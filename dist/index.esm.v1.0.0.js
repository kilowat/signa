var Et=e=>{throw TypeError(e)};var Rt=(e,t,r)=>t.has(e)||Et("Cannot "+r);var A=(e,t,r)=>(Rt(e,t,"read from private field"),r?r.call(e):t.get(e)),J=(e,t,r)=>t.has(e)?Et("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r),pt=(e,t,r,o)=>(Rt(e,t,"write to private field"),o?o.call(e,r):t.set(e,r),r);var wt=(e,t,r,o,n)=>{let i=r.length,c=t.length,s=i,a=0,u=0,p=null;for(;a<c||u<s;)if(c===a){let f=s<i?u?o(r[u-1],-0).nextSibling:o(r[s],0):n;for(;u<s;)e.insertBefore(o(r[u++],1),f)}else if(s===u)for(;a<c;)(!p||!p.has(t[a]))&&e.removeChild(o(t[a],-1)),a++;else if(t[a]===r[u])a++,u++;else if(t[c-1]===r[s-1])c--,s--;else if(t[a]===r[s-1]&&r[u]===t[c-1]){let f=o(t[--c],-0).nextSibling;e.insertBefore(o(r[u++],1),o(t[a++],-0).nextSibling),e.insertBefore(o(r[--s],1),f),t[c]=r[s]}else{if(!p){p=new Map;let f=u;for(;f<s;)p.set(r[f],f++)}if(p.has(t[a])){let f=p.get(t[a]);if(u<f&&f<s){let d=a,g=1;for(;++d<c&&d<s&&p.get(t[d])===f+g;)g++;if(g>f-u){let k=o(t[a],0);for(;u<f;)e.insertBefore(o(r[u++],1),k)}else e.replaceChild(o(r[u++],1),o(t[a++],-1))}else a++}else e.removeChild(o(t[a++],-1))}return r};var{isArray:q}=Array,{getPrototypeOf:le,getOwnPropertyDescriptor:fe}=Object;var Nt="http://www.w3.org/2000/svg",S=[],X=()=>document.createRange(),P=(e,t,r)=>(e.set(t,r),r),Ot=(e,t)=>{let r;do r=fe(e,t);while(!r&&(e=le(e)));return r},kt=(e,t)=>t.reduceRight(de,e),de=(e,t)=>e.childNodes[t];var{setPrototypeOf:me}=Object,Gt=e=>{function t(r){return me(r,new.target.prototype)}return t.prototype=e.prototype,t};var D,Z=(e,t,r)=>(D||(D=X()),r?D.setStartAfter(e):D.setStartBefore(e),D.setEndAfter(t),D.deleteContents(),e);var ut=({firstChild:e,lastChild:t},r)=>Z(e,t,r),$t=!1,Q=(e,t)=>$t&&e.nodeType===11?1/t<0?t?ut(e,!0):e.lastChild:t?e.valueOf():e.firstChild:e,Ft=e=>document.createComment(e),M,B,R,Y=class extends Gt(DocumentFragment){constructor(r){super(r);J(this,M,Ft("<>"));J(this,B,Ft("</>"));J(this,R,S);this.replaceChildren(A(this,M),...r.childNodes,A(this,B)),$t=!0}get firstChild(){return A(this,M)}get lastChild(){return A(this,B)}get parentNode(){return A(this,M).parentNode}remove(){ut(this,!1)}replaceWith(r){ut(this,!0).replaceWith(r)}valueOf(){let{parentNode:r}=this;if(r===this)A(this,R)===S&&pt(this,R,[...this.childNodes]);else{if(r){let{firstChild:o,lastChild:n}=this;for(pt(this,R,[o]);o!==n;)A(this,R).push(o=o.nextSibling)}this.replaceChildren(...A(this,R))}return this}};M=new WeakMap,B=new WeakMap,R=new WeakMap;var Dt=(e,t,r)=>e.setAttribute(t,r),L=(e,t)=>e.removeAttribute(t),ye=(e,t)=>{for(let r in t){let o=t[r],n=r==="role"?r:`aria-${r}`;o==null?L(e,n):Dt(e,n,o)}return t},tt,ge=(e,t,r)=>{r=r.slice(1),tt||(tt=new WeakMap);let o=tt.get(e)||P(tt,e,{}),n=o[r];return n&&n[0]&&e.removeEventListener(r,...n),n=q(t)?t:[t,!1],o[r]=n,n[0]&&e.addEventListener(r,...n),t};var w=(e,t)=>{let{t:r,n:o}=e,n=!1;switch(typeof t){case"object":if(t!==null){(o||r).replaceWith(e.n=t.valueOf());break}case"undefined":n=!0;default:r.data=n?"":t,o&&(e.n=null,o.replaceWith(r));break}return t},xe=(e,t)=>ft(e,t,t==null?"class":"className"),Ce=(e,t)=>{let{dataset:r}=e;for(let o in t)t[o]==null?delete r[o]:r[o]=t[o];return t},et=(e,t,r)=>e[r]=t,Se=(e,t,r)=>et(e,t,r.slice(1)),ft=(e,t,r)=>t==null?(L(e,r),t):et(e,t,r),Mt=(e,t)=>(typeof t=="function"?t(e):t.current=e,t),lt=(e,t,r)=>(t==null?L(e,r):Dt(e,r,t),t),ve=(e,t)=>t==null?ft(e,t,"style"):et(e.style,t,"cssText"),Te=(e,t,r)=>(e.toggleAttribute(r.slice(1),t),t),G=(e,t,r)=>{let{length:o}=t;if(e.data=`[${o}]`,o)return wt(e.parentNode,r,t,Q,e);switch(r.length){case 1:r[0].remove();case 0:break;default:Z(Q(r[0],0),Q(r.at(-1),-0),!1);break}return S},rt=new Map([["aria",ye],["class",xe],["data",Ce],["ref",Mt],["style",ve]]),jt=(e,t,r)=>{var o;switch(t[0]){case".":return Se;case"?":return Te;case"@":return ge;default:return r||"ownerSVGElement"in e?t==="ref"?Mt:lt:rt.get(t)||(t in e?t.startsWith("on")?et:(o=Ot(e,t))!=null&&o.set?ft:lt:lt)}},It=(e,t)=>(e.textContent=t==null?"":t,t);var j=(e,t,r)=>({a:e,b:t,c:r}),Kt=(e,t)=>({b:e,c:t}),Vt=(e,t,r,o)=>({v:S,u:e,t,n:r,c:o}),v=()=>j(null,null,S);var dt=e=>(t,r)=>{let{a:o,b:n,c:i}=e(t,r),c=document.importNode(o,!0),s=S;if(n!==S){s=[];for(let a,u,p=0;p<n.length;p++){let{a:f,b:d,c:g}=n[p],k=f===u?a:a=kt(c,u=f);s[p]=Vt(d,k,g,d===G?[]:d===w?v():null)}}return Kt(i?c.firstChild:new Y(c),s)};var _t=/^(?:plaintext|script|style|textarea|title|xmp)$/i,Bt=/^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;var be=/<([a-zA-Z0-9]+[a-zA-Z0-9:._-]*)([^>]*?)(\/?)>/g,Pe=/([^\s\\>"'=]+)\s*=\s*(['"]?)\x01/g,Ae=/[\x01\x02]/g,Lt=(e,t,r)=>{let o=0;return e.join("").trim().replace(be,(n,i,c,s)=>`<${i}${c.replace(Pe,"=$2$1").trimEnd()}${s?r||Bt.test(i)?" /":`></${i}`:""}>`).replace(Ae,n=>n===""?`<!--${t+o++}-->`:t+o++)};var ot=document.createElement("template"),mt,ht,Wt=(e,t)=>{if(t)return mt||(mt=document.createElementNS(Nt,"svg"),ht=X(),ht.selectNodeContents(mt)),ht.createContextualFragment(e);ot.innerHTML=e;let{content:r}=ot;return ot=ot.cloneNode(!1),r};var yt=e=>{let t=[],r;for(;r=e.parentNode;)t.push(t.indexOf.call(r.childNodes,e)),e=r;return t},zt=()=>document.createTextNode(""),we=(e,t,r)=>{let o=Wt(Lt(e,W,r),r),{length:n}=e,i=S;if(n>1){let a=[],u=document.createTreeWalker(o,129),p=0,f=`${W}${p++}`;for(i=[];p<n;){let d=u.nextNode();if(d.nodeType===8){if(d.data===f){let g=q(t[p-1])?G:w;g===w&&a.push(d),i.push(j(yt(d),g,null)),f=`${W}${p++}`}}else{let g;for(;d.hasAttribute(f);){g||(g=yt(d));let k=d.getAttribute(f);i.push(j(g,jt(d,k,r),k)),L(d,f),f=`${W}${p++}`}!r&&_t.test(d.localName)&&d.textContent.trim()===`<!--${f}-->`&&(i.push(j(g||yt(d),It,null)),f=`${W}${p++}`)}}for(p=0;p<a.length;p++)a[p].replaceWith(zt())}let{childNodes:c}=o,{length:s}=c;return s<1?(s=1,o.appendChild(zt())):s===1&&n!==1&&c[0].nodeType!==1&&(s=0),P(Ut,e,j(o,i,s===1))},Ut=new WeakMap,W="is\xB5",gt=e=>(t,r)=>Ut.get(t)||we(t,r,e);var Ne=dt(gt(!1)),Oe=dt(gt(!0)),xt=(e,{s:t,t:r,v:o})=>{if(e.a!==r){let{b:n,c:i}=(t?Oe:Ne)(r,o);e.a=r,e.b=n,e.c=i}for(let{c:n}=e,i=0;i<n.length;i++){let c=o[i],s=n[i];switch(s.u){case G:s.v=G(s.t,ke(s.c,c),s.v);break;case w:let a=c instanceof T?xt(s.c||(s.c=v()),c):(s.c=null,c);a!==s.v&&(s.v=w(s,a));break;default:c!==s.v&&(s.v=s.u(s.t,c,s.n,s.v));break}}return e.b},ke=(e,t)=>{let r=0,{length:o}=t;for(o<e.length&&e.splice(o);r<o;r++){let n=t[r];n instanceof T?t[r]=xt(e[r]||(e[r]=v()),n):e[r]=null}return t},T=class{constructor(t,r,o){this.s=t,this.t=r,this.v=o}toDOM(t=v()){return xt(t,this)}};var Ht=e=>(t,...r)=>new T(e,t,r),b=Ht(!1),Jt=Ht(!0);var qt=new WeakMap,nt=(e,t,r)=>{let o=qt.get(e)||P(qt,e,v()),{b:n}=o,i=r&&typeof t=="function"?t():t,c=i instanceof T?i.toDOM(o):i;return n!==c&&e.replaceChildren((o.b=c).valueOf()),e};var Xt=new WeakMap,Zt=e=>(t,r)=>{function o(i,...c){return new T(e,i,c).toDOM(this)}let n=Xt.get(t)||P(Xt,t,new Map);return n.get(r)||P(n,r,o.bind(v()))},Yt=Zt(!1),Ge=Zt(!0);var te=new FinalizationRegistry(([e,t,r])=>{r&&console.debug(`%c${String(t)}`,"font-weight:bold","collected"),e(t)}),Qt=Object.create(null),ee=(e,t,{debug:r,handler:o,return:n,token:i=e}=Qt)=>{let c=n||new Proxy(e,o||Qt),s=[c,[t,e,!!r]];return i!==!1&&s.push(i),te.register(...s),c},re=e=>te.unregister(e);var Ct=new WeakMap,Fe=e=>e(),st=!0,St=e=>(t,r)=>{if(st=typeof r!="function",oe(t),st)return nt(t,r,!1);st=!0;let o=new WeakRef(t),n=e(()=>{nt(o.deref(),r(),!1)});return Ct.set(t,n),ee(n,Fe,{return:t})},oe=e=>{let t=Ct.get(e);t&&(st&&Ct.delete(e),re(t),t())};var $e=Symbol.for("preact-signals");function Tt(){if(I>1)I--;else{for(var e,t=!1;z!==void 0;){var r=z;for(z=void 0,vt++;r!==void 0;){var o=r.o;if(r.o=void 0,r.f&=-3,!(8&r.f)&&se(r))try{r.c()}catch(n){t||(e=n,t=!0)}r=o}}if(vt=0,I--,t)throw e}}var m=void 0;var z=void 0,I=0,vt=0,it=0;function ne(e){if(m!==void 0){var t=e.n;if(t===void 0||t.t!==m)return t={i:0,S:e,p:m.s,n:void 0,t:m,e:void 0,x:void 0,r:t},m.s!==void 0&&(m.s.n=t),m.s=t,e.n=t,32&m.f&&e.S(t),t;if(t.i===-1)return t.i=0,t.n!==void 0&&(t.n.p=t.p,t.p!==void 0&&(t.p.n=t.n),t.p=m.s,t.n=void 0,m.s.n=t,m.s=t),t}}function y(e){this.v=e,this.i=0,this.n=void 0,this.t=void 0}y.prototype.brand=$e;y.prototype.h=function(){return!0};y.prototype.S=function(e){this.t!==e&&e.e===void 0&&(e.x=this.t,this.t!==void 0&&(this.t.e=e),this.t=e)};y.prototype.U=function(e){if(this.t!==void 0){var t=e.e,r=e.x;t!==void 0&&(t.x=r,e.e=void 0),r!==void 0&&(r.e=t,e.x=void 0),e===this.t&&(this.t=r)}};y.prototype.subscribe=function(e){var t=this;return H(function(){var r=t.value,o=m;m=void 0;try{e(r)}finally{m=o}})};y.prototype.valueOf=function(){return this.value};y.prototype.toString=function(){return this.value+""};y.prototype.toJSON=function(){return this.value};y.prototype.peek=function(){var e=m;m=void 0;try{return this.value}finally{m=e}};Object.defineProperty(y.prototype,"value",{get:function(){var e=ne(this);return e!==void 0&&(e.i=this.i),this.v},set:function(e){if(e!==this.v){if(vt>100)throw new Error("Cycle detected");this.v=e,this.i++,it++,I++;try{for(var t=this.t;t!==void 0;t=t.x)t.t.N()}finally{Tt()}}}});function ct(e){return new y(e)}function se(e){for(var t=e.s;t!==void 0;t=t.n)if(t.S.i!==t.i||!t.S.h()||t.S.i!==t.i)return!0;return!1}function ie(e){for(var t=e.s;t!==void 0;t=t.n){var r=t.S.n;if(r!==void 0&&(t.r=r),t.S.n=t,t.i=-1,t.n===void 0){e.s=t;break}}}function ce(e){for(var t=e.s,r=void 0;t!==void 0;){var o=t.p;t.i===-1?(t.S.U(t),o!==void 0&&(o.n=t.n),t.n!==void 0&&(t.n.p=o)):r=t,t.S.n=t.r,t.r!==void 0&&(t.r=void 0),t=o}e.s=r}function K(e){y.call(this,void 0),this.x=e,this.s=void 0,this.g=it-1,this.f=4}(K.prototype=new y).h=function(){if(this.f&=-3,1&this.f)return!1;if((36&this.f)==32||(this.f&=-5,this.g===it))return!0;if(this.g=it,this.f|=1,this.i>0&&!se(this))return this.f&=-2,!0;var e=m;try{ie(this),m=this;var t=this.x();(16&this.f||this.v!==t||this.i===0)&&(this.v=t,this.f&=-17,this.i++)}catch(r){this.v=r,this.f|=16,this.i++}return m=e,ce(this),this.f&=-2,!0};K.prototype.S=function(e){if(this.t===void 0){this.f|=36;for(var t=this.s;t!==void 0;t=t.n)t.S.S(t)}y.prototype.S.call(this,e)};K.prototype.U=function(e){if(this.t!==void 0&&(y.prototype.U.call(this,e),this.t===void 0)){this.f&=-33;for(var t=this.s;t!==void 0;t=t.n)t.S.U(t)}};K.prototype.N=function(){if(!(2&this.f)){this.f|=6;for(var e=this.t;e!==void 0;e=e.x)e.t.N()}};Object.defineProperty(K.prototype,"value",{get:function(){if(1&this.f)throw new Error("Cycle detected");var e=ne(this);if(this.h(),e!==void 0&&(e.i=this.i),16&this.f)throw this.v;return this.v}});function N(e){return new K(e)}function ae(e){var t=e.u;if(e.u=void 0,typeof t=="function"){I++;var r=m;m=void 0;try{t()}catch(o){throw e.f&=-2,e.f|=8,bt(e),o}finally{m=r,Tt()}}}function bt(e){for(var t=e.s;t!==void 0;t=t.n)t.S.U(t);e.x=void 0,e.s=void 0,ae(e)}function De(e){if(m!==this)throw new Error("Out-of-order effect");ce(this),m=e,this.f&=-2,8&this.f&&bt(this),Tt()}function U(e){this.x=e,this.u=void 0,this.s=void 0,this.o=void 0,this.f=32}U.prototype.c=function(){var e=this.S();try{if(8&this.f||this.x===void 0)return;var t=this.x();typeof t=="function"&&(this.u=t)}finally{e()}};U.prototype.S=function(){if(1&this.f)throw new Error("Cycle detected");this.f|=1,this.f&=-9,ae(this),ie(this),I++;var e=m;return m=this,De.bind(this,e)};U.prototype.N=function(){2&this.f||(this.f|=2,this.o=z,z=this)};U.prototype.d=function(){this.f|=8,1&this.f||bt(this)};function H(e){var t=new U(e);try{t.c()}catch(r){throw t.d(),r}return t.d.bind(t)}var Pt=class extends y{emit(t){if(typeof t=="object"&&t!==null&&typeof this.value=="object"){let r=At(this.value);this.value={...r,...t}}else this.value=t}};function V(e){let t=ct(e);return Object.setPrototypeOf(t,Pt.prototype),t}function At(e){if(e===null||typeof e!="object")return e;if(Array.isArray(e))return e.map(At);let t={};for(let r of Reflect.ownKeys(e))t[r]=At(e[r]);return t}function uo(e){return(...t)=>N(()=>e(...t)).value}function lo(e){let t=new Map,r=new Map;return Object.entries(e()).reduce((n,[i,c])=>c.length===0?(t.has(i)||t.set(i,N(()=>c())),{...n,[i]:()=>t.get(i).value}):{...n,[i]:(...s)=>{let a=JSON.stringify(s),u=r.get(i);if(u||(u=new Map,r.set(i,u)),!u.has(a)){let p=N(()=>c(...s));u.set(a,p)}return u.get(a).value}},{})}var E=class{static createCacheKey(t){return t.map(r=>{if(r===null)return"null";if(r===void 0)return"undefined";if(typeof r=="object"){let o=r;return"id"in o?String(o.id):"key"in o?String(o.key):JSON.stringify(this.sortObjectKeys(o))}return String(r)}).join("|")}static sortObjectKeys(t){return Array.isArray(t)?t.map(r=>typeof r=="object"&&r!==null?this.sortObjectKeys(r):r):Object.keys(t).sort().reduce((r,o)=>{let n=t[o];return r[o]=typeof n=="object"&&n!==null?this.sortObjectKeys(n):n,r},{})}static argsEqual(t,r){return t.length!==r.length?!1:t.every((o,n)=>Object.is(o,r[n])?!0:typeof o=="object"&&o&&typeof r[n]=="object"&&r[n]?JSON.stringify(this.sortObjectKeys(o))===JSON.stringify(this.sortObjectKeys(r[n])):!1)}static createComputed(t,r={}){var c,s;let o=new Map,n=(c=r.maxAge)!=null?c:this.cacheTimeout,i=(s=r.cacheSize)!=null?s:this.maxCacheSize;return(...a)=>{if(a.length===0){if(!o.has("_")){let g=N(()=>t(...a));o.set("_",{signal:g,args:[],lastAccessed:Date.now()})}let d=o.get("_");return d.lastAccessed=Date.now(),d.signal.value}let u=this.createCacheKey(a),p=o.get(u);if(p&&this.argsEqual(p.args,a)){let d=Date.now();if(d-p.lastAccessed<=n)return p.lastAccessed=d,p.signal.value}o.size>=i*this.cleanupThreshold&&this.cleanup(o,n);let f=N(()=>t(...a));return o.set(u,{signal:f,args:[...a],lastAccessed:Date.now()}),f.value}}static cleanup(t,r){let o=Date.now();for(let[n,i]of t.entries())o-i.lastAccessed>r&&t.delete(n)}};E.maxCacheSize=1e3,E.cleanupThreshold=.8,E.cacheTimeout=5*60*1e3;var at={};function Me(e){let{state:t,getters:r,computed:o,actions:n}=e,i=V(t),c=r?Object.entries(r({state:i})).reduce((u,[p,f])=>({...u,[p]:f()}),{}):{},s=o?Object.entries(o({state:i})).reduce((u,[p,f])=>{let d=E.createComputed(()=>f(),{maxAge:9e5,cacheSize:500});return{...u,[p]:{get value(){return d()}}}},{}):{},a=n?n({state:i,computed:s}):{};return{state:i,getters:c,computed:s,actions:a}}function je(e,t){if(at[e])throw new Error(`Store "${e}" already exists`);at[e]=t}function Ie(e){let t=at[e];if(!t)throw new Error(`Store "${e}" not found`);return t}function pe(e){let{key:t,state:r,...o}=e,n=Me({state:r,...o});return _.register(t,n),n}var _={list:at,$:Ie,register:je};function O(e){let{tagName:t,props:r={},state:o,getters:n=()=>({}),computed:i=()=>({}),actions:c=()=>({}),connected:s,disconnected:a,render:u,listen:p}=e,f=St(H);class d extends HTMLElement{constructor(){super();this.slots={};this.cleanup=[];this.props=ct({}),this.props.value=this.initializeProps(),this.state=V(o),this.getters=this.setupGetters(),this.computed=this.setupComputed(),this.actions=this.setupActions()}static get observedAttributes(){return Object.keys(r).map(l=>`data-${l}`)}$(l){return this[l]}emitEvent(l,h={}){this.dispatchEvent(new CustomEvent(l,{detail:h}))}setupGetters(){let l=n({props:this.getPropValue(),state:this.state,store:_,el:this,slots:this.slots});return Object.entries(l).reduce((h,[x,C])=>({...h,[x]:C()}),{})}setupComputed(){let l={props:this.getPropValue(),state:this.state,store:_,el:this,slots:this.slots},h=i(l),x={};for(let[C,F]of Object.entries(h)){let $=E.createComputed(()=>F(),{maxAge:3e5,cacheSize:100});Object.defineProperty(x,C,{get:()=>$(),enumerable:!0})}return x}setupActions(){return c({props:this.getPropValue(),state:this.state,computed:this.computed,store:_,el:this,slots:this.slots})}get context(){return{props:this.getPropValue(),state:this.state,getters:this.getters,computed:this.computed,actions:this.actions,el:this,slots:this.slots,store:_}}initializeProps(){var h;let l={};for(let[x,C]of Object.entries(r)){let F=`data-${x}`,$=this.getAttribute(F),ue=(h=C.default)!=null?h:this.getDefaultForType(C.type);l[x]=$!==null?this.parseAttributeValue($,C.type):ue}return l}getDefaultForType(l){switch(l){case String:return"";case Number:return 0;case Boolean:return!1;case Object:return{};case Array:return[];default:return null}}parseAttributeValue(l,h){switch(h){case Number:return Number(l);case Boolean:return l!==null&&l!=="false";case Object:case Array:try{return JSON.parse(l)}catch{return h===Object?{}:[]}default:return l}}attributeChangedCallback(l,h,x){let C=l.replace(/^data-/,""),F=r[C];if(!F)return;let $=this.parseAttributeValue(x,F.type);this.updateProp(C,$)}updateProp(l,h){this.props.value={...this.props.peek(),[l]:h}}getPropValue(){return this.props.value}setupListener(){if(!p)return;let l=this.state.peek(),h=H(()=>{let x=this.state.value;p({...this.context,newValue:x,oldValue:l}),l=x});this.cleanup.push(h)}setupRender(){if(!u)return;let l=f(this,()=>u(this.context));this.cleanup.push(l)}collectSlots(){let l={default:[]};Array.from(this.childNodes).forEach(h=>{var x;if(h instanceof Element){let C=h.getAttribute("data-slot")||"default";l[C]=l[C]||[],l[C].push(h)}else(x=h.textContent)!=null&&x.trim()&&l.default.push(h)}),this.slots=l}connectedCallback(){requestAnimationFrame(()=>{this.collectSlots(),this.setupListener(),this.setupRender(),s==null||s(this.context)})}disconnectedCallback(){this.cleanup.forEach(l=>l()),this.cleanup=[],a==null||a(this.context)}}t&&customElements.define(t,d)}var _o=pe({key:"counter",state:{count:0},computed:()=>({double:()=>!0})});O({tagName:"my-counter",state:{count:0},props:{val:{type:Number,default:20}},listen(e){},connected(e){},disconnected(e){},getters:e=>({counterStore:()=>e.store.$("counter"),hi:()=>"hi"}),computed:({state:e,props:t})=>(console.log(t),{doubleCount:()=>e.value.count+t.val,isEven:()=>e.value.count%2===0}),actions:({state:e})=>({increment:t=>{e.emit({count:e.value.count+t})},reset:()=>{e.emit({count:0})}}),render:e=>{let{state:t,computed:r,actions:o,getters:{counterStore:n}}=e;return b`<div> <p>Count test: ${t.value.count}</p> <p>Double: ${r.doubleCount}</p> <p>Is Even: ${r.isEven}</p> <button onclick=${()=>o.increment(1)}>+1</button> <button onclick=${o.reset}>Reset</button> </div>`}});O({tagName:"my-counter-2",state:{count:0},props:{count:{type:Number,default:0}},getters:e=>({hi:()=>"hi",counterStore:()=>e.store.$("counter")}),computed:({state:e})=>({doubleCount:()=>e.value.count*2,isEven:()=>e.value.count%2===0}),actions:({state:e})=>({increment:t=>{e.emit({count:e.value.count+t})},reset:()=>{e.emit({count:0})}}),listen(e){},render:({props:e,state:t,computed:r,actions:o,getters:{counterStore:n,hi:i}})=>b`<div> counter 2 component props value ${e.count} <p>Count: ${t.value.count}</p> <p>Double: ${r.doubleCount}</p> <p>Is Even: ${r.isEven}</p> <button onclick=${()=>o.increment(1)}>+1</button> <button onclick=${o.reset}>Reset</button> <my-component data-count="${t.value.count}"></my-component> </div>`});O({tagName:"my-component",state:{count:0},props:{count:{type:Number,default:0}},getters:e=>({hi:()=>"hi",counterStore:()=>e.store.$("counter")}),computed:({state:e})=>({doubleCount:()=>e.value.count*2,isEven:()=>e.value.count%2===0}),actions:({state:e})=>({increment:t=>{e.emit({count:e.value.count+t})},reset:()=>{e.emit({count:0})}}),listen(e){},render:({props:e,state:t,computed:r,actions:o,getters:{counterStore:n}})=>b`<div> <div>props: ${e.count}</div> <p >Count: ${t.value.count}</p> <button onclick=${()=>o.increment(1)}>+1</button> <button onclick=${o.reset}>Reset</button> </div>`});var Ke={count:0},Ve=e=>({inc:()=>e.emit({count:e.value.count+1})});O({tagName:"parent-example-cmp-2",state:{example:0,...Ke},actions:({state:e})=>({...Ve(e),myinc:()=>{e.emit({example:e.value.example+1})}}),render(e){return b`${e.state.value.example}<example-cmp @button-click="${()=>console.log("button-click event")}"></example-cmp>`}});O({tagName:"example-cmp",render(e){return b`<button @click="${()=>e.el.emitEvent("button-click")}">Click</button>`}});var _e=V(0),Bo=_e.value+1;O({tagName:"example-cmp-2",render(e){return b`<button @click="${()=>e.el.emitEvent("button-click")}">Click</button>`}});var Lo=O({tagName:"signa-button",props:{variant:{type:String,default:"primary"}},render:({slots:e})=>(console.log(e.default),b`<button class="signa-button"> ${e.default} </button>`)});export{Lo as Button,Pt as State,uo as compute,lo as createComputed,V as createState,Me as createStore,O as defineComponent,pe as defineStore,H as effect,b as html,Yt as htmlFor,N as preactComputed,_ as storeRegistry};
/*! Bundled license information:

uhtml/esm/index.js:
  (*! (c) Andrea Giammarchi - MIT *)

uhtml/esm/keyed.js:
  (*! (c) Andrea Giammarchi - MIT *)
*/
