"use strict";var signa=(()=>{var it=Object.defineProperty;var pe=Object.getOwnPropertyDescriptor;var fe=Object.getOwnPropertyNames;var le=Object.prototype.hasOwnProperty;var Et=e=>{throw TypeError(e)};var ue=(e,t)=>{for(var r in t)it(e,r,{get:t[r],enumerable:!0})},de=(e,t,r,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let n of fe(t))!le.call(e,n)&&n!==r&&it(e,n,{get:()=>t[n],enumerable:!(o=pe(t,n))||o.enumerable});return e};var he=e=>de(it({},"__esModule",{value:!0}),e);var Nt=(e,t,r)=>t.has(e)||Et("Cannot "+r);var b=(e,t,r)=>(Nt(e,t,"read from private field"),r?r.call(e):t.get(e)),H=(e,t,r)=>t.has(e)?Et("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r),st=(e,t,r,o)=>(Nt(e,t,"write to private field"),o?o.call(e,r):t.set(e,r),r);var Ue={};ue(Ue,{app:()=>$,computed:()=>nt,def:()=>W,effect:()=>j,html:()=>P,htmlFor:()=>yt,useState:()=>V});var wt=(e,t,r,o,n)=>{let a=r.length,c=t.length,i=a,p=0,m=0,u=null;for(;p<c||m<i;)if(c===p){let f=i<a?m?o(r[m-1],-0).nextSibling:o(r[i],0):n;for(;m<i;)e.insertBefore(o(r[m++],1),f)}else if(i===m)for(;p<c;)(!u||!u.has(t[p]))&&e.removeChild(o(t[p],-1)),p++;else if(t[p]===r[m])p++,m++;else if(t[c-1]===r[i-1])c--,i--;else if(t[p]===r[i-1]&&r[m]===t[c-1]){let f=o(t[--c],-0).nextSibling;e.insertBefore(o(r[m++],1),o(t[p++],-0).nextSibling),e.insertBefore(o(r[--i],1),f),t[c]=r[i]}else{if(!u){u=new Map;let f=m;for(;f<i;)u.set(r[f],f++)}if(u.has(t[p])){let f=u.get(t[p]);if(m<f&&f<i){let h=p,s=1;for(;++h<c&&h<i&&u.get(t[h])===f+s;)s++;if(s>f-m){let d=o(t[p],0);for(;m<f;)e.insertBefore(o(r[m++],1),d)}else e.replaceChild(o(r[m++],1),o(t[p++],-1))}else p++}else e.removeChild(o(t[p++],-1))}return r};var{isArray:G}=Array,{getPrototypeOf:me,getOwnPropertyDescriptor:ye}=Object;var Pt="http://www.w3.org/2000/svg",x=[],z=()=>document.createRange(),T=(e,t,r)=>(e.set(t,r),r),Ot=(e,t)=>{let r;do r=ye(e,t);while(!r&&(e=me(e)));return r},At=(e,t)=>t.reduceRight(ve,e),ve=(e,t)=>e.childNodes[t];var{setPrototypeOf:xe}=Object,kt=e=>{function t(r){return xe(r,new.target.prototype)}return t.prototype=e.prototype,t};var O,K=(e,t,r)=>(O||(O=z()),r?O.setStartAfter(e):O.setStartBefore(e),O.setEndAfter(t),O.deleteContents(),e);var ct=({firstChild:e,lastChild:t},r)=>K(e,t,r),Mt=!1,q=(e,t)=>Mt&&e.nodeType===11?1/t<0?t?ct(e,!0):e.lastChild:t?e.valueOf():e.firstChild:e,Dt=e=>document.createComment(e),A,R,C,X=class extends kt(DocumentFragment){constructor(r){super(r);H(this,A,Dt("<>"));H(this,R,Dt("</>"));H(this,C,x);this.replaceChildren(b(this,A),...r.childNodes,b(this,R)),Mt=!0}get firstChild(){return b(this,A)}get lastChild(){return b(this,R)}get parentNode(){return b(this,A).parentNode}remove(){ct(this,!1)}replaceWith(r){ct(this,!0).replaceWith(r)}valueOf(){let{parentNode:r}=this;if(r===this)b(this,C)===x&&st(this,C,[...this.childNodes]);else{if(r){let{firstChild:o,lastChild:n}=this;for(st(this,C,[o]);o!==n;)b(this,C).push(o=o.nextSibling)}this.replaceChildren(...b(this,C))}return this}};A=new WeakMap,R=new WeakMap,C=new WeakMap;var $t=(e,t,r)=>e.setAttribute(t,r),L=(e,t)=>e.removeAttribute(t),Se=(e,t)=>{for(let r in t){let o=t[r],n=r==="role"?r:`aria-${r}`;o==null?L(e,n):$t(e,n,o)}return t},J,Te=(e,t,r)=>{r=r.slice(1),J||(J=new WeakMap);let o=J.get(e)||T(J,e,{}),n=o[r];return n&&n[0]&&e.removeEventListener(r,...n),n=G(t)?t:[t,!1],o[r]=n,n[0]&&e.addEventListener(r,...n),t};var E=(e,t)=>{let{t:r,n:o}=e,n=!1;switch(typeof t){case"object":if(t!==null){(o||r).replaceWith(e.n=t.valueOf());break}case"undefined":n=!0;default:r.data=n?"":t,o&&(e.n=null,o.replaceWith(r));break}return t},be=(e,t)=>pt(e,t,t==null?"class":"className"),Ce=(e,t)=>{let{dataset:r}=e;for(let o in t)t[o]==null?delete r[o]:r[o]=t[o];return t},Z=(e,t,r)=>e[r]=t,Ee=(e,t,r)=>Z(e,t,r.slice(1)),pt=(e,t,r)=>t==null?(L(e,r),t):Z(e,t,r),Rt=(e,t)=>(typeof t=="function"?t(e):t.current=e,t),at=(e,t,r)=>(t==null?L(e,r):$t(e,r,t),t),Ne=(e,t)=>t==null?pt(e,t,"style"):Z(e.style,t,"cssText"),we=(e,t,r)=>(e.toggleAttribute(r.slice(1),t),t),w=(e,t,r)=>{let{length:o}=t;if(e.data=`[${o}]`,o)return wt(e.parentNode,r,t,q,e);switch(r.length){case 1:r[0].remove();case 0:break;default:K(q(r[0],0),q(r.at(-1),-0),!1);break}return x},Y=new Map([["aria",Se],["class",be],["data",Ce],["ref",Rt],["style",Ne]]),Lt=(e,t,r)=>{var o;switch(t[0]){case".":return Ee;case"?":return we;case"@":return Te;default:return r||"ownerSVGElement"in e?t==="ref"?Rt:at:Y.get(t)||(t in e?t.startsWith("on")?Z:(o=Ot(e,t))!=null&&o.set?pt:at:at)}},_t=(e,t)=>(e.textContent=t==null?"":t,t);var k=(e,t,r)=>({a:e,b:t,c:r}),Ft=(e,t)=>({b:e,c:t}),It=(e,t,r,o)=>({v:x,u:e,t,n:r,c:o}),g=()=>k(null,null,x);var ft=e=>(t,r)=>{let{a:o,b:n,c:a}=e(t,r),c=document.importNode(o,!0),i=x;if(n!==x){i=[];for(let p,m,u=0;u<n.length;u++){let{a:f,b:h,c:s}=n[u],d=f===m?p:p=At(c,m=f);i[u]=It(h,d,s,h===w?[]:h===E?g():null)}}return Ft(a?c.firstChild:new X(c),i)};var jt=/^(?:plaintext|script|style|textarea|title|xmp)$/i,Wt=/^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;var Pe=/<([a-zA-Z0-9]+[a-zA-Z0-9:._-]*)([^>]*?)(\/?)>/g,Oe=/([^\s\\>"'=]+)\s*=\s*(['"]?)\x01/g,Ae=/[\x01\x02]/g,Vt=(e,t,r)=>{let o=0;return e.join("").trim().replace(Pe,(n,a,c,i)=>`<${a}${c.replace(Oe,"=$2$1").trimEnd()}${i?r||Wt.test(a)?" /":`></${a}`:""}>`).replace(Ae,n=>n===""?`<!--${t+o++}-->`:t+o++)};var Q=document.createElement("template"),lt,ut,Ut=(e,t)=>{if(t)return lt||(lt=document.createElementNS(Pt,"svg"),ut=z(),ut.selectNodeContents(lt)),ut.createContextualFragment(e);Q.innerHTML=e;let{content:r}=Q;return Q=Q.cloneNode(!1),r};var dt=e=>{let t=[],r;for(;r=e.parentNode;)t.push(t.indexOf.call(r.childNodes,e)),e=r;return t},Bt=()=>document.createTextNode(""),Me=(e,t,r)=>{let o=Ut(Vt(e,_,r),r),{length:n}=e,a=x;if(n>1){let p=[],m=document.createTreeWalker(o,129),u=0,f=`${_}${u++}`;for(a=[];u<n;){let h=m.nextNode();if(h.nodeType===8){if(h.data===f){let s=G(t[u-1])?w:E;s===E&&p.push(h),a.push(k(dt(h),s,null)),f=`${_}${u++}`}}else{let s;for(;h.hasAttribute(f);){s||(s=dt(h));let d=h.getAttribute(f);a.push(k(s,Lt(h,d,r),d)),L(h,f),f=`${_}${u++}`}!r&&jt.test(h.localName)&&h.textContent.trim()===`<!--${f}-->`&&(a.push(k(s||dt(h),_t,null)),f=`${_}${u++}`)}}for(u=0;u<p.length;u++)p[u].replaceWith(Bt())}let{childNodes:c}=o,{length:i}=c;return i<1?(i=1,o.appendChild(Bt())):i===1&&n!==1&&c[0].nodeType!==1&&(i=0),T(Ht,e,k(o,a,i===1))},Ht=new WeakMap,_="is\xB5",ht=e=>(t,r)=>Ht.get(t)||Me(t,r,e);var $e=ft(ht(!1)),Re=ft(ht(!0)),mt=(e,{s:t,t:r,v:o})=>{if(e.a!==r){let{b:n,c:a}=(t?Re:$e)(r,o);e.a=r,e.b=n,e.c=a}for(let{c:n}=e,a=0;a<n.length;a++){let c=o[a],i=n[a];switch(i.u){case w:i.v=w(i.t,Le(i.c,c),i.v);break;case E:let p=c instanceof S?mt(i.c||(i.c=g()),c):(i.c=null,c);p!==i.v&&(i.v=E(i,p));break;default:c!==i.v&&(i.v=i.u(i.t,c,i.n,i.v));break}}return e.b},Le=(e,t)=>{let r=0,{length:o}=t;for(o<e.length&&e.splice(o);r<o;r++){let n=t[r];n instanceof S?t[r]=mt(e[r]||(e[r]=g()),n):e[r]=null}return t},S=class{constructor(t,r,o){this.s=t,this.t=r,this.v=o}toDOM(t=g()){return mt(t,this)}};var Gt=e=>(t,...r)=>new S(e,t,r),P=Gt(!1),zt=Gt(!0);var Kt=new WeakMap,tt=(e,t,r)=>{let o=Kt.get(e)||T(Kt,e,g()),{b:n}=o,a=r&&typeof t=="function"?t():t,c=a instanceof S?a.toDOM(o):a;return n!==c&&e.replaceChildren((o.b=c).valueOf()),e};var Xt=new WeakMap,qt=e=>(t,r)=>{function o(a,...c){return new S(e,a,c).toDOM(this)}let n=Xt.get(t)||T(Xt,t,new Map);return n.get(r)||T(n,r,o.bind(g()))},yt=qt(!1),_e=qt(!0);var Zt=new FinalizationRegistry(([e,t,r])=>{r&&console.debug(`%c${String(t)}`,"font-weight:bold","collected"),e(t)}),Jt=Object.create(null),Yt=(e,t,{debug:r,handler:o,return:n,token:a=e}=Jt)=>{let c=n||new Proxy(e,o||Jt),i=[c,[t,e,!!r]];return a!==!1&&i.push(a),Zt.register(...i),c},Qt=e=>Zt.unregister(e);var vt=new WeakMap,Fe=e=>e(),et=!0,xt=e=>(t,r)=>{if(et=typeof r!="function",te(t),et)return tt(t,r,!1);et=!0;let o=new WeakRef(t),n=e(()=>{tt(o.deref(),r(),!1)});return vt.set(t,n),Yt(n,Fe,{return:t})},te=e=>{let t=vt.get(e);t&&(et&&vt.delete(e),Qt(t),t())};var Ie=Symbol.for("preact-signals");function St(){if(D>1)D--;else{for(var e,t=!1;F!==void 0;){var r=F;for(F=void 0,gt++;r!==void 0;){var o=r.o;if(r.o=void 0,r.f&=-3,!(8&r.f)&&re(r))try{r.c()}catch(n){t||(e=n,t=!0)}r=o}}if(gt=0,D--,t)throw e}}var l=void 0;var F=void 0,D=0,gt=0,rt=0;function ee(e){if(l!==void 0){var t=e.n;if(t===void 0||t.t!==l)return t={i:0,S:e,p:l.s,n:void 0,t:l,e:void 0,x:void 0,r:t},l.s!==void 0&&(l.s.n=t),l.s=t,e.n=t,32&l.f&&e.S(t),t;if(t.i===-1)return t.i=0,t.n!==void 0&&(t.n.p=t.p,t.p!==void 0&&(t.p.n=t.n),t.p=l.s,t.n=void 0,l.s.n=t,l.s=t),t}}function y(e){this.v=e,this.i=0,this.n=void 0,this.t=void 0}y.prototype.brand=Ie;y.prototype.h=function(){return!0};y.prototype.S=function(e){this.t!==e&&e.e===void 0&&(e.x=this.t,this.t!==void 0&&(this.t.e=e),this.t=e)};y.prototype.U=function(e){if(this.t!==void 0){var t=e.e,r=e.x;t!==void 0&&(t.x=r,e.e=void 0),r!==void 0&&(r.e=t,e.x=void 0),e===this.t&&(this.t=r)}};y.prototype.subscribe=function(e){var t=this;return j(function(){var r=t.value,o=l;l=void 0;try{e(r)}finally{l=o}})};y.prototype.valueOf=function(){return this.value};y.prototype.toString=function(){return this.value+""};y.prototype.toJSON=function(){return this.value};y.prototype.peek=function(){var e=l;l=void 0;try{return this.value}finally{l=e}};Object.defineProperty(y.prototype,"value",{get:function(){var e=ee(this);return e!==void 0&&(e.i=this.i),this.v},set:function(e){if(e!==this.v){if(gt>100)throw new Error("Cycle detected");this.v=e,this.i++,rt++,D++;try{for(var t=this.t;t!==void 0;t=t.x)t.t.N()}finally{St()}}}});function ot(e){return new y(e)}function re(e){for(var t=e.s;t!==void 0;t=t.n)if(t.S.i!==t.i||!t.S.h()||t.S.i!==t.i)return!0;return!1}function oe(e){for(var t=e.s;t!==void 0;t=t.n){var r=t.S.n;if(r!==void 0&&(t.r=r),t.S.n=t,t.i=-1,t.n===void 0){e.s=t;break}}}function ne(e){for(var t=e.s,r=void 0;t!==void 0;){var o=t.p;t.i===-1?(t.S.U(t),o!==void 0&&(o.n=t.n),t.n!==void 0&&(t.n.p=o)):r=t,t.S.n=t.r,t.r!==void 0&&(t.r=void 0),t=o}e.s=r}function M(e){y.call(this,void 0),this.x=e,this.s=void 0,this.g=rt-1,this.f=4}(M.prototype=new y).h=function(){if(this.f&=-3,1&this.f)return!1;if((36&this.f)==32||(this.f&=-5,this.g===rt))return!0;if(this.g=rt,this.f|=1,this.i>0&&!re(this))return this.f&=-2,!0;var e=l;try{oe(this),l=this;var t=this.x();(16&this.f||this.v!==t||this.i===0)&&(this.v=t,this.f&=-17,this.i++)}catch(r){this.v=r,this.f|=16,this.i++}return l=e,ne(this),this.f&=-2,!0};M.prototype.S=function(e){if(this.t===void 0){this.f|=36;for(var t=this.s;t!==void 0;t=t.n)t.S.S(t)}y.prototype.S.call(this,e)};M.prototype.U=function(e){if(this.t!==void 0&&(y.prototype.U.call(this,e),this.t===void 0)){this.f&=-33;for(var t=this.s;t!==void 0;t=t.n)t.S.U(t)}};M.prototype.N=function(){if(!(2&this.f)){this.f|=6;for(var e=this.t;e!==void 0;e=e.x)e.t.N()}};Object.defineProperty(M.prototype,"value",{get:function(){if(1&this.f)throw new Error("Cycle detected");var e=ee(this);if(this.h(),e!==void 0&&(e.i=this.i),16&this.f)throw this.v;return this.v}});function ie(e){return new M(e)}function se(e){var t=e.u;if(e.u=void 0,typeof t=="function"){D++;var r=l;l=void 0;try{t()}catch(o){throw e.f&=-2,e.f|=8,Tt(e),o}finally{l=r,St()}}}function Tt(e){for(var t=e.s;t!==void 0;t=t.n)t.S.U(t);e.x=void 0,e.s=void 0,se(e)}function je(e){if(l!==this)throw new Error("Out-of-order effect");ne(this),l=e,this.f&=-2,8&this.f&&Tt(this),St()}function I(e){this.x=e,this.u=void 0,this.s=void 0,this.o=void 0,this.f=32}I.prototype.c=function(){var e=this.S();try{if(8&this.f||this.x===void 0)return;var t=this.x();typeof t=="function"&&(this.u=t)}finally{e()}};I.prototype.S=function(){if(1&this.f)throw new Error("Cycle detected");this.f|=1,this.f&=-9,se(this),oe(this),D++;var e=l;return l=this,je.bind(this,e)};I.prototype.N=function(){2&this.f||(this.f|=2,this.o=F,F=this)};I.prototype.d=function(){this.f|=8,1&this.f||Tt(this)};function j(e){var t=new I(e);try{t.c()}catch(r){throw t.d(),r}return t.d.bind(t)}var We=()=>{let e={};return{register:(n,a)=>{e[n]={factory:a}},get:(n,...a)=>{let c=e[n];if(!c)throw new Error(`Service ${n} not found`);return c.instance||(c.instance=c.factory(...a)),c.instance},clear:()=>{Object.keys(e).forEach(n=>{delete e[n]})}}},$={...We()};function W(e){let{tagName:t,props:r={},slots:o,setup:n,connected:a,disconnected:c,render:i}=e,p=xt(j);class m extends HTMLElement{$(h){return this[h]}emitEvent(h,s){this.dispatchEvent(new CustomEvent(h,{detail:s}))}}class u extends m{constructor(){super();this.cleanup=[];this.propsSignals=this.initializeProps(),Object.keys(this.propsSignals).forEach(s=>{this[s]=this.propsSignals[s]}),this.setupResult=(n==null?void 0:n({props:this.propsSignals,app:$}))||{},Object.entries(this.setupResult).forEach(([s,d])=>{typeof d=="function"?this[s]=d.bind(this):this[s]=d})}static get observedAttributes(){return Object.keys(r).map(s=>`data-${s}`)}initializeProps(){var d;let s={};for(let[N,v]of Object.entries(r)){let U=`data-${N}`,B=this.getAttribute(U),ce=(d=v.default)!=null?d:this.getDefaultForType(v.type),ae=B!==null?this.parseAttributeValue(B,v.type):ce;s[N]=ot(ae)}return s}getDefaultForType(s){switch(s){case String:return"";case Number:return 0;case Boolean:return!1;case Object:return{};case Array:return[];default:return null}}parseAttributeValue(s,d){switch(d){case Number:return Number(s);case Boolean:return s!==null&&s!=="false";case Object:case Array:try{return JSON.parse(s)}catch{return d===Object?{}:[]}default:return s}}attributeChangedCallback(s,d,N){let v=s.replace(/^data-/,""),U=r[v];if(!U)return;let B=this.parseAttributeValue(N,U.type);this.propsSignals[v].value=B}setupRender(){if(!i)return;let s=p(this,()=>i.call(this));this.cleanup.push(s)}connectedCallback(){requestAnimationFrame(()=>{this.collectSlots(),this.setupRender(),a&&a.call(this)})}disconnectedCallback(){this.cleanup.forEach(s=>s()),this.cleanup=[],c&&c.call(this)}collectSlots(){let s={default:[]};o&&o.forEach(d=>{s[d]=[]}),Array.from(this.childNodes).forEach(d=>{var N;if(d instanceof Element){let v=d.getAttribute("data-slot")||"default";if(v!=="default"&&o&&!o.includes(v)){console.warn(`Slot "${v}" is not defined in component slots`);return}d.hasChildNodes()&&(s[v]=s[v]||[],s[v].push(...Array.from(d.childNodes)))}else(N=d.textContent)!=null&&N.trim()&&s.default.push(d)}),this.slots=s}}t&&customElements.define(t,u)}var bt=class extends y{emit(t){if(typeof t=="object"&&t!==null&&typeof this.value=="object"){let r=Ct(this.value);this.value={...r,...t}}else this.value=t}};function V(e){let t=ot(e);return Object.setPrototypeOf(t,bt.prototype),t}function Ct(e){if(e===null||typeof e!="object")return e;if(Array.isArray(e))return e.map(Ct);let t={};for(let r of Reflect.ownKeys(e))t[r]=Ct(e[r]);return t}function nt(e){return ie(e)}var Ve={fetch:()=>"1"};$.register("api",()=>Ve);var Po=W({tagName:"signa-button",slots:["header","footer"],props:{name:{type:String,default:"test"}},setup({props:e,app:t}){let r=V(0),o=V({count:0}),n=t.get("api"),a=()=>{r.value++,o.emit({count:o.value.count+1})},c=nt(()=>r.value%2===0);return{count:r,inc:a,isDouble:c,state:o}},connected(){},render(){return P`<div> <div>State count: ${this.state.value.count}</div> <div>IsDouble: ${this.isDouble.value}</div> <div>Header slot result: ${this.slots.header}</div> <div>${this.count.value}</div> <div>Default slot result: ${this.slots.default}</div> <div>Footer slot result: ${this.slots.footer}</div> <div><button @click="${()=>this.inc()}">inc</button></div> <prop-example data-example="${this.count.value}"></prop-example> </div>`}});W({tagName:"prop-example",props:{example:{type:Number,default:0}},render(){return P`prop: ${this.example.value}`}});return he(Ue);})();
/*! Bundled license information:

uhtml/esm/index.js:
  (*! (c) Andrea Giammarchi - MIT *)

uhtml/esm/keyed.js:
  (*! (c) Andrea Giammarchi - MIT *)
*/
