import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as appData from '../data.js';
const files={};
class FakeFormData{constructor(form){this.form=form;}entries(){return Object.entries(this.form.fields||{});}}
const ctx=vm.createContext({window:{},console,Date,Math,Number,String,Array,Object,JSON,RegExp,Set,Error,Intl,FormData:FakeFormData,localStorage:{getItem:k=>files[k]||null,setItem:(k,v)=>files[k]=v},document:{querySelector(){return null}}});
vm.runInContext(fs.readFileSync(new URL('../pim.js',import.meta.url),'utf8'),ctx);
const pim=ctx.window.PrimePIM;
let html='',lastExport=null;
const bridge={getModule:appData.getModule,render(){html=pim.render(active,appData.getModule('PIM',active),bridge)},navigate(id){active=id;bridge.render()},scan(){},export(name,cols,rows){lastExport={name,cols,rows}}};
let active='requests';const checks=[];const test=(name,callback)=>{pim.reset();active='requests';html=pim.render(active,appData.getModule('PIM',active),bridge);callback();checks.push(name);console.log('PASS',name)};
const click=(action,extras={})=>pim.click({dataset:{pimAction:action,...extras},textContent:action},bridge);
const submit=(action,fields,submitter=null)=>{
 const error={hidden:true,textContent:''};const form={id:'pim-workflow-form',dataset:{workflow:action},fields,querySelector(){return error}};
 const success=pim.submit(form,{submitter:submitter?{value:submitter}:null},bridge);
 return {success,error};
};
test('New catalogue SKUs render and duplicate SKU/barcode is blocked',()=>{
 active='catalogue';bridge.render();click('open-form',{form:'new-item'});
 let a=submit('new-item',{name:'Protective apron',sku:'PPE-16',category:'Safety equipment',unit:'Each',reorder:'10',lead:'5',averageDaily:'1',safety:'2',barcode:'1000033344555',tracking:'None'});
 assert.equal(a.error.hidden,true);assert.ok(html.includes('Protective apron'));
 click('open-form',{form:'new-item'});let dup=submit('new-item',{name:'Another apron',sku:'PPE-16',category:'Safety equipment',unit:'Each',reorder:'10',lead:'5',averageDaily:'1',safety:'2',barcode:'1000033344556',tracking:'None'});
 assert.equal(dup.error.hidden,false);assert.match(dup.error.textContent,/SKU already exists/);
});
test('Submitting new request creates a pending approval, not reserved stock',()=>{
 let before=pim.inventory.available('PPE-01','Central warehouse');click('open-form',{form:'new-request'});
 let result=submit('new-request',{sku:'PPE-01',qty:'2',location:'Central warehouse',needed:'2026-11-02',requester:'Ada Okafor',reason:'PPE for extra contractor',project:'Lekki'},'Submit');
 assert.equal(result.error.hidden,true);assert.equal(pim.inventory.available('PPE-01','Central warehouse'),before);
 assert.equal(pim.inventory.snapshot().requests[0].status,'Awaiting approval');assert.ok(html.includes('Awaiting approval'));
});
test('Purchasing drafts require submission, approval and supplier send before receipt',()=>{
 active='purchasing';bridge.render();click('open-form',{form:'new-po'});
 let result=submit('new-po',{supplier:'Atlas Supplies',sku:'PPE-01',qty:'8',location:'Central warehouse',expected:'2026-11-15'});
 assert.equal(result.error.hidden,true);
 const order=pim.inventory.snapshot().orders[0];assert.equal(order.status,'Draft');
 assert.throws(()=>pim.inventory.receiveOrder(order.id,2),/approved/);
 click('row-op',{op:'Submit order',id:order.id});click('row-op',{op:'Approve order',id:order.id});click('row-op',{op:'Send to supplier',id:order.id});
 assert.equal(pim.inventory.snapshot().orders[0].status,'Ordered');
 pim.inventory.receiveOrder(order.id,3,'DEL-008');
 assert.equal(pim.inventory.snapshot().orders[0].received,3);assert.equal(pim.inventory.snapshot().receipts[0].deliveryRef,'DEL-008');
});
test('Material returns restore usable quantities and quarantine damaged ones',()=>{
 const req='REQ-0042';pim.inventory.approveRequest(req);pim.inventory.allocateRequest(req);pim.inventory.issueRequest(req);
 const before=pim.inventory.available('PPE-01','Central warehouse');
 click('row-op',{op:'Record return',id:req});
 const result=submit('return-material',{qty:'4',condition:'Damaged',reason:'Cracked and not safe'});
 assert.equal(result.error.hidden,true);
 const rec=pim.inventory.snapshot().requests.find(r=>r.id===req);assert.equal(rec.status,'Part returned');assert.equal(rec.returned,4);
 assert.equal(pim.inventory.available('PPE-01','Central warehouse'),before);
});
test('Count entry prompts a second explicit confirmation before posting',()=>{
 active='counts';bridge.render();click('row-op',{op:'Count stock',id:'CNT-0013'});
 const before=pim.inventory.onHand('PPE-02','Lekki store');let r=submit('post-count',{counted:'17',reason:'Count discrepancy confirmed'});
 assert.equal(r.error.hidden,true);assert.equal(pim.inventory.onHand('PPE-02','Lekki store'),before);
 assert.ok(html.includes('Review count adjustment'));
 r=submit('confirm-count',{});assert.equal(r.error.hidden,true);
 assert.equal(pim.inventory.onHand('PPE-02','Lekki store'),17);
});
test('Exports use the visible PIM data, with domain-specific columns',()=>{
 active='inventory';bridge.render();click('export');assert.equal(lastExport.name,'inventory');assert.ok(lastExport.cols.includes('Reserved'));assert.ok(lastExport.cols.includes('Available'));
});
test('Every PIM tab is selectable and returns a valid view',()=>{
 for(const page of pim.allowedPages){active=page;bridge.render();const tabs=[...html.matchAll(/data-pim-action="tab" data-tab="([^"]+)"/g)].map(m=>m[1]);for(const tab of tabs){click('tab',{tab});assert.ok(html.includes('pim-workspace'),page+' '+tab);}}
});
console.log(`\n${checks.length} PIM workflow interaction checks passed.`);
