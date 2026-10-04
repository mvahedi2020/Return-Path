import {addRun,decode,initial,revise,type Policy,type Scope,type State} from './domain'
export const KEY='return-path.sample.v1'
export type Store=Pick<Storage,'getItem'|'setItem'>
export type Reading={readable:true;raw:string|null}|{readable:false;raw:null}
export type Action={kind:'run';scope:Scope}|{kind:'policy';policy:Policy}|{kind:'reset'}
export type Review={action:Action;reading:Reading;state:string;input:string}
const clone=<T,>(v:T):T=>JSON.parse(JSON.stringify(v)) as T
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b)
export class SampleStore {
 state:State=initial();notice='Sample ready. All invitations stay on this device.';blocked=false;private unseen=false;private baseline:Reading;private undo:{state:State;reading:Reading}|null=null
 constructor(private provider:()=>Store){this.baseline=this.read();if(!this.baseline.readable){this.unseen=true;this.notice='Saved data cannot be read. Working in memory; unseen bytes will never be overwritten.'}else if(this.baseline.raw!==null){try{this.state=decode(this.baseline.raw);this.notice='Compatible sample restored. Previous runs keep their original policies.'}catch{this.blocked=true;this.notice='Saved data is incompatible. It is preserved. Review a reset before replacing it.'}}}
 private read():Reading {try{return {readable:true,raw:this.provider().getItem(KEY)}}catch{return {readable:false,raw:null}}}
 get canUndo(){return this.undo!==null}
 get memoryOnly(){return this.unseen||!this.baseline.readable}
 private sync(){const now=this.read();if(!same(now,this.baseline)){this.undo=null;if(!now.readable){this.unseen=true;this.notice='Saved data became unreadable. Working in memory; unseen bytes are preserved.'}else if(!this.unseen){try{this.state=now.raw===null?initial():decode(now.raw);this.blocked=false;this.notice='Another saved sample was loaded. Review this current state before acting.'}catch{this.blocked=true;this.notice='Saved data changed and is incompatible. It is preserved until a fresh reviewed reset.'}}else{this.notice='Storage can now be read. Review a reset to replace the previously unseen sample.'}this.baseline=now}}
 preview(action:Action):Review {this.sync();if(this.blocked&&action.kind!=='reset')throw new Error('Saved data is incompatible. Review a reset first.');return {action:clone(action),reading:clone(this.baseline),state:JSON.stringify(this.state),input:JSON.stringify(action)}}
 private persist(state:State,reset=false){if(this.unseen&&!reset){this.notice='Kept in memory. Saved data was unreadable; unseen bytes are preserved.';return}if(!this.baseline.readable){this.unseen=true;this.notice='Kept in memory. Storage cannot be read; unseen bytes are preserved.';return}try{const raw=JSON.stringify(state);this.provider().setItem(KEY,raw);this.baseline={readable:true,raw};this.unseen=false;this.notice='Saved on this device. Nothing was sent.'}catch{this.notice='Kept in memory. Saving is unavailable; refresh may lose this change.'}}
 confirm(review:Review,current:Action){const fresh=this.read();if(!same(fresh,review.reading)||JSON.stringify(this.state)!==review.state||JSON.stringify(current)!==review.input){this.undo=null;this.sync();throw new Error('Preview expired because the selection, draft or saved data changed. Review again.')}if(this.blocked&&review.action.kind!=='reset')throw new Error('Saved data is incompatible. Review a reset first.');const previous=clone(this.state),wasBlocked=this.blocked,wasUnseen=this.unseen
 if(review.action.kind==='run')this.state=addRun(this.state,review.action.scope)
 else if(review.action.kind==='policy')this.state=revise(this.state,review.action.policy)
 else {this.state=initial();this.blocked=false}
 this.undo=null;this.persist(this.state,review.action.kind==='reset')
 if(review.action.kind==='reset'&&!wasBlocked&&!wasUnseen&&fresh.readable)this.undo={state:previous,reading:clone(this.baseline)}
 return this.state}
 undoReset(){if(!this.undo)throw new Error('Undo is no longer available.');if(!same(this.read(),this.undo.reading)){this.undo=null;this.sync();throw new Error('Saved data changed. Undo expired; review the current sample.')}this.state=clone(this.undo.state);this.undo=null;this.persist(this.state);return this.state}
 refresh(){this.sync();return this.state}
}
