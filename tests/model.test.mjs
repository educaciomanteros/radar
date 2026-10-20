import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {score,status,rank,budget,csv,validateBackup,todayMadrid} from '../dist/model.mjs';
const d=JSON.parse(readFileSync(new URL('../dist/data.json',import.meta.url)));
const weights=[40,25,20,15];
assert.equal(d.rows.length,32);assert.equal(new Set(d.rows.map(r=>r.id)).size,32);
for(const r of d.rows){assert.ok(r.source.startsWith('https://'));assert.equal(r.scores.length,4);assert.ok(r.scores.every(v=>v>=1&&v<=5));for(const field of ['entity','proposal','fit','risk','steps','docs','amount','funding','evidence'])assert.ok(r[field]?.trim(),r.id+' '+field);}
const creix=d.rows.find(r=>r.id==='creixess');
assert.equal(status(creix,new Date('2026-10-22T11:59:59Z')),'Oberta');assert.equal(status(creix,new Date('2026-10-22T12:00:01Z')),'Tancada');
assert.equal(status(d.rows.find(r=>r.id==='arc'),new Date('2026-10-19T18:00:00Z')),'Anunciada');
assert.equal(todayMadrid(new Date('2026-10-19T23:30:00Z')),'2026-10-20');
assert.equal(score(creix,[0,0,0,0]),null);
const list=rank(d.rows,weights);assert.ok(list.length>0);assert.ok(list.every(r=>r.kind==='Subvenció'));assert.ok(!rank(d.rows,weights,{creixess:{stage:'Descartada'}}).some(r=>r.id==='creixess'));
assert.notEqual(rank(d.rows,[100,0,0,0])[0].id,rank(d.rows,[0,0,0,100])[0].id);
assert.deepEqual(budget(20000,80,15000,50,80,25),{grant:15000,own:5000,initial:12500,admin:2000});
assert.deepEqual(budget(20000,0,15000,0,0,25),{grant:0,own:20000,initial:20000,admin:0});
const work={creixess:{stage:'En preparació',owner:'=HYPERLINK("x")',due:'2026-10-21',validated:true,notes:'Dues línies\namb "cometes"'}};
assert.deepEqual(validateBackup({version:1,weights,work},d.rows.map(r=>r.id)).work,work);
assert.throws(()=>validateBackup({version:1,weights:[-1,1,1,1],work:{}},[]));
assert.throws(()=>validateBackup({version:1,weights,work:{fake:work.creixess}},d.rows.map(r=>r.id)));
assert.throws(()=>validateBackup({version:1,weights,work:{creixess:{...work.creixess,notes:55}}},d.rows.map(r=>r.id)));
const out=csv(d.rows,weights,work);assert.ok(out.startsWith('\ufeff'));assert.ok(out.includes("'=HYPERLINK"));assert.ok(out.includes('Dues línies\namb ""cometes""'));
console.log('PASS: integritat de 32 fitxes, terminis i fus horari, priorització, exclusions, pressupost, còpies i exportació CSV.');

