import {describe,it,expect} from 'vitest'
import {addRun,decode,DEFAULT_POLICY,initial,quiet,revise,simulate,type Scope} from './domain'
import {CLOCK,getProfile,localTime,message} from './fixtures'
const scope:Scope={cohort:'C01',channel:'email',start:CLOCK}
describe('independent sample calculations',()=>{
 it('Aster at exactly72 hours is eligible, day1 suppressed, day7 eligible',()=>{expect(simulate(initial(),scope).filter(o=>o.profile==='P01').map(o=>o.eligible)).toEqual([true,false,true])})
 it('Birch lacks email consent for all three attempts',()=>{expect(simulate(initial(),scope).filter(o=>o.profile==='P02').every(o=>o.reason.includes('no consent'))).toBe(true)})
 it('Birch push at01 local is quiet on every day',()=>{expect(simulate(initial(),{...scope,channel:'push'}).filter(o=>o.profile==='P02').every(o=>o.reason.includes('quiet hours'))).toBe(true)})
 it('in-app permission does not override preferred channel',()=>{expect(simulate(initial(),{...scope,channel:'in-app'}).every(o=>o.reason.includes('prefers'))).toBe(true)})
 it('Clover in-app at17 local is eligible and Fern lacks consent',()=>{const r=simulate(initial(),{...scope,cohort:'C02',channel:'in-app'});expect(r.filter(o=>o.profile==='P03').map(o=>o.eligible)).toEqual([true,false,true]);expect(r.filter(o=>o.profile==='P04').every(o=>o.reason.includes('no consent'))).toBe(true)})
 it('Fern recent touch is48h, then exact72h permits day1',()=>{expect(simulate(initial(),{...scope,cohort:'C02'}).filter(o=>o.profile==='P04').map(o=>o.eligible)).toEqual([false,true,true])})
 it('optout and completed goal always excluded',()=>{for(const channel of ['email','push','in-app'] as const){const r=simulate(initial(),{...scope,cohort:'C03',channel});expect(r.every(o=>!o.eligible)).toBe(true);expect(r[0].reason).toContain('opted out');expect(r[1].reason).toContain('complete')}})
 it('rolling7d excludes exact lower boundary, includes current instant',()=>{const s=revise(initial(),{...DEFAULT_POLICY,maxWeek:1});expect(simulate(s,scope).filter(o=>o.profile==='P01').map(o=>o.eligible)).toEqual([false,true,false])})
 it('quiet interval includes21:00 and excludes08:00, wraps midnight',()=>{for(const [t,want] of [['2026-10-04T04:00:00.000Z',true],['2026-10-04T14:59:00.000Z',true],['2026-10-04T15:00:00.000Z',false],['2026-10-04T03:59:00.000Z',false]] as const)expect(quiet(t,-420,DEFAULT_POLICY)).toBe(want)})
 it('same-day quiet interval includes start and excludes end',()=>{const p={...DEFAULT_POLICY,quietStart:9,quietEnd:17};expect(quiet(CLOCK,-420,p)).toBe(true);expect(quiet('2026-10-04T00:00:00.000Z',-420,p)).toBe(false)})
 it('same attempts cannot become eligible on repeated runs',()=>{const s=addRun(initial(),scope);expect(simulate(s,scope).filter(o=>o.profile==='P01').every(o=>o.reason.includes('already reviewed'))).toBe(true)})
 it('relaxed revision cannot bypass historical frequency ceiling',()=>{const s=revise(addRun(revise(initial(),{...DEFAULT_POLICY,maxWeek:1}),scope),{...DEFAULT_POLICY,gapHours:24,maxWeek:3});const r=simulate(s,{...scope,start:'2026-10-04T05:00:00.000Z'});expect(r.filter(o=>o.profile==='P01').every(o=>!o.eligible)).toBe(true)})
 it('out of order run respects a future reservation',()=>{const s=addRun(initial(),{...scope,start:'2026-10-10T16:00:00.000Z'});expect(simulate(s,scope).filter(o=>o.profile==='P01').map(o=>o.eligible)).toEqual([true,false,false])})
 it('run stores exact policy and scope snapshots',()=>{const s=addRun(initial(),scope),old=JSON.stringify(s.runs);const next=revise(s,{...DEFAULT_POLICY,gapHours:168});expect(JSON.stringify(next.runs)).toBe(old);expect(next.runs[0].policyVersion).toBe(1)})
 it('timezone and destination have exact original labels',()=>{expect(localTime(CLOCK,getProfile('P02'))).toBe('2026-10-04 01:00 UTC+09:00');expect(message(getProfile('P01'))).toContain('three saved stops')})
})
describe('strict schema and bounded state',()=>{
 it('compatible history roundtrips',()=>{const s=addRun(revise(initial(),{...DEFAULT_POLICY,maxWeek:1}),scope);expect(decode(JSON.stringify(s))).toEqual(s)})
 it.each(['bad','null','[]','{"schema":2}','{"schema":1}'])('rejects incompatible %s',raw=>expect(()=>decode(raw)).toThrow())
 it('rejects altered outcome, profile, policy reference, revision and unknown fields',()=>{const source=addRun(initial(),scope);for(const mutate of [(s:typeof source)=>{s.runs[0].outcomes[0].eligible=false},(s:typeof source)=>{s.runs[0].outcomes[0].profile='P99'},(s:typeof source)=>{s.runs[0].policyVersion=9},(s:typeof source)=>{s.revision=0},(s:typeof source)=>{Object.assign(s,{extra:true})}]){const s=structuredClone(source);mutate(s);expect(()=>decode(JSON.stringify(s))).toThrow()}})
 it('rejects invalid scope and policy drafts',()=>{expect(()=>simulate(initial(),{...scope,cohort:'bad'})).toThrow();expect(()=>revise(initial(),{...DEFAULT_POLICY,quietEnd:21})).toThrow();expect(()=>revise(initial(),{...DEFAULT_POLICY,gapHours:0})).toThrow()})
 it('bounds30 runs and30 policy versions',()=>{let s=initial();for(let i=0;i<30;i++)s=addRun(s,scope);expect(()=>addRun(s,scope)).toThrow('30 runs');s=initial();for(let i=0;i<29;i++)s=revise(s,{...DEFAULT_POLICY,maxWeek:i%2?2:1});expect(()=>revise(s,{...DEFAULT_POLICY,maxWeek:3})).toThrow('30 versions')})
})
