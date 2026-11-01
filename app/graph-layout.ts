export type GraphNode = {
  id:string; label:string; type:'group'|'artifact'; group:string;
  x:number; y:number; vx:number; vy:number; tx:number; ty:number; pinned?:boolean;
};
export type GraphEdge = {a:string;b:string;dashed?:boolean};

// Bounded forces around stable targets: no perpetual global repulsion.
export function settleStep(nodes:GraphNode[], alpha:number) {
  const cells=new Map<string,GraphNode[]>();
  for(const n of nodes){
    const key=Math.floor(n.x/40)+','+Math.floor(n.y/40);
    const cell=cells.get(key)||[];cell.push(n);cells.set(key,cell);
  }
  for(const n of nodes){
    if(n.pinned){n.vx=n.vy=0;continue}
    let fx=(n.tx-n.x)*.07,fy=(n.ty-n.y)*.07;
    const cx=Math.floor(n.x/40),cy=Math.floor(n.y/40);
    for(let x=cx-1;x<=cx+1;x++)for(let y=cy-1;y<=cy+1;y++){
      for(const b of cells.get(x+','+y)||[]){
        if(b===n)continue;
        const dx=n.x-b.x||.01,dy=n.y-b.y||.01,d=Math.max(.1,Math.hypot(dx,dy));
        const gap=n.type==='group'||b.type==='group'?38:22;
        if(d<gap){fx+=dx/d*(gap-d)*.12;fy+=dy/d*(gap-d)*.12}
      }
    }
    n.vx=(n.vx+fx*alpha)*.65;n.vy=(n.vy+fy*alpha)*.65;
    n.x+=Math.max(-3,Math.min(3,n.vx));n.y+=Math.max(-3,Math.min(3,n.vy));
  }
}
