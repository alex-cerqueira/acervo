'use client';
import {useEffect,useMemo,useRef,useState,type PointerEvent} from 'react';
import {Network,X,RotateCcw,Pause,Play} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {type Item,Select} from './page';
import {settleStep,type GraphNode,type GraphEdge} from './graph-layout';
type Node=GraphNode&{item?:Item};
type Edge=GraphEdge;
const colors=['#0063de','#38a5ec','#8a79bd','#2f8d83','#d38b45','#54799f','#aa6681'];
const fields:Record<string,keyof Item>={Assunto:'method','Portfólio':'portfolio',Cadeia:'chain',Produto:'product','Responsável':'owner'};
export function KnowledgeGraph({records}:{records:Item[]}){
 const canvas=useRef<HTMLCanvasElement>(null),wrap=useRef<HTMLDivElement>(null);
 const nodes=useRef<Node[]>([]),edges=useRef<Edge[]>([]);
 const hover=useRef<string|null>(null),drag=useRef<{id:string;x:number;y:number;dx:number;dy:number;moved:boolean}|null>(null);
 const [connect,setConnect]=useState('Portfólio'),[selectedId,setSelectedId]=useState<string|null>(null);
 const [width,setWidth]=useState(900),[reset,setReset]=useState(0),[paused,setPaused]=useState(false),[ready,setReady]=useState(false);
 const redraw=useRef(()=>{}),stop=useRef(()=>{});
 const active=records.filter(r=>r.kind==='Item');
 const groupKey=(r:Item)=>String(r[fields[connect]]||'Não informado');
 const signature=JSON.stringify(active.map(r=>[r.id,r.name,r.portfolio,r.chain,r.product,r.owner,r.method,r.format,r.status]));
 const groups=useMemo(()=>{const g=new Map<string,Item[]>();for(const r of active){const key=groupKey(r);g.set(key,[...(g.get(key)||[]),r])}return [...g].sort(([a],[b])=>a.localeCompare(b));},[signature,connect]);
 const groupCount=groups.length,columns=Math.max(1,Math.floor(width/270));
 const cellHeight=Math.max(230,Math.ceil(Math.sqrt(Math.max(1,...groups.map(([,rs])=>rs.length))))*28+100);
 const size={w:width,h:Math.max(520,Math.ceil(groupCount/columns)*cellHeight)};
 const selected=nodes.current.find(n=>n.id===selectedId)||null;
 const setSelected=(n:Node|null)=>setSelectedId(n?.id||null);
 useEffect(()=>{const el=wrap.current;if(!el)return;const ro=new ResizeObserver(([e])=>setWidth(Math.max(540,Math.floor(e.contentRect.width))));ro.observe(el);return()=>ro.disconnect()},[]);
 useEffect(()=>{
   const ns:Node[]=[],es:Edge[]=[];const cw=size.w/columns;
   groups.forEach(([g,items],gi)=>{
     const x=(gi%columns+.5)*cw,y=Math.floor(gi/columns)*cellHeight+cellHeight/2;
     ns.push({id:'g:'+g,label:g,type:'group',group:g,x,y,vx:0,vy:0,tx:x,ty:y});
     items.sort((a,b)=>a.id.localeCompare(b.id)).forEach((r,i)=>{
       const angle=i*2.399963, radius=48+Math.sqrt(i)*13;
       const px=x+Math.cos(angle)*Math.min(radius,cw/2-28),py=y+Math.sin(angle)*Math.min(radius,cellHeight/2-50);
       ns.push({id:'a:'+r.id,label:r.name,type:'artifact',group:g,item:r,x:px+4,y:py+4,vx:0,vy:0,tx:px,ty:py});
       es.push({a:'g:'+g,b:'a:'+r.id});
     });
   });
   const chainGroups=new Map<string,Set<string>>();
   for(const [g,items]of groups)for(const r of items)if(r.chain){
     const key=r.portfolio+' / '+r.chain,set=chainGroups.get(key)||new Set<string>();set.add('g:'+g);chainGroups.set(key,set);
   }
   const linked=new Set<string>();
   for(const set of chainGroups.values()){const ids=[...set].sort();for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++){
     const key=JSON.stringify([ids[i],ids[j]]);if(!linked.has(key)){linked.add(key);es.push({a:ids[i],b:ids[j],dashed:true})}
   }}
   nodes.current=ns;edges.current=es;hover.current=null;drag.current=null;
   setSelectedId(id=>ns.some(n=>n.id===id)?id:null);setReady(false);
 },[groups,size.w,size.h,reset]);
 useEffect(()=>{
   const el=canvas.current;if(!el)return;const ctx=el.getContext('2d');if(!ctx)return;
   const dpr=Math.min(window.devicePixelRatio||1,2);el.width=Math.round(size.w*dpr);el.height=Math.round(size.h*dpr);
   ctx.setTransform(dpr,0,0,dpr,0,0);
   const paint=()=>draw(ctx,nodes.current,edges.current,size,hover.current,selectionRef.current);
   redraw.current=paint;
   let frame=0,steps=0,cancelled=false;
   stop.current=()=>{cancelled=true;cancelAnimationFrame(frame);setReady(true)};
   const tick=()=>{
     if(cancelled)return;
     if(!paused&&steps<90){settleStep(nodes.current,1-steps/90);steps++}
     paint();
     if(!paused&&steps<90)frame=requestAnimationFrame(tick);else setReady(true);
   };
   if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)steps=90;
   tick();return()=>{cancelled=true;cancelAnimationFrame(frame)};
 },[groups,size.w,size.h,reset,paused]);
 useEffect(()=>{redraw.current()},[selectedId]);
 // Selection redraw uses a ref so it never restarts the simulation.
 const selectionRef=useRef(selectedId);selectionRef.current=selectedId;
 function point(e:PointerEvent<HTMLCanvasElement>){const r=canvas.current!.getBoundingClientRect();return{x:(e.clientX-r.left)*size.w/r.width,y:(e.clientY-r.top)*size.h/r.height}}
 function hit(e:PointerEvent<HTMLCanvasElement>){const p=point(e);return [...nodes.current].reverse().find(n=>Math.hypot(n.x-p.x,n.y-p.y)<(n.type==='group'?24:13))||null}
 function down(e:PointerEvent<HTMLCanvasElement>){if(e.button!==0)return;const n=hit(e);if(!n)return;stop.current();const p=point(e);drag.current={id:n.id,x:p.x,y:p.y,dx:n.x-p.x,dy:n.y-p.y,moved:false};e.currentTarget.setPointerCapture(e.pointerId)}
 function move(e:PointerEvent<HTMLCanvasElement>){
   const d=drag.current,n=d&&nodes.current.find(n=>n.id===d.id);
   if(n&&d){const p=point(e);if(Math.hypot(p.x-d.x,p.y-d.y)>5)d.moved=true;
     if(d.moved){const x=Math.max(25,Math.min(size.w-25,p.x+d.dx)),y=Math.max(25,Math.min(size.h-45,p.y+d.dy));
       const dx=x-n.x,dy=y-n.y;n.x=x;n.y=y;n.pinned=true;n.vx=n.vy=0;
       if(n.type==='group')for(const child of nodes.current)if(child.type==='artifact'&&child.group===n.group){child.x=Math.max(12,Math.min(size.w-12,child.x+dx));child.y=Math.max(12,Math.min(size.h-12,child.y+dy));child.pinned=true}
     }
     e.currentTarget.style.cursor='grabbing';
   }else{hover.current=hit(e)?.id||null;e.currentTarget.style.cursor=hover.current?'grab':'default';e.currentTarget.title=nodes.current.find(n=>n.id===hover.current)?.label||''}
   redraw.current();
 }
 function up(e:PointerEvent<HTMLCanvasElement>){const d=drag.current;if(d&&!d.moved)setSelectedId(d.id);drag.current=null;if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);e.currentTarget.style.cursor='grab';redraw.current()}
 return <section className="panel graph-panel">
  <div className="graph-toolbar"><div><h2>Rede de conhecimento</h2><p>Explore as relações entre os artefatos do acervo.</p></div><label className="graph-connect"><span>Conectar por</span><Select label="Conectar por" value={connect} onChange={setConnect} options={['Assunto','Portfólio','Cadeia','Produto','Responsável']}/></label></div>
  <div className="graph-controls"><span role="status">{paused?'Movimento pausado':ready?'Rede estabilizada':'Organizando a rede…'}</span><div><Button variant="outline" onClick={()=>{stop.current();setPaused(!paused);setReady(false)}}>{paused?<Play size={15}/>:<Pause size={15}/>} {paused?'Retomar':'Pausar'}</Button><Button variant="outline" onClick={()=>{setPaused(false);setReset(v=>v+1)}}><RotateCcw size={15}/> Reorganizar</Button></div></div>
  <div className="graph-workspace">
    <div className="graph-stage" ref={wrap}>
      <canvas aria-label={`Grafo com ${groupCount} agrupamentos e ${active.length} artefatos. Arraste os nós ou clique para ver detalhes.`} ref={canvas} style={{width:size.w,height:size.h}}
        onPointerDown={down} onPointerMove={move} onPointerUp={up}
        onPointerCancel={()=>{drag.current=null;redraw.current()}} onLostPointerCapture={()=>drag.current=null}
        onPointerLeave={()=>{hover.current=null;redraw.current()}}/>
      {!active.length&&<div className="graph-empty"><Network size={30}/><h3>Nenhum artefato encontrado</h3><p>Ajuste os filtros acima. Pastas não são exibidas como nós.</p></div>}
    </div>
    <aside className="graph-detail" aria-live="polite">
      <label className="graph-node-picker">Localizar nó<select value={selectedId||''} onChange={e=>setSelectedId(e.target.value||null)}><option value="">Selecione um agrupamento ou artefato</option>{nodes.current.map(n=><option key={n.id} value={n.id}>{n.type==='group'?'Agrupamento: ':''}{n.label}</option>)}</select></label><div className="graph-detail-heading"><h3>Detalhes</h3>{selected&&<button onClick={()=>setSelected(null)} aria-label="Limpar seleção"><X size={18}/></button>}</div>
      {selected?<><span className="graph-type">{selected.type==='group'?'AGRUPAMENTO':'ARTEFATO'}</span><h4>{selected.label}</h4>
        {selected.item?<><p className="graph-path">{selected.item.portfolio} › {selected.item.chain} › {selected.item.product}</p><dl><div><dt>Responsável</dt><dd>{selected.item.owner||'Não informado'}</dd></div><div><dt>Formato</dt><dd>{selected.item.format}</dd></div><div><dt>Status</dt><dd>{selected.item.status}</dd></div></dl></>:<><p>{active.filter(r=>groupKey(r)===selected.group).length} artefatos neste agrupamento.</p><dl><div><dt>Conectado por</dt><dd>{connect}</dd></div></dl><div className="graph-members">{active.filter(r=>groupKey(r)===selected.group).map(r=><button key={r.id} onClick={()=>setSelectedId('a:'+r.id)}>{r.name}</button>)}</div></>}
        <div className="graph-pinned">Detalhes fixados · arrastar não altera a seleção.</div>
      </>:<div className="graph-detail-empty"><Network size={28}/><h4>Selecione um nó</h4><p>Clique em um agrupamento ou artefato para manter seus detalhes aqui.</p><ul><li>Arraste para reposicionar e manter no lugar.</li><li>Passe o mouse para destacar a vizinhança.</li><li>Clique para fixar os detalhes.</li></ul></div>}
    </aside>
  </div>
  <div className="graph-legend"><span><i className="large"/> Agrupamentos <strong>{groupCount}</strong></span><span><i/> Artefatos <strong>{active.length}</strong></span><span><b/> Cadeia compartilhada</span><small>Contagens conforme os filtros · somente itens</small></div>
</section>}
function draw(ctx:CanvasRenderingContext2D,nodes:Node[],edges:Edge[],size:{w:number,h:number},hover:string|null,selected:string|null){ctx.clearRect(0,0,size.w,size.h);const byId=new Map(nodes.map(n=>[n.id,n]));const near=new Set<string>();if(hover||selected){const id=hover||selected!;near.add(id);for(const e of edges)if(e.a===id)near.add(e.b);else if(e.b===id)near.add(e.a)}for(const e of edges){const a=byId.get(e.a),b=byId.get(e.b);if(!a||!b)continue;ctx.beginPath();ctx.setLineDash(e.dashed?[5,6]:[]);ctx.strokeStyle=near.size&&!(near.has(a.id)&&near.has(b.id))?'#dce5ee55':e.dashed?'#8aa5bf88':'#b8cce0aa';ctx.lineWidth=e.dashed?1.2:1;ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}ctx.setLineDash([]);for(const n of nodes){const faded=near.size&&!near.has(n.id),r=n.type==='group'?18:7,ci=Math.abs([...n.group].reduce((a,c)=>a+c.charCodeAt(0),0))%colors.length;ctx.globalAlpha=faded?.18:1;ctx.beginPath();ctx.fillStyle=n.type==='group'?colors[ci]:'#fff';ctx.strokeStyle=n.type==='group'?colors[ci]:'#5791c6';ctx.lineWidth=n.id===selected?4:2;ctx.arc(n.x,n.y,r,0,Math.PI*2);ctx.fill();ctx.stroke();if(n.type==='group'||n.id===hover||n.id===selected){ctx.font='600 12px Arial';ctx.fillStyle='#294d70';ctx.textAlign='center';const label=n.label.length>28?n.label.slice(0,27)+'…':n.label;const tw=ctx.measureText(label).width;const lx=Math.max(tw/2+6,Math.min(size.w-tw/2-6,n.x));ctx.fillStyle='#f8fbff';ctx.fillRect(lx-tw/2-4,n.y+23,tw+8,18);ctx.fillStyle='#294d70';ctx.fillText(label,lx,n.y+36)}}ctx.globalAlpha=1}
