import {useEffect,useRef,type ReactNode} from 'react'
export default function Dialog({title,children,onCancel}:{title:string;children:ReactNode;onCancel:()=>void}){
 const ref=useRef<HTMLDialogElement>(null)
 useEffect(()=>{const d=ref.current;d?.showModal();return()=>d?.close()},[])
 return <dialog ref={ref} aria-labelledby="dialog-title" onCancel={e=>{e.preventDefault();onCancel()}}><div className="dialog-head"><span className="eyebrow">A deliberate choice</span><h2 id="dialog-title">{title}</h2></div>{children}</dialog>
}
