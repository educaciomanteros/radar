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


try{const r=await fetch('./universitats/data.json');if(r.ok){const d=await r.json();let u={custom:[],work:{}};try{const raw=localStorage.getItem('top-manta-universitats-v1');if(raw){const{validateState}=await import('./universitats/model.mjs');u=validateState(JSON.parse(raw));}}catch{}const rows=[...d.rows,...u.custom];const n=rows.filter(r=>['Preparant proposta','Contactat','En conversa','Proposta enviada','Confirmat'].includes(u.work[r.id]?.stage)).length;document.getElementById('university-count').textContent=rows.length;document.getElementById('university-progress').textContent=n+' contactes en marxa en aquest navegador.';document.getElementById('active-count').textContent=activeFestival+activeEconomic+n;document.getElementById('total-count').textContent=Number(document.getElementById('total-count').textContent)+rows.length;}}catch{}
