import {readFileSync,existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const js=readFileSync(resolve(root,'app.js'),'utf8');
const css=readFileSync(resolve(root,'styles.css'),'utf8');
const html=readFileSync(resolve(root,'index.html'),'utf8');
new vm.Script(js,{filename:'app.js'});
const checks={
  'site entry exists':existsSync(resolve(root,'index.html')),
  'logo exists':existsSync(resolve(root,'assets/prime-mark.svg')),
  'all three editions': ['PIM:','RIM:','TIM:'].every(s=>js.includes(s)),
  'submenus remain': ['Stock Counts','Custody Checks','Returns & Refunds','Calibration'].every(s=>js.includes(s)),
  'chat in top navigation': js.includes('class="topbar-chat"'),
  'profile and settings':js.includes('function profilePage()')&&js.includes('function settingsPage()'),
  'key activity period options':['This week','This month','3 months','6 months','1 year'].every(s=>js.includes(s)),
  'no bar chart in key activity':!js.match(/class="chart-bar"/),
  'explore more and support':js.includes('Explore more')&&js.includes('Contact support'),
  'mobile navigation':js.includes('function mobileNav()'),
  'safe relative site assets':html.includes('src="app.js"')&&html.includes('href="styles.css"'),
  'responsive dashboard CSS':css.includes('@media(max-width:600px)')&&css.includes('.dashboard-grid')
};
for(const [name,pass] of Object.entries(checks)) console.log(`${pass?'PASS':'FAIL'} ${name}`);
if(Object.values(checks).some(v=>!v))process.exit(1);
