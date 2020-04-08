!function(e){function n(n){for(var t,r,l=n[0],i=n[1],a=0,s=[];a<l.length;a++)r=l[a],Object.prototype.hasOwnProperty.call(o,r)&&o[r]&&s.push(o[r][0]),o[r]=0;for(t in i)Object.prototype.hasOwnProperty.call(i,t)&&(e[t]=i[t]);for(c&&c(n);s.length;)s.shift()()}var t={},o={1:0};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.e=function(e){var n=[],t=o[e];if(0!==t)if(t)n.push(t[2]);else{var l=new Promise((function(n,r){t=o[e]=[n,r]}));n.push(t[2]=l);var i,a=document.createElement("script");a.charset="utf-8",a.timeout=120,r.nc&&a.setAttribute("nonce",r.nc),a.src=function(e){return r.p+""+({}[e]||e)+"-"+{0:"034151694adf91cc34b3",3:"b4c99bb7ecb9a7c8ce61",4:"f930fbdd8b1b2ad47c2a"}[e]+".js"}(e);var c=new Error;i=function(n){a.onerror=a.onload=null,clearTimeout(s);var t=o[e];if(0!==t){if(t){var r=n&&("load"===n.type?"missing":n.type),l=n&&n.target&&n.target.src;c.message="Loading chunk "+e+" failed.\n("+r+": "+l+")",c.name="ChunkLoadError",c.type=r,c.request=l,t[1](c)}o[e]=void 0}};var s=setTimeout((function(){i({type:"timeout",target:a})}),12e4);a.onerror=a.onload=i,document.head.appendChild(a)}return Promise.all(n)},r.m=e,r.c=t,r.d=function(e,n,t){r.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:t})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,n){if(1&n&&(e=r(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(r.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var o in e)r.d(t,o,function(n){return e[n]}.bind(null,o));return t},r.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(n,"a",n),n},r.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},r.p="",r.oe=function(e){throw console.error(e),e};var l=this.webpackJsonp=this.webpackJsonp||[],i=l.push.bind(l);l.push=n,l=l.slice();for(var a=0;a<l.length;a++)n(l[a]);var c=i;r(r.s=2)}([function(e,n,t){e.exports=function(){return new Worker(t.p+"a0df9a6ab66d498780c5.worker.js")}},,function(e,n,t){"use strict";t.r(n);const o="https://tzl3kczlk5.execute-api.us-east-1.amazonaws.com/default/explainer",r=()=>{},l=()=>fetch(o,{method:"POST"}),i=e=>fetch(o,{method:"POST",body:JSON.stringify(e)});function a(e,n){let t={},o=null;return l=>{const i="function"==typeof l?l({...n.get(),...t}):l;r("setState: ",i),Object.assign(t,i),null==o&&(o=window.requestAnimationFrame(()=>(()=>{const r=Object.assign({},n.get(),t),l=n.get();n.set(r),t={},o=null,e(l)})()))}}function c(e){let n={_sentinel:{}};return t=>{const o=Object.keys({...n,...t}).some(e=>n[e]!==t[e]);n=t,o&&e(t)}}function s(e,n){e.classList.add(n)}function u(e,n){e.classList.remove(n)}function d(e,n){e.textContent=n}function m(e,n){e.innerHTML=n}function p(e,n){e.style.display=n}self.addEventListener("error",e=>{i({line:e&&e.lineno,column:e&&e.colno,message:e&&e.message,filename:e&&e.filename,stack:e&&e.error&&e.error.stack,raw:e})});var h=t(0),f=t.n(h);const g=e=>document.querySelector(e);const b=e=>document.querySelector(e);const w=({onNavigate:e,onOutsideClick:n})=>{const t=b(".missing-tooltip"),o=t.querySelector("code"),r=t.querySelector(".submit-issue");let l={missing:null};const i=a(()=>{!function({missing:e}){var n;(null!=e?s:u)(t,"visible"),d(o,null!==(n=null==e?void 0:e.code)&&void 0!==n?n:"")}({missing:l.missing})},{get:()=>l,set(e){l=e}});return r.addEventListener("click",n=>{n.preventDefault();const{code:t,location:o}=l.missing||{};if(!t||!o)return;let r=new URLSearchParams;r.append("labels","missing-hint"),r.append("title","Missing Hint"),r.append("body",["### What I expected","\x3c!-- What hint should we show here? What part of this syntax don't you understand? --\x3e","","### Source code","```",t,"```","",`Location: line ${o.line}, column ${o.ch}`].join("\n"));let i=new URL("https://github.com/jrvidal/explaine.rs/issues/new");i.search=r.toString(),window.open(i.toString(),"_blank"),e()}),window.addEventListener("click",e=>{if(null==l.missing)return;let o=e.target;do{if(o==t)return;o=o.parentElement}while(null!=o);n()}),i};function k(){const e=b(".explanation"),n=e.querySelector(".loading"),t=e.querySelector(".loaded"),o=e.querySelector(".item-container"),r=o.querySelector(".item-title"),l=o.querySelector(".item"),i=o.querySelector(".error-message-container"),c=o.querySelector(".error-message"),h=e.querySelector(".file-bug"),f=e.querySelector(".do-file-bug"),g=l.innerHTML,k=r.innerHTML;let v={issueVisible:!1,error:null,compilationState:0,elaboration:null,missing:null};let y=null!=localStorage.getItem("settings.reportDialog");const x=a(()=>{!function({error:e,compilationState:o,elaboration:a,missing:b}){p(n,0===o?"initial":"none"),p(t,0!==o?"initial":"none");const w=1===o&&null!=b;p(h,w?"block":"none"),(w&&!y?s:u)(f,"shake"),2===o?(m(r,"Oops! 💥"),m(l,"There is a syntax error in your code:"),p(i,"block"),d(c,e.msg)):null!=a?(m(r,a.title),m(l,a.elaboration),p(i,"none")):(m(r,k),m(l,g),p(i,"none"),S({missing:v.issueVisible?v.missing:null}))}(v)},{get:()=>v,set(e){v=e}}),S=w({onNavigate(){x({issueVisible:!1})},onOutsideClick(){x({issueVisible:!1})}});return f.addEventListener("click",e=>{e.preventDefault(),localStorage.setItem("settings.reportDialog","true"),y=!0,x({issueVisible:!v.issueVisible})}),e=>x(e)}let v=Promise.all([t.e(0).then(t.t.bind(null,3,7)),Promise.all([t.e(0),t.e(4)]).then(t.t.bind(null,4,7)),Promise.all([t.e(0),t.e(3)]).then(t.t.bind(null,5,7))]);const y=window.document,x=e=>y.querySelector(e);l();const S="ontouchstart"in window;let M,E;s(y.body,S?"touch-device":"non-touch-device"),function({anchor:e,isTouchDevice:n,onChange:t,onMouseMove:o,onClick:r}){let l=v.then(([{default:l}])=>{const i=l.fromTextArea(e,{mode:"rust",lineNumbers:!0,theme:"solarized",readOnly:!!n&&"nocursor",indentUnit:4}),a=i.getWrapperElement();return i.on("change",e=>t(i,e)),a.addEventListener("mousemove",e=>o(i,e)),a.addEventListener("click",e=>r(i,e)),{cm:i,codemirrorEl:a}});return l.catch(e=>i({message:e&&e.message,error:e})),l}({isTouchDevice:S,anchor:x(".codemirror-anchor"),onClick(){!function(e){1!==C.compilation.state||C.empty||(P.elaborationIndex=P.compilationIndex,P.lastElaborationRequest=e,A({type:"elaborate",location:e}))}(M.getCursor("from"))},onMouseMove(e,n){!function(e){if(1!==C.compilation.state)return;if(P.computedMarks)return void R(({compilation:n})=>({compilation:{...n,hoverEl:e.target}}));W(e)}(n)},onChange(){P.compilationIndex+=1,R({compilation:T,address:null,empty:""===M.getValue()}),$()}}).then(({cm:e,codemirrorEl:n})=>(M=e,E=n,function(e){let n=Promise.resolve();const t=[...new window.URLSearchParams(location.search)].find(([e,n])=>"code"===e),o=null!=t?window.decodeURIComponent(t[1]):null;if(null!=o&&""!==o.trim())return e.setValue(o),n;const r=window.localStorage.getItem("code");if(null!=r&&""!==r.trim())return e.setValue(r),n;return n="loading"===y.readyState?new Promise(e=>{y.addEventListener("DOMContentLoaded",()=>e())}):Promise.resolve(),n=n.then(()=>e.setValue(x(".default-code").value)),n}(M))).then(()=>{s(y.body,"codemirror-rendered"),R({editorReady:!0})});const L=function({onAddress:e,getValue:n}){const t=g(".generate"),o=g(".link");return t.addEventListener("click",()=>{if(null==n())return;let t=new window.URL(window.location.href),o=new window.URLSearchParams;const r=n();null!=r&&(o.append("code",r),t.search=`?${o.toString()}`,e(t.toString()))}),c((function({address:e,enabled:n}){t.disabled=!n,e?(p(t,"none"),u(o,"hidden"),o.href=e):(p(t,"initial"),s(o,"hidden"))}))}({onAddress(e){R({address:e})},getValue:()=>M&&M.getValue()});!function(){const e=g(".modal"),n=g(".overlay");let t={showModal:!1};const o=a(o=>{t.showModal?(s(e,"show-modal"),s(n,"show-modal")):(u(e,"show-modal"),u(n,"show-modal"))},{get:()=>t,set(e){t=e}});g(".whats-this").addEventListener("click",()=>{o(({showModal:e})=>({showModal:!e}))}),n.addEventListener("click",()=>{o({showModal:!1})}),g(".close-modal").addEventListener("click",()=>{o({showModal:!1})})}();const I=function({onToggleEdit:e}){const n=g(".toggle-edit");return n.addEventListener("click",()=>{e()}),c(({enabled:e,editable:t})=>{n.disabled=!e,d(n,t?"Disable editing":"Enable editing")})}({onToggleEdit(){R(({editable:e})=>({editable:!e}))}}),q=function({onToggleShowAll:e}){const n=g(".show-all"),t=g(".show-all-text"),o=t.textContent;return n.addEventListener("click",()=>{e()}),c((function({showAll:e,empty:r,canShow:l,failedCompilation:i}){n.disabled=!l,(l||i||r?s:u)(n,"show-all-loaded"),d(t,e?"Hide elements":o)}))}({onToggleShowAll(){R(({compilation:e})=>({compilation:{...e,showAll:!e.showAll}}))}}),O=function({onWrapInBlock:e}){const n=b(".explanation").querySelector(".more-info"),t=n.querySelector(".book-row"),o=t.querySelector("a"),r=n.querySelector(".keyword-row"),l=r.querySelector("a"),i=b(".info-wip"),a=function({onWrapInBlock:e}){const n=b(".can-be-block");return b(".wrap-in-block").addEventListener("click",()=>{e()}),({canBeBlock:e})=>{p(n,e?"block":"none")}}({onWrapInBlock:e}),s=k(),u=c(a),d=c((function({elaboration:e}){null!=e?(p(n,"block"),p(t,e.book?"block":"none"),p(r,e.keyword?"block":"none"),o.href=e.book||"",l.href=e.keyword||"",p(i,e.book||e.keyword?"none":"initial")):p(n,"none")})),m=c(s);return({elaboration:e,error:n,compilationState:t,missing:o})=>{u({canBeBlock:Boolean(n&&n.isBlock)}),d({elaboration:e}),m({error:n,compilationState:t,elaboration:e,missing:o})}}({onWrapInBlock(){if(null==M)return;const e=M.lineCount();for(let n=0;n<e;n++)M.indentLine(n,"add");M.replaceRange("fn main() {\n",{line:0,ch:0}),M.replaceRange("\n}",{line:e,ch:M.getLineHandle(e).text.length})}});let C={compilation:{state:0,showAll:!1,hoverEl:null,explanation:null,elaboration:null,exploration:!1,error:null,missing:null},editable:!S,address:null,editorReady:!1,empty:!1};const T=C.compilation;let P={lastRule:-1,mark:null,hoverMark:null,computedMarks:null,errorMark:null,errorContextMark:null,hoverIndex:null,compilationIndex:0,elaborationIndex:null,lastElaborationRequest:null};const R=a(()=>{const{compilation:e}=C;U({hoverEl:e.hoverEl}),H({error:e.error}),z({elaboration:e.elaboration}),F({explanation:e.explanation}),J({showAll:e.showAll,editable:C.editable}),O({elaboration:e.elaboration,error:e.error,compilationState:e.state,missing:e.missing}),L({address:C.address,enabled:C.editorReady}),I({editable:C.editable,enabled:C.editorReady}),q({showAll:e.showAll,empty:C.empty,canShow:null!=e.exploration,failedCompilation:2===e.state})},{get:()=>C,set(e){C=e}});let{postMessage:A,ready:j}=function({onMessage:e}){const n=new f.a;let t,o=new Promise(e=>{t=e});return n.onerror=e=>i(e),n.onmessageerror=e=>i({message:"onmessageerror",error:e}),n.onmessage=n=>{const{data:o}=n;r("Window received",o.type,o),"ready"!==o.type?e(o):t()},{postMessage:e=>n.postMessage(e),ready:o}}({onMessage(e){switch(e.type){case"compiled":R({compilation:{...T,state:1}});break;case"compilation-error":R({compilation:{...T,state:2,error:e.error}});break;case"explanation":R(({compilation:n})=>({compilation:{...n,explanation:e.location}})),function(){if(P.computedMarks)return;B()}();break;case"elaboration":!function(e){if(P.compilationIndex!==P.elaborationIndex)return;let n=null;if(null==e.location){const e=5,{line:t,ch:o}=P.lastElaborationRequest,r=Math.max(0,t-e),l=Math.min(M.lineCount()-1,t+e);let i=[...new Array(l-r)].map((e,n)=>M.getLine(r+n));const a=/^ *$/,c=i.filter(e=>!a.test(e)).reduce((e,n)=>{var t,o;return Math.min(e,null!==(o=null===(t=n.match(/^ */))||void 0===t?void 0:t[0].length)&&void 0!==o?o:0)},Number.POSITIVE_INFINITY);if(c>0){const e=new RegExp("^"+" ".repeat(c));i.forEach((n,t)=>{a.test(n)||(i[t]=n.replace(e,""))})}i.forEach((e,n)=>{i[n]=`${String(n).padStart(2," ")} | ${e}`}),i.splice(t-r+1,0,`   | ${" ".repeat(o-c)}↑`),n={code:i.join("\n"),location:{line:t-r,ch:o-c}}}R(({compilation:t})=>({compilation:{...t,elaboration:null!=e.location?e:null,missing:n}}))}(e);break;case"exploration":!function(e){P.computedMarks=e.map(({start:e,end:n},t)=>Y({start:e,end:n},`computed-${t}`));for(let n=P.lastRule+1;n<e.length;n++)V.insertRule(`.hover-${n} .computed-${n} { background: #eee8d5 }`,V.cssRules.length);P.lastRule=Math.max(e.length,P.lastRule),P.hoverMark&&P.hoverMark.clear()}(e.exploration),R(({compilation:e})=>({compilation:{...e,exploration:!0}}));break;default:console.error("Unexpected message in window",e)}}});const V=(()=>{const e=y.createElement("style");return y.head.appendChild(e),e.sheet})();const $=(()=>{let e=!1;j.then(()=>{e=!0});let n=!1;return()=>{e?D():n||(n=!0,j.then(()=>D()))}})();const{debounced:W,done:B}=function(e,n){let t=!0;const o={};let r=o,l=!1;const i=()=>{r!==o?l||(l=!0,window.setTimeout(()=>{l=!1;const n=r;r=o,e(n,i)},n)):t=!0};return{done:i,debounced(n){t?(t=!1,e(n,i)):r=n}}}((function({clientX:e,clientY:n},t){const{compilation:o}=C;if(1!==o.state)return t();let{line:r,ch:l}=M.coordsChar({left:e,top:n},"window");N({line:r,ch:l}),N.cached&&t()}),200),N=function(e,n){let t={},o=r=>{n(t,r)?(t=r,o.cached=!0):(t=r,o.cached=!1,e(r))};return o}((function({line:e,ch:n}){A({type:"explain",location:{line:e,ch:n}})}),(e,n)=>{if(e.line===n.line&&e.ch===n.ch)return!0;const{explanation:t}=C.compilation;return null!=t&&function({line:e,ch:n},t,o){return(t.line<e||t.line===e&&t.ch<=n)&&(e<o.line||e===o.line&&n<=o.ch)}(n,t.start,t.end)});const _=function(e,n){let t=null,o=null;const r=()=>e(o);return e=>{o=e,null!=t&&window.clearTimeout(t),t=window.setTimeout(r,n)}}(e=>A({type:"compile",source:e}),128);function D(){const e=M.getValue();window.localStorage.setItem("code",e),""===e.trim()?R({compilation:{...T,state:1}}):_(M.getValue());const{computedMarks:n}=P;P.computedMarks=null,n&&requestAnimationFrame(()=>n.forEach(e=>e.clear()))}const U=c((function({hoverEl:e}){const n=e&&[...e.classList].find(e=>e.startsWith("computed-")),t=null!=n?Number(n.replace("computed-","")):null;null!=P.hoverIndex&&t!==P.hoverIndex&&u(E,`hover-${P.hoverIndex}`),null!=t&&s(E,`hover-${t}`),P.hoverIndex=t})),H=c((function({error:e}){P.errorMark&&P.errorMark.clear(),P.errorContextMark&&P.errorContextMark.clear(),null!=e&&(P.errorMark=Y(e,"compilation-error"),P.errorContextMark=Y({start:{...e.start,ch:0},end:{...e.end,ch:M.getLine(e.end.line).length}},"compilation-error"))})),z=c((function({elaboration:e}){P.mark&&P.mark.clear(),null!=e&&(P.mark=Y(e.location))})),F=c((function({explanation:e}){P.hoverMark&&P.hoverMark.clear(),null!=e&&null==P.computedMarks&&(P.hoverMark=Y(e))})),J=c((function({showAll:e,editable:n}){M.setOption("readOnly",!n&&"nocursor"),e?s(E,"show-all-computed"):u(E,"show-all-computed")}));function Y(e,n="highlighted"){return M.markText(e.start,e.end,{className:n})}}]);