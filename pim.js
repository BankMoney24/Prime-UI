/* PRIME PIM product experience. Fictional browser-local demonstration data.
   Business transactions here never reach a server or a real inventory ledger. */
(function (global) {
  'use strict';
  const EDITION = 'PIM';
  const KEY = 'prime-pim-workflow-demo-v1';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const isoDate = () => new Date().toISOString().slice(0,10);
  const number = x => Number(x || 0);
  const amount = x => '₦'+ Number(x||0).toLocaleString('en-NG');
  const id = prefix => prefix+'-'+Math.random().toString(36).slice(2,7).toUpperCase();
  const deep = v => JSON.parse(JSON.stringify(v));
  const baseline = {
    items:[
      {sku:'PPE-01',name:'Safety helmet',category:'Safety equipment',unit:'Each',reorder:20,lead:5,safety:10,averageDaily:2,tracking:'None',barcode:'0123456789012',unitCost:7500},
      {sku:'PPE-02',name:'Work gloves',category:'Safety equipment',unit:'Pair',reorder:30,lead:7,safety:12,averageDaily:2,tracking:'None',barcode:'0123456789013',unitCost:1800},
      {sku:'ELE-04',name:'Electrical cable',category:'Electrical',unit:'Metre',reorder:100,lead:10,safety:40,averageDaily:6,tracking:'Lot',barcode:'0123456789014',unitCost:2500},
      {sku:'OFF-07',name:'Printer paper',category:'Office supplies',unit:'Ream',reorder:15,lead:4,safety:6,averageDaily:2,tracking:'None',barcode:'0123456789015',unitCost:4500},
      {sku:'MNT-09',name:'Bearing kit',category:'Maintenance',unit:'Kit',reorder:8,lead:12,safety:4,averageDaily:1,tracking:'Lot',barcode:'0123456789016',unitCost:12000},
      {sku:'PPE-10',name:'Safety boots',category:'Safety equipment',unit:'Pair',reorder:12,lead:6,safety:4,averageDaily:1,tracking:'None',barcode:'0123456789017',unitCost:21000}
    ],
    balances:[
      {sku:'PPE-01',location:'Central warehouse',opening:40,reserved:12,quarantine:0},
      {sku:'PPE-02',location:'Lekki store',opening:18,reserved:0,quarantine:0},
      {sku:'ELE-04',location:'Central warehouse',opening:240,reserved:50,quarantine:0},
      {sku:'OFF-07',location:'Head office',opening:9,reserved:0,quarantine:0},
      {sku:'MNT-09',location:'Workshop',opening:13,reserved:0,quarantine:2},
      {sku:'PPE-10',location:'Central warehouse',opening:24,reserved:4,quarantine:0}
    ],
    locations:['Central warehouse','Lekki store','Head office','Workshop','Quarantine zone'],
    movements:[{id:'MOV-001',sku:'ELE-04',location:'Central warehouse',delta:0,type:'Opening reference',reference:'OPEN-2026',date:'2026-10-30'}],
    requests:[
      {id:'REQ-0042',requester:'Ada Okafor',sku:'PPE-01',qty:12,location:'Central warehouse',needed:'2026-11-02',status:'Awaiting approval',reason:'New site team',allocated:0},
      {id:'REQ-0043',requester:'Tunde Bello',sku:'ELE-04',qty:50,location:'Central warehouse',needed:'2026-11-03',status:'Approved',reason:'Installation work',allocated:0},
      {id:'REQ-0044',requester:'Amaka Obi',sku:'PPE-02',qty:20,location:'Lekki store',needed:'2026-11-05',status:'Draft',reason:'Workshop PPE',allocated:0}
    ],
    orders:[
      {id:'PO-0018',supplier:'Atlas Supplies',sku:'PPE-01',ordered:40,received:0,location:'Central warehouse',expected:'2026-11-03',status:'Ordered'},
      {id:'PO-0019',supplier:'Metro Equipment',sku:'PPE-02',ordered:60,received:20,location:'Lekki store',expected:'2026-11-04',status:'Part received'},
      {id:'PO-0020',supplier:'Broadway Parts',sku:'MNT-09',ordered:20,received:20,location:'Workshop',expected:'2026-10-30',status:'Received'}
    ],
    receipts:[],
    batches:[
      {lot:'LOT-ELE-003',sku:'ELE-04',location:'Central warehouse',qty:120,expires:'2027-07-31',status:'Available'},
      {lot:'LOT-MNT-009',sku:'MNT-09',location:'Workshop',qty:11,expires:'2027-01-30',status:'Available'},
      {lot:'LOT-MNT-Q02',sku:'MNT-09',location:'Workshop',qty:2,expires:'2026-11-15',status:'Quarantined'}
    ],
    transfers:[
      {id:'TRF-0032',sku:'PPE-01',qty:4,from:'Central warehouse',to:'Lekki store',status:'Draft'},
      {id:'TRF-0033',sku:'PPE-02',qty:2,from:'Lekki store',to:'Workshop',status:'Draft'}
    ],
    counts:[
      {id:'CNT-0012',sku:'PPE-01',location:'Central warehouse',status:'Scheduled',counted:null,reason:''},
      {id:'CNT-0013',sku:'PPE-02',location:'Lekki store',status:'Scheduled',counted:null,reason:''}
    ],
    assets:[
      {tag:'AST-0244',name:'Laptop',holder:'Ada Okafor',location:'Head office',condition:'Good',status:'Assigned',serial:'LAP-2026-001',warranty:'2027-06-01'},
      {tag:'AST-0245',name:'Generator',holder:'Facilities team',location:'Lekki store',condition:'Service due',status:'In use',serial:'GEN-2025-012',warranty:'2026-11-15'},
      {tag:'AST-0246',name:'Printer',holder:'',location:'Central warehouse',condition:'Good',status:'Available',serial:'PRN-2026-031',warranty:'2026-10-10'}
    ],
    activity:[{id:'ACT-001',description:'Workspace demonstration records loaded',reference:'DEMO',date:'2026-10-30',type:'Demo'}],
    notes:[],
    version:1
  };
  function load() { try{const j=JSON.parse(localStorage.getItem(KEY)||'null');if(j && j.version===1 && Array.isArray(j.balances) && Array.isArray(j.orders))return j;}catch{}return deep(baseline) }
  let db=load();
  let ui={page:'',tab:'',query:'',status:'All',location:'All',sort:'',pageIndex:0,modal:null,selected:null,feedback:'',period:'This week'};
  function save(){try{localStorage.setItem(KEY,JSON.stringify(db))}catch{}}
  const item=sku=>db.items.find(x=>x.sku===sku);
  const reorderPoint=sku=>{const i=item(sku);return i?Math.max(i.reorder,Math.ceil((i.averageDaily||0)*i.lead+i.safety)):0};
  const stockRecord=(sku,location)=>db.balances.find(x=>x.sku===sku && x.location===location);
  function available(sku,location){const b=stockRecord(sku,location);if(!b)return 0;return onHand(sku,location)-b.reserved-b.quarantine}
  function onHand(sku,location){const b=stockRecord(sku,location);return (b?.opening||0) + db.movements.filter(m=>m.sku===sku&&m.location===location).reduce((n,m)=>n+number(m.delta),0)}
  function totals(){const balance=db.balances.reduce((acc,b)=>{acc.onHand+=onHand(b.sku,b.location);acc.reserved+=b.reserved;acc.quarantine+=b.quarantine;acc.available+=available(b.sku,b.location);return acc},{onHand:0,reserved:0,quarantine:0,available:0});balance.low=db.balances.filter(b=>available(b.sku,b.location)<reorderPoint(b.sku)).length;return balance}
  function movements(sku,location,delta,type,reference){if(!Number.isFinite(delta)||delta===0)throw Error('Enter a non-zero quantity.');if(delta<0 && available(sku,location)<Math.abs(delta))throw Error('Insufficient available stock at the selected location.');let b=stockRecord(sku,location);if(!b){if(delta<0)throw Error('No stock exists at this location.');b={sku,location,opening:0,reserved:0,quarantine:0};db.balances.push(b)} const entry={id:id('MOV'),sku,location,delta,type,reference,date:isoDate()};db.movements.unshift(entry);db.activity.unshift({id:id('ACT'),description:type+' · '+sku+' · '+(delta>0?'+':'')+delta+' '+(item(sku)?.unit||''),reference,date:isoDate(),type});save();return entry;}
  function approveRequest(reqId){const r=db.requests.find(x=>x.id===reqId);if(!r||r.status!=='Awaiting approval')throw Error('Only submitted requests can be approved.');r.status='Approved';log('Approved material request',r.id);save();}
  function allocateRequest(reqId){const r=db.requests.find(x=>x.id===reqId);if(!r||r.status!=='Approved')throw Error('Approve the request before allocation.');if(available(r.sku,r.location)<r.qty)throw Error('Not enough available stock to reserve this request.');let b=stockRecord(r.sku,r.location);b.reserved+=r.qty;r.allocated=r.qty;r.status='Allocated';log('Allocated request to stock',r.id);save();}
  function issueRequest(reqId){const r=db.requests.find(x=>x.id===reqId);if(!r||r.status!=='Allocated'||r.allocated<1)throw Error('Allocate approved stock before issuing it.');let b=stockRecord(r.sku,r.location);b.reserved-=r.allocated;movements(r.sku,r.location,-r.allocated,'Material issue',r.id);r.status='Issued';r.issued=r.allocated;r.allocated=0;log('Issued materials for request',r.id);save();}
  function receiveOrder(orderId,qty,deliveryRef=""){const order=db.orders.find(x=>x.id===orderId);if(!order)throw Error('Purchase order not found.');let n=Number(qty);if(!Number.isInteger(n)||n<1)throw Error('Receive quantity must be a positive whole number.');if(n>order.ordered-order.received)throw Error('You cannot receive more than the outstanding quantity.');if(order.status==='Draft'||order.status==='Awaiting approval')throw Error('Purchase order must be approved before receiving.');order.received+=n;order.status=order.received===order.ordered?'Received':'Part received';const receipt={id:id('GRN'),order:order.id,sku:order.sku,qty:n,location:order.location,deliveryRef:String(deliveryRef||'').trim(),date:isoDate(),supplier:order.supplier};(db.receipts||=[]).unshift(receipt);movements(order.sku,order.location,n,'Goods receipt',receipt.id);log('Received '+n+' items from '+order.supplier,order.id);save();}
  function dispatchTransfer(transferId){const r=db.transfers.find(x=>x.id===transferId);if(!r||r.status!=='Draft')throw Error('Only draft transfers can be dispatched.');if(r.from===r.to)throw Error('Source and destination must be different.');movements(r.sku,r.from,-r.qty,'Transfer dispatched',r.id);r.status='In transit';log('Dispatched stock transfer',r.id);save();}
  function receiveTransfer(transferId){const r=db.transfers.find(x=>x.id===transferId);if(!r||r.status!=='In transit')throw Error('Only in-transit transfers can be received.');movements(r.sku,r.to,r.qty,'Transfer received',r.id);r.status='Received';log('Received stock transfer',r.id);save();}
  function postCount(countId,counted,reason){const count=db.counts.find(x=>x.id===countId);if(!count||!['Scheduled','Review variance'].includes(count.status))throw Error('This count has already been posted.');const n=Number(counted);if(!Number.isInteger(n)||n<0)throw Error('Count must be zero or a positive whole number.');const delta=n-onHand(count.sku,count.location);if(delta!==0 && String(reason||'').trim().length<6)throw Error('Explain the stock variance (at least six characters).');if(delta<0 && available(count.sku,count.location)<Math.abs(delta))throw Error('Count adjustment conflicts with stock already reserved or blocked. Review allocation first.');count.counted=n;count.reason=String(reason||'');count.variance=delta;count.status='Posted';if(delta)movements(count.sku,count.location,delta,'Count variance',count.id);log('Posted stock count',count.id);save();}
  function log(description,reference){db.activity.unshift({id:id('ACT'),description,reference,date:isoDate(),type:'Operation'});}
  const TABS={
    requests:['All requests','My requests','Awaiting approval','Ready to issue','History'],
    batches:['All batches','Expiring soon','Quarantined','Serial tracking'],
    catalogue:['Products','Categories','Units','Barcodes'],
    inventory:['Stock balances','Movements','Transfers','Counts','Quarantine'],
    purchasing:['Purchase orders','To receive','Purchase requests','Receipts'],
    assets:['Asset register','Assigned','Custody checks','Warranties'],
    projects:['Projects','Allocations','Material usage','Budgets'],
    suppliers:['Directory','Lead times','Orders','Documents'],
    maintenance:['Scheduled','Repairs','Completed','Service history'],
    counts:['Open counts','Variances','History','Count plans'],
    locations:['Locations','Sites','Warehouses','Bins'],
    budgets:['Budgets','Commitments','Spend'],
    custody:['Pending checks','Confirmed','Exceptions'],
    warranties:['Active','Expiring','Claims','Expired'],
    people:['Employees','Cost centres','Asset clearance'],
    imports:['Upload & validate','Templates','History'],
    reports:['Inventory reports','Movement log','Stock valuation','Purchase analysis','Schedules'],
    replenishment:['Recommended orders','Low stock','Lead time','History'],
    field:['My field work','Scan','Sync queue'],
    transfers:['Draft','In transit','Received','All transfers'],
    contracts:['Active','Renewals','Documents'],
    kits:['Kits','Components','Assignments'],
    bookings:['Upcoming','My bookings','Approvals'],
    bills:['Supplier bills','Payment preparation','Balances'],
    approvals:['Awaiting me','Decision history','Delegated'],
  };
  const META={
    requests:['Requests','Request, approve, reserve and issue materials.','Create request'],
    batches:['Batches & traceability','Trace lots, expiry and stock restrictions.','Register batch'],
    catalogue:['Catalogue','Maintain item identity, units and reorder rules.','Add item'],
    inventory:['Inventory','Inspect stock availability and every movement.','Receive stock'],
    purchasing:['Purchasing','Order goods and receive against approved quantities.','Create purchase order'],
    assets:['Assets','Track each asset, its holder and service condition.','Register asset'],
    projects:['Projects','Track material allocation and spending by project.','Create project'],
    suppliers:['Suppliers','Manage supplier contacts and lead times.','Add supplier'],
    maintenance:['Maintenance','Schedule service and monitor asset repairs.','Schedule maintenance'],
    counts:['Stock counts','Count physical quantities and review differences.','Start count'],
    locations:['Locations','Manage sites, stores, warehouses and bins.','Add location'],
    budgets:['Budgets','Track commitments and actual spending.','Create budget'],
    custody:['Custody checks','Confirm who holds each assigned asset.','New custody check'],
    warranties:['Warranties','Track coverage, expiry and claims.','Record warranty'],
    people:['People & accountability','Track employees, assigned equipment and clearance.','Add employee'],
    imports:['Imports','Validate uploaded data before applying any changes.','Choose CSV'],
    reports:['Reports','Export stock, movements, purchasing and usage.','Export current view'],
    replenishment:['Replenishment','Review stock shortages before ordering.','Create purchase request'],
    field:['Field app','Look up items and track device-side tasks.','Scan item'],
    transfers:['Transfers','Dispatch stock and confirm receipt at the destination.','Create transfer'],
    contracts:['Contracts','Review supplier agreement terms and renewals.','Add contract'],
    kits:['Kits','Define reusable bundles of items and equipment.','Create kit'],
    bookings:['Bookings','Schedule access to shared equipment and spaces.','New booking'],
    bills:['Bills & payments','Match approved supplier invoices with orders.','Record bill'],
    approvals:['Approvals','Review decisions assigned to your PIM role.','Review next'],
  };
  const allowedPages=Object.keys(META);
  const styleStatus=s=>/rejected|expired|overdue|low|blocked|error|quarantine/i.test(s)?'pim-bad':/draft|await|pending|partial|review|scheduled|transit|expiring/i.test(s)?'pim-warn':/ready|received|active|approved|passed|assigned|available|issued|posted/i.test(s)?'pim-good':'pim-neutral';
  function status(s){return `<span class="pim-status ${styleStatus(s)}">${esc(s)}</span>`}
  const btn=(text,action,attr='')=>`<button type="button" class="pim-btn" data-pim-action="${esc(action)}" ${attr}>${esc(text)}</button>`;
  const softBtn=(text,action,attr='')=>`<button type="button" class="pim-btn pim-btn-soft" data-pim-action="${esc(action)}" ${attr}>${esc(text)}</button>`;
  function columns(titles,rows){return {columns:titles,rows}}
  const row=(id,values,statusText='',actions=[],detail={})=>({id,values,status:statusText,actions,detail});
  const ctxModule=id=>global.PrimePIMBridge?.getModule?.('PIM',id);
  function rowsFor(page,tab,legacy){
    if(page==='batches'){
      const list=db.batches.filter(b=>tab==='Expiring soon'?b.expires>='2026-10-31'&&b.expires<='2026-12-31':tab==='Quarantined'?b.status==='Quarantined':tab==='Serial tracking'?false:true);
      return columns(['Lot / batch','Product / SKU','Location','Quantity','Expires','Status'],list.map(b=>row(b.lot,[b.lot,(item(b.sku)?.name||b.sku)+' / '+b.sku,b.location,String(b.qty),b.expires,b.status],b.status,['Details'],{lot:b.lot,sku:b.sku,location:b.location})));
    }
    if(page==='catalogue'){
      if(tab==='Categories')return columns(['Category','Items','Purpose'],[...new Set(db.items.map(i=>i.category))].map(cat=>row(cat,[cat,String(db.items.filter(i=>i.category===cat).length),'Catalogue group'])));
      if(tab==='Units')return columns(['Unit','Items','Example'],[...new Set(db.items.map(i=>i.unit))].map(unit=>row(unit,[unit,String(db.items.filter(i=>i.unit===unit).length),db.items.find(i=>i.unit===unit)?.name])));
      if(tab==='Barcodes')return columns(['Item / SKU','Barcode','Tracking'],db.items.map(i=>row(i.sku,[i.name+' / '+i.sku,i.barcode,i.tracking],null,[],{sku:i.sku})));
      return columns(['Item / SKU','Category','Unit','Reorder point','Tracking'],db.items.map(i=>row(i.sku,[i.name+' / '+i.sku,i.category,i.unit,String(reorderPoint(i.sku)),i.tracking],null,['Details'],{sku:i.sku})));
    }
    if(page==='inventory'){
      if(tab==='Movements')return columns(['Movement','Item / location','Quantity','Type','Reference'],db.movements.map(m=>row(m.id,[m.id,(item(m.sku)?.name||m.sku)+' / '+m.location,(m.delta>0?'+':'')+m.delta,m.type,m.reference],null,[],{movement:m.id})));
      if(tab==='Transfers')return rowsFor('transfers','All transfers',legacy);
      if(tab==='Counts')return rowsFor('counts','Open counts',legacy);
      if(tab==='Quarantine')return columns(['Item','Location','Held','Available'],db.balances.filter(b=>b.quarantine>0).map(b=>row(b.sku,[item(b.sku)?.name||b.sku,b.location,String(b.quarantine),String(available(b.sku,b.location))])));
      return columns(['Item / SKU','Location','On hand','Reserved','Available','Status'],db.balances.map(b=>{const n=available(b.sku,b.location),i=item(b.sku);return row(b.sku+'@'+b.location,[i?.name+' / '+b.sku,b.location,String(onHand(b.sku,b.location)),String(b.reserved),String(n),n<reorderPoint(b.sku)?'Low stock':'Available'],n<reorderPoint(b.sku)?'Low stock':'Available',['Details'],{sku:b.sku,location:b.location})}));
    }
    if(page==='requests'||page==='approvals'){
      let reqs=db.requests;
      if(page==='approvals')reqs=reqs.filter(x=>['Awaiting approval','Approved','Rejected'].includes(x.status));
      if(page==='requests'&&tab==='My requests')reqs=reqs.filter(x=>x.requester==='Ada Okafor');
      if((page==='requests'&&tab==='Awaiting approval')||(page==='approvals'&&tab==='Awaiting me'))reqs=reqs.filter(x=>x.status==='Awaiting approval');
      if(page==='requests'&&tab==='Ready to issue')reqs=reqs.filter(x=>['Approved','Allocated'].includes(x.status));
      if(page==='requests'&&tab==='History')reqs=reqs.filter(x=>['Issued','Part returned','Returned'].includes(x.status));
      if(page==='approvals'&&tab==='Decision history')reqs=reqs.filter(x=>['Approved','Rejected'].includes(x.status));
      if(page==='approvals'&&tab==='Delegated')reqs=[];
      return columns(['Request','Requester','Item / quantity','Needed by','Status'],reqs.map(r=>row(r.id,[r.id,r.requester,(item(r.sku)?.name||r.sku)+' · '+r.qty+' '+(item(r.sku)?.unit||''),r.needed,r.status],r.status,requestActions(r),{request:r.id})));
    }
    if(page==='purchasing'){
      if(tab==='Purchase requests')return columns(['Request','Requested by','Item','Value','Status'],db.requests.filter(r=>['Approved','Awaiting approval'].includes(r.status)).map(r=>row(r.id,[r.id,r.requester,item(r.sku)?.name||r.sku,amount(r.qty*(item(r.sku)?.unitCost||0)),r.status],r.status,['Details'],{request:r.id})));
      let orders=db.orders;
      if(tab==='To receive')orders=orders.filter(o=>o.received<o.ordered&&['Ordered','Part received'].includes(o.status));
      if(tab==='Receipts')return columns(['Goods receipt','Purchase order','Item','Received','Supplier reference','Date'],(db.receipts||[]).map(r=>row(r.id,[r.id,r.order,item(r.sku)?.name||r.sku,String(r.qty),r.deliveryRef||'—',r.date],null,['Details'],{receipt:r.id})));
      return columns(['Purchase order','Supplier','Item','Ordered / received','Outstanding','Status'],orders.map(o=>row(o.id,[o.id,o.supplier,item(o.sku)?.name||o.sku,o.ordered+' / '+o.received,String(o.ordered-o.received),o.status],o.status,o.status==='Draft'?['Submit order','Details']:o.status==='Awaiting approval'?['Approve order','Details']:o.status==='Approved'?['Send to supplier','Details']:o.received<o.ordered?['Receive','Details']:['Details'],{order:o.id})));
    }
    if(page==='transfers'){
      let list=db.transfers;if(tab!=='All transfers')list=list.filter(t=>t.status===tab);
      return columns(['Transfer','Item','From','To','Quantity','Status'],list.map(t=>row(t.id,[t.id,item(t.sku)?.name||t.sku,t.from,t.to,String(t.qty),t.status],t.status,t.status==='Draft'?['Dispatch','Details']:t.status==='In transit'?['Confirm receipt','Details']:['Details'],{transfer:t.id})));
    }
    if(page==='counts'){
      let list=db.counts;if(tab==='Open counts')list=list.filter(c=>c.status!=='Posted');if(tab==='History')list=list.filter(c=>c.status==='Posted');if(tab==='Variances')list=list.filter(c=>c.variance!==undefined&&c.variance!==0);if(tab==='Count plans')list=[];
      return columns(['Count','Item','Location','System on hand','Result','Status'],list.map(c=>row(c.id,[c.id,item(c.sku)?.name||c.sku,c.location,c.status==='Posted'?String(onHand(c.sku,c.location)):'Hidden until review',c.counted===null?'Not counted':String(c.counted),c.status],c.status,c.status==='Posted'?['Details']:['Count stock','Details'],{count:c.id})));
    }
    if(page==='assets'){
      let assets=db.assets;if(tab==='Assigned')assets=assets.filter(a=>a.status==='Assigned'||a.status==='In use');if(tab==='Warranties')return rowsFor('warranties','Active',legacy);if(tab==='Custody checks')return rowsFor('custody','Pending checks',legacy);
      return columns(['Asset / tag','Holder','Location','Condition','Status'],assets.map(a=>row(a.tag,[a.name+' / '+a.tag,a.holder||'Unassigned',a.location,a.condition,a.status],a.status,a.status==='Available'?['Assign asset','Details']:['Reassign asset','Return asset','Details'],{asset:a.tag})));
    }
    if(page==='replenishment'){
      const list=db.balances.filter(b=>available(b.sku,b.location)<reorderPoint(b.sku));
      return columns(['Item / SKU','Location','Available','Reorder point','Suggested order','Status'],list.map(b=>{let i=item(b.sku),avail=available(b.sku,b.location),qty=Math.max(0,reorderPoint(b.sku)-avail);return row(b.sku+'@'+b.location,[i.name+' / '+i.sku,b.location,String(avail),String(reorderPoint(b.sku)),qty+' '+i.unit,'Needs review'],'Needs review',['Draft purchase request'],{sku:b.sku,location:b.location,suggested:qty})}));
    }
    if(page==='warranties')return columns(['Asset','Provider','Warranty ends','Coverage','Status'],db.assets.filter(a=>tab==='Expired'?a.warranty<'2026-10-31':tab==='Expiring'?a.warranty>='2026-10-31'&&a.warranty<='2026-11-30':tab==='Active'?a.warranty>='2026-10-31':true).map(a=>row(a.tag,[a.name+' / '+a.tag,'Supplier record',a.warranty,'Manufacturing defects',a.warranty<'2026-10-31'?'Expired':a.warranty<'2026-11-30'?'Expiring soon':'Active'],null,['Details'],{asset:a.tag})));
    if(page==='reports'){
      if(tab==='Movement log')return rowsFor('inventory','Movements',legacy);
      if(tab==='Stock valuation')return columns(['Item','Location','On hand','Unit cost','Book value'],db.balances.map(b=>{const i=item(b.sku);return row(b.sku+'@'+b.location,[i?.name,b.location,String(onHand(b.sku,b.location)),amount(i?.unitCost),amount(onHand(b.sku,b.location)*i?.unitCost)],null,[],{sku:b.sku,location:b.location})}));
      if(tab==='Purchase analysis')return columns(['Order','Supplier','Ordered','Received','Value'],db.orders.map(o=>row(o.id,[o.id,o.supplier,String(o.ordered),String(o.received),amount(o.ordered*(item(o.sku)?.unitCost||0))])));
    }
    if(page==='projects'&&legacy){
      if(tab==='Allocations')return columns(['Request','Project','Item','Quantity','Status'],db.requests.filter(r=>['Approved','Allocated','Issued'].includes(r.status)).map(r=>row(r.id,[r.id,r.project||'Unassigned',item(r.sku)?.name||r.sku,String(r.qty),r.status],r.status,['Details'],{request:r.id})));
      if(tab==='Material usage')return columns(['Material issue','Project','Item','Issued quantity','Location'],db.requests.filter(r=>r.status==='Issued').map(r=>row(r.id,[r.id,r.project||'Unassigned',item(r.sku)?.name||r.sku,String(r.issued||0),r.location])));
      if(tab==='Budgets')return rowsFor('budgets','Budgets',ctxModule('budgets')||{columns:['Budget / period','Approved','Committed','Spent','Available'],rows:[['Engineering / Oct','₦4,000,000','₦500,000','₦2,400,000','₦1,100,000'],['Operations / Oct','₦2,000,000','₦250,000','₦900,000','₦850,000']]});
    }
    if(page==='suppliers'&&legacy){
      if(tab==='Orders')return columns(['Purchase order','Supplier','Item','Outstanding','Status'],db.orders.map(o=>row(o.id,[o.id,o.supplier,item(o.sku)?.name||o.sku,String(o.ordered-o.received),o.status],o.status,['Details'],{order:o.id})));
      if(tab==='Documents')return columns(['Document','Supplier','Updated','Status'],[]);
      if(tab==='Lead times')return columns(['Supplier','Category','Lead time','Status'],legacy.rows.map((r,i)=>row('supplier-'+i,[r[0],r[2],r[3],r[4]],r[4],['Details'],{legacy:true,index:i})));
    }
    if(page==='maintenance'&&legacy){
      const condition=(row)=>String(row[4]||'').toLowerCase();
      const list=legacy.rows.filter(r=>tab==='Scheduled'?(condition(r).includes('scheduled')||condition(r).includes('overdue')):tab==='Repairs'?r[1]==='Corrective':tab==='Completed'?condition(r).includes('completed'):true);
      return columns(legacy.columns,list.map((r,i)=>row('maintenance-'+i,r,r[r.length-1],['Details'],{legacy:true,index:i})));
    }
    if(page==='locations'&&legacy){
      const matches=legacy.rows.filter(r=>tab==='Locations'||tab==='Sites'?tab==='Locations'||r[1].includes('Site'):tab==='Warehouses'?r[1].includes('Warehouse'):r[1].includes('bin'));
      return columns(legacy.columns,matches.map((r,i)=>row('location-'+i,r,r[r.length-1],['Details'],{legacy:true,index:i})));
    }
    if(page==='budgets'&&legacy){
      if(tab==='Commitments')return columns(['Purchase order','Supplier','Status','Committed value'],db.orders.filter(o=>o.status!=='Received').map(o=>row(o.id,[o.id,o.supplier,o.status,amount((o.ordered-o.received)*(item(o.sku)?.unitCost||0))],o.status,['Details'],{order:o.id})));
      if(tab==='Spend')return columns(['Department / period','Approved','Committed','Spent','Available'],legacy.rows.map((r,i)=>row('budget-'+i,r,'',['Details'],{legacy:true,index:i})));
    }
    if(page==='custody'&&legacy){
      const rows=legacy.rows.filter(r=>tab==='Pending checks'?(/Pending|Overdue/.test(r[4])):tab==='Confirmed'?r[4]==='Confirmed':/Overdue|Exception|Damaged|Missing/.test(r[4]));
      return columns(legacy.columns,rows.map((r,i)=>row('custody-'+i,r,r[r.length-1],['Details'],{legacy:true,index:i})));
    }
    if(page==='people'&&legacy){
      if(tab==='Cost centres')return columns(['Cost centre','Department','Budget owner'],[['ENG','Engineering','Ada Okafor'],['OPS','Operations','Tunde Bello'],['FAC','Facilities','Amina Yusuf']].map((r,i)=>row('cost-centre-'+i,r)));
      if(tab==='Asset clearance')return columns(['Employee','Asset','Condition','Action'],db.assets.filter(a=>a.holder).map(a=>row(a.tag,[a.holder,a.name+' / '+a.tag,a.condition,'Confirm return'],'Pending',['Details'],{asset:a.tag})));
    }
    if(page==='imports'&&legacy){
      if(tab==='Templates')return columns(['Template','Required fields','Format'],[['Products','sku, name, unit','CSV'],['Opening stock','sku, location, quantity','CSV'],['Assets','tag, name, location','CSV']].map((r,i)=>row('template-'+i,r)));
      if(tab==='History')return columns(legacy.columns,legacy.rows.map((r,i)=>row('import-'+i,r,r[r.length-1],['Details'],{legacy:true,index:i})));
    }
    if(page==='reports'&&legacy){
      if(tab==='Schedules')return columns(['Report','Frequency','Recipients','Next run','Status'],[['Stock summary','Weekly','Inventory team','Not scheduled','Draft'],['Monthly valuation','Monthly','Finance team','Not scheduled','Draft']].map((r,i)=>row('report-schedule-'+i,r,r[r.length-1])));
    }
    if(page==='field'&&legacy){
      const records=legacy.rows.filter(r=>tab==='Sync queue'?r[4]!=='Synced':true);
      return columns(legacy.columns,records.map((r,i)=>row('field-'+i,r,r[r.length-1],['Details'],{legacy:true,index:i})));
    }
    if(page==='contracts'&&legacy){
      const records=legacy.rows.filter(r=>tab==='Renewals'?/expiring|nov/i.test(String(r[4])+' '+r[3]):tab==='Documents'?false:true);
      return columns(legacy.columns,records.map((r,i)=>row('contract-'+i,r,r[r.length-1],['Details'],{legacy:true,index:i})));
    }
    if(page==='kits'&&legacy){
      if(tab==='Components')return columns(['Kit','Components','Location'],legacy.rows.map((r,i)=>row('kit-'+i,[r[0],r[1],r[2]])));
      if(tab==='Assignments')return columns(legacy.columns,legacy.rows.filter(r=>r[4]==='Assigned').map((r,i)=>row('assigned-kit-'+i,r,r[4],['Details'],{legacy:true,index:i})));
    }
    if(page==='bookings'&&legacy){
      const bookings=legacy.rows.filter(r=>tab==='My bookings'?r[2]==='Ada Okafor':tab==='Approvals'?r[4]==='Pending':true);
      return columns(legacy.columns,bookings.map((r,i)=>row('booking-'+i,r,r[4],['Details'],{legacy:true,index:i})));
    }
    if(page==='bills'&&legacy){
      const bills=legacy.rows.filter(r=>tab==='Payment preparation'?r[4]==='Ready':true);
      if(tab==='Balances')return columns(['Supplier','Outstanding bill','Status'],legacy.rows.map((r,i)=>row('bill-balance-'+i,[r[1],r[2],r[4]],r[4])));
      return columns(legacy.columns,bills.map((r,i)=>row('bill-'+i,r,r[4],['Details'],{legacy:true,index:i})));
    }
    // Secondary modules retain their source-specific schema. Rows are not silently relabelled.
    if(legacy && legacy.columns && legacy.rows){const demoDrafts=db.notes.filter(n=>n.page===page).map(n=>{const fields=[n.name,n.reference||'—',n.location||'—','Draft'];const values=legacy.columns.map((label,i)=>/status$/i.test(label)?'Draft':fields[Math.min(i,fields.length-1)]);return row(n.id,values,'Draft',['Details'],{draft:n.id});});return columns(legacy.columns,[...demoDrafts,...legacy.rows.map((cells,index)=>row('source-'+index,cells,String(cells[cells.length-1]||''),['Details'],{legacy:true,index}))]);}
    return columns(['Record','Status'],[]);
  }
  function requestActions(r){return r.status==='Draft'?['Submit','Details']:r.status==='Awaiting approval'?['Approve','Details']:r.status==='Approved'?['Allocate','Details']:r.status==='Allocated'?['Issue','Details']:['Issued','Part returned'].includes(r.status)?['Record return','Details']:['Details']}
  function getCtx(){return global.PrimePIMBridge||{} }
  const nav=(name,id)=>`<button type="button" class="pim-link" data-pim-action="navigate" data-id="${esc(id)}">${esc(name)} <span aria-hidden="true">↗</span></button>`;
  function contextKpis(page){const t=totals();if(page==='inventory')return [['On hand',t.onHand,'Units across locations'],['Reserved',t.reserved,'Committed to requests'],['Quarantined',t.quarantine,'Unavailable for use'],['Available',t.available,'On hand minus unavailable']];if(page==='requests'||page==='approvals')return [['Open requests',db.requests.filter(r=>!['Issued','Returned','Rejected'].includes(r.status)).length,'Across departments'],['Need approval',db.requests.filter(r=>r.status==='Awaiting approval').length,'Review before issue'],['Ready to issue',db.requests.filter(r=>r.status==='Allocated').length,'Already reserved'],['Issued',db.requests.filter(r=>r.status==='Issued').length,'Confirmed movements']];if(page==='purchasing')return [['Purchase orders',db.orders.length,'Tracked orders'],['Awaiting delivery',db.orders.filter(o=>o.received<o.ordered).length,'Outstanding receipts'],['Part received',db.orders.filter(o=>o.status==='Part received').length,'Keep open until complete'],['Received units',db.orders.reduce((n,o)=>n+o.received,0),'Recorded quantity']];if(page==='catalogue')return [['Active items',db.items.length,'Unique SKUs'],['Categories',new Set(db.items.map(i=>i.category)).size,'Catalogue groups'],['Stock lines',db.balances.length,'Across locations'],['Need reorder',t.low,'Below reorder point']];if(page==='transfers')return [['Draft',db.transfers.filter(x=>x.status==='Draft').length,'Not yet dispatched'],['In transit',db.transfers.filter(x=>x.status==='In transit').length,'Awaiting receipt'],['Received',db.transfers.filter(x=>x.status==='Received').length,'Confirmed transfers'],['Locations',db.locations.length,'Available destinations']];if(page==='counts')return [['Open counts',db.counts.filter(x=>x.status!=='Posted').length,'Scheduled or under review'],['Posted',db.counts.filter(x=>x.status==='Posted').length,'Posted adjustments'],['Varied',db.counts.filter(x=>x.variance).length,'Non-zero differences'],['Stock lines',db.balances.length,'Countable locations']];if(page==='assets')return [['Registered',db.assets.length,'Asset tags'],['Assigned',db.assets.filter(a=>a.holder).length,'Named custodians'],['Available',db.assets.filter(a=>a.status==='Available').length,'Ready to assign'],['Warranty expired',db.assets.filter(a=>a.warranty<'2026-10-31').length,'Needs review']];return []}
  function notice(content){return `<div class="pim-inline-note"><span class="pim-icon">i</span>${content}</div>`}
  function recordSummary(page,rec){const parts=Object.entries(rec.detail||{}).filter(([k])=>!['legacy','index'].includes(k)).map(([k,v])=>`<div><small>${esc(k)}</small><strong>${esc(v)}</strong></div>`).join('');return `<div class="pim-facts">${parts}</div>`}
  function detailExtras(page,rec){
    const {sku,location,request,order,asset}=rec.detail||{};
    if(['inventory','catalogue','replenishment'].includes(page)&&sku){const lines=db.balances.filter(b=>b.sku===sku&&(location?b.location===location:true));return `<div class="pim-related"><h3>Stock breakdown</h3>${lines.map(b=>`<div><span>${esc(b.location)}</span><span>On hand <b>${onHand(b.sku,b.location)}</b></span><span>Reserved <b>${b.reserved}</b></span><span>Blocked <b>${b.quarantine}</b></span><span>Available <b>${available(b.sku,b.location)}</b></span></div>`).join('')||'<p>No physical stock recorded.</p>'}</div>`}
    if(request){const r=db.requests.find(x=>x.id===request);return r?`<div class="pim-related"><h3>Fulfilment stages</h3><p>Submission → approval → allocation → physical issue.</p><div><span>Requested</span><b>${r.qty} ${esc(item(r.sku)?.unit||'')}</b><span>Reserved</span><b>${r.allocated||0}</b><span>Issue status</span>${status(r.status)}</div></div>`:''}
    if(order){const o=db.orders.find(x=>x.id===order);return o?`<div class="pim-related"><h3>Quantity check</h3><div><span>Ordered</span><b>${o.ordered}</b><span>Received</span><b>${o.received}</b><span>Outstanding</span><b>${o.ordered-o.received}</b></div></div>`:''}
    if(asset){const a=db.assets.find(x=>x.tag===asset);return a?`<div class="pim-related"><h3>Asset responsibility</h3><div><span>Custodian</span><b>${esc(a.holder||'Unassigned')}</b><span>Serial</span><b>${esc(a.serial)}</b><span>Warranty expires</span><b>${esc(a.warranty||'Unknown')}</b></div></div>`:''}
    return '';
  }
  function detailPanel(page,rec){if(!rec)return '';let origin=page;let spec=META[page];const noteMap={requests:'A request moves through approval, reservation, and physical issue as separate steps.',inventory:'Available stock excludes reserved and quarantined quantities.',purchasing:'A partial receipt must not close an order with outstanding quantity.',assets:'Assignment and equipment condition remain distinct from stock transactions.',counts:'Physical count differences need a reason before posting.',transfers:'A transfer has separate dispatch and receipt confirmations.'};return `<div class="pim-overlay" data-pim-action="close" role="presentation"><aside class="pim-drawer" role="dialog" aria-modal="true" aria-labelledby="pim-drawer-title" tabindex="-1"><div class="pim-drawer-head"><div><small>${esc(spec?.[0]||page)}</small><h2 id="pim-drawer-title">${esc(rec.id)}</h2></div>${softBtn('Close','close')}</div><div class="pim-drawer-body">${rec.status?status(rec.status):''}<div class="pim-facts">${rec.values.map((v,i)=>`<div><small>${esc(ui.columns?.[i]||'Field '+(i+1))}</small><strong>${esc(v)}</strong></div>`).join('')}</div>${recordSummary(page,rec)}${detailExtras(page,rec)}${note(noteMap[page]||'Open the related record to review its activity and context.')}<h3>Available actions</h3><div class="pim-drawer-actions">${rec.actions.filter(x=>x!=='Details').map(a=>softBtn(a,'row-op',`data-op="${esc(a)}" data-id="${esc(rec.id)}"`)).join('')||'<p class="pim-muted">No pending actions for this record.</p>'}</div></div></aside></div>`}
  const select=(name,choices,current,attr='')=>`<label class="pim-select-label">${esc(name)}<select ${attr}>${choices.map(x=>`<option value="${esc(x)}" ${String(x)===String(current)?'selected':''}>${esc(x)}</option>`).join('')}</select></label>`;
  function toolbar(page,cols,data){let statuses=[...new Set(data.rows.map(r=>r.status).filter(Boolean))];let locations=db.locations;
    return `<div class="pim-tools"><div class="pim-search"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg><input data-pim-input="search" placeholder="Search ${esc(META[page]?.[0]?.toLowerCase()||'records')}..." value="${esc(ui.query)}" aria-label="Search visible records"/></div><label class="pim-filter"><span>Status</span><select data-pim-change="status"><option>All</option>${statuses.map(s=>`<option ${ui.status===s?'selected':''}>${esc(s)}</option>`).join('')}</select></label><label class="pim-filter"><span>Location</span><select data-pim-change="location"><option>All</option>${locations.map(loc=>`<option ${ui.location===loc?'selected':''}>${esc(loc)}</option>`).join('')}</select></label>${softBtn('Export CSV','export')}</div>`;
  }
  function rowsHtml(page,data){const cols=data.columns,hasStatus=cols.some(x=>/status/i.test(x));ui.columns=cols;let entries=data.rows.filter(r=>!ui.query||[...r.values,r.id].join(' ').toLowerCase().includes(ui.query.toLowerCase())).filter(r=>ui.status==='All'||r.status===ui.status||r.values.includes(ui.status)).filter(r=>ui.location==='All'||r.values.includes(ui.location));const ordered=entries.slice().sort((a,b)=>ui.sort==='Descending'?b.id.localeCompare(a.id):a.id.localeCompare(b.id));const pg=8,nPages=Math.max(1,Math.ceil(ordered.length/pg));ui.pageIndex=Math.min(ui.pageIndex,nPages-1);const shown=ordered.slice(ui.pageIndex*pg,(ui.pageIndex+1)*pg);return `<div class="pim-table-wrap"><table class="pim-table"><thead><tr>${cols.map(c=>`<th scope="col">${esc(c)}</th>`).join('')}<th scope="col"><span class="pim-sr">Actions</span></th></tr></thead><tbody>${shown.map(r=>`<tr>${r.values.map((v,i)=>`<td data-label="${esc(cols[i]||'')}">${hasStatus&&i===cols.length-1?status(v):i===0?`<button class="pim-table-link" data-pim-action="detail" data-id="${esc(r.id)}">${esc(v)}</button>`:esc(v)}</td>`).join('')}<td class="pim-row-actions">${(r.actions||[]).filter(a=>a!=='Details').slice(0,1).map(a=>softBtn(a,'row-op',`data-op="${esc(a)}" data-id="${esc(r.id)}"`)).join('')}${softBtn('View','detail',`data-id="${esc(r.id)}"`)}</td></tr>`).join('')}</tbody></table>${!shown.length?`<div class="pim-empty"><strong>No matching records</strong><p>Change the filters or choose another view.</p>${softBtn('Clear filters','clear-filters')}</div>`:''}</div><div class="pim-table-foot"><span>${ordered.length} records · ${shown.length?ui.pageIndex*pg+1:0}–${ui.pageIndex*pg+shown.length} shown</span><div>${softBtn('Previous','previous',ui.pageIndex===0?'disabled':'')}${softBtn('Next','next',ui.pageIndex===nPages-1?'disabled':'')}</div></div>`;}
  function tabsHtml(page,tabs,active){return `<nav class="pim-tabs" aria-label="${esc(META[page]?.[0]||page)} views">${tabs.map(tab=>`<button type="button" data-pim-action="tab" data-tab="${esc(tab)}" class="${tab===active?'active':''}" aria-current="${tab===active?'page':'false'}">${esc(tab)}</button>`).join('')}</nav>`}
  function itemSelect(name='sku',selected=''){return `<label>Item / SKU <span class="pim-required">*</span><select required name="${name}"><option value="">Choose an item</option>${db.items.map(i=>`<option value="${esc(i.sku)}" ${i.sku===selected?'selected':''}>${esc(i.name)} · ${esc(i.sku)} (${esc(i.unit)})</option>`).join('')}</select></label>`}
  function locationSelect(name='location',selected=''){return `<label>Location <span class="pim-required">*</span><select required name="${name}"><option value="">Choose location</option>${db.locations.filter(l=>l!=='Quarantine zone').map(l=>`<option value="${esc(l)}" ${l===selected?'selected':''}>${esc(l)}</option>`).join('')}</select></label>`}
  const input=(name,label,type='text',req=true,extra='')=>`<label>${esc(label)}${req?' <span class="pim-required">*</span>':''}<input name="${name}" type="${type}" ${req?'required':''} ${extra} /></label>`;
  function formModal(){const m=ui.modal;if(!m)return '';const action=m.action,page=m.page||ui.page;let form='';let footer='';let heading=m.title||'New record';
    if(action==='new-request'){
      form=`<div class="pim-steps"><span class="active">1 · Request details</span><span>2 · Approval</span><span>3 · Issue</span></div><div class="pim-form-grid">${itemSelect()}${input('qty','Quantity','number',true,'min="1" step="1"')}${locationSelect()}${input('needed','Needed by','date',true,`min="${isoDate()}"`)}${input('requester','Requested by','text',true,'value="Ada Okafor"')}${input('project','Project / cost centre','text',false,'placeholder="Optional"')}${input('reason','Business reason','text',true,'minlength="6"')}</div>`;
      footer=`<button class="pim-btn pim-btn-soft" type="submit" name="intent" value="Draft">Save draft</button><button class="pim-btn" type="submit" name="intent" value="Submit">Submit for approval</button>`;
    }else if(action==='new-batch'){
      form=`<div class="pim-form-grid">${itemSelect()}${locationSelect()}${input('lot','Lot / batch number','text',true,'minlength="3"')}${input('qty','Batch quantity','number',true,'min="1" step="1"')}${input('expires','Expiry date','date',false)}</div>${notice('Registering a lot identifies existing stock; it does not increase quantity. Physical receipts are recorded separately.')}`;
    }else if(action==='new-item'){
      form=`<div class="pim-form-grid">${input('name','Item name')}${input('sku','Unique SKU','text',true,'pattern="[A-Za-z0-9_-]{3,30}"')}${input('category','Category')}${input('unit','Unit of measure')}${input('reorder','Reorder point','number',true,'min="0" step="1"')}${input('lead','Supplier lead time (days)','number',true,'min="1" step="1"')}${input('averageDaily','Average daily usage','number',true,'min="0" step="0.1"')}${input('safety','Safety stock','number',true,'min="0" step="1"')}${input('barcode','Barcode / GTIN','text',false,'placeholder="Optional"')}<label>Tracking<select name="tracking"><option>None</option><option>Lot</option><option>Serial</option></select></label></div>`;
    }else if(action==='return-material'){
      const req=db.requests.find(r=>r.id===m.id);form=`<div class="pim-inline-note">${esc(req?.id||'Request')} · ${esc(item(req?.sku)?.name||'')} · Issued ${req?.issued||0}, returned ${req?.returned||0}</div><div class="pim-form-grid">${input('qty','Quantity returning','number',true,'min="1" step="1"')}<label>Condition<select name="condition"><option>Usable</option><option>Damaged</option></select></label>${input('reason','Return reason','text',true,'minlength="6"')}</div>`;
    }else if(action==='receive'){
      form=`<div class="pim-form-grid"><label>Purchase order <span class="pim-required">*</span><select name="order" required><option value="">Select an outstanding order</option>${db.orders.filter(o=>o.ordered>o.received).map(o=>`<option value="${esc(o.id)}" ${m.order===o.id?'selected':''}>${esc(o.id)} · ${esc(o.supplier)} · ${o.ordered-o.received} outstanding</option>`).join('')}</select></label>${input('qty','Quantity received','number',true,'min="1" step="1"')}${input('deliveryRef','Supplier delivery reference','text',true,'minlength="3"')}</div>${notice('Only posted receipts increase on-hand stock. Partial orders remain open.')}`;
    }else if(action==='new-po'){
      form=`<div class="pim-form-grid"><label>Supplier <span class="pim-required">*</span><select required name="supplier"><option value="">Choose supplier</option>${['Atlas Supplies','Metro Equipment','Broadway Parts'].map(n=>`<option>${n}</option>`).join('')}</select></label>${itemSelect()}${input('qty','Ordered quantity','number',true,'min="1" step="1"')}${locationSelect()}${input('expected','Expected delivery','date',true,`min="${isoDate()}"`)}</div>${notice('The purchase order is saved as a draft; no goods are added to stock.')}`;
    }else if(action==='new-transfer'){
      form=`<div class="pim-form-grid">${itemSelect()}<label>From location <span class="pim-required">*</span><select name="from" required><option value="">Choose origin</option>${db.locations.filter(l=>l!=='Quarantine zone').map(l=>`<option>${l}</option>`).join('')}</select></label><label>To location <span class="pim-required">*</span><select name="to" required><option value="">Choose destination</option>${db.locations.filter(l=>l!=='Quarantine zone').map(l=>`<option>${l}</option>`).join('')}</select></label>${input('qty','Quantity','number',true,'min="1" step="1"')}</div>${notice('Dispatch removes goods from the origin. Receipt adds them at the destination.')}`;
    }else if(action==='new-count'){
      form=`<div class="pim-form-grid">${itemSelect()}${locationSelect()}</div>${notice('Create a blind count task. The counter enters the observed quantity during the counting step.')}`;
    }else if(action==='post-count'){
      const c=db.counts.find(x=>x.id===m.id);form=`<div class="pim-inline-note">${esc(item(c?.sku)?.name||'Item')} · ${esc(c?.location||'')}. Enter physically observed quantity. The system quantity is not shown during the count.</div><div class="pim-form-grid">${input('counted','Counted quantity','number',true,'min="0" step="1"')}${input('reason','Variance reason (required if different)','text',false,'minlength="6"')}</div>`;
      footer='<button class="pim-btn" type="submit">Review and post count</button>';
    }else if(action==='confirm-count'){
      const c=db.counts.find(c=>c.id===m.id);const oldQty=onHand(c.sku,c.location),variance=Number(m.counted)-oldQty;
      form=`<div class="pim-verify-card"><h3>Verify physical count</h3><div><span>Item</span><strong>${esc(item(c.sku)?.name)}</strong></div><div><span>Location</span><strong>${esc(c.location)}</strong></div><div><span>Recorded quantity</span><strong>${esc(m.counted)}</strong></div><div><span>System quantity</span><strong>${oldQty}</strong></div><div><span>Difference</span><strong class="${variance?'pim-difference':''}">${variance>0?'+':''}${variance}</strong></div><div><span>Reason</span><strong>${esc(m.reason||'No difference')}</strong></div></div>${notice('Confirm to post this adjustment to the local demonstration movement history. This cannot be undone here.')}`;
      footer='<button class="pim-btn" type="submit">Post count adjustment</button>';
    }else if(action==='new-asset'){
      form=`<div class="pim-form-grid">${input('name','Asset name')}${input('tag','Asset tag')}${input('serial','Serial number')}${locationSelect()}${input('warranty','Warranty end date','date',false)}</div>`;
    }else if(action==='assign-asset'){
      const a=db.assets.find(x=>x.tag===m.id);form=`<div class="pim-inline-note">${esc(a?.name||'Asset')} · ${esc(m.id)}</div><div class="pim-form-grid">${input('holder','New custodian','text',true,'minlength="3"')}${locationSelect('location',a?.location)}</div>`;
    }else if(action==='create-reorder'){
      const sku=m.sku;const loc=m.location;const i=item(sku);const suggested=m.suggested||1;form=`<div class="pim-inline-note">${esc(i?.name||sku)} · ${esc(loc)} · Suggested ${suggested} ${esc(i?.unit||'units')}. Review before ordering.</div><div class="pim-form-grid">${input('qty','Requested quantity','number',true,`min="1" step="1" value="${suggested}"`)}${input('reason','Reason','text',true,'value="Below reorder threshold"')}</div>`;
    }else{
      const schema=global.PrimePIMBridge?.getModule?.('PIM',page);form=`<div class="pim-form-grid">${input('name',schema?.name?.replace(/s$/,'')+' name'||'Title')}${input('reference','Reference / category','text',false)}${locationSelect('location')}</div>${notice('This is a local draft only; production actions remain handled by the PHP application.')}`;
    }
    return `<div class="pim-overlay" data-pim-action="close" role="presentation"><div class="pim-form-dialog" role="dialog" aria-modal="true" aria-labelledby="pim-form-title"><div class="pim-drawer-head"><div><small>PIM · ${esc(META[page]?.[0]||page)}</small><h2 id="pim-form-title">${esc(heading)}</h2></div>${softBtn('Close','close')}</div><form id="pim-workflow-form" data-workflow="${esc(action)}" class="pim-workflow-form"><div class="pim-form-body">${form}<p class="pim-form-error" id="pim-form-error" role="alert" hidden></p></div><div class="pim-form-footer"><button type="button" class="pim-btn pim-btn-soft" data-pim-action="close">Cancel</button>${footer||'<button class="pim-btn" type="submit">Save draft</button>'}</div></form></div></div>`;
  }
  function handleSave(form,ctx){const action=form.dataset.workflow;const data=Object.fromEntries(new FormData(form).entries());const positive=x=>Number.isInteger(Number(x))&&Number(x)>0;const requireError=(message)=>{const el=form.querySelector('#pim-form-error');if(el){el.hidden=false;el.textContent=message;}return true;};
    try {
    if(action==='new-request'){if(!positive(data.qty))return requireError('Quantity must be a positive whole number.');if(!item(data.sku))return requireError('Choose a valid catalogue item.');if(!db.locations.includes(data.location))return requireError('Choose a valid location.');if(String(data.reason).trim().length<6)return requireError('Give a clear reason for the request.');const intent=(ctx.submitter?.value||'Draft');db.requests.unshift({id:id('REQ'),sku:data.sku,qty:Number(data.qty),location:data.location,needed:data.needed,requester:data.requester,project:data.project||'',reason:data.reason,status:intent==='Submit'?'Awaiting approval':'Draft',allocated:0});log('Created '+intent.toLowerCase()+' material request',db.requests[0].id);
    }else if(action==='new-batch'){if(db.batches.some(b=>b.lot===data.lot))return requireError('The lot number is already registered.');if(!stockRecord(data.sku,data.location))return requireError('This item has no stock at the chosen location.');if(!positive(data.qty)||Number(data.qty)+db.batches.filter(b=>b.sku===data.sku&&b.location===data.location).reduce((sum,b)=>sum+b.qty,0)>onHand(data.sku,data.location))return requireError('Lot total cannot exceed existing on-hand quantity.');db.batches.unshift({lot:data.lot,sku:data.sku,location:data.location,qty:+data.qty,expires:data.expires||'',status:'Registered'});log('Registered lot traceability',data.lot);
    }else if(action==='new-item'){if(db.items.some(i=>i.sku.toLowerCase()===String(data.sku).toLowerCase()))return requireError('SKU already exists. Choose a unique identifier.');if(data.barcode&&db.items.some(i=>i.barcode===data.barcode))return requireError('This barcode is already assigned to another item.');if(!Number.isInteger(+data.reorder)||+data.reorder<0)return requireError('Reorder point must be zero or greater.');db.items.unshift({sku:String(data.sku).toUpperCase(),name:data.name,category:data.category,unit:data.unit,reorder:+data.reorder,lead:+data.lead,safety:+data.safety,averageDaily:+data.averageDaily,tracking:data.tracking,barcode:data.barcode||'',unitCost:0});log('Added catalogue item',data.sku);
    }else if(action==='return-material'){
       const r=db.requests.find(r=>r.id===ui.modal.id);const qty=Number(data.qty);if(!r||!['Issued','Part returned'].includes(r.status))return requireError('Only issued requests can be returned.');if(!positive(qty)||qty>r.issued-(r.returned||0))return requireError('Return quantity must be within the outstanding issued quantity.');if(String(data.reason).trim().length<6)return requireError('Provide a return reason (at least six characters).');movements(r.sku,r.location,qty,'Material returned',r.id);if(data.condition==='Damaged')stockRecord(r.sku,r.location).quarantine+=qty;r.returned=(r.returned||0)+qty;r.status=r.returned>=r.issued?'Returned':'Part returned';log('Recorded material return',r.id);
    }else if(action==='receive'){receiveOrder(data.order,Number(data.qty),data.deliveryRef);
    }else if(action==='new-po'){if(!positive(data.qty))return requireError('Order quantity must be positive.');db.orders.unshift({id:id('PO'),supplier:data.supplier,sku:data.sku,ordered:+data.qty,received:0,location:data.location,expected:data.expected,status:'Draft'});log('Created draft purchase order',db.orders[0].id);
    }else if(action==='new-transfer'){if(data.from===data.to)return requireError('Source and destination must be different.');if(!positive(data.qty))return requireError('Quantity must be positive.');if(available(data.sku,data.from)<+data.qty)return requireError('Not enough available stock at the origin.');db.transfers.unshift({id:id('TRF'),sku:data.sku,from:data.from,to:data.to,qty:+data.qty,status:'Draft'});log('Created stock transfer draft',db.transfers[0].id);
    }else if(action==='new-count'){if(!stockRecord(data.sku,data.location))return requireError('Choose an item and location containing stock.');db.counts.unshift({id:id('CNT'),sku:data.sku,location:data.location,status:'Scheduled',counted:null,reason:''});log('Scheduled stock count',db.counts[0].id);
    }else if(action==='post-count'){
      const c=db.counts.find(c=>c.id===ui.modal.id),n=Number(data.counted);if(!c)return requireError('Count not found.');
      if(!Number.isInteger(n)||n<0)return requireError('Count must be a non-negative whole number.');
      const variance=n-onHand(c.sku,c.location);if(variance!==0&&String(data.reason||'').trim().length<6)return requireError('Explain the variance before posting.');
      if(variance<0&&available(c.sku,c.location)<Math.abs(variance))return requireError('The reduction exceeds available stock. Review reservations first.');
      ui.modal={action:'confirm-count',title:'Review count adjustment',page:'counts',id:c.id,counted:n,reason:data.reason||''};ctx.render?.();return true;
    }else if(action==='confirm-count'){postCount(ui.modal.id,ui.modal.counted,ui.modal.reason);
    }else if(action==='new-asset'){if(db.assets.some(a=>a.tag===data.tag))return requireError('Asset tag must be unique.');db.assets.unshift({tag:data.tag,name:data.name,holder:'',location:data.location,condition:'Good',status:'Available',serial:data.serial,warranty:data.warranty||''});log('Registered asset',data.tag);
    }else if(action==='assign-asset'){let a=db.assets.find(a=>a.tag===ui.modal.id);if(!a)return requireError('Asset not found.');a.holder=data.holder;a.location=data.location;a.status='Assigned';log('Assigned asset to '+data.holder,a.tag);
    }else if(action==='create-reorder'){if(!positive(data.qty))return requireError('Quantity must be positive.');db.orders.unshift({id:id('PO'),supplier:'To be selected',sku:ui.modal.sku,ordered:+data.qty,received:0,location:ui.modal.location,expected:'',status:'Draft'});log('Created replenishment purchase draft',db.orders[0].id);
    }else {db.notes.unshift({id:id('DRAFT'),page:ui.page,name:data.name,reference:data.reference||'',location:data.location,status:'Draft',date:isoDate()});log('Saved local '+(META[ui.page]?.[0]||ui.page)+' draft',db.notes[0].id);}
    save();ui.modal=null;ui.feedback='Saved to the PIM demonstration. Production stock was not changed.';ctx.render?.();return true;
    }catch(e){return requireError(e.message||'Could not save this change.');}
  }
  function controlRow(page,rowData){let res=rowData.actions||[];return res.map(a=>a==='Details'?'':softBtn(a,'row-op',`data-op="${esc(a)}" data-id="${esc(rowData.id)}"`)).join('')}
  function runOp(page,op,rec,ctx){try {
    if(op==='Submit'||op==='Approve'||op==='Allocate'||op==='Issue'){if(op==='Submit'){let r=db.requests.find(x=>x.id===rec.id);if(r?.status!=='Draft')throw Error('Only drafts can be submitted.');r.status='Awaiting approval';log('Submitted material request',r.id);save();}if(op==='Approve')approveRequest(rec.id);if(op==='Allocate')allocateRequest(rec.id);if(op==='Issue')issueRequest(rec.id);}
    else if(op==='Submit order'||op==='Approve order'||op==='Send to supplier'){const order=db.orders.find(o=>o.id===rec.id);const expected={'Submit order':'Draft','Approve order':'Awaiting approval','Send to supplier':'Approved'};const after={'Submit order':'Awaiting approval','Approve order':'Approved','Send to supplier':'Ordered'};if(!order||order.status!==expected[op])throw Error('The purchase order is not in the required stage.');order.status=after[op];log(op,order.id);save();}
    else if(op==='Record return'){ui.modal={action:'return-material',title:'Record material return',page:'requests',id:rec.id};ctx.render?.();return;}
    else if(op==='Return asset'){const a=db.assets.find(x=>x.tag===rec.id);if(!a)throw Error('Asset not found.');a.holder='';a.status='Available';log('Asset returned to storage',a.tag);save();}
    else if(op==='Receive'){ui.modal={action:'receive',title:'Receive against purchase order',page:'purchasing',order:rec.id};ctx.render?.();return;}
    else if(op==='Dispatch')dispatchTransfer(rec.id);
    else if(op==='Confirm receipt')receiveTransfer(rec.id);
    else if(op==='Count stock'){ui.modal={action:'post-count',title:'Record physical count',page:'counts',id:rec.id};ctx.render?.();return;}
    else if(op==='Draft purchase request'){ui.modal={action:'create-reorder',title:'Review replenishment order',page:'replenishment',...rec.detail};ctx.render?.();return;}
    else if(op==='Assign asset'||op==='Reassign asset'){ui.modal={action:'assign-asset',title:'Assign asset',page:'assets',id:rec.id};ctx.render?.();return;}
    ui.selected=null;ui.feedback=op+' completed in local demo for '+rec.id+'.';ctx.render?.();
    }catch(e){ui.feedback=e.message||'Action could not be completed.';ctx.render?.()}
  }
  function primaryAction(page,tab){if(page==='batches')return 'new-batch';if(page==='catalogue')return 'new-item';if(page==='requests')return 'new-request';if(page==='inventory')return 'receive';if(page==='purchasing')return tab==='To receive'?'receive':'new-po';if(page==='transfers')return 'new-transfer';if(page==='counts')return 'new-count';if(page==='assets')return 'new-asset';if(page==='replenishment')return 'create-reorder';if(page==='field')return 'scan';if(page==='reports')return 'export';if(page==='approvals')return 'review-next';return 'generic';}
  function specialHint(page,tab){const hints={requests:'Approval, reservation and issue are separate stages. A submitted request does not reserve stock.',catalogue:'Catalogue definitions do not change inventory quantities. Use Inventory for physical stock.',inventory:'Available = on hand − reserved − quarantined. Receipts and issues generate movement entries.',purchasing:'Partial receipts stay open until all outstanding quantities are received.',assets:'A registered asset can be assigned and returned without changing consumable stock balances.',counts:'Blind counting hides system quantity until the recorded result is reviewed.',replenishment:'Suggested quantity restores the reorder threshold. Threshold = max(manual minimum, average daily use × lead time + safety stock). Review demand before ordering.',field:'Offline queue examples are illustrative; no background sync to your production ERP is provided.',reports:'Reports reflect this browser’s sample records and local demonstration changes.'};return hints[page]||''}
  function renderMain(page,legacy,ctx){if(!META[page])return null;if(ui.page!==page){ui={...ui,page,tab:TABS[page][0],query:'',status:'All',location:'All',pageIndex:0,sort:'',modal:null,selected:null,feedback:''}};
    const tab=TABS[page].includes(ui.tab)?ui.tab:TABS[page][0];const data=rowsFor(page,tab,legacy);const meta=META[page],kpis=contextKpis(page);const primary=primaryAction(page,tab);
    const canPrimary=primary!=='review-next'&&primary!=='create-reorder'||page==='replenishment';const heading=`<div class="pim-page-heading"><div><div class="pim-crumb">PIM <span>›</span> ${esc(meta[0])}</div><h1>${esc(meta[0])}</h1><p>${esc(meta[1])}</p></div><div class="pim-head-actions">${primary==='review-next'?softBtn('Review first request','review-next'):primary==='export'?softBtn('Export current view','export'):primary==='scan'?softBtn('Scan an item','scan'):primary==='create-reorder'?softBtn('Review low stock','tab',`data-tab="Recommended orders"`):btn(meta[2],'open-form',`data-form="${esc(primary)}"`)}</div></div>`;
    const cards=kpis.length?`<div class="pim-kpi-grid">${kpis.map(([label,v,detail])=>`<div class="pim-kpi"><span>${esc(label)}</span><strong>${esc(v)}</strong><small>${esc(detail)}</small></div>`).join('')}</div>`:'';
    let topHint=specialHint(page,tab),hint=topHint?notice(esc(topHint)):'';
    let panel=`<section class="pim-panel">${tabsHtml(page,TABS[page],tab)}${toolbar(page,data.columns,data)}${rowsHtml(page,data)}</section>`;
    if(page==='inventory'&&tab==='Stock balances')panel+=`<div class="pim-explainer">${notice('Reserved and quarantined balances cannot be issued. A transfer needs a dispatch at the origin and a receipt at its destination.')}${softBtn('Start transfer','open-form','data-form="new-transfer"')}${softBtn('Schedule stock count','open-form','data-form="new-count"')}</div>`;
    if(page==='purchasing'&&tab==='To receive')panel+=`<div class="pim-explainer">${notice('Received quantity is posted only after validation. Supplier delivery references remain separate from the PO number.')}</div>`;
    if(page==='reports'&&tab==='Inventory reports')panel+=`<div class="pim-reports-grid">${[['Stock balances','Stock by item and location'],['Movement history','Receipts, issues and transfers'],['Purchasing','Open orders and outstanding quantity'],['Replenishment','Items under reorder threshold']].map(([t,d])=>`<button class="pim-report-card" data-pim-action="tab" data-tab="${t==='Stock balances'?'Stock valuation':t==='Movement history'?'Movement log':t==='Purchasing'?'Purchase analysis':'Schedules'}"><b>${esc(t)}</b><small>${esc(d)}</small><span>View →</span></button>`).join('')}</div>`;
    if(page==='imports'&&tab==='Upload & validate')panel=`<section class="pim-panel">${tabsHtml(page,TABS[page],tab)}<h2>Check CSV headers</h2><p class="pim-muted">Check required headings and preview a few rows. A full production import needs server-side validation.</p><form id="pim-csv-form"><label>CSV file<input name="csv" type="file" accept=".csv,text/csv" required/></label><div class="pim-form-footer"><button type="submit" class="pim-btn">Validate CSV</button></div></form><div id="pim-csv-result" role="status"></div></section>`;
    if(page==='field'&&tab==='Scan')panel=`<section class="pim-panel">${tabsHtml(page,TABS[page],tab)}<h2>Find an item by code</h2><p class="pim-muted">Manual item lookup works here. Camera scanning depends on the browser.</p><form id="pim-lookup-form"><label>SKU or barcode<input name="code" required placeholder="PPE-01 or 0123456789012"/></label><button class="pim-btn" type="submit">Find item</button></form><div id="pim-lookup-result" role="status"></div></section>`;
    const feedback=ui.feedback?`<div role="status" class="pim-feedback"><span>${esc(ui.feedback)}</span>${softBtn('Dismiss','dismiss')}</div>`:'';
    const all=rowsFor(page,tab,legacy).rows;const chosen=all.find(r=>r.id===ui.selected);
    return `<div class="pim-workspace">${heading}${feedback}${cards}${hint}${panel}<div class="pim-workspace-foot"><span>PIM demonstration · All figures are sample data</span>${nav('Browse all modules','all')}</div>${ui.modal?formModal():''}${ui.selected?detailPanel(page,chosen):''}</div>`;
  }
  function handleClick(el,ctx){const action=el.dataset.pimAction;if(!action)return false;const page=ui.page;
    if(action==='dashboard-action'){ui.modal={action:el.dataset.form,title:el.textContent.trim(),page:el.dataset.target};ctx.render?.();return true}
    if(action==='dashboard-fold'){ui[el.dataset.fold]=!ui[el.dataset.fold];ctx.render?.();return true}
    if(action==='navigate'){ui.selected=null;ui.modal=null;ctx.navigate?.(el.dataset.id);return true}
    if(action==='tab'){ui.tab=el.dataset.tab;ui.pageIndex=0;ui.query='';ui.status='All';ui.location='All';ui.selected=null;ctx.render?.();return true}
    if(action==='previous'){ui.pageIndex=Math.max(0,ui.pageIndex-1);ctx.render?.();return true}
    if(action==='next'){ui.pageIndex++;ctx.render?.();return true}
    if(action==='clear-filters'){ui.query='';ui.status='All';ui.location='All';ui.pageIndex=0;ctx.render?.();return true}
    if(action==='dismiss'){ui.feedback='';ctx.render?.();return true}
    if(action==='close'){ui.modal=null;ui.selected=null;ctx.render?.();return true}
    if(action==='detail'){ui.selected=el.dataset.id;ui.modal=null;ctx.render?.();return true}
    if(action==='open-form'){const form=el.dataset.form;ui.selected=null;ui.modal={action:form,title:el.textContent.trim(),page};ctx.render?.();return true}
    if(action==='review-next'){ui.selected=db.requests.find(r=>r.status==='Awaiting approval')?.id||null;ctx.render?.();return true}
    if(action==='scan'){ctx.scan?.();return true}
    if(action==='export'){const legacy=ctx.getModule?.('PIM',page);const data=rowsFor(page,ui.tab||TABS[page][0],legacy);ctx.export?.(page,data.columns,data.rows.map(r=>r.values));return true}
    if(action==='row-op'){const recId=el.dataset.id,legacy=ctx.getModule?.('PIM',page),data=rowsFor(page,ui.tab||TABS[page][0],legacy),rec=data.rows.find(r=>r.id===recId)||rowsFor('requests','All requests',legacy).rows.find(r=>r.id===recId);if(rec){runOp(page,el.dataset.op,rec,ctx)}return true;}
    return false;
  }
  function handleChange(el,ctx){if(el.dataset.pimChange==='status'){ui.status=el.value;ui.pageIndex=0;ctx.render?.();return true}if(el.dataset.pimChange==='location'){ui.location=el.value;ui.pageIndex=0;ctx.render?.();return true}return false;}
  function handleInput(el,ctx){if(el.dataset.pimInput==='search'){const start=el.selectionStart;ui.query=el.value;ui.pageIndex=0;ctx.render?.();let field=document.querySelector('[data-pim-input="search"]');field?.focus({preventScroll:true});try{field?.setSelectionRange(start,start)}catch{}return true}return false;}
  function handleSubmit(form,event,ctx){if(form.id==='pim-workflow-form')return handleSave(form,{...ctx,submitter:event.submitter});if(form.id==='pim-lookup-form'){let val=String(new FormData(form).get('code')||'').toLowerCase().trim();let i=db.items.find(i=>[i.sku.toLowerCase(),i.barcode.toLowerCase(),i.name.toLowerCase()].some(x=>x.includes(val)));let el=form.querySelector('#pim-lookup-result');if(el)el.textContent=i?`${i.name} · ${i.sku} · ${db.balances.filter(b=>b.sku===i.sku).reduce((n,b)=>n+available(b.sku,b.location),0)} ${i.unit} available across locations`:'Item not found in this demonstration.';return true}
    if(form.id==='pim-csv-form'){const file=form.querySelector('input[type=file]')?.files?.[0];if(!file)return true;if(file.size>3_000_000){form.querySelector('#pim-csv-result').textContent='File is too large for the preview (3 MB maximum).';return true}file.text().then(text=>{const first=text.split(/\r?\n/).slice(0,5);const cols=(first[0]||'').split(',').map(x=>x.trim().toLowerCase());let missing=['sku','name','unit'].filter(x=>!cols.includes(x));const el=form.querySelector('#pim-csv-result');if(el)el.textContent=missing.length?'Missing required columns: '+missing.join(', '):'Required headings found. '+Math.max(0,first.length-1)+' sample rows previewed. Nothing was imported.'});return true}return false;}
  function renderDashboard(){
    if(ui.page!=='dashboard')ui={...ui,page:'dashboard',tab:'',query:'',status:'All',location:'All',modal:null,selected:null,feedback:''};
    const t=totals(),urgent=db.requests.filter(r=>r.status==='Awaiting approval'||r.status==='Approved'||r.status==='Allocated').slice(0,3);
    const short=db.balances.filter(b=>available(b.sku,b.location)<reorderPoint(b.sku)).sort((a,b)=>available(a.sku,a.location)-available(b.sku,b.location)).slice(0,3);
    const actions=[['Create request','new-request','requests'],['Ask to Buy','new-po','purchasing'],['Receive Delivery','receive','purchasing'],['Add item','new-item','catalogue']];
    const metric=[['Available units',t.available,'Usable across locations'],['Need approval',db.requests.filter(r=>r.status==='Awaiting approval').length,'Requests waiting'],['Low-stock lines',t.low,'Replenishment review'],['Orders outstanding',db.orders.filter(o=>o.ordered>o.received).length,'Supplier deliveries']];
    const folded=(title,kind,contents)=>{let open=!!ui[kind];return `<section class="pim-dash-fold"><button class="pim-dash-fold-head" data-pim-action="dashboard-fold" data-fold="${kind}" aria-expanded="${open}"><strong>${esc(title)}</strong><span>${open?'−':'+'}</span></button>${open?`<div class="pim-dash-fold-body">${contents}</div>`:''}</section>`};
    return `<div class="pim-workspace pim-dashboard"><div class="pim-page-heading"><div><div class="pim-crumb">PIM <span>›</span> Dashboard</div><h1>Product inventory</h1><p>Your priorities and stock position, in one place.</p></div><span class="pim-dash-date">${new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric'}).format(new Date())}</span></div>
      ${ui.feedback?`<div class="pim-feedback">${esc(ui.feedback)} ${softBtn('Dismiss','dismiss')}</div>`:''}
      <div class="pim-dash-actions"><div class="pim-dash-subheading"><h2>Quick actions</h2><span>Start common work</span></div><div class="pim-dash-actions-grid">${actions.map(([label,form,page],i)=>`<button data-pim-action="dashboard-action" data-form="${form}" data-target="${page}" class="pim-dash-action"><span class="pim-dash-action-symbol pim-acc-${i}">${['✉','↗','⇣','＋'][i]}</span><span>${label}</span><b aria-hidden="true">›</b></button>`).join('')}</div></div>
      <div class="pim-kpi-grid">${metric.map(([title,note,sub])=>`<div class="pim-kpi"><span>${esc(title)}</span><strong>${esc(note)}</strong><small>${esc(sub)}</small></div>`).join('')}</div>
      <div class="pim-dash-primary-grid">
        <section class="pim-panel"><div class="pim-dash-panel-head"><h2>Needs your attention</h2>${nav('All requests','requests')}</div>${urgent.map(r=>`<div class="pim-dash-task"><div><b>${esc(r.id)} · ${esc(item(r.sku)?.name||r.sku)}</b><small>${esc(r.requester)} · ${esc(r.qty)} ${esc(item(r.sku)?.unit||'')} · ${esc(r.location)}</small></div>${status(r.status)}${softBtn('Open','navigate','data-id="requests"')}</div>`).join('')||'<p class="pim-muted">No pending material requests.</p>'}</section>
        <section class="pim-panel"><div class="pim-dash-panel-head"><h2>Stock watch</h2>${nav('Inventory','inventory')}</div>${short.map(b=>`<div class="pim-dash-task"><div><b>${esc(item(b.sku)?.name||b.sku)}</b><small>${esc(b.location)} · Reorder at ${esc(reorderPoint(b.sku))}</small></div><div class="pim-dash-stock-number">${available(b.sku,b.location)} <small>${esc(item(b.sku)?.unit||'')}</small></div></div>`).join('')||'<p class="pim-muted">No current low-stock alerts.</p>'}</section>
      </div>
      <div class="pim-dash-primary-grid">
        ${folded('Recent movements','dashMovements',`<div class="pim-dash-mini-list">${db.movements.slice(0,5).map(m=>`<div><b>${esc(m.type)}</b><span>${esc(m.sku)} · ${esc(m.location)}</span><strong>${m.delta>0?'+':''}${m.delta}</strong></div>`).join('')}</div>`)}
        ${folded('My material requests','dashMyRequests',`<div class="pim-dash-mini-list">${db.requests.filter(r=>r.requester==='Ada Okafor').map(r=>`<div><b>${esc(r.id)}</b><span>${esc(item(r.sku)?.name||r.sku)}</span>${status(r.status)}</div>`).join('')}</div>`)}
        ${folded('Workspace readiness','dashSetup',`<div class="pim-dash-mini-list"><div><b>Catalogue configured</b><span>6 starter products</span>${status('Complete')}</div><div><b>Locations configured</b><span>5 demonstration locations</span>${status('Complete')}</div><div><b>Team permissions</b><span>Review in shared administration</span>${softBtn('Open','navigate','data-id="team"')}</div></div>`)}
        ${folded('Inventory controls','dashControls',`<div class="pim-dash-mini-list"><div><b>Reservation policy</b><span>Available stock only</span>${status('Enabled')}</div><div><b>Counts</b><span>Variance reason required</span>${status('Enabled')}</div><div><b>Order receiving</b><span>Partial receipts supported</span>${status('Enabled')}</div></div>`)}
      </div>
      <div class="pim-workspace-foot">PIM demonstration · Actions save only in this browser ${nav('All modules','all')}</div>${ui.modal?formModal():''}</div>`;
  }
  function close(ctx){if(ui.modal||ui.selected){ui.modal=null;ui.selected=null;ctx.render?.();return true}return false}
  global.PrimePIM={version:'1.0',allowedPages,render:renderMain,dashboard:renderDashboard,click:handleClick,change:handleChange,input:handleInput,submit:handleSubmit,close,lookup:(code)=>{const q=String(code||'').toLowerCase().trim();return db.items.find(i=>[i.name,i.sku,i.barcode].some(v=>String(v||'').toLowerCase().includes(q)))||null},inventory:{snapshot:()=>deep(db),totals,available,onHand,receiveOrder,approveRequest,allocateRequest,issueRequest,dispatchTransfer,receiveTransfer,postCount},reset(){db=deep(baseline);save();ui.page='';ui.feedback='';}};
})(typeof window!=='undefined'?window:globalThis);
