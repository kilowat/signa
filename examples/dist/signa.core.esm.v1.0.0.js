var gt=e=>{throw TypeError(e)};var St=(e,t,r)=>t.has(e)||gt("Cannot "+r);var b=(e,t,r)=>(St(e,t,"read from private field"),r?r.call(e):t.get(e)),j=(e,t,r)=>t.has(e)?gt("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r),et=(e,t,r,o)=>(St(e,t,"write to private field"),o?o.call(e,r):t.set(e,r),r);var Tt=(e,t,r,o,n)=>{let a=r.length,c=t.length,i=a,f=0,m=0,u=null;for(;f<c||m<i;)if(c===f){let p=i<a?m?o(r[m-1],-0).nextSibling:o(r[i],0):n;for(;m<i;)e.insertBefore(o(r[m++],1),p)}else if(i===m)for(;f<c;)(!u||!u.has(t[f]))&&e.removeChild(o(t[f],-1)),f++;else if(t[f]===r[m])f++,m++;else if(t[c-1]===r[i-1])c--,i--;else if(t[f]===r[i-1]&&r[m]===t[c-1]){let p=o(t[--c],-0).nextSibling;e.insertBefore(o(r[m++],1),o(t[f++],-0).nextSibling),e.insertBefore(o(r[--i],1),p),t[c]=r[i]}else{if(!u){u=new Map;let p=m;for(;p<i;)u.set(r[p],p++)}if(u.has(t[f])){let p=u.get(t[f]);if(m<p&&p<i){let h=f,s=1;for(;++h<c&&h<i&&u.get(t[h])===p+s;)s++;if(s>p-m){let d=o(t[f],0);for(;m<p;)e.insertBefore(o(r[m++],1),d)}else e.replaceChild(o(r[m++],1),o(t[f++],-1))}else f++}else e.removeChild(o(t[f++],-1))}return r};var{isArray:W}=Array,{getPrototypeOf:ie,getOwnPropertyDescriptor:se}=Object;var bt="http://www.w3.org/2000/svg",x=[],V=()=>document.createRange(),T=(e,t,r)=>(e.set(t,r),r),Ct=(e,t)=>{let r;do r=se(e,t);while(!r&&(e=ie(e)));return r},Et=(e,t)=>t.reduceRight(ce,e),ce=(e,t)=>e.childNodes[t];var{setPrototypeOf:ae}=Object,Nt=e=>{function t(r){return ae(r,new.target.prototype)}return t.prototype=e.prototype,t};var P,U=(e,t,r)=>(P||(P=V()),r?P.setStartAfter(e):P.setStartBefore(e),P.setEndAfter(t),P.deleteContents(),e);var rt=({firstChild:e,lastChild:t},r)=>U(e,t,r),Pt=!1,H=(e,t)=>Pt&&e.nodeType===11?1/t<0?t?rt(e,!0):e.lastChild:t?e.valueOf():e.firstChild:e,wt=e=>document.createComment(e),O,M,C,B=class extends Nt(DocumentFragment){constructor(r){super(r);j(this,O,wt("<>"));j(this,M,wt("</>"));j(this,C,x);this.replaceChildren(b(this,O),...r.childNodes,b(this,M)),Pt=!0}get firstChild(){return b(this,O)}get lastChild(){return b(this,M)}get parentNode(){return b(this,O).parentNode}remove(){rt(this,!1)}replaceWith(r){rt(this,!0).replaceWith(r)}valueOf(){let{parentNode:r}=this;if(r===this)b(this,C)===x&&et(this,C,[...this.childNodes]);else{if(r){let{firstChild:o,lastChild:n}=this;for(et(this,C,[o]);o!==n;)b(this,C).push(o=o.nextSibling)}this.replaceChildren(...b(this,C))}return this}};O=new WeakMap,M=new WeakMap,C=new WeakMap;var Ot=(e,t,r)=>e.setAttribute(t,r),R=(e,t)=>e.removeAttribute(t),pe=(e,t)=>{for(let r in t){let o=t[r],n=r==="role"?r:`aria-${r}`;o==null?R(e,n):Ot(e,n,o)}return t},G,le=(e,t,r)=>{r=r.slice(1),G||(G=new WeakMap);let o=G.get(e)||T(G,e,{}),n=o[r];return n&&n[0]&&e.removeEventListener(r,...n),n=W(t)?t:[t,!1],o[r]=n,n[0]&&e.addEventListener(r,...n),t};var E=(e,t)=>{let{t:r,n:o}=e,n=!1;switch(typeof t){case"object":if(t!==null){(o||r).replaceWith(e.n=t.valueOf());break}case"undefined":n=!0;default:r.data=n?"":t,o&&(e.n=null,o.replaceWith(r));break}return t},ue=(e,t)=>nt(e,t,t==null?"class":"className"),de=(e,t)=>{let{dataset:r}=e;for(let o in t)t[o]==null?delete r[o]:r[o]=t[o];return t},K=(e,t,r)=>e[r]=t,he=(e,t,r)=>K(e,t,r.slice(1)),nt=(e,t,r)=>t==null?(R(e,r),t):K(e,t,r),kt=(e,t)=>(typeof t=="function"?t(e):t.current=e,t),ot=(e,t,r)=>(t==null?R(e,r):Ot(e,r,t),t),me=(e,t)=>t==null?nt(e,t,"style"):K(e.style,t,"cssText"),ye=(e,t,r)=>(e.toggleAttribute(r.slice(1),t),t),w=(e,t,r)=>{let{length:o}=t;if(e.data=`[${o}]`,o)return Tt(e.parentNode,r,t,H,e);switch(r.length){case 1:r[0].remove();case 0:break;default:U(H(r[0],0),H(r.at(-1),-0),!1);break}return x},z=new Map([["aria",pe],["class",ue],["data",de],["ref",kt],["style",me]]),At=(e,t,r)=>{var o;switch(t[0]){case".":return he;case"?":return ye;case"@":return le;default:return r||"ownerSVGElement"in e?t==="ref"?kt:ot:z.get(t)||(t in e?t.startsWith("on")?K:(o=Ct(e,t))!=null&&o.set?nt:ot:ot)}},Dt=(e,t)=>(e.textContent=t==null?"":t,t);var k=(e,t,r)=>({a:e,b:t,c:r}),Mt=(e,t)=>({b:e,c:t}),Rt=(e,t,r,o)=>({v:x,u:e,t,n:r,c:o}),g=()=>k(null,null,x);var it=e=>(t,r)=>{let{a:o,b:n,c:a}=e(t,r),c=document.importNode(o,!0),i=x;if(n!==x){i=[];for(let f,m,u=0;u<n.length;u++){let{a:p,b:h,c:s}=n[u],d=p===m?f:f=Et(c,m=p);i[u]=Rt(h,d,s,h===w?[]:h===E?g():null)}}return Mt(a?c.firstChild:new B(c),i)};var Lt=/^(?:plaintext|script|style|textarea|title|xmp)$/i,$t=/^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;var ve=/<([a-zA-Z0-9]+[a-zA-Z0-9:._-]*)([^>]*?)(\/?)>/g,xe=/([^\s\\>"'=]+)\s*=\s*(['"]?)\x01/g,ge=/[\x01\x02]/g,_t=(e,t,r)=>{let o=0;return e.join("").trim().replace(ve,(n,a,c,i)=>`<${a}${c.replace(xe,"=$2$1").trimEnd()}${i?r||$t.test(a)?" /":`></${a}`:""}>`).replace(ge,n=>n===""?`<!--${t+o++}-->`:t+o++)};var X=document.createElement("template"),st,ct,It=(e,t)=>{if(t)return st||(st=document.createElementNS(bt,"svg"),ct=V(),ct.selectNodeContents(st)),ct.createContextualFragment(e);X.innerHTML=e;let{content:r}=X;return X=X.cloneNode(!1),r};var at=e=>{let t=[],r;for(;r=e.parentNode;)t.push(t.indexOf.call(r.childNodes,e)),e=r;return t},Ft=()=>document.createTextNode(""),be=(e,t,r)=>{let o=It(_t(e,L,r),r),{length:n}=e,a=x;if(n>1){let f=[],m=document.createTreeWalker(o,129),u=0,p=`${L}${u++}`;for(a=[];u<n;){let h=m.nextNode();if(h.nodeType===8){if(h.data===p){let s=W(t[u-1])?w:E;s===E&&f.push(h),a.push(k(at(h),s,null)),p=`${L}${u++}`}}else{let s;for(;h.hasAttribute(p);){s||(s=at(h));let d=h.getAttribute(p);a.push(k(s,At(h,d,r),d)),R(h,p),p=`${L}${u++}`}!r&&Lt.test(h.localName)&&h.textContent.trim()===`<!--${p}-->`&&(a.push(k(s||at(h),Dt,null)),p=`${L}${u++}`)}}for(u=0;u<f.length;u++)f[u].replaceWith(Ft())}let{childNodes:c}=o,{length:i}=c;return i<1?(i=1,o.appendChild(Ft())):i===1&&n!==1&&c[0].nodeType!==1&&(i=0),T(jt,e,k(o,a,i===1))},jt=new WeakMap,L="is\xB5",ft=e=>(t,r)=>jt.get(t)||be(t,r,e);var Ce=it(ft(!1)),Ee=it(ft(!0)),pt=(e,{s:t,t:r,v:o})=>{if(e.a!==r){let{b:n,c:a}=(t?Ee:Ce)(r,o);e.a=r,e.b=n,e.c=a}for(let{c:n}=e,a=0;a<n.length;a++){let c=o[a],i=n[a];switch(i.u){case w:i.v=w(i.t,Ne(i.c,c),i.v);break;case E:let f=c instanceof S?pt(i.c||(i.c=g()),c):(i.c=null,c);f!==i.v&&(i.v=E(i,f));break;default:c!==i.v&&(i.v=i.u(i.t,c,i.n,i.v));break}}return e.b},Ne=(e,t)=>{let r=0,{length:o}=t;for(o<e.length&&e.splice(o);r<o;r++){let n=t[r];n instanceof S?t[r]=pt(e[r]||(e[r]=g()),n):e[r]=null}return t},S=class{constructor(t,r,o){this.s=t,this.t=r,this.v=o}toDOM(t=g()){return pt(t,this)}};var Wt=e=>(t,...r)=>new S(e,t,r),lt=Wt(!1),Vt=Wt(!0);var Ut=new WeakMap,q=(e,t,r)=>{let o=Ut.get(e)||T(Ut,e,g()),{b:n}=o,a=r&&typeof t=="function"?t():t,c=a instanceof S?a.toDOM(o):a;return n!==c&&e.replaceChildren((o.b=c).valueOf()),e};var Bt=new WeakMap,Ht=e=>(t,r)=>{function o(a,...c){return new S(e,a,c).toDOM(this)}let n=Bt.get(t)||T(Bt,t,new Map);return n.get(r)||T(n,r,o.bind(g()))},Gt=Ht(!1),we=Ht(!0);var zt=new FinalizationRegistry(([e,t,r])=>{r&&console.debug(`%c${String(t)}`,"font-weight:bold","collected"),e(t)}),Kt=Object.create(null),Xt=(e,t,{debug:r,handler:o,return:n,token:a=e}=Kt)=>{let c=n||new Proxy(e,o||Kt),i=[c,[t,e,!!r]];return a!==!1&&i.push(a),zt.register(...i),c},qt=e=>zt.unregister(e);var ut=new WeakMap,Pe=e=>e(),J=!0,dt=e=>(t,r)=>{if(J=typeof r!="function",Jt(t),J)return q(t,r,!1);J=!0;let o=new WeakRef(t),n=e(()=>{q(o.deref(),r(),!1)});return ut.set(t,n),Xt(n,Pe,{return:t})},Jt=e=>{let t=ut.get(e);t&&(J&&ut.delete(e),qt(t),t())};var Oe=Symbol.for("preact-signals");function mt(){if(A>1)A--;else{for(var e,t=!1;$!==void 0;){var r=$;for($=void 0,ht++;r!==void 0;){var o=r.o;if(r.o=void 0,r.f&=-3,!(8&r.f)&&Yt(r))try{r.c()}catch(n){t||(e=n,t=!0)}r=o}}if(ht=0,A--,t)throw e}}var l=void 0;var $=void 0,A=0,ht=0,Z=0;function Zt(e){if(l!==void 0){var t=e.n;if(t===void 0||t.t!==l)return t={i:0,S:e,p:l.s,n:void 0,t:l,e:void 0,x:void 0,r:t},l.s!==void 0&&(l.s.n=t),l.s=t,e.n=t,32&l.f&&e.S(t),t;if(t.i===-1)return t.i=0,t.n!==void 0&&(t.n.p=t.p,t.p!==void 0&&(t.p.n=t.n),t.p=l.s,t.n=void 0,l.s.n=t,l.s=t),t}}function y(e){this.v=e,this.i=0,this.n=void 0,this.t=void 0}y.prototype.brand=Oe;y.prototype.h=function(){return!0};y.prototype.S=function(e){this.t!==e&&e.e===void 0&&(e.x=this.t,this.t!==void 0&&(this.t.e=e),this.t=e)};y.prototype.U=function(e){if(this.t!==void 0){var t=e.e,r=e.x;t!==void 0&&(t.x=r,e.e=void 0),r!==void 0&&(r.e=t,e.x=void 0),e===this.t&&(this.t=r)}};y.prototype.subscribe=function(e){var t=this;return Q(function(){var r=t.value,o=l;l=void 0;try{e(r)}finally{l=o}})};y.prototype.valueOf=function(){return this.value};y.prototype.toString=function(){return this.value+""};y.prototype.toJSON=function(){return this.value};y.prototype.peek=function(){var e=l;l=void 0;try{return this.value}finally{l=e}};Object.defineProperty(y.prototype,"value",{get:function(){var e=Zt(this);return e!==void 0&&(e.i=this.i),this.v},set:function(e){if(e!==this.v){if(ht>100)throw new Error("Cycle detected");this.v=e,this.i++,Z++,A++;try{for(var t=this.t;t!==void 0;t=t.x)t.t.N()}finally{mt()}}}});function Y(e){return new y(e)}function Yt(e){for(var t=e.s;t!==void 0;t=t.n)if(t.S.i!==t.i||!t.S.h()||t.S.i!==t.i)return!0;return!1}function Qt(e){for(var t=e.s;t!==void 0;t=t.n){var r=t.S.n;if(r!==void 0&&(t.r=r),t.S.n=t,t.i=-1,t.n===void 0){e.s=t;break}}}function te(e){for(var t=e.s,r=void 0;t!==void 0;){var o=t.p;t.i===-1?(t.S.U(t),o!==void 0&&(o.n=t.n),t.n!==void 0&&(t.n.p=o)):r=t,t.S.n=t.r,t.r!==void 0&&(t.r=void 0),t=o}e.s=r}function D(e){y.call(this,void 0),this.x=e,this.s=void 0,this.g=Z-1,this.f=4}(D.prototype=new y).h=function(){if(this.f&=-3,1&this.f)return!1;if((36&this.f)==32||(this.f&=-5,this.g===Z))return!0;if(this.g=Z,this.f|=1,this.i>0&&!Yt(this))return this.f&=-2,!0;var e=l;try{Qt(this),l=this;var t=this.x();(16&this.f||this.v!==t||this.i===0)&&(this.v=t,this.f&=-17,this.i++)}catch(r){this.v=r,this.f|=16,this.i++}return l=e,te(this),this.f&=-2,!0};D.prototype.S=function(e){if(this.t===void 0){this.f|=36;for(var t=this.s;t!==void 0;t=t.n)t.S.S(t)}y.prototype.S.call(this,e)};D.prototype.U=function(e){if(this.t!==void 0&&(y.prototype.U.call(this,e),this.t===void 0)){this.f&=-33;for(var t=this.s;t!==void 0;t=t.n)t.S.U(t)}};D.prototype.N=function(){if(!(2&this.f)){this.f|=6;for(var e=this.t;e!==void 0;e=e.x)e.t.N()}};Object.defineProperty(D.prototype,"value",{get:function(){if(1&this.f)throw new Error("Cycle detected");var e=Zt(this);if(this.h(),e!==void 0&&(e.i=this.i),16&this.f)throw this.v;return this.v}});function ee(e){return new D(e)}function re(e){var t=e.u;if(e.u=void 0,typeof t=="function"){A++;var r=l;l=void 0;try{t()}catch(o){throw e.f&=-2,e.f|=8,yt(e),o}finally{l=r,mt()}}}function yt(e){for(var t=e.s;t!==void 0;t=t.n)t.S.U(t);e.x=void 0,e.s=void 0,re(e)}function ke(e){if(l!==this)throw new Error("Out-of-order effect");te(this),l=e,this.f&=-2,8&this.f&&yt(this),mt()}function _(e){this.x=e,this.u=void 0,this.s=void 0,this.o=void 0,this.f=32}_.prototype.c=function(){var e=this.S();try{if(8&this.f||this.x===void 0)return;var t=this.x();typeof t=="function"&&(this.u=t)}finally{e()}};_.prototype.S=function(){if(1&this.f)throw new Error("Cycle detected");this.f|=1,this.f&=-9,re(this),Qt(this),A++;var e=l;return l=this,ke.bind(this,e)};_.prototype.N=function(){2&this.f||(this.f|=2,this.o=$,$=this)};_.prototype.d=function(){this.f|=8,1&this.f||yt(this)};function Q(e){var t=new _(e);try{t.c()}catch(r){throw t.d(),r}return t.d.bind(t)}var Ae=()=>{let e={};return{register:(n,a)=>{e[n]={factory:a}},get:(n,...a)=>{let c=e[n];if(!c)throw new Error(`Service ${n} not found`);return c.instance||(c.instance=c.factory(...a)),c.instance},clear:()=>{Object.keys(e).forEach(n=>{delete e[n]})}}},vt={...Ae()};function De(e){let{tagName:t,props:r={},slots:o,setup:n,connected:a,disconnected:c,render:i}=e,f=dt(Q);class m extends HTMLElement{$(h){return this[h]}emitEvent(h,s){this.dispatchEvent(new CustomEvent(h,{detail:s}))}}class u extends m{constructor(){super();this.cleanup=[];this.propsSignals=this.initializeProps(),Object.keys(this.propsSignals).forEach(s=>{this[s]=this.propsSignals[s]}),this.setupResult=(n==null?void 0:n({props:this.propsSignals,app:vt}))||{},Object.entries(this.setupResult).forEach(([s,d])=>{typeof d=="function"?this[s]=d.bind(this):this[s]=d})}static get observedAttributes(){return Object.keys(r).map(s=>`data-${s}`)}initializeProps(){var d;let s={};for(let[N,v]of Object.entries(r)){let I=`data-${N}`,F=this.getAttribute(I),oe=(d=v.default)!=null?d:this.getDefaultForType(v.type),ne=F!==null?this.parseAttributeValue(F,v.type):oe;s[N]=Y(ne)}return s}getDefaultForType(s){switch(s){case String:return"";case Number:return 0;case Boolean:return!1;case Object:return{};case Array:return[];default:return null}}parseAttributeValue(s,d){switch(d){case Number:return Number(s);case Boolean:return s!==null&&s!=="false";case Object:case Array:try{return JSON.parse(s)}catch{return d===Object?{}:[]}default:return s}}attributeChangedCallback(s,d,N){let v=s.replace(/^data-/,""),I=r[v];if(!I)return;let F=this.parseAttributeValue(N,I.type);this.propsSignals[v].value=F}setupRender(){if(!i)return;let s=f(this,()=>i.call(this));this.cleanup.push(s)}connectedCallback(){requestAnimationFrame(()=>{this.collectSlots(),this.setupRender(),a&&a.call(this)})}disconnectedCallback(){this.cleanup.forEach(s=>s()),this.cleanup=[],c&&c.call(this)}collectSlots(){let s={default:[]};o&&o.forEach(d=>{s[d]=[]}),Array.from(this.childNodes).forEach(d=>{var N;if(d instanceof Element){let v=d.getAttribute("data-slot")||"default";if(v!=="default"&&o&&!o.includes(v)){console.warn(`Slot "${v}" is not defined in component slots`);return}d.hasChildNodes()&&(s[v]=s[v]||[],s[v].push(...Array.from(d.childNodes)))}else(N=d.textContent)!=null&&N.trim()&&s.default.push(d)}),this.slots=s}}t&&customElements.define(t,u)}var tt=class extends y{emit(t){if(typeof t=="object"&&t!==null&&typeof this.value=="object"){let r=xt(this.value);this.value={...r,...t}}else this.value=t}};function Me(e){let t=Y(e);return Object.setPrototypeOf(t,tt.prototype),t}function xt(e){if(e===null||typeof e!="object")return e;if(Array.isArray(e))return e.map(xt);let t={};for(let r of Reflect.ownKeys(e))t[r]=xt(e[r]);return t}function Re(e){return ee(e)}export{tt as State,vt as app,Re as computed,De as defineComponent,Q as effect,lt as html,Gt as htmlFor,Me as useState};
/*! Bundled license information:

uhtml/esm/index.js:
  (*! (c) Andrea Giammarchi - MIT *)

uhtml/esm/keyed.js:
  (*! (c) Andrea Giammarchi - MIT *)
*/
