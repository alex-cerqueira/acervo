export type RecordItem = { id:string; name:string; owner:string; modified:string; kind:string; format:string; portfolio:string; chainType:string; chain:string; productType:string; product:string; path:string; url:string; status:string; method:string; summary:string; classification:string; source:string; sourceId:string; createdBy?:string; createdAt?:string; demo?:boolean };
export const formats = ['PowerPoint','Word','Excel','Figma','PDF','Link','Imagem','Vídeo','Outros'];
export const taxonomy:Record<string,Record<string,string[]>> = {
 'Listado':{'Negociação':['Home broker','Plataforma de negociação'],'Pós-negociação':['Liquidação','Custódia']},
 'Balcão':{'Registro de ativos':['Renda fixa','Derivativos'],'Serviços de dados':['Portal de dados']},
 'Infraestrutura':{'Experiência do cliente':['Portal do cliente','Atendimento'],'Serviços corporativos':['Design System']}
};
export const seedRecords:RecordItem[] = [
 ['Mapa da jornada do investidor.pptx','Marina Costa','PowerPoint','Listado','Negociação','Home broker','2026-09-10','Validado','Jornada'],
 ['Entrevistas · investidores iniciantes.docx','Rafael Almeida','Word','Listado','Negociação','Home broker','2026-09-09','Validado','Entrevista'],
 ['Protótipo · fluxo de compra','Julia Santos','Figma','Listado','Negociação','Home broker','2026-09-09','Validado','Teste de usabilidade'],
 ['Matriz de oportunidades.xlsx','Marina Costa','Excel','Balcão','Registro de ativos','Renda fixa','2026-09-08','Validado','Desk research'],
 ['Relatório de usabilidade.pdf','Lucas Oliveira','PDF','Balcão','Registro de ativos','Derivativos','2026-09-07','Em revisão','Teste de usabilidade'],
 ['Discovery · portal do cliente.pptx','Marina Costa','PowerPoint','Infraestrutura','Experiência do cliente','Portal do cliente','2026-09-06','Validado','Discovery'],
 ['Roteiro de entrevistas.docx','Rafael Almeida','Word','Listado','Pós-negociação','Custódia','2026-09-05','Em revisão','Entrevista'],
 ['Componentes · formulários','Julia Santos','Figma','Infraestrutura','Serviços corporativos','Design System','2026-09-04','Validado','Design UI'],
 ['Pesquisa de satisfação.xlsx','Camila Ferreira','Excel','Infraestrutura','Experiência do cliente','Atendimento','2026-09-03','Validado','Survey'],
 ['Benchmark de plataformas.pdf','Marina Costa','PDF','Listado','Negociação','Plataforma de negociação','2026-09-02','Validado','Benchmark'],
 ['Síntese · liquidação.pptx','Lucas Oliveira','PowerPoint','Listado','Pós-negociação','Liquidação','2026-08-28','Em revisão','Discovery'],
 ['Pesquisa exploratória.docx','','Word','Balcão','Serviços de dados','Portal de dados','2026-08-25','Pendente','Entrevista'],
 ['Hipóteses de produto.xlsx','Rafael Almeida','Excel','Balcão','Registro de ativos','Renda fixa','2026-08-20','Validado','Discovery'],
 ['Navegação · renda fixa','Julia Santos','Figma','Balcão','Registro de ativos','Renda fixa','2026-08-18','Validado','Design UI'],
 ['Guia de boas práticas.pdf','Marina Costa','PDF','Infraestrutura','Serviços corporativos','Design System','2026-08-15','Validado','Desk research'],
 ['Gravação · teste de custódia.mp4','Camila Ferreira','Vídeo','Listado','Pós-negociação','Custódia','2026-07-15','Pendente','Teste de usabilidade'],
 ['Referências de acessibilidade','Julia Santos','Link','Infraestrutura','Serviços corporativos','Design System','2026-08-11','Validado','Desk research'],
 ['Fluxo de atendimento.png','Camila Ferreira','Imagem','Infraestrutura','Experiência do cliente','Atendimento','2026-08-10','Validado','Jornada'],
 ['Resultados · negociação.pptx','Marina Costa','PowerPoint','Listado','Negociação','Plataforma de negociação','2026-02-12','Validado','Survey'],
 ['Base de evidências.xlsx','Rafael Almeida','Excel','Balcão','Registro de ativos','Derivativos','2026-08-07','Validado','Desk research'],
 ['Pesquisa de comportamento.pdf','','PDF','Listado','Negociação','Home broker','2026-02-10','Pendente','Entrevista'],
 ['Arquitetura de informação','Lucas Oliveira','Figma','Infraestrutura','Experiência do cliente','Portal do cliente','2026-08-05','Em revisão','Card sorting'],
 ['Pesquisa · Home broker','Marina Costa','Pasta','Listado','Negociação','Home broker','2026-09-10','Validado',''],
 ['Pesquisa · Renda fixa','Rafael Almeida','Pasta','Balcão','Registro de ativos','Renda fixa','2026-09-08','Validado','']
].map((r,i)=>({id:`demo-${i+1}`,name:r[0],owner:r[1],format:r[2],portfolio:r[3],chain:r[4],product:r[5],modified:r[6],status:r[7],method:r[8],chainType:r[3]==='Infraestrutura'?'Cadeia de serviço':'Cadeia de valor',productType:'Produto',kind:r[2]==='Pasta'?'Pasta':'Item',path:`/${r[3]}/${r[4]}/${r[5]}/Pesquisa`,url:`https://example.com/acervo/${i+1}`,summary:'Registro ilustrativo para validar a organização e a governança do acervo de pesquisa.',classification:'Interno',source:'Demonstração',sourceId:`demo-${i+1}`,createdBy:r[1]||'Lucas Oliveira',createdAt:`2026-09-${String(1+i%10).padStart(2,'0')}T12:00:00Z`,demo:true}));
export function isStale(r:RecordItem){return Date.now()-Date.parse(r.modified)>180*86400000}
export function issues(r:RecordItem){return [!r.owner&&'Sem responsável',(!r.portfolio||!r.chain||!r.product)&&'Sem classificação',isStale(r)&&'Revisão de 180 dias',r.status==='Pendente'&&'Cadastro pendente'].filter(Boolean) as string[]}
export function canonical(url:string){try{const u=new URL(url);u.hash='';['utm_source','utm_medium','utm_campaign'].forEach(k=>u.searchParams.delete(k));u.searchParams.sort();return u.toString().replace(/\/$/,'')}catch{return url.trim()}}
export function inferFormat(name:string,url=''){if(/figma\.com/i.test(url))return 'Figma';const e=name.split('.').pop()?.toLowerCase();return ({ppt:'PowerPoint',pptx:'PowerPoint',doc:'Word',docx:'Word',xls:'Excel',xlsx:'Excel',csv:'Excel',pdf:'PDF',png:'Imagem',jpg:'Imagem',jpeg:'Imagem',svg:'Imagem',mp4:'Vídeo',mov:'Vídeo',url:'Link'} as Record<string,string>)[e||'']||'Outros'}
export function parseCSV(text:string){const clean=text.replace(/^\uFEFF/,'');const line=clean.split(/\r?\n/)[0];const delim=(line.match(/;/g)||[]).length>(line.match(/,/g)||[]).length?';':',';const rows:string[][]=[];let row:string[]=[],cell='',quote=false;for(let i=0;i<clean.length;i++){const c=clean[i];if(c==='"'){if(quote&&clean[i+1]==='"'){cell+='"';i++}else quote=!quote}else if(c===delim&&!quote){row.push(cell);cell=''}else if(c==='\n'&&!quote){row.push(cell.replace(/\r$/,''));if(row.some(x=>x.trim()))rows.push(row);row=[];cell=''}else cell+=c}if(quote)throw new Error('Aspas não fechadas no CSV.');row.push(cell.replace(/\r$/,''));if(row.some(x=>x.trim()))rows.push(row);return rows}
