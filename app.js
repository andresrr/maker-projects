const projects=window.projects;
const $=s=>document.querySelector(s); const grid=$('#grid');
const categories=[...new Set(projects.map(p=>p.category))].sort((a,b)=>a.localeCompare(b));
const platforms=[...new Set(projects.map(p=>p.platform))].sort((a,b)=>a.localeCompare(b));
for(const c of categories) $('#cat').insertAdjacentHTML('beforeend',`<option>${c}</option>`);
for(const p of platforms) $('#platform').insertAdjacentHTML('beforeend',`<option>${p}</option>`);
const featured=['Robots','Animatronics','Kinetic Art','Vuelo','Agua','Control','Gadgets','Displays','Plotters'];
$('#chips').innerHTML=['Todos',...featured.filter(x=>categories.includes(x))].map((x,i)=>`<button class="chip ${i===0?'active':''}" data-cat="${i===0?'':x}">${x}</button>`).join('');
let favOnly=false; let favorites=new Set(); try{favorites=new Set(JSON.parse(localStorage.getItem('makerFavs')||'[]'))}catch(e){}
function saveFavs(){try{localStorage.setItem('makerFavs',JSON.stringify([...favorites]))}catch(e){}}
function stars(n){return '★'.repeat(n)+'☆'.repeat(5-n)}
function cls(s){return s==='Muy reproducible'?'good':s==='Experimental'?'exp':'mid'}
function isPrintable(p){return !['No','No claro','N/A'].includes((p.printable||'').trim())}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function cleanOneLine(s){return String(s||'').replace(/\s+/g,' ').trim()}
const purposeByCategory={
 'Robots':'Es una buena referencia para aprender movimiento, sensores, control y comportamiento interactivo.',
 'Robotics':'Sirve como base práctica para experimentar con cinemática, actuadores, control y automatización.',
 'Animatronics':'Está especialmente orientado a mecanismos expresivos, movimiento de personajes y efectos animatrónicos.',
 'Gadgets':'Está planteado como un dispositivo funcional que puedes adaptar a tus propios usos.',
 'Displays':'Es una referencia interesante para experimentar con visualización física, interfaces y mecanismos de presentación.',
 'Kinetic Art':'Combina electrónica y movimiento para crear una pieza visual o mecánica con carácter artístico.',
 'Plotters':'Es una buena base para aprender control de movimiento, motores y generación de trayectorias.',
 'Vuelo':'Está orientado a experimentar con control, navegación y plataformas aéreas de forma reproducible.',
 'Agua':'Explora mecanismos, sensores o movimiento relacionados con agua y efectos físicos.',
 'Control':'Se centra en interfaces, automatización y control de hardware.',
 'Audio':'Es una base útil para experimentar con sonido, reproducción, síntesis o interacción musical.',
 'Cámaras':'Está pensado para proyectos de visión, captura de imagen o monitorización.',
 'Wearables':'Es una referencia útil para electrónica compacta, portátil y de bajo consumo.'
};
function docsSentence(p){
 if(p.docs>=5) return 'La documentación es muy completa, por lo que es de los proyectos más sencillos de estudiar y reproducir del directorio.';
 if(p.docs===4) return 'La documentación es sólida y debería permitir reproducirlo con pocas dudas, revisando el repositorio antes de comprar componentes.';
 if(p.docs===3) return 'La documentación permite seguir el proyecto, aunque probablemente tendrás que completar algunos detalles por tu cuenta.';
 return 'La documentación es limitada, así que conviene tratarlo más como inspiración o punto de partida que como una guía paso a paso.';
}
function printableSentence(p){
 if(isPrintable(p)) return `Dispone de recursos de impresión 3D o CAD (${p.printable}), algo útil si quieres fabricar también la parte mecánica o la carcasa.`;
 return 'No depende claramente de archivos 3D/CAD completos, por lo que la parte mecánica puede requerir adaptación o fabricación propia.';
}
function longDescription(p){
 const purpose=purposeByCategory[p.category]||`Es un proyecto de la categoría ${p.category} pensado para experimentar y reutilizar ideas en otros montajes.`;
 return `${cleanOneLine(p.description)} La plataforma principal es ${p.platform}. ${purpose} ${printableSentence(p)} ${docsSentence(p)}`;
}
function filtered(){
 const q=$('#q').value.trim().toLowerCase(),cat=$('#cat').value,plat=$('#platform').value,docs=+$('#docs').value,status=$('#status').value,pr=$('#print').value;
 return projects.filter(p=>(!q||[p.name,p.category,p.platform,p.description,p.printable].join(' ').toLowerCase().includes(q))&&(!cat||p.category===cat)&&(!plat||p.platform===plat)&&p.docs>=docs&&(!status||p.status===status)&&(!pr||isPrintable(p))&&(!favOnly||favorites.has(p.name)))
}
function render(){
 const arr=filtered();
 $('#totalStat').textContent=projects.length+' proyectos'; $('#shownStat').textContent=arr.length+' visibles'; $('#empty').style.display=arr.length?'none':'block';
 grid.innerHTML=arr.map(p=>`<article class="card"><div class="thumb"><img loading="lazy" src="${esc(p.image)}" alt="Foto o imagen de ${esc(p.name)}" onerror="this.style.opacity=.18"><button class="fav ${favorites.has(p.name)?'on':''}" data-fav="${esc(p.name)}" title="Favorito">★</button></div><div class="body"><div class="titleline"><h2>${esc(p.name)}</h2><span class="cat">${esc(p.category)}</span></div><div class="desc">${esc(cleanOneLine(p.description))}</div><div class="tags"><span class="tag">${esc(p.platform)}</span><span class="tag">🖨️ ${esc(p.printable)}</span><span class="tag">${esc(p.category)}</span></div><div><span class="rating">${stars(p.docs)}</span> <span class="status ${cls(p.status)}">${esc(p.status)}</span></div><div class="actions"><button class="more" data-open="${projects.indexOf(p)}">Ver ficha</button><a class="btn" href="${esc(p.url)}" target="_blank" rel="noopener">Proyecto</a><a class="btn yt" href="${esc(p.video)}" target="_blank" rel="noopener">YouTube ▶</a></div></div></article>`).join('');
 document.querySelectorAll('[data-fav]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();const n=b.dataset.fav;favorites.has(n)?favorites.delete(n):favorites.add(n);saveFavs();render()}));
 document.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>openModal(projects[+b.dataset.open])));
 if($('#quickOverlay').classList.contains('open')) renderQuick();
}
function openModal(p){
 closeQuick();
 $('#mImg').src=p.image;$('#mImg').alt='Foto o imagen de '+p.name;$('#mTitle').textContent=p.name;$('#mDesc').textContent=longDescription(p);
 $('#mPlatform').textContent=p.platform;$('#mPrint').textContent=p.printable;$('#mDocs').textContent=stars(p.docs);$('#mStatus').textContent=p.status;$('#mProject').href=p.url;$('#mVideo').href=p.video;
 $('#overlay').classList.add('open');document.body.style.overflow='hidden'
}
function closeModal(){$('#overlay').classList.remove('open');if(!$('#quickOverlay').classList.contains('open'))document.body.style.overflow=''}
function renderQuick(){
 const arr=filtered();
 $('#quickCount').textContent=`${arr.length} de ${projects.length} proyectos`;
 $('#quickList').innerHTML=arr.map(p=>`<button class="quickrow" data-quick-open="${projects.indexOf(p)}"><strong>${esc(p.name)}</strong><span>${esc(cleanOneLine(p.description))}</span></button>`).join('')||'<div class="quickempty">No hay proyectos con los filtros actuales.</div>';
 document.querySelectorAll('[data-quick-open]').forEach(b=>b.addEventListener('click',()=>openModal(projects[+b.dataset.quickOpen])));
}
function openQuick(){renderQuick();$('#quickOverlay').classList.add('open');document.body.style.overflow='hidden'}
function closeQuick(){$('#quickOverlay').classList.remove('open');if(!$('#overlay').classList.contains('open'))document.body.style.overflow=''}
['q','cat','platform','docs','print','status'].forEach(id=>$('#'+id).addEventListener(id==='q'?'input':'change',()=>{if(id==='cat')document.querySelectorAll('.chip').forEach(c=>c.classList.toggle('active',c.dataset.cat===$('#cat').value));render()}));
document.querySelectorAll('.chip').forEach(c=>c.addEventListener('click',()=>{$('#cat').value=c.dataset.cat;document.querySelectorAll('.chip').forEach(x=>x.classList.toggle('active',x===c));render()}));
$('#favOnly').addEventListener('click',()=>{favOnly=!favOnly;$('#favOnly').classList.toggle('active',favOnly);render()});
$('#toggleFilters').addEventListener('click',()=>$('#filters').classList.toggle('collapsed'));
$('#quickBtn').addEventListener('click',openQuick);
$('#topBtn').addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
$('#closeModal').addEventListener('click',closeModal);
$('#closeQuick').addEventListener('click',closeQuick);
$('#overlay').addEventListener('click',e=>{if(e.target===$('#overlay'))closeModal()});
$('#quickOverlay').addEventListener('click',e=>{if(e.target===$('#quickOverlay'))closeQuick()});
addEventListener('keydown',e=>{if(e.key==='Escape'){if($('#overlay').classList.contains('open'))closeModal();else closeQuick()}});
if(matchMedia('(max-width:850px)').matches) $('#filters').classList.add('collapsed');
render();
if('serviceWorker' in navigator) navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
