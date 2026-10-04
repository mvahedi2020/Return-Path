import {useEffect,useRef,type ReactNode,type KeyboardEvent} from 'react'
export default function Dialog({title,children,onCancel}:{title:string;children:ReactNode;onCancel:()=>void}){
 const ref=useRef<HTMLDialogElement>(null)
 useEffect(()=>{const d=ref.current;const trigger=document.activeElement as HTMLElement|null;d?.showModal();d?.querySelector<HTMLButtonElement>('.dialog-actions button')?.focus();return()=>{d?.close();if(trigger?.isConnected)trigger.focus()}},[])
 function trap(e:KeyboardEvent<HTMLDialogElement>){if(e.key!=='Tab')return;const nodes=Array.from(ref.current!.querySelectorAll<HTMLElement>('button,select,summary,a[href],input,textarea,[tabindex]:not([tabindex="-1"])')).filter(n=>!n.hasAttribute('disabled')&&n.getClientRects().length>0);const first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}}
 return <dialog ref={ref} aria-labelledby="dialog-title" onKeyDown={trap} onCancel={e=>{e.preventDefault();onCancel()}}><div className="dialog-head"><span className="eyebrow">A deliberate choice</span><h2 id="dialog-title">{title}</h2></div>{children}</dialog>
}
