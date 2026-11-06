import {readFileSync,existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const js=readFileSync(resolve(root,'app.js'),'utf8');
const css=readFileSync(resolve(root,'styles.css'),'utf8');
const polish=readFileSync(resolve(root,'prime-polish.css'),'utf8');
const html=readFileSync(resolve(root,'index.html'),'utf8');
new vm.Script(js.replace(/^import\s+\{[^}]+\}\s+from\s+'\.\/data\.js';\s*/,''),{filename:'app.js'});
const checks={
  'site entry exists':existsSync(resolve(root,'index.html')),
  'logo exists':existsSync(resolve(root,'assets/prime-mark.svg')),
  'all three editions': ['PIM','RIM','TIM'].every(s=>js.includes(`'${s}'`)),
  'PIM, TIM and RIM controllers load': ['pim.js','tim.js','app.js'].every(file=>html.includes(file)),
  'product walkthrough label':js.includes('Product Walkthrough')&&!js.includes('App Walkthrough'),
  'chat in top navigation': js.includes('chat-top'),
  'profile and settings':js.includes('function profilePage()')&&js.includes('function settingsPage()'),
  'activity period options':['Today','This week','This month','Annually'].every(s=>js.includes(s)),
  'accessible dialogs':js.includes('aria-labelledby="prime-modal-title"'),
  'RIM checkout validates available stock':js.includes('rimAvailable(item.sku)')&&js.includes('pos-payment-form'),
  'mobile dialog and POS controls':polish.includes('.overlay .modal.wide')&&polish.includes('.pos-layout .qty-controls button'),
  'mobile navigation':js.includes('function mobileNav()'),
  'safe relative site assets':html.includes('src="./app.js"')&&html.includes('href="./styles.css"'),
  'responsive layout CSS':css.includes('@media(max-width:700px)')&&css.includes('.pos-layout')
};
for(const [name,pass] of Object.entries(checks)) console.log(`${pass?'PASS':'FAIL'} ${name}`);
if(Object.values(checks).some(v=>!v))process.exit(1);
