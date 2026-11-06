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
 assert.equal(run('filteredRows().length'),3);
 assert.equal(run("filteredRows().some(r=>r.v[0]==='ORD-0322')"),true);
 view('sales','Pending');
 assert.equal(run('filteredRows().length'),5);
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
 assert.equal(run('filteredRows().length'),2);
 assert.match(root.innerHTML,/Scanner · SCN-003/);
 view('retailassets','Fixtures');assert.equal(run('filteredRows()[0].v[0]'),'Shelf unit · FX-023');
});
check('Specialised views display their own labelled sample records',()=>{
 view('products','Brands');
 assert.equal(run('filteredRows().length'),4);
 assert.match(root.innerHTML,/Coastline Goods/);
 assert.match(root.innerHTML,/<th>Supplier<\/th>/);
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
check('RIM dashboard links and totals use existing inventory and order IDs',()=>{
 const snapshot=run('rimDashboardSnapshot()');
 assert.equal(snapshot.meta.items,data.getModule('RIM','pos').rows.length);
 assert.equal(snapshot.meta.stockLines,data.getModule('RIM','inventory').rows.length);
 assert.equal(Number(snapshot.metrics[1][1]),data.getModule('RIM','sales').rows.filter(row=>row[3]==='Paid'&&!/delivered|dispatched|cancelled/i.test(row[4])).length);
 assert.ok(snapshot.attention.some(row=>row.id==='ORD-0321'));
 assert.ok(snapshot.low.every(row=>data.getModule('RIM','pos').rows.some(item=>item[1]===row.sku)));
});
check('Checkout and return status changes flow into retail dashboard metrics',()=>{
 const before=run('rimDashboardSnapshot()');
 run("S.preferences.posSales=[{id:'DEMO-LOCAL',total:17000,lines:[{sku:'MS-01',qty:2}]}];S.local['RIM:sales']=[['DEMO-LOCAL','Demo customer','₦17,000','Paid · Cash (demo)','Not started']];S.preferences.returnStates={'RET-0045 · ORD-0310':{status:'Refunded'}}");
 const after=run('rimDashboardSnapshot()');
 assert.equal(after.metrics[0][1],'₦17,000');
 assert.equal(Number(after.metrics[1][1]),Number(before.metrics[1][1])+1);
 assert.equal(Number(after.metrics[2][1]),Number(before.metrics[2][1])-1);
 assert.equal(run("rimAvailable('MS-01')"),26);
});
check('Retail dashboard view uses the live bridge and valid navigation',()=>{
 vm.runInContext(fs.readFileSync(new URL('../prime-refresh.js',import.meta.url),'utf8'),ctx,{filename:'prime-refresh.js'});
 const html=run("window.PrimeRefresh.render('RIM')");
 assert.match(html,/Recorded POS sales/);
 assert.match(html,/₦17,000/);
 assert.doesNotMatch(html,/ELE-01|TRF-0011|TILL-022/);
 assert.match(html,/data-go="inventory"/);
});
console.log('\n10 retail view and mobile simulations passed.');
