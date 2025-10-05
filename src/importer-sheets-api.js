import fs from 'fs/promises';
import YAML from 'yaml';

const STRICT_IMG = String(process.env.VALIDATE_IMAGES||'').toLowerCase()==='strict';
const isHttp = u=>{ try{const x=new URL(u); return x.protocol==='http:'||x.protocol==='https:';}catch{return false;}};
const isRel = p=> typeof p==='string' && p.startsWith('/') && !p.startsWith('//');

export async function loadRegistry(p='registry/modules.registry.yaml'){
  const txt = await fs.readFile(p,'utf8'); return YAML.parse(txt);
}
function field(entry){ const [k,v]=Object.entries(entry)[0]; return {name:k, required:v==='required'}; }

export function validateModel(model, registry){
  const errors=[], warnings=[];
  for (const section of model.sections){
    for (const mod of section.modules){
      const def = registry[mod.module_type];
      if(!def){ errors.push(`Unknown module_type "${mod.module_type}" in section "${section.section_id}"`); continue; }

      let min=def.min_items??1, max=def.max_items??999;
      if(def.variants?.[mod.variant]){ min=def.variants[mod.variant].min_items??min; max=def.variants[mod.variant].max_items??max; }
      if(mod.items.length<min || mod.items.length>max){
        errors.push(`${mod.module_type}:${mod.variant} requires ${min}-${max} items – found ${mod.items.length} (module_id=${mod.module_id})`);
      }

      const fields=(def.fields||[]).map(field);
      mod.items.forEach((it,i)=>{
        fields.forEach(f=>{
          if(f.required){
            const v=(it[f.name]??'').toString().trim();
            if(!v) errors.push(`Missing required field "${f.name}" in ${mod.module_type} item #${i+1} (module_id=${mod.module_id})`);
          }
        });

        // light URL checks
        ['desktop_image','mobile_image'].forEach(k=>{
          const v=(it[k]??'').trim(); if(!v) return;
          const ok = isHttp(v) || isRel(v);
          if(!ok){ const msg=`Suspicious ${k} "${v}" in ${mod.module_type} item #${i+1}`; STRICT_IMG?errors.push(msg):warnings.push(msg); }
        });
        const link=(it.cta_url??'').trim();
        if(link && !(isHttp(link)||isRel(link))){
          const msg=`Invalid cta_url "${link}" in ${mod.module_type} item #${i+1}`;
          STRICT_IMG?errors.push(msg):warnings.push(msg);
        }
        if(!it.alt_text?.trim()) warnings.push(`Missing alt_text in ${mod.module_type} item #${i+1} (module_id=${mod.module_id})`);
      });
    }
  }
  if(errors.length){ const e=new Error('Validation failed:\n'+errors.map(x=>'- '+x).join('\n')); e.list=errors; e.warnings=warnings; throw e; }
  return {warnings};
}
