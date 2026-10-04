import {cohorts,DAY,getProfile,profiles,starts,type Channel} from './fixtures'
export type Policy = {gapHours:number; maxWeek:number; quietStart:number; quietEnd:number}
export type PolicyVersion = {version:number; policy:Policy}
export type Outcome = {profile:string; time:string; channel:Channel; eligible:boolean; reason:string}
export type Scope = {cohort:string; channel:Channel; start:string}
export type Run = {id:number; policyVersion:number; policy:Policy; scope:Scope; outcomes:Outcome[]}
export type State = {schema:1; revision:number; policies:PolicyVersion[]; runs:Run[]}
export const DEFAULT_POLICY:Policy = {gapHours:72,maxWeek:2,quietStart:21,quietEnd:8}
export function initial():State {return {schema:1,revision:0,policies:[{version:1,policy:{...DEFAULT_POLICY}}],runs:[]}}
export const latest=(s:State)=>s.policies[s.policies.length-1]
export function validPolicy(p:unknown):p is Policy {return exact(p,['gapHours','maxWeek','quietStart','quietEnd'])&&[24,72,168].includes(p.gapHours as number)&&[1,2,3].includes(p.maxWeek as number)&&Number.isInteger(p.quietStart)&&Number.isInteger(p.quietEnd)&&(p.quietStart as number)>=0&&(p.quietStart as number)<=23&&(p.quietEnd as number)>=0&&(p.quietEnd as number)<=23&&p.quietStart!==p.quietEnd}
export function validScope(s:unknown):s is Scope {return exact(s,['cohort','channel','start'])&&cohorts.some(c=>c.id===s.cohort)&&['email','push','in-app'].includes(s.channel as string)&&starts.some(t=>t.id===s.start)}
function exact(v:unknown,keys:string[]):v is Record<string,unknown> {return !!v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).sort().join('|')===[...keys].sort().join('|')}
export function quiet(time:string,offset:number,p:Policy):boolean {const d=new Date(Date.parse(time)+offset*60000);const h=d.getUTCHours()+d.getUTCMinutes()/60;return p.quietStart<p.quietEnd?h>=p.quietStart&&h<p.quietEnd:h>=p.quietStart||h<p.quietEnd}
export function simulate(s:State,scope:Scope,policy:Policy=latest(s).policy):Outcome[] {
 if(!validScope(scope)||!validPolicy(policy))throw new Error('Invalid simulation input')
 const effective={gapHours:Math.max(policy.gapHours,...s.runs.map(r=>r.policy.gapHours)),maxWeek:Math.min(policy.maxWeek,...s.runs.map(r=>r.policy.maxWeek))}
 const all=s.runs.flatMap(r=>r.outcomes); const out:Outcome[]=[]
 for(const delta of [0,DAY,7*DAY]) {
 const time=new Date(Date.parse(scope.start)+delta).toISOString(),now=Date.parse(time)
 for(const p of profiles.filter(p=>p.cohort===scope.cohort)) {
 const prior=[...all,...out];const touches=[...(p.lastTouch?[Date.parse(p.lastTouch)]:[]),...prior.filter(o=>o.profile===p.id&&o.eligible).map(o=>Date.parse(o.time))]
 let reason='Eligible · useful unfinished goal, consent, preferred channel and timing all fit.'
 if(!p.eligible)reason='Suppressed · goal is already complete; a return invitation adds no unfinished value.'
 else if(p.optedOut)reason='Suppressed · opted out; respect the request to be left alone.'
 else if(!p.consent.includes(scope.channel))reason='Suppressed · no consent for this channel; permission on another channel does not transfer.'
 else if(p.preferred!==scope.channel)reason=`Suppressed · prefers ${p.preferred}; reduce unwanted channel switching.`
 else if(prior.some(o=>o.profile===p.id&&o.time===time))reason='Suppressed · this exact attempt was already reviewed; reruns cannot bypass its outcome.'
 else if(quiet(time,p.offset,policy))reason='Suppressed · local quiet hours; protect time away from the product.'
 else if(touches.some(t=>Math.abs(now-t)<effective.gapHours*3600000))reason=`Suppressed · ${effective.gapHours}-hour spacing protects attention across runs and channels.`
 else if(touches.filter(t=>t>now-7*DAY&&t<=now).length>=effective.maxWeek)reason=`Suppressed · ${effective.maxWeek} invitations in a rolling seven-day window is the accepted ceiling.`
 // A later reservation must also retain its accepted rolling-window ceiling.
 else if(touches.some(t=>t>now&&t<now+7*DAY&&touches.filter(x=>x>t-7*DAY&&x<=t).length>=effective.maxWeek))reason=`Suppressed · a later accepted invitation already fills the ${effective.maxWeek}-per-week ceiling.`
 out.push({profile:p.id,time,channel:scope.channel,eligible:reason.startsWith('Eligible'),reason})
 }
 }
 return out
}
export function addRun(s:State,scope:Scope):State {if(s.runs.length>=30)throw new Error('Timeline holds 30 runs. Review a reset to begin another sample.');const v=latest(s);return {...s,revision:s.revision+1,runs:[...s.runs,{id:s.runs.length+1,policyVersion:v.version,policy:{...v.policy},scope:{...scope},outcomes:simulate(s,scope)}]}}
export function revise(s:State,p:Policy):State {if(!validPolicy(p))throw new Error('Choose distinct quiet-hour start and end.');if(s.policies.length>=30)throw new Error('Policy history holds 30 versions. Review a reset to begin again.');if(JSON.stringify(p)===JSON.stringify(latest(s).policy))throw new Error('The policy is unchanged.');return {...s,revision:s.revision+1,policies:[...s.policies,{version:s.policies.length+1,policy:{...p}}]}}
export function decode(raw:string):State {
 const value:unknown=JSON.parse(raw)
 if(!exact(value,['schema','revision','policies','runs'])||value.schema!==1||!Number.isInteger(value.revision)||(value.revision as number)<0||!Array.isArray(value.policies)||value.policies.length<1||value.policies.length>30||!Array.isArray(value.runs)||value.runs.length>30)throw new Error('Saved sample is incompatible')
 const policies:PolicyVersion[]=[]
 for(const [i,v] of value.policies.entries()){if(!exact(v,['version','policy'])||v.version!==i+1||!validPolicy(v.policy))throw new Error('Invalid policy history');policies.push({version:i+1,policy:{...v.policy}})}
 if(JSON.stringify(policies[0].policy)!==JSON.stringify(DEFAULT_POLICY))throw new Error('Invalid initial policy')
 const runs:Run[]=[];let lastVersion=1
 for(const [i,r] of value.runs.entries()){
 if(!exact(r,['id','policyVersion','policy','scope','outcomes'])||r.id!==i+1||!Number.isInteger(r.policyVersion)||(r.policyVersion as number)<lastVersion||(r.policyVersion as number)>policies.length||!validScope(r.scope)||!validPolicy(r.policy)||JSON.stringify(r.policy)!==JSON.stringify(policies[(r.policyVersion as number)-1].policy)||!Array.isArray(r.outcomes))throw new Error('Invalid run history')
 const expected=simulate({schema:1,revision:0,policies:policies.slice(0,r.policyVersion as number),runs},r.scope,r.policy)
 if(JSON.stringify(r.outcomes)!==JSON.stringify(expected))throw new Error('Saved results do not match their immutable inputs')
 for(const o of expected)getProfile(o.profile)
 runs.push({id:i+1,policyVersion:r.policyVersion as number,policy:{...r.policy},scope:{...r.scope},outcomes:expected});lastVersion=r.policyVersion as number
 }
 if(value.revision!==runs.length+policies.length-1)throw new Error('Invalid revision')
 return {schema:1,revision:value.revision as number,policies,runs}
}
