var bt=e=>{throw TypeError(e)};var At=(e,t,r)=>t.has(e)||bt("Cannot "+r);var b=(e,t,r)=>(At(e,t,"read from private field"),r?r.call(e):t.get(e)),B=(e,t,r)=>t.has(e)?bt("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r),it=(e,t,r,o)=>(At(e,t,"write to private field"),o?o.call(e,r):t.set(e,r),r);var Rt=(e,t,r,o,n)=>{let i=r.length,p=t.length,s=i,c=0,u=0,f=null;for(;c<p||u<s;)if(p===c){let l=s<i?u?o(r[u-1],-0).nextSibling:o(r[s],0):n;for(;u<s;)e.insertBefore(o(r[u++],1),l)}else if(s===u)for(;c<p;)(!f||!f.has(t[c]))&&e.removeChild(o(t[c],-1)),c++;else if(t[c]===r[u])c++,u++;else if(t[p-1]===r[s-1])p--,s--;else if(t[c]===r[s-1]&&r[u]===t[p-1]){let l=o(t[--p],-0).nextSibling;e.insertBefore(o(r[u++],1),o(t[c++],-0).nextSibling),e.insertBefore(o(r[--s],1),l),t[p]=r[s]}else{if(!f){f=new Map;let l=u;for(;l<s;)f.set(r[l],l++)}if(f.has(t[c])){let l=f.get(t[c]);if(u<l&&l<s){let h=c,x=1;for(;++h<p&&h<s&&f.get(t[h])===l+x;)x++;if(x>l-u){let w=o(t[c],0);for(;u<l;)e.insertBefore(o(r[u++],1),w)}else e.replaceChild(o(r[u++],1),o(t[c++],-1))}else c++}else e.removeChild(o(t[c++],-1))}return r};var{isArray:U}=Array,{getPrototypeOf:ce,getOwnPropertyDescriptor:ae}=Object;var Et="http://www.w3.org/2000/svg",S=[],H=()=>document.createRange(),P=(e,t,r)=>(e.set(t,r),r),wt=(e,t)=>{let r;do r=ae(e,t);while(!r&&(e=ce(e)));return r},Gt=(e,t)=>t.reduceRight(ue,e),ue=(e,t)=>e.childNodes[t];var{setPrototypeOf:fe}=Object,Nt=e=>{function t(r){return fe(r,new.target.prototype)}return t.prototype=e.prototype,t};var N,z=(e,t,r)=>(N||(N=H()),r?N.setStartAfter(e):N.setStartBefore(e),N.setEndAfter(t),N.deleteContents(),e);var pt=({firstChild:e,lastChild:t},r)=>z(e,t,r),Ft=!1,X=(e,t)=>Ft&&e.nodeType===11?1/t<0?t?pt(e,!0):e.lastChild:t?e.valueOf():e.firstChild:e,Ot=e=>document.createComment(e),O,$,R,J=class extends Nt(DocumentFragment){constructor(r){super(r);B(this,O,Ot("<>"));B(this,$,Ot("</>"));B(this,R,S);this.replaceChildren(b(this,O),...r.childNodes,b(this,$)),Ft=!0}get firstChild(){return b(this,O)}get lastChild(){return b(this,$)}get parentNode(){return b(this,O).parentNode}remove(){pt(this,!1)}replaceWith(r){pt(this,!0).replaceWith(r)}valueOf(){let{parentNode:r}=this;if(r===this)b(this,R)===S&&it(this,R,[...this.childNodes]);else{if(r){let{firstChild:o,lastChild:n}=this;for(it(this,R,[o]);o!==n;)b(this,R).push(o=o.nextSibling)}this.replaceChildren(...b(this,R))}return this}};O=new WeakMap,$=new WeakMap,R=new WeakMap;var Mt=(e,t,r)=>e.setAttribute(t,r),I=(e,t)=>e.removeAttribute(t),de=(e,t)=>{for(let r in t){let o=t[r],n=r==="role"?r:`aria-${r}`;o==null?I(e,n):Mt(e,n,o)}return t},Z,he=(e,t,r)=>{r=r.slice(1),Z||(Z=new WeakMap);let o=Z.get(e)||P(Z,e,{}),n=o[r];return n&&n[0]&&e.removeEventListener(r,...n),n=U(t)?t:[t,!1],o[r]=n,n[0]&&e.addEventListener(r,...n),t};var E=(e,t)=>{let{t:r,n:o}=e,n=!1;switch(typeof t){case"object":if(t!==null){(o||r).replaceWith(e.n=t.valueOf());break}case"undefined":n=!0;default:r.data=n?"":t,o&&(e.n=null,o.replaceWith(r));break}return t},me=(e,t)=>at(e,t,t==null?"class":"className"),ye=(e,t)=>{let{dataset:r}=e;for(let o in t)t[o]==null?delete r[o]:r[o]=t[o];return t},q=(e,t,r)=>e[r]=t,xe=(e,t,r)=>q(e,t,r.slice(1)),at=(e,t,r)=>t==null?(I(e,r),t):q(e,t,r),kt=(e,t)=>(typeof t=="function"?t(e):t.current=e,t),ct=(e,t,r)=>(t==null?I(e,r):Mt(e,r,t),t),ge=(e,t)=>t==null?at(e,t,"style"):q(e.style,t,"cssText"),Ce=(e,t,r)=>(e.toggleAttribute(r.slice(1),t),t),G=(e,t,r)=>{let{length:o}=t;if(e.data=`[${o}]`,o)return Rt(e.parentNode,r,t,X,e);switch(r.length){case 1:r[0].remove();case 0:break;default:z(X(r[0],0),X(r.at(-1),-0),!1);break}return S},Y=new Map([["aria",de],["class",me],["data",ye],["ref",kt],["style",ge]]),Dt=(e,t,r)=>{var o;switch(t[0]){case".":return xe;case"?":return Ce;case"@":return he;default:return r||"ownerSVGElement"in e?t==="ref"?kt:ct:Y.get(t)||(t in e?t.startsWith("on")?q:(o=wt(e,t))!=null&&o.set?at:ct:ct)}},$t=(e,t)=>(e.textContent=t==null?"":t,t);var F=(e,t,r)=>({a:e,b:t,c:r}),It=(e,t)=>({b:e,c:t}),Kt=(e,t,r,o)=>({v:S,u:e,t,n:r,c:o}),v=()=>F(null,null,S);var ut=e=>(t,r)=>{let{a:o,b:n,c:i}=e(t,r),p=document.importNode(o,!0),s=S;if(n!==S){s=[];for(let c,u,f=0;f<n.length;f++){let{a:l,b:h,c:x}=n[f],w=l===u?c:c=Gt(p,u=l);s[f]=Kt(h,w,x,h===G?[]:h===E?v():null)}}return It(i?p.firstChild:new J(p),s)};var Vt=/^(?:plaintext|script|style|textarea|title|xmp)$/i,_t=/^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;var Se=/<([a-zA-Z0-9]+[a-zA-Z0-9:._-]*)([^>]*?)(\/?)>/g,ve=/([^\s\\>"'=]+)\s*=\s*(['"]?)\x01/g,Te=/[\x01\x02]/g,jt=(e,t,r)=>{let o=0;return e.join("").trim().replace(Se,(n,i,p,s)=>`<${i}${p.replace(ve,"=$2$1").trimEnd()}${s?r||_t.test(i)?" /":`></${i}`:""}>`).replace(Te,n=>n===""?`<!--${t+o++}-->`:t+o++)};var Q=document.createElement("template"),ft,lt,Lt=(e,t)=>{if(t)return ft||(ft=document.createElementNS(Et,"svg"),lt=H(),lt.selectNodeContents(ft)),lt.createContextualFragment(e);Q.innerHTML=e;let{content:r}=Q;return Q=Q.cloneNode(!1),r};var dt=e=>{let t=[],r;for(;r=e.parentNode;)t.push(t.indexOf.call(r.childNodes,e)),e=r;return t},Wt=()=>document.createTextNode(""),Ae=(e,t,r)=>{let o=Lt(jt(e,K,r),r),{length:n}=e,i=S;if(n>1){let c=[],u=document.createTreeWalker(o,129),f=0,l=`${K}${f++}`;for(i=[];f<n;){let h=u.nextNode();if(h.nodeType===8){if(h.data===l){let x=U(t[f-1])?G:E;x===E&&c.push(h),i.push(F(dt(h),x,null)),l=`${K}${f++}`}}else{let x;for(;h.hasAttribute(l);){x||(x=dt(h));let w=h.getAttribute(l);i.push(F(x,Dt(h,w,r),w)),I(h,l),l=`${K}${f++}`}!r&&Vt.test(h.localName)&&h.textContent.trim()===`<!--${l}-->`&&(i.push(F(x||dt(h),$t,null)),l=`${K}${f++}`)}}for(f=0;f<c.length;f++)c[f].replaceWith(Wt())}let{childNodes:p}=o,{length:s}=p;return s<1?(s=1,o.appendChild(Wt())):s===1&&n!==1&&p[0].nodeType!==1&&(s=0),P(Bt,e,F(o,i,s===1))},Bt=new WeakMap,K="is\xB5",ht=e=>(t,r)=>Bt.get(t)||Ae(t,r,e);var Re=ut(ht(!1)),Ee=ut(ht(!0)),mt=(e,{s:t,t:r,v:o})=>{if(e.a!==r){let{b:n,c:i}=(t?Ee:Re)(r,o);e.a=r,e.b=n,e.c=i}for(let{c:n}=e,i=0;i<n.length;i++){let p=o[i],s=n[i];switch(s.u){case G:s.v=G(s.t,we(s.c,p),s.v);break;case E:let c=p instanceof T?mt(s.c||(s.c=v()),p):(s.c=null,p);c!==s.v&&(s.v=E(s,c));break;default:p!==s.v&&(s.v=s.u(s.t,p,s.n,s.v));break}}return e.b},we=(e,t)=>{let r=0,{length:o}=t;for(o<e.length&&e.splice(o);r<o;r++){let n=t[r];n instanceof T?t[r]=mt(e[r]||(e[r]=v()),n):e[r]=null}return t},T=class{constructor(t,r,o){this.s=t,this.t=r,this.v=o}toDOM(t=v()){return mt(t,this)}};var Ut=e=>(t,...r)=>new T(e,t,r),yt=Ut(!1),Ht=Ut(!0);var zt=new WeakMap,tt=(e,t,r)=>{let o=zt.get(e)||P(zt,e,v()),{b:n}=o,i=r&&typeof t=="function"?t():t,p=i instanceof T?i.toDOM(o):i;return n!==p&&e.replaceChildren((o.b=p).valueOf()),e};var Jt=new WeakMap,Xt=e=>(t,r)=>{function o(i,...p){return new T(e,i,p).toDOM(this)}let n=Jt.get(t)||P(Jt,t,new Map);return n.get(r)||P(n,r,o.bind(v()))},Zt=Xt(!1),Ge=Xt(!0);var Yt=new FinalizationRegistry(([e,t,r])=>{r&&console.debug(`%c${String(t)}`,"font-weight:bold","collected"),e(t)}),qt=Object.create(null),Qt=(e,t,{debug:r,handler:o,return:n,token:i=e}=qt)=>{let p=n||new Proxy(e,o||qt),s=[p,[t,e,!!r]];return i!==!1&&s.push(i),Yt.register(...s),p},te=e=>Yt.unregister(e);var xt=new WeakMap,Ne=e=>e(),et=!0,gt=e=>(t,r)=>{if(et=typeof r!="function",ee(t),et)return tt(t,r,!1);et=!0;let o=new WeakRef(t),n=e(()=>{tt(o.deref(),r(),!1)});return xt.set(t,n),Qt(n,Ne,{return:t})},ee=e=>{let t=xt.get(e);t&&(et&&xt.delete(e),te(t),t())};var Oe=Symbol.for("preact-signals");function St(){if(M>1)M--;else{for(var e,t=!1;V!==void 0;){var r=V;for(V=void 0,Ct++;r!==void 0;){var o=r.o;if(r.o=void 0,r.f&=-3,!(8&r.f)&&oe(r))try{r.c()}catch(n){t||(e=n,t=!0)}r=o}}if(Ct=0,M--,t)throw e}}var d=void 0;var V=void 0,M=0,Ct=0,rt=0;function re(e){if(d!==void 0){var t=e.n;if(t===void 0||t.t!==d)return t={i:0,S:e,p:d.s,n:void 0,t:d,e:void 0,x:void 0,r:t},d.s!==void 0&&(d.s.n=t),d.s=t,e.n=t,32&d.f&&e.S(t),t;if(t.i===-1)return t.i=0,t.n!==void 0&&(t.n.p=t.p,t.p!==void 0&&(t.p.n=t.n),t.p=d.s,t.n=void 0,d.s.n=t,d.s=t),t}}function y(e){this.v=e,this.i=0,this.n=void 0,this.t=void 0}y.prototype.brand=Oe;y.prototype.h=function(){return!0};y.prototype.S=function(e){this.t!==e&&e.e===void 0&&(e.x=this.t,this.t!==void 0&&(this.t.e=e),this.t=e)};y.prototype.U=function(e){if(this.t!==void 0){var t=e.e,r=e.x;t!==void 0&&(t.x=r,e.e=void 0),r!==void 0&&(r.e=t,e.x=void 0),e===this.t&&(this.t=r)}};y.prototype.subscribe=function(e){var t=this;return j(function(){var r=t.value,o=d;d=void 0;try{e(r)}finally{d=o}})};y.prototype.valueOf=function(){return this.value};y.prototype.toString=function(){return this.value+""};y.prototype.toJSON=function(){return this.value};y.prototype.peek=function(){var e=d;d=void 0;try{return this.value}finally{d=e}};Object.defineProperty(y.prototype,"value",{get:function(){var e=re(this);return e!==void 0&&(e.i=this.i),this.v},set:function(e){if(e!==this.v){if(Ct>100)throw new Error("Cycle detected");this.v=e,this.i++,rt++,M++;try{for(var t=this.t;t!==void 0;t=t.x)t.t.N()}finally{St()}}}});function ot(e){return new y(e)}function oe(e){for(var t=e.s;t!==void 0;t=t.n)if(t.S.i!==t.i||!t.S.h()||t.S.i!==t.i)return!0;return!1}function ne(e){for(var t=e.s;t!==void 0;t=t.n){var r=t.S.n;if(r!==void 0&&(t.r=r),t.S.n=t,t.i=-1,t.n===void 0){e.s=t;break}}}function se(e){for(var t=e.s,r=void 0;t!==void 0;){var o=t.p;t.i===-1?(t.S.U(t),o!==void 0&&(o.n=t.n),t.n!==void 0&&(t.n.p=o)):r=t,t.S.n=t.r,t.r!==void 0&&(t.r=void 0),t=o}e.s=r}function k(e){y.call(this,void 0),this.x=e,this.s=void 0,this.g=rt-1,this.f=4}(k.prototype=new y).h=function(){if(this.f&=-3,1&this.f)return!1;if((36&this.f)==32||(this.f&=-5,this.g===rt))return!0;if(this.g=rt,this.f|=1,this.i>0&&!oe(this))return this.f&=-2,!0;var e=d;try{ne(this),d=this;var t=this.x();(16&this.f||this.v!==t||this.i===0)&&(this.v=t,this.f&=-17,this.i++)}catch(r){this.v=r,this.f|=16,this.i++}return d=e,se(this),this.f&=-2,!0};k.prototype.S=function(e){if(this.t===void 0){this.f|=36;for(var t=this.s;t!==void 0;t=t.n)t.S.S(t)}y.prototype.S.call(this,e)};k.prototype.U=function(e){if(this.t!==void 0&&(y.prototype.U.call(this,e),this.t===void 0)){this.f&=-33;for(var t=this.s;t!==void 0;t=t.n)t.S.U(t)}};k.prototype.N=function(){if(!(2&this.f)){this.f|=6;for(var e=this.t;e!==void 0;e=e.x)e.t.N()}};Object.defineProperty(k.prototype,"value",{get:function(){if(1&this.f)throw new Error("Cycle detected");var e=re(this);if(this.h(),e!==void 0&&(e.i=this.i),16&this.f)throw this.v;return this.v}});function A(e){return new k(e)}function ie(e){var t=e.u;if(e.u=void 0,typeof t=="function"){M++;var r=d;d=void 0;try{t()}catch(o){throw e.f&=-2,e.f|=8,vt(e),o}finally{d=r,St()}}}function vt(e){for(var t=e.s;t!==void 0;t=t.n)t.S.U(t);e.x=void 0,e.s=void 0,ie(e)}function Fe(e){if(d!==this)throw new Error("Out-of-order effect");se(this),d=e,this.f&=-2,8&this.f&&vt(this),St()}function _(e){this.x=e,this.u=void 0,this.s=void 0,this.o=void 0,this.f=32}_.prototype.c=function(){var e=this.S();try{if(8&this.f||this.x===void 0)return;var t=this.x();typeof t=="function"&&(this.u=t)}finally{e()}};_.prototype.S=function(){if(1&this.f)throw new Error("Cycle detected");this.f|=1,this.f&=-9,ie(this),ne(this),M++;var e=d;return d=this,Fe.bind(this,e)};_.prototype.N=function(){2&this.f||(this.f|=2,this.o=V,V=this)};_.prototype.d=function(){this.f|=8,1&this.f||vt(this)};function j(e){var t=new _(e);try{t.c()}catch(r){throw t.d(),r}return t.d.bind(t)}var Tt=class extends y{emit(t){if(typeof t=="object"&&t!==null&&typeof this.value=="object"){let r=Pt(this.value);this.value={...r,...t}}else this.value=t}};function nt(e){let t=ot(e);return Object.setPrototypeOf(t,Tt.prototype),t}function Pt(e){if(e===null||typeof e!="object")return e;if(Array.isArray(e))return e.map(Pt);let t={};for(let r of Reflect.ownKeys(e))t[r]=Pt(e[r]);return t}function no(e){return(...t)=>A(()=>e(...t)).value}function so(e){let t=new Map,r=new Map;return Object.entries(e()).reduce((n,[i,p])=>p.length===0?(t.has(i)||t.set(i,A(()=>p())),{...n,[i]:()=>t.get(i).value}):{...n,[i]:(...s)=>{let c=JSON.stringify(s),u=r.get(i);if(u||(u=new Map,r.set(i,u)),!u.has(c)){let f=A(()=>p(...s));u.set(c,f)}return u.get(c).value}},{})}var st={};function Me(e){let{state:t,getters:r,computed:o,actions:n}=e,i=nt(t),p=r?Object.entries(r({state:i})).reduce((u,[f,l])=>({...u,[f]:l()}),{}):{},s=o?Object.entries(o({state:i})).reduce((u,[f,l])=>({...u,[f]:A(()=>l())}),{}):{},c=n?n({state:i,computed:s}):{};return{state:i,getters:p,computed:s,actions:c}}function ke(e,t){if(st[e])throw new Error(`Store "${e}" already exists`);st[e]=t}function De(e){let t=st[e];if(!t)throw new Error(`Store "${e}" not found`);return t}function uo(e){let{key:t,state:r,...o}=e,n=Me({state:r,...o});return D.register(t,n),n}var D={list:st,$:De,register:ke};function To(e){let{tagName:t,props:r={},state:o,getters:n=()=>({}),computed:i=()=>({}),actions:p=()=>({}),connected:s,disconnected:c,render:u,listen:f}=e,l=gt(j);class h extends HTMLElement{constructor(){super();this.slots={};this.cleanup=[];this.props=ot({}),this.props.value=this.initializeProps(),this.state=nt(o),this.getters=this.setupGetters(),this.computed=this.setupComputed(),this.actions=this.setupActions()}static get observedAttributes(){return Object.keys(r).map(a=>`data-${a}`)}$(a){return this[a]}emitEvent(a,m={}){this.dispatchEvent(new CustomEvent(a,{detail:m}))}setupGetters(){let a=n({props:this.getPropValue(),state:this.state,store:D,el:this,slots:this.slots});return Object.entries(a).reduce((m,[g,C])=>({...m,[g]:C()}),{})}setupComputed(){let a=i({props:this.getPropValue(),state:this.state,store:D,el:this,slots:this.slots});return Object.entries(a).reduce((m,[g,C])=>({...m,[g]:A(()=>C())}),{})}setupActions(){return p({props:this.getPropValue(),state:this.state,computed:this.computed,store:D,el:this,slots:this.slots})}get context(){return{props:this.getPropValue(),state:this.state,getters:this.getters,computed:this.computed,actions:this.actions,el:this,slots:this.slots,store:D}}initializeProps(){var m;let a={};for(let[g,C]of Object.entries(r)){let L=`data-${g}`,W=this.getAttribute(L),pe=(m=C.default)!=null?m:this.getDefaultForType(C.type);a[g]=W!==null?this.parseAttributeValue(W,C.type):pe}return a}getDefaultForType(a){switch(a){case String:return"";case Number:return 0;case Boolean:return!1;case Object:return{};case Array:return[];default:return null}}parseAttributeValue(a,m){switch(m){case Number:return Number(a);case Boolean:return a!==null&&a!=="false";case Object:case Array:try{return JSON.parse(a)}catch{return m===Object?{}:[]}default:return a}}attributeChangedCallback(a,m,g){let C=a.replace(/^data-/,""),L=r[C];if(!L)return;let W=this.parseAttributeValue(g,L.type);this.updateProp(C,W)}updateProp(a,m){this.props.value={...this.props.peek(),[a]:m}}getPropValue(){return this.props.value}setupListener(){if(!f)return;let a=this.state.peek(),m=j(()=>{let g=this.state.value;f({...this.context,newValue:g,oldValue:a}),a=g});this.cleanup.push(m)}setupRender(){if(!u)return;let a=l(this,()=>u(this.context));this.cleanup.push(a)}collectSlots(){let a={default:[]};Array.from(this.childNodes).forEach(m=>{var g;if(m instanceof Element){let C=m.getAttribute("data-slot")||"default";a[C]=a[C]||[],a[C].push(m)}else(g=m.textContent)!=null&&g.trim()&&a.default.push(m)}),this.slots=a}connectedCallback(){this.collectSlots(),this.setupListener(),this.setupRender(),s==null||s(this.context)}disconnectedCallback(){this.cleanup.forEach(a=>a()),this.cleanup=[],c==null||c(this.context)}}t&&customElements.define(t,h)}export{Tt as State,no as compute,so as createComputed,nt as createState,Me as createStore,To as defineComponent,uo as defineStore,j as effect,yt as html,Zt as htmlFor,A as preactComputed,D as storeRegistry};
/*! Bundled license information:

uhtml/esm/index.js:
  (*! (c) Andrea Giammarchi - MIT *)

uhtml/esm/keyed.js:
  (*! (c) Andrea Giammarchi - MIT *)
*/
