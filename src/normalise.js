export function buildModel({ page, modules, items }) {
  const norm = v => String(v ?? '').trim();
  const isActive = v => String(v ?? '').trim().toLowerCase() in { 'true':1,'yes':1,'1':1 };

  const sections = page.filter(r => isActive(r.active))
    .sort((a,b)=>Number(a.sort_order)-Number(b.sort_order));

  const itemsByModule = items.reduce((acc, it) => {
    const mid = norm(it.module_id); if(!mid) return acc;
    (acc[mid] ||= []).push({
      ...it,
      module_id: mid,
      item_order: Number(it.item_order)||0,
      desktop_image: norm(it.desktop_image),
      mobile_image: norm(it.mobile_image),
      alt_text: norm(it.alt_text),
      headline: norm(it.headline),
      subhead: norm(it.subhead),
      cta_text: norm(it.cta_text),
      cta_url: norm(it.cta_url),
      legal_copy: norm(it.legal_copy),
    });
    return acc;
  }, {});
  for (const k in itemsByModule) itemsByModule[k].sort((a,b)=>a.item_order-b.item_order);

  const modulesBySection = modules.filter(m => isActive(m.active))
    .reduce((acc,m)=>{
      const sid = norm(m.section_id);
      (acc[sid] ||= []).push({
        ...m,
        section_id:sid,
        module_id:norm(m.module_id),
        module_type:norm(m.module_type),
        variant:norm(m.variant)||'default',
      });
      return acc;
    },{});

  const structured = sections.map(sec=>{
    const sid = norm(sec.section_id);
    const mods = (modulesBySection[sid]||[]).map(m=>({
      module_id:m.module_id,
      module_type:m.module_type,
      variant:m.variant,
      items: itemsByModule[m.module_id] || []
    }));
    return { section_id:sid, title:sec.title, modules:mods };
  });

  return { sections: structured };
}
