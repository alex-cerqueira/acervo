'use client';
import {useEffect,useState} from 'react';
import {NativeSelect} from '@/components/ui/native-select';
export type TaxonomyOption={name:string;chains:{name:string;products:string[]}[]};
export function useTaxonomy(enabled=true){
 const [options,setOptions]=useState<TaxonomyOption[]>([]),[error,setError]=useState('');
 useEffect(()=>{if(!enabled){setOptions([]);return}let active=true;let request=0;
 const refresh=async()=>{const id=++request;try{const r=await fetch('/api/admin?taxonomy=1');const d=await r.json() as {error?:string;portfolios:TaxonomyOption[]};if(!r.ok)throw new Error(d.error||'Não foi possível carregar a taxonomia.');if(active&&id===request){setOptions(d.portfolios);setError('')}}catch(e){if(active&&id===request)setError((e as Error).message)}};
 void refresh();window.addEventListener('taxonomy-updated',refresh);window.addEventListener('focus',refresh);
 return()=>{active=false;window.removeEventListener('taxonomy-updated',refresh);window.removeEventListener('focus',refresh)};
 },[enabled]);return {options,error};
}
export function TaxonomySelect({label,value,onChange,options,required=false,disabled=false,placeholder='Selecione'}:{label:string;value:string;onChange:(v:string)=>void;options:string[];required?:boolean;disabled?:boolean;placeholder?:string}){
 const valid=options.includes(value)?value:'';
 return <NativeSelect aria-label={label} value={valid} onChange={e=>onChange(e.target.value)} required={required} disabled={disabled}>
  <option value="">{placeholder}</option>{options.map(v=><option key={v} value={v}>{v}</option>)}
 </NativeSelect>;
}
