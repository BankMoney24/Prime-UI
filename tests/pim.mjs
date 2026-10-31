import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import * as appData from '../data.js';
const s=fs.readFileSync(new URL('../pim.js',import.meta.url),'utf8');
const storage={};
const win={};
const sandbox={window:win,console,Date,Math,Number,String,Array,Object,JSON,RegExp,Set,Error,localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},document:{querySelector:()=>null},Intl,FormData,URL,Blob};
vm.runInNewContext(s,sandbox,{filename:'pim.js'});
const pim=win.PrimePIM;
let checks=0;
const test=(label,callback)=>{callback();checks++;console.log('PASS',label)};
const ctx={getModule:appData.getModule,render(){},navigate(){},scan(){},export(){}};
test('All PIM pages render independently with correct title, tabs and no generic module shell',()=>{
 for(const page of pim.allowedPages){const html=pim.render(page,appData.getModule('PIM',page),ctx);assert.ok(html.includes('class="pim-workspace"'),page);assert.ok(html.includes('pim-tabs'),page);assert.ok(html.includes('pim-table')||html.includes('pim-csv-form')||html.includes('pim-lookup-form'),page);}
 assert.ok(pim.allowedPages.length>=20);
});
test('Available stock excludes reserved and quarantined quantities',()=>{
 assert.equal(pim.inventory.onHand('PPE-01','Central warehouse'),40);
 assert.equal(pim.inventory.available('PPE-01','Central warehouse'),28);
 assert.equal(pim.inventory.available('MNT-09','Workshop'),11);
});
test('Receiving partial stock increases on-hand and never over-receives',()=>{
 const original=pim.inventory.onHand('PPE-01','Central warehouse');
 pim.inventory.receiveOrder('PO-0018',10);
 assert.equal(pim.inventory.onHand('PPE-01','Central warehouse'),original+10);
 assert.equal(pim.inventory.snapshot().orders.find(x=>x.id==='PO-0018').status,'Part received');
 assert.throws(()=>pim.inventory.receiveOrder('PO-0018',100),/outstanding/);
 assert.equal(pim.inventory.onHand('PPE-01','Central warehouse'),original+10);
});
test('Request approval, reservation and issue are separate transitions',()=>{
 const r='REQ-0042';const before=pim.inventory.onHand('PPE-01','Central warehouse');
 assert.throws(()=>pim.inventory.issueRequest(r),/Allocate/);
 pim.inventory.approveRequest(r);
 pim.inventory.allocateRequest(r);
 assert.equal(pim.inventory.snapshot().requests.find(x=>x.id===r).status,'Allocated');
 assert.equal(pim.inventory.snapshot().balances.find(x=>x.sku==='PPE-01').reserved,24);
 pim.inventory.issueRequest(r);
 assert.equal(pim.inventory.onHand('PPE-01','Central warehouse'),before-12);
 assert.equal(pim.inventory.snapshot().balances.find(x=>x.sku==='PPE-01').reserved,12);
 assert.equal(pim.inventory.snapshot().requests.find(x=>x.id===r).status,'Issued');
});
test('Transfer dispatch does not simultaneously receive goods at destination',()=>{
 const id='TRF-0032';const originalFrom=pim.inventory.onHand('PPE-01','Central warehouse');const beforeDest=pim.inventory.onHand('PPE-01','Lekki store');
 pim.inventory.dispatchTransfer(id);
 assert.equal(pim.inventory.onHand('PPE-01','Central warehouse'),originalFrom-4);
 assert.equal(pim.inventory.onHand('PPE-01','Lekki store'),beforeDest);
 assert.throws(()=>pim.inventory.dispatchTransfer(id),/draft transfers/);
 pim.inventory.receiveTransfer(id);
 assert.equal(pim.inventory.onHand('PPE-01','Lekki store'),beforeDest+4);
 assert.equal(pim.inventory.snapshot().transfers.find(x=>x.id===id).status,'Received');
});
test('Physical count discrepancy requires explanation',()=>{
 const before=pim.inventory.onHand('PPE-02','Lekki store');
 assert.throws(()=>pim.inventory.postCount('CNT-0013',before-1,''),/Explain/);
 pim.inventory.postCount('CNT-0013',before-1,'One damaged glove pair');
 assert.equal(pim.inventory.onHand('PPE-02','Lekki store'),before-1);
 assert.equal(pim.inventory.snapshot().counts.find(x=>x.id==='CNT-0013').status,'Posted');
 assert.throws(()=>pim.inventory.postCount('CNT-0013',before-1,'Another reason'),/already been posted/);
});
test('Source PIM modules retain page-level data and RIM/TIM remain defined',()=>{
 for(const [edition,mods] of Object.entries(appData.MODULES))assert.ok(mods.length>10,edition);
 for(const id of ['requests','catalogue','inventory','purchasing','assets','projects','suppliers','counts','custody','transfers','replenishment','reports','field'])assert.ok(appData.getModule('PIM',id),id);
});
test('Reset restores baseline state and previous stock moves are cleared',()=>{
 pim.reset();assert.equal(pim.inventory.snapshot().movements.length,1);assert.equal(pim.inventory.onHand('PPE-01','Central warehouse'),40);
});
console.log(`\n${checks} PIM domain and page tests passed.`);
