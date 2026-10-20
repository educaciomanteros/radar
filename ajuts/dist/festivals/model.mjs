export const CRITERIA = [
  { id: 'mission', label: 'Encaix amb Top Manta', short: 'Encaix', help: 'Afinitat amb la moda, l’antiracisme i l’acció col·lectiva.', color: '#7544c8' },
  { id: 'reach', label: 'Projecció internacional', short: 'Projecció', help: 'Potencial de crear aliances i arribar a nous públics.', color: '#a27cda' },
  { id: 'feasibility', label: 'Viabilitat', short: 'Viabilitat', help: 'Capacitat de preparar i sostenir la participació.', color: '#5d8770' },
  { id: 'affordability', label: 'Cost assumible', short: 'Cost', help: 'Una puntuació alta vol dir menys càrrega econòmica.', color: '#a79539' }
];
export const DEFAULT_WEIGHTS = { mission: 40, reach: 25, feasibility: 20, affordability: 15 };
export const PRESETS = { balanced: DEFAULT_WEIGHTS, impact: { mission: 60, reach: 30, feasibility: 5, affordability: 5 }, practical: { mission: 15, reach: 10, feasibility: 40, affordability: 35 } };
export const STATUSES = ['Pendent', 'En preparació', 'Contactat', 'En conversa', 'Proposta enviada', 'Confirmat', 'Descartat'];
const rows = [
  ['What Design Can Do','Països Baixos','Alta','Ponència sobre moda i activisme','info@whatdesigncando.com','2026-10',[5,4,5,4]],
  ['Toronto Biennial','Canadà','Alta','Xerrada i taller participatiu','programs@torontobiennial.org','2026-10',[4,5,3,2]],
  ['Dutch Design Week','Països Baixos','Alta','Exposició de moda activista','programme@dutchdesignfoundation.com','2026-10',[5,4,4,3],'Octubre–novembre 2026'],
  ['Liverpool Biennial','Regne Unit','Alta','Art comunitari i migració','info@biennial.com','2026-10',[4,4,4,3]],
  ['Berlin Biennale','Alemanya','Alta','Instal·lació artística','office@berlinbiennale.de','2026-11',[4,5,3,3]],
  ['Manifesta','Europa','Alta','Projecte artístic col·lectiu','office@manifesta.org','2026-11',[5,5,2,2]],
  ["Dak’Art Biennale",'Senegal','Alta','Moda, art i diàspora','','2026-11',[5,5,3,3]],
  ['Afropunk','Internacional','Mitjana','Moda, performance i activisme','','2026-12',[5,5,3,2]],
  ['BlackStar Film Festival','EUA','Mitjana','Conversa sobre narratives migrants','','2026-12',[4,4,3,2]],
  ['Helsinki Biennial','Finlàndia','Mitjana','Art, sostenibilitat i migració','','2027-01',[4,4,3,2]],
  ['Ars Electronica','Àustria','Mitjana','Creativitat i transformació social','','2027-01',[3,5,3,3]],
  ['London Design Festival','Regne Unit','Mitjana','Moda i disseny social','','2027-01',[4,5,4,2]],
  ['Design Indaba','Sud-àfrica','Mitjana','Ponència sobre disseny africà','','2027-01',[5,5,3,2]],
  ['EVA International','Irlanda','Mitjana','Art polític i pràctiques comunitàries','','2027-02',[5,3,4,3]],
  ['SPRING/BREAK Art Show','EUA','Mitjana','Instal·lació artística','','2027-02',[3,4,3,2]],
  ['Soft Power Festival','Alemanya','Mitjana','Xerrada i exposició','','',[3,3,3,3]]
];
export function initialState() {
  return { version: 1, weights: { ...DEFAULT_WEIGHTS }, referenceWeights: { ...DEFAULT_WEIGHTS }, compare: ['f1','f3','f7'], festivals: rows.map((r,i) => ({ id: `f${i+1}`, name:r[0], country:r[1], priority:r[2], proposal:r[3], contact:r[4], month:r[5], timingNote:r[7] || '', scores:Object.fromEntries(CRITERIA.map((c,j)=>[c.id,r[6][j]])), status:'Pendent', eligible:true, reviewed:false, verified:false, nextAction:'Verificar convocatòria, contacte i condicions de participació.', dueDate:'', notes:'' })) };
}
export function totalWeight(weights) { return CRITERIA.reduce((sum,c)=>sum+weights[c.id],0); }
export function score(festival,weights) {
  const total=totalWeight(weights);
  return total ? CRITERIA.reduce((sum,c)=>sum+festival.scores[c.id]*weights[c.id],0)/total*20 : null;
}
export function ranked(state,weights=state.weights) {
  if(!totalWeight(weights)) return [];
  return state.festivals.filter(f=>f.eligible && f.status!=='Descartat').map(f=>({ ...f, score:score(f,weights) })).sort((a,b)=>b.score-a.score || a.name.localeCompare(b.name,'ca'));
}
export function ties(list) { return list.length ? list.filter(f=>Math.abs(f.score-list[0].score)<0.000001) : []; }
export function csvCell(v) { let text=String(v??''); if(/^[\s]*[=+@-]/.test(text)) text="'"+text; return '"'+text.replaceAll('"','""')+'"'; }
export function toCSV(state) {
  const head=['Festival','País','Prioritat inicial','Proposta','Contacte (pendent de verificar si no indicat)','Mes previst de contacte','Nota del calendari','Estat','Següent acció','Data límit interna','Puntuació /100','Puntuacions revisades','Dades verificades','Candidata',...CRITERIA.map(c=>c.label+' /5'),'Notes'];
  return '\ufeff'+[head,...state.festivals.map(f=>[f.name,f.country,f.priority,f.proposal,f.contact,f.month,f.timingNote,f.status,f.nextAction,f.dueDate,score(f,state.weights)?.toFixed(1)??'',f.reviewed?'Sí':'No',f.verified?'Sí':'No',f.eligible?'Sí':'No',...CRITERIA.map(c=>f.scores[c.id]),f.notes])].map(r=>r.map(csvCell).join(';')).join('\r\n');
}
export function validateState(value) {
  const bad=()=>{throw new Error('El fitxer no és una còpia vàlida del planificador. No s’ha canviat el teu pla.');};
  if(!value || value.version!==1 || !Array.isArray(value.festivals) || value.festivals.length>300 || !Array.isArray(value.compare)) bad();
  for(const weights of [value.weights,value.referenceWeights]) if(!weights || CRITERIA.some(c=>!Number.isFinite(weights[c.id])||weights[c.id]<0||weights[c.id]>100)) bad();
  const ids=new Set();
  for(const f of value.festivals) {
    if(!f || typeof f.id!=='string' || !/^[a-zA-Z0-9-]{1,80}$/.test(f.id) || ids.has(f.id)) bad();
    ids.add(f.id);
    if(typeof f.name!=='string'||!f.name.trim()||f.name.length>150||!STATUSES.includes(f.status)||!['Alta','Mitjana','Baixa'].includes(f.priority)) bad();
    for(const key of ['country','proposal','contact','month','timingNote','nextAction','dueDate','notes']) if(typeof f[key]!=='string'||f[key].length>6000) bad();
    if(f.month&&!/^\d{4}-(0[1-9]|1[0-2])$/.test(f.month)) bad();
    if(f.dueDate&&(!/^\d{4}-\d{2}-\d{2}$/.test(f.dueDate)||Number.isNaN(Date.parse(f.dueDate)))) bad();
    for(const key of ['eligible','reviewed','verified']) if(typeof f[key]!=='boolean') bad();
    if(!f.scores || CRITERIA.some(c=>!Number.isInteger(f.scores[c.id])||f.scores[c.id]<1||f.scores[c.id]>5)) bad();
  }
  if(value.compare.length>3||new Set(value.compare).size!==value.compare.length||value.compare.some(id=>!ids.has(id))) bad();
  return {version:1, weights:Object.fromEntries(CRITERIA.map(c=>[c.id,value.weights[c.id]])),referenceWeights:Object.fromEntries(CRITERIA.map(c=>[c.id,value.referenceWeights[c.id]])),compare:[...value.compare],festivals:value.festivals.map(f=>({...f,scores:Object.fromEntries(CRITERIA.map(c=>[c.id,f.scores[c.id]]))}))};
}
