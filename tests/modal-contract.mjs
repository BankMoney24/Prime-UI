import assert from 'node:assert/strict';
import fs from 'node:fs';
const f=(p)=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const index=f('index.html'),pim=f('pim.js'),tim=f('tim-industrial-ui.js'),ux=f('prime-dialog-ux.js'),css=f('prime-dialog-ux.css');
let passed=0;
function test(name,ok){assert.ok(ok,name);console.log('PASS',name);passed++;}
test('Responsive modal theme is part of the deployed document',index.includes('prime-dialog-ux.css')&&index.includes('prime-dialog-ux.js'));
test('PIM form labels keep their required markers inline',pim.includes('pim-field-label')&&pim.includes('form.replace(/<label>'));
test('PIM form has named, described dialog and action footer',pim.includes('aria-describedby="pim-form-help"')&&pim.includes('pim-form-footer'));
test('TIM form uses action-specific submit labels',tim.includes("issue:'Confirm issue'")&&tim.includes("calibration:'Save calibration'"));
test('TIM tool details are a drawer with issue restrictions',tim.includes('itim-detail-drawer')&&tim.includes('Not cleared for issue')&&tim.includes('E.toolBlocks(item)'));
test('TIM filters by site when locations are available',tim.includes("ui.site==='All'||!siteScoped"));
test('TIM summary does not link View all back to same page',!tim.includes("${link('View all',ui.lastPage)}"));
test('Modal UI traps keyboard focus across products',ux.includes("if(e.key!=='Tab')return")&&ux.includes('dlg.contains(document.activeElement)'));
test('Mobile modal uses bottom-sheet layout and constrained height',css.includes('@media(max-width:720px)')&&css.includes('max-height:min(95dvh,950px)'));
test('Close controls have accessible descriptions',tim.includes('aria-label="Close dialog"')&&pim.includes('aria-label="Close dialog"'));
console.log(`\n${passed} shared PIM/TIM modal contract checks passed.`);
