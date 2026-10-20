import { CRITERIA, DEFAULT_WEIGHTS, PRESETS, STATUSES, initialState, ranked, score, ties, totalWeight, toCSV, validateState } from './model.mjs';
const $ = s=>document.querySelector(s);
const key='top-manta-radar-v1';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=v=>new Intl.NumberFormat('ca-ES',{maximumFractionDigits:1}).format(v);
const signed=v=>`${v>0?'+':v<0?'−':''}${num(Math.abs(v))}`;
let state=initialState(), pendingImport=null, toastTimer, storageAvailable=true;
let startupMessage='';
try { const saved=localStorage.getItem(key); if(saved) state=validateState(JSON.parse(saved)); }
catch { startupMessage='No s’ha pogut recuperar el pla desat. Es mostra la base inicial; pots importar una còpia JSON.'; }
function toast(message){$('#toast').textContent=message;$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').hidden=true,6500);}
function persist(){try{localStorage.setItem(key,JSON.stringify(state));storageAvailable=true;$('#save-status').textContent='Canvis desats en aquest navegador';}catch{storageAvailable=false;$('#save-status').textContent='No s’ha pogut desar. Exporta una còpia del pla.';toast('El navegador no permet desar el pla. Descarrega una còpia JSON per conservar els canvis.');}}
function monthLabel(f){if(f.timingNote)return f.timingNote;if(!f.month)return 'Per definir';return new Intl.DateTimeFormat('ca-ES',{month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(f.month+'-01T12:00:00Z'));}
function dateLabel(date){return new Intl.DateTimeFormat('ca-ES',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(date+'T12:00:00Z'));}
function renderWeights(){
  const total=totalWeight(state.weights);
  $('#weight-controls').innerHTML=CRITERIA.map(c=>`<div class="weight-group"><div class="weight-title"><label for="weight-${c.id}">${c.label}</label><output for="weight-${c.id}" id="output-${c.id}">${total?Math.round(state.weights[c.id]/total*100):0}%</output></div><input type="range" id="weight-${c.id}" data-weight="${c.id}" min="0" max="100" step="1" value="${state.weights[c.id]}" style="--fill:${state.weights[c.id]}%" aria-describedby="help-${c.id}"><p id="help-${c.id}">${c.help}</p></div>`).join('');
  updateWeightLabels();
}
function updateWeightLabels(){
  const total=totalWeight(state.weights);
  for(const c of CRITERIA){const input=$('#weight-'+c.id);input.value=state.weights[c.id];input.style.setProperty('--fill',state.weights[c.id]+'%');input.setAttribute('aria-valuetext',`${state.weights[c.id]} de pes; ${total?Math.round(state.weights[c.id]/total*100):0}% del total`);$('#output-'+c.id).textContent=(total?Math.round(state.weights[c.id]/total*100):0)+'%';}
  for(const button of document.querySelectorAll('[data-preset]')){const active=CRITERIA.every(c=>state.weights[c.id]===PRESETS[button.dataset.preset][c.id]);button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));}
}
function renderRecommendation(list){
  if(!totalWeight(state.weights)){$('#recommendation').innerHTML='<div class="rec-empty"><h3>Què vols prioritzar?</h3><p>Tots els pesos són a zero. Dona pes a almenys un criteri per tornar a calcular la recomanació.</p></div>';return;}
  if(!list.length){$('#recommendation').innerHTML='<div class="rec-empty"><h3>El radar espera candidates</h3><p>Afegeix un festival o activa «Inclou aquest festival a la recomanació» a una fitxa. Els festivals descartats no es recomanen.</p></div>';return;}
  const best=list[0], tied=ties(list), baseline=ranked(state,state.referenceWeights), base=score(best,state.referenceWeights);
  const reasons=[...CRITERIA].filter(c=>state.weights[c.id]>0).sort((a,b)=>best.scores[b.id]*state.weights[b.id]-best.scores[a.id]*state.weights[a.id]).slice(0,2);
  const reason=reasons.map(c=>`${c.short.toLocaleLowerCase('ca')} (${best.scores[c.id]}/5)`).join(' i ');
  const referenceNote=baseline.length?(baseline[0].id===best.id?'Manté el primer lloc respecte a la referència.':`Amb els pesos de referència, ${baseline[0].name} era al davant.`):'La referència no té pesos assignats.';
  $('#recommendation').innerHTML=`<article class="recommendation"><div><div class="eyebrow">↗ ${tied.length>1?'PRIMER LLOC COMPARTIT':'MILLOR ENCAIX AMB AQUESTS PESOS'}</div><h3 class="rec-title">${esc(best.name)}</h3><p class="rec-meta">${esc(best.country)} <span aria-hidden="true">·</span> ${esc(best.proposal)}</p><p class="rec-reason">${tied.length>1?`Empat amb ${esc(tied.slice(1).map(f=>f.name).join(', '))}. `:''}Hi contribueixen sobretot ${esc(reason)}. ${esc(referenceNote)}</p><div class="rec-footer"><span class="rec-tag">${best.reviewed?'Puntuacions revisades':'Simulació · puntuacions de mostra'}</span><button class="rec-link" data-edit="${esc(best.id)}">Prepara el següent pas ↗</button></div></div><div class="rec-score"><strong>${num(best.score)}</strong><span>sobre 100</span><small>${base===null?'Sense referència':signed(best.score-base)+' punts'}<br>vs. pesos de referència</small></div></article>`;
}
function renderComparison(list){
  $('#compare-count').textContent=state.compare.length+'/3';
  const html=state.compare.map(id=>{
    const f=state.festivals.find(f=>f.id===id);if(!f)return '';
    const current=score(f,state.weights),base=score(f,state.referenceWeights),i=list.findIndex(x=>x.id===id),rank=i<0?'Fora de selecció':`#${list.filter(x=>x.score>(current??0)+0.000001).length+1} al radar`;
    return `<article class="compare-card ${i===0?'leader':''}"><div class="compare-topline"><span class="rank">${rank}</span><button class="remove-compare" data-remove="${esc(id)}" aria-label="Deixa de comparar ${esc(f.name)}">×</button></div><h4 class="compare-name">${esc(f.name)}</h4><p class="compare-country">${esc(f.country)}</p><div class="compare-score"><strong>${current===null?'—':num(current)}</strong><span>/100</span><span class="delta" title="Canvi de puntuació amb els pesos actuals respecte als pesos de referència">${current===null||base===null?'—':signed(current-base)+' punts'}</span></div>${CRITERIA.map(c=>`<div class="compare-row"><span>${c.short}</span><div class="bar-track"><div class="bar-fill" style="width:${f.scores[c.id]*20}%;background:${c.color}"></div></div><span>${f.scores[c.id]}</span></div>`).join('')}<div class="card-edit"><span class="sample-tag">${f.reviewed?'✓ Revisada':'<span class="legend-dot"></span>De mostra'}</span><button class="text-button" data-edit="${esc(id)}">Edita ↗</button></div></article>`;
  });
  for(let i=state.compare.length;i<3;i++)html.push('<div class="compare-placeholder">＋<br>Marca un festival<br>per comparar-lo</div>');
  $('#comparison').innerHTML=html.join('');
}
function statusClass(f){return f.status==='Confirmat'?'done':f.status==='Descartat'?'rejected':f.status!=='Pendent'?'active':'';}
function renderTable(list){
  const query=$('#search').value.trim().toLocaleLowerCase('ca'),status=$('#status-filter').value;
  const order=new Map(list.map((f,i)=>[f.id,i]));
  const filtered=[...state.festivals].sort((a,b)=>(order.get(a.id)??1000)-(order.get(b.id)??1000)||a.name.localeCompare(b.name,'ca')).filter(f=>(!query||`${f.name} ${f.country} ${f.proposal}`.toLocaleLowerCase('ca').includes(query))&&(!status||f.status===status));
  $('#festival-rows').innerHTML=filtered.length?filtered.map(f=>{
    const value=score(f,state.weights),base=score(f,state.referenceWeights),delta=value===null||base===null?null:value-base;
    return `<tr class="${!f.eligible||f.status==='Descartat'?'excluded':''}"><td class="check-cell"><input type="checkbox" data-compare="${esc(f.id)}" ${state.compare.includes(f.id)?'checked':''} aria-label="Compara ${esc(f.name)}"></td><td><button class="festival-name" data-edit="${esc(f.id)}">${esc(f.name)}</button><div class="festival-country">${esc(f.country)} <span class="priority ${f.priority!=='Alta'?'medium':''}">${esc(f.priority)}</span>${f.verified?'<span title="Dades marcades com a verificades">✓</span>':''}</div></td><td class="proposal-col"><div class="proposal">${esc(f.proposal||'Per definir')}</div></td><td class="month">${esc(monthLabel(f))}<small>${f.dueDate?'Límit intern: '+esc(dateLabel(f.dueDate)):f.verified?'Calendari revisat':'Calendari per verificar'}</small></td><td><span class="status ${statusClass(f)}">${esc(f.status)}</span></td><td><div class="points">${!f.reviewed?'<span class="legend-dot" title="Puntuació de mostra"></span>':''}${value===null?'—':num(value)}${delta!==null&&Math.abs(delta)>.01?`<small title="Canvi amb els pesos actuals">${signed(delta)}</small>`:''}</div></td><td><button class="row-edit" data-edit="${esc(f.id)}" aria-label="Edita ${esc(f.name)}"><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m4 13 8-8 3 3-8 8-4 1 1-4ZM11 6l3 3M11 16h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button></td></tr>`;
  }).join(''):'<tr><td colspan="7" class="empty-table">Cap festival coincideix amb la cerca o l’estat seleccionat.</td></tr>';
  $('#result-count').textContent=`${filtered.length} de ${state.festivals.length} festivals · ${list.length} candidates`;
}
function renderResults(){
  const list=ranked(state);renderRecommendation(list);renderComparison(list);renderTable(list);
  $('#total-count').textContent=state.festivals.length;$('#nav-count').textContent=state.festivals.length;
  $('#progress-count').textContent=state.festivals.filter(f=>!['Pendent','Descartat'].includes(f.status)).length;
  $('#verified-count').textContent=state.festivals.filter(f=>f.verified).length;
}
function renderAll(){renderWeights();renderResults();}
function changeState(){persist();renderAll();}
const form=$('#festival-form'),dialog=$('#festival-dialog');
function openFestival(id){
  form.reset();
  const f=state.festivals.find(f=>f.id===id)||{id:'',name:'',country:'',priority:'Mitjana',proposal:'',contact:'',month:'',timingNote:'',scores:{mission:3,reach:3,feasibility:3,affordability:3},status:'Pendent',eligible:true,reviewed:false,verified:false,nextAction:'',dueDate:'',notes:''};
  for(const key of ['id','name','country','priority','proposal','contact','month','timingNote','status','nextAction','dueDate','notes'])form.elements.namedItem(key).value=f[key];
  for(const key of ['reviewed','verified','eligible'])form.elements.namedItem(key).checked=f[key];
  $('#dialog-title').textContent=f.id?'Edita '+f.name:'Una nova oportunitat';
  $('#score-controls').innerHTML=CRITERIA.map(c=>`<div class="score-control"><label for="score-${c.id}">${c.short}<output for="score-${c.id}">${f.scores[c.id]}/5</output></label><input id="score-${c.id}" type="range" name="score-${c.id}" min="1" max="5" step="1" value="${f.scores[c.id]}" style="--fill:${(f.scores[c.id]-1)*25}%"></div>`).join('');
  dialog.showModal();
}
function download(text,name,type){const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
const stamp=()=>new Date().toISOString().slice(0,10);
function exportJSON(){download(JSON.stringify(state,null,2),`top-manta-radar-${stamp()}.json`,'application/json');document.querySelector('.backup-menu').open=false;}
$('#status-filter').insertAdjacentHTML('beforeend',STATUSES.map(s=>`<option>${s}</option>`).join(''));
form.elements.namedItem('status').innerHTML=STATUSES.map(s=>`<option>${s}</option>`).join('');
$('#weight-controls').addEventListener('input',event=>{const id=event.target.dataset.weight;if(!id)return;state.weights[id]=Number(event.target.value);updateWeightLabels();persist();renderResults();});
document.addEventListener('click',event=>{
  const edit=event.target.closest('[data-edit]');if(edit)openFestival(edit.dataset.edit);
  const remove=event.target.closest('[data-remove]');if(remove){state.compare=state.compare.filter(id=>id!==remove.dataset.remove);changeState();}
  const preset=event.target.closest('[data-preset]');if(preset){state.weights={...PRESETS[preset.dataset.preset]};changeState();}
});
$('#festival-rows').addEventListener('change',event=>{
  const id=event.target.dataset.compare;if(!id)return;
  if(event.target.checked){if(state.compare.length>=3){event.target.checked=false;toast('Ja compares 3 festivals. Desmarca’n un per afegir-ne un altre.');return;}state.compare.push(id);}else state.compare=state.compare.filter(x=>x!==id);
  persist();renderComparison(ranked(state));
});
$('#reset-weights').addEventListener('click',()=>{state.weights={...DEFAULT_WEIGHTS};changeState();toast('S’han restablert els pesos inicials.');});
$('#save-reference').addEventListener('click',()=>{if(!totalWeight(state.weights)){toast('Assigna pes a algun criteri abans de fixar una referència.');return;}state.referenceWeights={...state.weights};changeState();toast('Referència actualitzada. Els canvis de punts es compararan amb aquests pesos.');});
$('#search').addEventListener('input',()=>renderTable(ranked(state)));
$('#status-filter').addEventListener('change',()=>renderTable(ranked(state)));
$('#add-festival').addEventListener('click',()=>openFestival());
$('#close-dialog').addEventListener('click',()=>dialog.close());$('#cancel-dialog').addEventListener('click',()=>dialog.close());
$('#score-controls').addEventListener('input',event=>{if(event.target.type!=='range')return;event.target.previousElementSibling.querySelector('output').textContent=event.target.value+'/5';event.target.style.setProperty('--fill',(Number(event.target.value)-1)*25+'%');});
form.addEventListener('submit',event=>{
  event.preventDefault();if(!form.reportValidity())return;
  const data=new FormData(form),f={};
  for(const key of ['id','name','country','priority','proposal','contact','month','timingNote','status','nextAction','dueDate','notes'])f[key]=String(data.get(key)||'').trim();
  if(!f.name||!f.country){toast('Escriu un nom i un país o àmbit.');return;}
  f.id=f.id||'f-'+crypto.randomUUID();f.scores=Object.fromEntries(CRITERIA.map(c=>[c.id,Number(data.get('score-'+c.id))]));
  for(const key of ['reviewed','verified','eligible'])f[key]=data.get(key)==='on';
  const index=state.festivals.findIndex(x=>x.id===f.id);
  if(index<0){if(state.festivals.length>=300){toast('El límit del planificador és de 300 festivals.');return;}state.festivals.push(f);}else state.festivals[index]=f;
  changeState();dialog.close();toast(storageAvailable?'Fitxa desada. La recomanació ja està actualitzada.':'Fitxa actualitzada. Exporta una còpia per conservar els canvis.');
});
$('#export-csv').addEventListener('click',()=>{download(toCSV(state),`top-manta-festivals-${stamp()}.csv`,'text/csv;charset=utf-8');toast('CSV exportat amb separador de punt i coma, preparat per a Excel.');});
$('#export-json').addEventListener('click',exportJSON);
$('#backup-before-import').addEventListener('click',exportJSON);
$('#import-json').addEventListener('click',()=>{document.querySelector('.backup-menu').open=false;$('#import-file').click();});
$('#import-file').addEventListener('change',async event=>{
  const file=event.target.files[0];if(!file)return;
  try{if(file.size>2000000)throw new Error('La còpia és massa gran. El màxim és de 2 MB.');pendingImport=validateState(JSON.parse(await file.text()));$('#import-summary').textContent=`La còpia «${file.name}» conté ${pendingImport.festivals.length} festivals.`;$('#import-dialog').showModal();}
  catch(error){toast(error instanceof SyntaxError?'El fitxer no conté JSON vàlid. El pla actual es manté.':error.message);pendingImport=null;}
  event.target.value='';
});
$('#cancel-import').addEventListener('click',()=>{pendingImport=null;$('#import-dialog').close();});
$('#import-dialog').addEventListener('cancel',()=>{pendingImport=null;});
$('#confirm-import').addEventListener('click',()=>{if(!pendingImport)return;state=pendingImport;pendingImport=null;$('#search').value='';$('#status-filter').value='';changeState();$('#import-dialog').close();toast('Còpia importada. El radar ja està actualitzat.');});
renderAll();
if(startupMessage)toast(startupMessage);else persist();
