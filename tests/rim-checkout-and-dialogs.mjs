import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import * as data from '../data.js';

const source=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8').replace(/^import\s+\{[^}]+\}\s+from\s+'\.\/data\.js';\s*/,'');
const handlers={};
const root={innerHTML:'',addEventListener(type,fn){handlers[type]=fn},querySelector(){return null}};
const document={
  getElementById:id=>id==='app'?root:null,
  addEventListener(){},
  documentElement:{dataset:{}},
  body:{classList:{toggle() {}}}
};
const location={hash:'#/rim/pos'};
const saved={};
class DemoFormData{
 constructor(form){this.entriesObject=form.values||{};}
 entries(){return Object.entries(this.entriesObject)[Symbol.iterator]();}
}
const ctx=vm.createContext({...data,console,document,location,FormData:DemoFormData,window:{innerWidth:390,addEventListener(){}},history:{replaceState(_a,_b,hash){location.hash=hash}},localStorage:{getItem:key=>saved[key]||null,setItem:(key,val)=>saved[key]=val},Intl,Math,Number,String,Array,JSON,Date,Set,Error,URL,Blob,requestAnimationFrame(){},setTimeout(){return 1;},clearTimeout(){}});
vm.runInContext(source,ctx,{filename:'app.js'});
const run=script=>vm.runInContext(script,ctx);
const click=dataset=>handlers.click({target:{dataset,closest:()=>({dataset})}});
const submit=(name,values)=>handlers.submit({preventDefault(){},target:{
  id:name,values,getAttribute:key=>key==='id'?name:null,
  querySelector:()=>({hidden:true,textContent:''})
}});
const check=(description,test)=>{test();console.log('PASS',description);};

check('All editions expose Product Walkthrough, including modal title',()=>{
 for(const edition of ['PIM','TIM','RIM']){run(`S.edition='${edition}';S.page='dashboard';S.modal=null;render()`);assert.match(root.innerHTML,/Product Walkthrough/);}
 click({action:'tour'});
 assert.match(root.innerHTML,/PRODUCT WALKTHROUGH/);
 assert.match(root.innerHTML,/aria-labelledby="prime-modal-title"/);
});
check('Checkout displays line totals and an explicit demo payment form',()=>{
 run("S.edition='RIM';S.page='pos';S.modal=null;S.basket=[];render()");
 click({action:'pos-add',sku:'MS-01'});
 click({action:'pos-add',sku:'WB-01'});
 click({action:'checkout'});
 assert.match(root.innerHTML,/id="pos-payment-form"/);
 assert.match(root.innerHTML,/Cash received \(NGN\)/);
 assert.match(root.innerHTML,/₦16,100/);
});
check('Short cash payments cannot record a demo sale',()=>{
 submit('pos-payment-form',{customer:'Ada Obi',method:'Cash',cashReceived:'100'});
 assert.equal(run('S.preferences.posSales?.length||0'),0);
 assert.equal(run('S.basket.length'),2);
});
check('Checkout creates one local sale and decrements retail inventory',()=>{
 submit('pos-payment-form',{customer:'Ada Obi',method:'Cash',cashReceived:'16100'});
 assert.equal(run('S.preferences.posSales.length'),1);
 assert.equal(run("S.local['RIM:sales'].length"),1);
 assert.equal(run('S.basket.length'),0);
 assert.equal(run("rimAvailable('MS-01')"),27);
 assert.equal(run("rimAvailable('WB-01')"),18);
 run("S.page='inventory'");
 assert.equal(run("rowArray().find(r=>r.v[0]==='Wireless mouse').v[2]"),'27');
 assert.equal(run("rowArray().find(r=>r.v[0]==='Wireless mouse').v[3]"),'23');
});
check('A cashier cannot add more products than sample stock',()=>{
 run("S.page='pos';S.basket=[];S.search='';render()");
 for(let i=0;i<27;i++)click({action:'pos-add',sku:'MS-01'});
 assert.equal(run('S.basket[0].qty'),27);
 click({action:'pos-add',sku:'MS-01'});
 assert.equal(run('S.basket[0].qty'),27);
});
check('RIM local drafts map to their page-specific table columns',()=>{
 run("S.edition='RIM';S.page='customers'");
 run("createRow({name:'Test Customer',group:'Trade'},'customers')");
 assert.equal(run("rowArray()[0].v[0]"),'Test Customer');
 assert.equal(run("rowArray()[0].v[4]"),'Trade');
 run("S.page='returns'");
 run("createRow({order:'ORD-DEMO',name:'Test Customer',price:8500,details:'Faulty'},'returns')");
 assert.equal(run("rowArray()[0].v[2]"),'₦8,500');
 assert.equal(run("rowArray()[0].v[4]"),'Awaiting inspection');
});
check('Return inspection, approval and refund follow ordered demo states',()=>{
 run("S.edition='RIM';S.page='returns';S.detail={index:0};S.modal={type:'record'};render()");
 assert.match(root.innerHTML,/Record inspection/);
 const record=run('rowArray()[0].v[0]');
 click({action:'rim-return-inspect',record});
 assert.match(root.innerHTML,/return-inspection-form/);
 submit('return-inspection-form',{condition:'Passed',notes:'Sample item inspected and photographed'});
 assert.equal(run('rowArray()[0].v[4]'),'Inspected');
 click({action:'rim-return-approve',record});
 assert.equal(run('rowArray()[0].v[4]'),'Refund approved');
 click({action:'rim-return-refund',record});
 assert.match(root.innerHTML,/return-refund-form/);
 submit('return-refund-form',{acknowledge:'yes'});
 assert.equal(run('rowArray()[0].v[4]'),'Refunded');
});
console.log('\n7 RIM checkout and dialog workflow simulations passed.');
