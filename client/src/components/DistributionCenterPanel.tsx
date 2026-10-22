import React, { useState } from 'react';
import { DistributionCenter } from '@/lib/distribution-center';
const center = new DistributionCenter();
export default function DistributionCenterPanel() {
 const [items,setItems]=useState(center.list());
 const [name,setName]=useState('');
 const [message,setMessage]=useState('');
 const add=(event: React.FormEvent)=>{event.preventDefault();try {center.addProduct({id:String(Date.now()),name,description:'',pricing:{kind:'free'}});setItems(center.list());setName('');setMessage('Draft product created');}catch(error){setMessage(String(error));}};
 return <section className="relative z-20 m-4 rounded-2xl border border-teal-500 bg-slate-950 p-4 text-white"><h2 className="text-xl font-bold">Distribution Center</h2><p>Draft catalog and versioned releases</p><form onSubmit={add}><input aria-label="Product name" required value={name} onChange={e=>setName(e.target.value)} className="m-2 rounded bg-slate-800 p-2"/><button type="submit" className="rounded bg-teal-500 p-2 text-black">Add draft</button></form><p role="status">{message}</p>{items.map(item=><article key={item.id} className="border-t border-slate-700 p-2"><strong>{item.name}</strong><span> — {item.releases.length} releases</span>{item.releases.filter(r=>r.status==='published').flatMap(r=>r.artifacts.map(a=><a key={a.url} className="block underline" href={a.url}>{a.name}</a>))}</article>)}<p className="text-xs">Browser-local drafts. Payments and builds not connected.</p></section>;
}
