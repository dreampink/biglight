import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import Handlebars from 'handlebars';
import { importAll } from './importer.js';
import { buildModel } from './normalize.js';
import { loadRegistry, validateModel } from './validate.js';

async function loadTemplate(rel){
  const full = path.join('src/templates', rel);
  const str = await fs.readFile(full,'utf8');
  return Handlebars.compile(str);
}

async function main(){
  const raw = await importAll('data'); // (replace with Sheets importer in the next commit)
  const model = buildModel(raw);

  const registry = await loadRegistry();
  await fs.mkdir('public', { recursive:true });
  let warnings=[];
  try { ({warnings} = validateModel(model, registry)); }
  catch(err){
    const pageTpl = await loadTemplate('page.hbs');
    const body = `<pre style="color:#b00020; white-space:pre-wrap;">${err.message}</pre>` +
                 (err.warnings?.length ? `<hr/><pre>${err.warnings.join('\n')}</pre>` : '');
    const html = pageTpl({ title:'Validation errors', body });
    await fs.writeFile('public/index.html', html);
    console.error(err.message);
    process.exit(1);
  }

  const sectionsHtml=[];
  for(const section of model.sections){
    for(const mod of section.modules){
      const tpl = await loadTemplate(`${mod.module_type}/${mod.variant||'default'}.hbs`);
      sectionsHtml.push(tpl({ items: mod.items }));
    }
  }

  const pageTpl = await loadTemplate('page.hbs');
  const html = pageTpl({ title:'Landing Page – Preview', body: sectionsHtml.join('\n'), warnings });
  await fs.writeFile('public/index.html', html);
  console.log('Built public/index.html from local CSVs');
}

main().catch(e=>{ console.error(e); process.exit(1); });
