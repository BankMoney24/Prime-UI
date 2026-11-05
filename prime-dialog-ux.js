/* Accessible modal management for the existing PRIME PIM and TIM renderers.
   Keeps the original form handlers, validations, and workflow ownership intact. */
(function(global){'use strict';
 const dialogSelector='.pim-overlay [role="dialog"],.itim-modal-backdrop [role="dialog"],.tim-backdrop [role="dialog"],.overlay .modal[role="dialog"]';
 let active=null, lastTrigger=null;
 const isVisible=el=>!!(el&&el.getClientRects().length&&!el.disabled&&!el.hidden);
 const focusables=dialog=>[...dialog.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(isVisible);
 const triggerSelector=el=>{if(!el?.dataset)return '';for(const key of ['pimAction','tim','action','prime','go']){const val=el.dataset[key];if(val){const attr=key.replace(/[A-Z]/g,m=>'-'+m.toLowerCase());const tag=el.tagName.toLowerCase();return `${tag}[data-${attr}="${CSS.escape(val)}"]`;}}return ''};
 document.addEventListener('click',e=>{const clicked=e.target.closest('button,a,[role="button"]');if(clicked&&!document.querySelector(dialogSelector))lastTrigger=triggerSelector(clicked);},true);
 function restore(){const selector=lastTrigger;lastTrigger=null;if(selector){const element=document.querySelector(selector);if(element&&isVisible(element))requestAnimationFrame(()=>element.focus({preventScroll:true}));}}
 function sync(){const dlg=document.querySelector(dialogSelector);document.body.classList.toggle('prime-modal-open',Boolean(dlg));if(!dlg){if(active)restore();active=null;return}
  if(!dlg.hasAttribute('tabindex'))dlg.setAttribute('tabindex','-1');
  if(dlg===active)return;
  active=dlg;
  const help=dlg.querySelector('.pim-modal-help,.itim-modal-subtitle');if(help&&help.id)dlg.setAttribute('aria-describedby',help.id);
  requestAnimationFrame(()=>{if(!dlg.isConnected)return;const field=focusables(dlg).find(n=>n.matches('input:not([type="hidden"]),select,textarea'));(field||focusables(dlg)[0]||dlg).focus({preventScroll:true});});
 }
 document.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const dlg=document.querySelector(dialogSelector);if(!dlg)return;const els=focusables(dlg);if(!els.length){e.preventDefault();dlg.focus();return}
  const first=els[0],last=els[els.length-1];if(e.shiftKey&&(document.activeElement===first||!dlg.contains(document.activeElement))){e.preventDefault();e.stopImmediatePropagation();last.focus();}
  else if(!e.shiftKey&&(document.activeElement===last||!dlg.contains(document.activeElement))){e.preventDefault();e.stopImmediatePropagation();first.focus();}
 },true);
 global.PrimeDialogUX={sync};
})(typeof window==='undefined'?globalThis:window);
