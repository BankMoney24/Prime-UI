import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import * as data from '../data.js';

const source=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8').replace(/^import\s+\{[^}]+\}\s+from\s+'\.\/data\.js';\s*/,'');
const listeners={};
const root={innerHTML:'',addEventListener(type,fn){listeners[type]=fn},querySelector(){return null}};
let scrolled=0,focused=0;
const document={getElementById:id=>id==='app'?root:id==='rim-current-sale'?{scrollIntoView(){scrolled++},focus(){focused++}}:null,addEventListener(){},documentElement:{dataset:{}},body:{classList:{toggle(){}}}};
const location={hash:'#/rim/sales'};
const ctx=vm.createContext({...data,console,document,location,window:{innerWidth:390,addEventListener(){}},history:{replaceState(_a,_b,value){location.hash=value}},localStorage:{getItem(){return null},setItem(){}},Intl,Math,Number,String,Array,JSON,Date,Set,Error,URL,Blob,setTimeout(){return 1},clearTimeout(){}});
vm.runInContext(source,ctx,{filename:'app.js'});
const run=code=>vm.runInContext(code,ctx);
const check=(name,fn)=>{fn();console.log('PASS',name)};
const view=(page,tab)=>run(`S.edition='RIM';S.page=${JSON.stringify(page)};S.activeTab=${JSON.stringify(tab)};S.search='';S.filter='All';S.pageIndex=0;render()`);

check('Sales views filter by the payment or fulfilment field, not random text',()=>{
 view('sales','Unpaid');
 assert.equal(run('filteredRows().length'),1);
 assert.equal(run('filteredRows()[0].v[0]'),'ORD-0322');
 view('sales','Pending');
 assert.equal(run('filteredRows().length'),2);
 view('sales','Cancelled');
 assert.equal(run('filteredRows().length'),0);
 assert.match(root.innerHTML,/No sample records in this view/);
 assert.match(root.innerHTML,/Show all records/);
});
check('Returns inspections, approvals and history map to actual workflow status',()=>{
 view('returns','Inspections');assert.equal(run('filteredRows()[0].v[0]'),'RET-0045 · ORD-0310');
 view('returns','Approvals');assert.equal(run('filteredRows()[0].v[0]'),'RET-0046 · ORD-0302');
 view('returns','History');assert.equal(run('filteredRows()[0].v[0]'),'RET-0047 · ORD-0298');
});
check('Retail assets tabs show relevant equipment',()=>{
 view('retailassets','Scanners');
 assert.equal(run('filteredRows().length'),1);
 assert.match(root.innerHTML,/Scanner · SCN-003/);
 view('retailassets','Fixtures');assert.equal(run('filteredRows()[0].v[0]'),'Shelf unit · FX-023');
});
check('Non-mappable views explain the sample limitation instead of hiding every row',()=>{
 view('products','Brands');
 assert.equal(run('filteredRows().length'),3);
 assert.match(root.innerHTML,/Showing available sample records for this view/);
 assert.match(root.innerHTML,/role="group" aria-label="Products views"/);
 assert.match(root.innerHTML,/aria-pressed="true"/);
});
check('Status dropdown uses the actual column label and avoids useless all-only menus',()=>{
 view('customers','Directory');
 assert.match(root.innerHTML,/Filter by group/);
 view('products','Catalogue');
 assert.match(root.innerHTML,/Filter by status/);
});
check('Search and view filters combine and empty state recovers',()=>{
 view('sales','Unpaid');run("S.search='Ada';render()");
 assert.equal(run('filteredRows().length'),0);
 assert.match(root.innerHTML,/No matching records/);
 assert.match(root.innerHTML,/Show all records/);
});
check('Mobile POS has a basket shortcut and scrolls the basket into view',()=>{
 view('pos','New sale');
 assert.match(root.innerHTML,/class="pos-mobile-cart"/);
 assert.match(root.innerHTML,/id="rim-current-sale"/);
 listeners.click({target:{dataset:{action:'pos-view-cart'},closest(){return {dataset:{action:'pos-view-cart'}}}}});
 assert.equal(scrolled,1);assert.equal(focused,1);
});
console.log('\n7 retail view and mobile simulations passed.');
