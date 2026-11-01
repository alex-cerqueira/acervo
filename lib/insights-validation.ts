export const insightModels=['gpt-4.1-mini','gpt-4.1','gpt-4.1-nano','gpt-4o'];
export function analysisIssue({items,key,model,question,consent}:{items:{content:string}[];key:string;model:string;question:string;consent:boolean}){
 if(!items.length)return 'Selecione pelo menos um arquivo na lista à esquerda.';
 if(items.length>30)return 'Selecione no máximo 30 arquivos por análise.';
 const documents=items.filter(item=>item.content.trim());
 if(!documents.length)return 'Os arquivos selecionados não têm texto. Abra um arquivo e adicione seu conteúdo para análise.';
 if(documents.reduce((sum,item)=>sum+item.content.length,0)>120000)return 'Reduza a seleção para até 120 mil caracteres de conteúdo.';
 if(!key.trim())return 'Informe a chave de API da OpenAI.';
 if(!insightModels.includes(model))return 'Selecione um dos modelos disponíveis na lista.';
 if(!question.trim())return 'Preencha o que você quer investigar.';
 if(!consent)return 'Marque a autorização de envio dos textos à OpenAI, logo acima do botão.';
 return '';
}
