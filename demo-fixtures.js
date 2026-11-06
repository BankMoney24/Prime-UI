/* Fictional, deterministic training records. No real buyers, payments, or suppliers. */
const retailGoods=[
 ['Canvas tote','BG-04',6500,42,38,'Accessories','Natural','Lekki outlet'],
 ['Bluetooth speaker','SP-08',24500,14,11,'Electronics','Charcoal','Ikeja outlet'],
 ['Ceramic mug','MG-11',4800,51,46,'Home','White','Online store'],
 ['Linen trousers','TR-07',18500,24,19,'Clothing','Sand / L','Lekki outlet'],
 ['Desk lamp','LM-02',22000,9,7,'Home','Black','Ikeja outlet'],
 ['Phone charger','CH-14',9500,61,55,'Electronics','USB-C / 30W','Online store'],
 ['Leather belt','BT-05',16000,17,15,'Clothing','Brown / M','Lekki outlet'],
 ['Travel flask','FL-13',11000,7,5,'Home','500 ml','Ikeja outlet'],
 ['Notebook set','NB-19',3900,73,69,'Stationery','A5 / 3-pack','Online store']
];
const naira=n=>'₦'+n.toLocaleString('en-NG');
const sales=[
 ['ORD-0319','Emeka Musa','₦24,500','Paid','Packing'],
 ['ORD-0318','Chika Nwosu','₦39,000','Paid','Dispatched'],
 ['ORD-0324','Bola Adebayo','₦18,500','Paid','Ready to pack'],
 ['ORD-0325','Ngozi Eze','₦6,500','Unpaid','Not started'],
 ['ORD-0326','Ibrahim Sani','₦35,500','Paid','Packing'],
 ['ORD-0327','Zainab Lawal','₦9,500','Unpaid','Not started'],
 ['ORD-0328','Femi Balogun','₦22,000','Paid','Dispatched'],
 ['ORD-0310','Ada Obi','₦8,500','Paid','Delivered'],
 ['ORD-0302','Tola Ade','₦12,500','Paid','Delivered'],
 ['ORD-0298','Emeka Musa','₦7,600','Paid','Delivered']
];

export const EXTRA_MODULE_ROWS={
 PIM:{
  projects:[['Generator replacement','Amina Yusuf','Lekki site','₦650,000 / ₦1.2m','Active'],['Head office rewire','Amaka Obi','Victoria Island','₦1.4m / ₦1.8m','Active'],['Workshop expansion','Tunde Bello','Ikeja','₦800,000 / ₦2m','Planning'],['Safety audit closeout','Ada Okafor','All sites','₦210,000 / ₦300,000','Closing']],
  suppliers:[['Lagos Safety Co.','Bola Adebayo','PPE','2 days','Active'],['Harbour Electrical','Chika Nwosu','Cables','6 days','Active'],['Printline Office','Ngozi Eze','Stationery','4 days','Under review'],['Delta Mechanical','Ibrahim Sani','Bearings','5 days','Active']],
  maintenance:[['Forklift servicing','Preventive','Delta Mechanical','08 Nov','Scheduled'],['Laptop battery replacement','Corrective','Tunde Bello','09 Nov','Awaiting parts'],['Fire extinguisher check','Safety','Ada Okafor','10 Nov','Scheduled'],['Printer overhaul','Corrective','Printline Office','03 Nov','Completed']],
  counts:[['CNT-0015','Head office','Ngozi Eze','12 / 12','Posted'],['CNT-0016','Workshop','Ibrahim Sani','8 / 30','In progress'],['CNT-0017','Central store','Amaka Obi','0 / 48','Scheduled'],['CNT-0018','Lekki site','Ada Okafor','15 / 18','Review variance']],
  locations:[['Lekki site','Site','Lagos region','Ada Okafor','Active'],['Workshop','Store','Ikeja site','Ibrahim Sani','Active'],['Head office','Office','Victoria Island','Ngozi Eze','Active'],['B-03','Storage bin','Workshop','Tunde Bello','Active'],['Returns cage','Restricted','Central store','Amaka Obi','Active']],
  custody:[['Tablet · CHK-004','Ngozi Eze','02 Nov','09 Nov','Confirmed'],['Projector · CHK-005','Amaka Obi','29 Oct','08 Nov','Pending'],['Scanner · CHK-006','Ibrahim Sani','03 Nov','10 Nov','Confirmed'],['Laptop · CHK-007','Bola Adebayo','20 Oct','06 Nov','Overdue']],
  warranties:[['Forklift · AST-0248','Delta Mechanical','15 Feb 2027','—','Active'],['Tablet · AST-0249','Metro Equipment','28 Nov','—','Expiring soon'],['Scanner · AST-0250','Atlas Supplies','02 Mar 2027','—','Active'],['Projector · AST-0251','Printline Office','30 Sep','CLM-005','Expired']],
  people:[['Amaka Obi','Projects','2','1 check due','Active'],['Ngozi Eze','Finance','1','None','Active'],['Bola Adebayo','Facilities','3','1 asset return','Active'],['Ibrahim Sani','Maintenance','4','1 check overdue','Clearance pending']],
  imports:[['Supplier master','Suppliers','26','01 Nov','Completed'],['November opening stock','Inventory','63','04 Nov','Validated'],['Serialised laptops','Assets','18','05 Nov','Errors to fix'],['Safety catalogue','Products','41','06 Nov','Pending review']],
  field:[['Transfer scan','TRF-0032','Saved offline','11:04','Pending'],['Receive helmets','PO-0019','Complete','10:28','Synced'],['Asset handover','AST-0249','Conflict','09:15','Needs review'],['Cycle count','CNT-0016','Saved offline','08:42','Pending']],
  contracts:[['CTR-004','Lagos Safety Co.','Procurement','15 Mar 2027','Active'],['CTR-005','Harbour Electrical','Engineering','30 Nov','Expiring'],['CTR-006','Delta Mechanical','Facilities','31 May 2027','Active'],['CTR-007','Printline Office','Finance','06 Nov','Renewal review']],
  kits:[['Site electrical kit','16 items','Workshop','Engineering','Available'],['Fire response kit','8 items','Lekki site','Safety','Assigned'],['Office onboarding kit','5 items','Head office','HR','Available'],['Heavy maintenance kit','10 items','Central store','Facilities','Inspection due']],
  bookings:[['BK-004','Forklift','Ibrahim Sani','08 Nov','Confirmed'],['BK-005','Site van','Amaka Obi','09 Nov','Pending'],['BK-006','Projector','Ngozi Eze','10 Nov','Confirmed'],['BK-007','Lifting platform','Ada Okafor','11 Nov','Awaiting approval']],
  bills:[['BIL-004','Lagos Safety Co.','₦185,000','12 Nov','Awaiting review'],['BIL-005','Harbour Electrical','₦340,000','14 Nov','Ready'],['BIL-006','Delta Mechanical','₦125,000','18 Nov','Part paid'],['BIL-007','Printline Office','₦72,500','21 Nov','Draft']]
 },
 RIM:{
  pos:retailGoods.map(([name,sku,price,stock])=>[name,sku,naira(price),String(stock),'Available']),
  products:retailGoods.map(([name,sku,price,, ,category,variant])=>[`${name} · ${sku}`,category,variant,naira(price),'Active']),
  inventory:retailGoods.map(([name,, ,stock,available,, ,location])=>[name,location,String(stock),String(available),available<=7?'Low stock':'In stock']),
  sales,
  returns:[['RET-0048 · ORD-0319','Emeka Musa','₦24,500','Damaged packaging','Inspection due'],['RET-0049 · ORD-0318','Chika Nwosu','₦9,500','Incorrect colour','Awaiting approval'],['RET-0050 · ORD-0324','Bola Adebayo','₦18,500','Size issue','Inspection due'],['RET-0051 · ORD-0323','Tola Ade','₦7,600','Changed mind','Refunded'],['RET-0052 · ORD-0326','Ibrahim Sani','₦11,000','Defect reported','Awaiting approval']],
  customers:[['Chika Nwosu','CUS-0015','6','04 Nov','Retail'],['Bola Adebayo','CUS-0016','4','05 Nov','Retail'],['Ngozi Eze','CUS-0017','13','01 Nov','Trade'],['Ibrahim Sani','CUS-0018','7','03 Nov','Retail'],['Zainab Lawal','CUS-0019','2','02 Nov','Retail'],['Femi Balogun','CUS-0020','9','04 Nov','Trade']],
  fulfilment:[['ORD-0324','Lekki','2','07 Nov','To pick'],['ORD-0326','Ikeja','3','07 Nov','Packing'],['ORD-0328','Yaba','1','06 Nov','In transit'],['ORD-0323','Ikoyi','2','05 Nov','In transit'],['ORD-0310','Lekki','1','01 Nov','Delivered']],
  pricing:[['Loyalty weekend','Selected categories','7%','07–08 Nov','Scheduled'],['Home office bundle','Desk items','₦2,000','09–15 Nov','Scheduled'],['Welcome voucher','First purchase','5%','01–30 Nov','Active'],['Trade discount','Trade group','12%','01–30 Nov','Active'],['October clearance','Clothing','15%','20–31 Oct','Ended']],
  stores:[['Yaba pickup','Pickup point','Bola Adebayo','Central','Active'],['Victoria Island','Store','Chika Nwosu','Central','Active'],['Online fulfilment','Warehouse','Amina Yusuf','Central','Active'],['Lekki stockroom','Stockroom','Ada Okafor','Lekki outlet','Active'],['Ikeja stockroom','Stockroom','Tunde Bello','Ikeja outlet','Active']],
  operations:[['Lekki / Evening','Bola Adebayo','8 / 8','Due 22:00','Open'],['Ikeja / Evening','Ibrahim Sani','8 / 8','Due 22:00','Scheduled'],['Yaba / Morning','Chika Nwosu','5 / 8','Due 18:00','Action needed'],['VI / Morning','Ngozi Eze','8 / 8','Closed 17:50','Closed'],['Online / Day','Amina Yusuf','7 / 8','Due 18:00','Open']],
  channels:[['Yaba pickup','Physical','Live','2','Connected'],['Social commerce','Social','10:12','5','Connected'],['Mobile checkout','Website','10:31','7','Connected'],['Pop-up register','Physical','Yesterday','0','Paused'],['Reseller portal','B2B','09:48','4','Sync error']],
  merchandising:[['Holiday table','Victoria Island','Gifts','09 Nov','Planned'],['Window display','Lekki','Clothing','08 Nov','Review required'],['Audio aisle','Ikeja','Electronics','10 Nov','Approved'],['Front-of-store edit','Yaba','Accessories','12 Nov','Planned'],['Gift bundle shelf','Lekki','Home','14 Nov','Draft']],
  loyalty:[['Trade reward','Tiered discount','45','31 Dec','Active'],['Referral credit','Voucher','88','31 Dec','Active'],['Weekend bonus','Double points','64','08 Nov','Scheduled'],['VIP club','Free delivery','27','31 Dec','Active'],['Legacy cashback','Credit','35','31 Oct','Ended']],
  payments:[['Lekki / S-024','₦187,500','₦187,500','₦0','Reconciled'],['Ikeja / S-025','₦122,000','₦121,500','−₦500','Review required'],['VI / S-026','₦210,000','₦210,000','₦0','Reconciled'],['Yaba / S-027','₦48,000','—','—','Open'],['Lekki / S-028','₦86,000','₦86,000','₦0','Reconciled']],
  purchasing:[['PO-0104','Atlas Supplies','80 / 80','01 Nov','Received'],['PO-0105','Metro Equipment','30 / 0','08 Nov','Ordered'],['PO-0106','Broadway Parts','40 / 10','09 Nov','Part received'],['PO-0107','Atlantic Homeware','60 / 0','12 Nov','Awaiting approval'],['PO-0108','Lagos Textiles','120 / 120','30 Oct','Received']],
  suppliers:[['Atlantic Homeware','Bola Adebayo','Home','4 days','Active'],['Lagos Textiles','Chika Nwosu','Clothing','7 days','Active'],['City Electronics','Ibrahim Sani','Electronics','5 days','Active'],['Office Bazaar','Zainab Lawal','Stationery','3 days','Under review'],['Bright Packaging','Femi Balogun','Packaging','2 days','Active']],
  retailassets:[['Tablet · POS-013','VI','Chika Nwosu','Good','In use'],['Receipt printer · PRN-008','Yaba','Bola Adebayo','Good','In use'],['Scanner · SCN-004','Lekki','Ada Okafor','Good','In use'],['Shelf unit · FX-024','VI','Ngozi Eze','Good','In use'],['Card terminal · POS-014','Ikeja','Ibrahim Sani','Battery fault','Repair needed']],
  reports:[['Weekly sales','All stores','This week','PDF','Ready'],['Store margins','Lekki','October','CSV','Ready'],['Refund reasons','All stores','This month','PDF','Scheduled'],['Inventory ageing','All stores','Quarter','CSV','Ready'],['Till variance','Ikeja','This week','CSV','Ready']]
 },
 SHARED:{
  tasks:[['Pack ORD-0324','RIM · ORD-0324','Bola Adebayo','Today','To do'],['Review REQ-0043','PIM · REQ-0043','Tunde Bello','Tomorrow','In progress'],['Inspect workshop tools','TIM · INS-0021','Amina Yusuf','Tomorrow','To do'],['Reconcile Lekki till','RIM · S-023','Ada Okafor','Today','Overdue'],['Count work gloves','PIM · CNT-0013','Tunde Bello','09 Nov','Scheduled']],
  approvals:[['PO-0018','PIM · Purchase order','Tunde Bello','₦450,000','Awaiting you'],['RET-0049','RIM · Refund','Chika Nwosu','₦9,500','Awaiting you'],['TIM-REQ-002','TIM · Toolbox issue','Aisha Bello','—','Delegated'],['REQ-0046','PIM · Material request','Amaka Obi','₦42,000','Awaiting you'],['PO-0107','RIM · Purchase order','Bola Adebayo','₦210,000','Awaiting you']],
  documents:[['Delivery receipt-0104.pdf','RIM · PO-0104','Bola Adebayo','03 Nov','v1'],['Inspection photo-0021.jpg','TIM · INSP-0021','Amina Yusuf','02 Nov','v1'],['Stock count-0013.csv','PIM · CNT-0013','Tunde Bello','04 Nov','v2'],['Till close-S024.pdf','RIM · S-024','Chika Nwosu','05 Nov','v1'],['Toolbox checklist-101.pdf','TIM · KIT-101','Aisha Bello','04 Nov','v3']],
  notifications:[['Purchase order approved','PIM','PO-0019','Yesterday','Read'],['Store stock low','RIM','FL-13','08:12','Unread'],['Inspection blocked tool','TIM','TL-003','Yesterday','Unread'],['Till variance needs review','RIM','S-025','09:32','Unread'],['Shipment dispatched','RIM','ORD-0328','10:01','Read']],
  activity:[['09:40','Bola Adebayo','RIM','Closed till','S-024'],['09:12','Amina Yusuf','TIM','Scheduled inspection','INSP-0021'],['08:55','Tunde Bello','PIM','Count variance reviewed','CNT-0013'],['Yesterday','Chika Nwosu','RIM','Packed order','ORD-0326'],['Yesterday','Ada Okafor','PIM','Approved request','REQ-0042']],
  team:[['Chika Nwosu','RIM','Store supervisor','VI','Active'],['Bola Adebayo','RIM','Cashier','Yaba','Active'],['Aisha Bello','TIM','Storekeeper','Hangar','Active'],['Ngozi Eze','PIM, RIM','Manager','Central','Active'],['Ibrahim Sani','RIM','Cashier','Ikeja','Invited']],
  policies:[['High-value transfer','PIM','Above ₦250,000','Warehouse manager','Active'],['Till variance escalation','RIM','Difference over ₦500','Store supervisor','Active'],['Failed tool inspection','TIM','Failed result','Quarantine','Active'],['Stock count variance','PIM','Nonzero variance','Count reviewer','Active'],['Customer refund review','RIM','Any return','Store manager','Active']],
  audit:[['Yesterday','System','Offline review','TIM · Field queue','Recorded'],['Yesterday','Amina Yusuf','Stock receipt','PIM · Central','Recorded'],['04 Nov','Bola Adebayo','Till close','RIM · S-024','Reconciled'],['03 Nov','Ada Okafor','Permission check','PIM · Purchasing','Allowed'],['02 Nov','Quality','Inspection hold','TIM · TL-003','Recorded']],
  billing:[['PIM','Enterprise','6 users / 10','30 Nov','Active'],['RIM','Growth','12 users / 20','30 Nov','Active'],['TIM','Industrial','5 users / 15','30 Nov','Active']]
 }
};

// A separate schema is necessary for subviews that aren't just a status filter.
const view=(columns,rows)=>({columns,rows});
export const RIM_DETAIL_VIEWS={
 inventory:{
  Movements:view(['Movement','Product / SKU','Store','Quantity','Type','Status'],[['MOV-0101','Wireless mouse · MS-01','Ikeja outlet','+12','Goods receipt','Posted'],['MOV-0102','Cotton shirt · SH-01','Lekki outlet','−2','Sale','Posted'],['MOV-0103','Desk lamp · LM-02','Ikeja outlet','−1','Adjustment','Review'],['MOV-0104','Canvas tote · BG-04','Lekki outlet','+24','Supplier receipt','Posted'],['MOV-0105','Travel flask · FL-13','Ikeja outlet','−3','Transfer dispatch','In transit']]),
  Transfers:view(['Transfer','From','To','Items','Requested','Status'],[['RIM-TRF-021','Central warehouse','Lekki outlet','Canvas tote × 12','04 Nov','Received'],['RIM-TRF-022','Ikeja outlet','Yaba pickup','Water bottle × 8','05 Nov','In transit'],['RIM-TRF-023','Online fulfilment','Ikeja outlet','Travel flask × 3','06 Nov','Draft'],['RIM-TRF-024','Lekki outlet','VI','Cotton shirt × 6','06 Nov','Awaiting approval']]),
  Counts:view(['Count','Store','Category','Lines checked','Assigned to','Status'],[['RIM-CNT-041','Lekki outlet','Clothing','22 / 22','Ada Okafor','Posted'],['RIM-CNT-042','Ikeja outlet','Electronics','14 / 20','Tunde Bello','In progress'],['RIM-CNT-043','Online fulfilment','Home','0 / 18','Amina Yusuf','Scheduled'],['RIM-CNT-044','VI','Accessories','12 / 12','Ngozi Eze','Variance review']])
 },
 products:{
  Brands:view(['Brand','Categories','Products','Supplier','Status'],[['Coastline Goods','Accessories','6','Atlas Supplies','Active'],['City Desk','Home, Stationery','9','Atlantic Homeware','Active'],['Field Notes','Stationery','4','Office Bazaar','Draft'],['Metro Audio','Electronics','5','City Electronics','Active']]),
  Bundles:view(['Bundle','Included items','Bundle price','Saving','Status'],[['Desk essentials','Desk lamp + Notebook set','₦24,500','₦1,400','Active'],['Everyday carry','Canvas tote + Travel flask','₦15,000','₦2,500','Active'],['Travel ready','Travel flask + Phone charger','₦18,000','₦2,500','Draft']])
 },
 customers:{Enquiries:view(['Enquiry','Customer','Channel','Topic','Received','Status'],[['ENQ-0102','Ada Obi','WhatsApp','Bulk pricing','10:12','Open'],['ENQ-0103','Chika Nwosu','Email','Order tracking','09:45','Resolved'],['ENQ-0104','Zainab Lawal','Instagram','Return policy','Yesterday','Awaiting reply'],['ENQ-0105','Ngozi Eze','In-store','Trade account','05 Nov','Open']])},
 pricing:{Coupons:view(['Code','Value','Usage','Expires','Status'],[['WELCOME5','5%','14 / 100','30 Nov','Active'],['WEEKEND10','10%','0 / 50','08 Nov','Scheduled'],['TRADE12','12%','8 / 50','31 Dec','Active'],['OCT1000','₦1,000','50 / 50','31 Oct','Expired']])},
 stores:{Stockrooms:view(['Stockroom','Store','Custodian','Bins','Status'],[['Lekki backroom','Lekki outlet','Ada Okafor','12','Active'],['Ikeja stockroom','Ikeja outlet','Tunde Bello','9','Active'],['VI stockroom','Victoria Island','Ngozi Eze','8','Active']]),Bins:view(['Bin','Stockroom','Zone','Capacity','Status'],[['LK-A01','Lekki backroom','Accessories','80 units','Available'],['IK-E02','Ikeja stockroom','Electronics','30 units','Available'],['VI-C03','VI stockroom','Clothing','120 units','At capacity'],['LK-H04','Lekki backroom','Home','50 units','Available']])},
 operations:{'Daily close':view(['Close','Store','Cashier','Sales','Variance','Status'],[['CLOSE-024','Lekki','Bola Adebayo','₦187,500','₦0','Completed'],['CLOSE-025','Ikeja','Tunde Bello','₦122,000','−₦500','Review required'],['CLOSE-026','VI','Chika Nwosu','₦210,000','₦0','Completed'],['CLOSE-027','Yaba','Ngozi Eze','₦48,000','—','Open']])},
 payments:{'Cash movements':view(['Movement','Till','Type','Amount','Approved by','Status'],[['CASH-031','Lekki / S-024','Float added','₦20,000','Ada Okafor','Approved'],['CASH-032','Ikeja / S-025','Cash pickup','₦50,000','Tunde Bello','Approved'],['CASH-033','Yaba / S-027','Petty cash','₦5,000','Bola Adebayo','Review required'],['CASH-034','VI / S-026','Float returned','₦10,000','Ngozi Eze','Approved']])},
 purchasing:{Requests:view(['Request','Raised by','Item','Quantity','Needed by','Status'],[['PUR-REQ-011','Ada Okafor','Canvas tote','80','10 Nov','Approved'],['PUR-REQ-012','Tunde Bello','Phone charger','100','12 Nov','Pending'],['PUR-REQ-013','Ngozi Eze','Notebook set','120','15 Nov','Draft']]),Quotes:view(['Quote','Supplier','Linked request','Amount','Valid until','Status'],[['Q-0201','Atlas Supplies','PUR-REQ-011','₦520,000','15 Nov','Received'],['Q-0202','City Electronics','PUR-REQ-012','₦760,000','20 Nov','Awaiting review'],['Q-0203','Office Bazaar','PUR-REQ-013','₦390,000','22 Nov','Requested']])},
 channels:{Allocations:view(['Allocation','Channel','Product','Reserved','Priority','Status'],[['ALLOC-01','Online store','Canvas tote','12','High','Active'],['ALLOC-02','Lekki outlet','Cotton shirt','20','Normal','Active'],['ALLOC-03','Reseller portal','Phone charger','8','Low','Review']]),'Order sync':view(['Sync run','Channel','Orders','Completed','Started','Status'],[['SYNC-121','Online store','12','12','10:31','Completed'],['SYNC-122','Marketplace','3','1','09:10','Failed'],['SYNC-123','Social commerce','5','5','10:12','Completed']])},
 merchandising:{Planograms:view(['Planogram','Store','Revision','Approved by','Status'],[['PLAN-021','Lekki outlet','v3','Ada Okafor','Approved'],['PLAN-022','Ikeja outlet','v1','Tunde Bello','Review required'],['PLAN-023','VI','v2','Ngozi Eze','Draft']])},
 retailassets:{Maintenance:view(['Work order','Asset','Store','Owner','Due','Status'],[['RA-WO-021','Scanner SCN-003','Ikeja','Tunde Bello','08 Nov','In progress'],['RA-WO-022','Terminal POS-014','Ikeja','Ibrahim Sani','09 Nov','Scheduled'],['RA-WO-023','Printer PRN-008','Yaba','Bola Adebayo','11 Nov','Completed']])}
};
