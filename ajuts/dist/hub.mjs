import{initialState,validateState}from './festivals/model.mjs';
let festivals=initialState(),work={};try{const raw=localStorage.getItem('top-manta-radar-v1');if(raw)festivals=validateState(JSON.parse(raw));}catch{}
try{const raw=localStorage.getItem('top-manta-ajuts-v1');if(raw){const saved=JSON.parse(raw);if(saved&&saved.work&&typeof saved.work==='object')work=saved.work;}}catch{}
const progressing=['En preparació','Contactat','En conversa','Proposta enviada','Confirmat'];const activeFestival=festivals.festivals.filter(f=>progressing.includes(f.status)).length;
const activeEconomic=Object.values(work).filter(w=>w&&['Validant requisits','En preparació','Presentada','Concedida'].includes(w.stage)).length;
document.getElementById('festival-count').textContent=festivals.festivals.length;
document.getElementById('festival-progress').textContent=activeFestival+' propostes en marxa en aquest navegador.';
document.getElementById('economic-progress').textContent=activeEconomic+' candidatures en marxa en aquest navegador.';
document.getElementById('active-count').textContent=activeFestival+activeEconomic;
try{const r=await fetch('./economia/data.json');if(r.ok){const d=await r.json();document.getElementById('economic-count').textContent=d.rows.length;document.getElementById('total-count').textContent=d.rows.length+festivals.festivals.length;}}catch{}

