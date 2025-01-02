var Ct=e=>{throw TypeError(e)};var vt=(e,t,o)=>t.has(e)||Ct("Cannot "+o);var E=(e,t,o)=>(vt(e,t,"read from private field"),o?o.call(e):t.get(e)),K=(e,t,o)=>t.has(e)?Ct("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,o),ot=(e,t,o,r)=>(vt(e,t,"write to private field"),r?r.call(e,o):t.set(e,o),o);var gt=(e,t,o,r,n)=>{let i=o.length,c=t.length,s=i,a=0,l=0,u=null;for(;a<c||l<s;)if(c===a){let p=s<i?l?r(o[l-1],-0).nextSibling:r(o[s],0):n;for(;l<s;)e.insertBefore(r(o[l++],1),p)}else if(s===l)for(;a<c;)(!u||!u.has(t[a]))&&e.removeChild(r(t[a],-1)),a++;else if(t[a]===o[l])a++,l++;else if(t[c-1]===o[s-1])c--,s--;else if(t[a]===o[s-1]&&o[l]===t[c-1]){let p=r(t[--c],-0).nextSibling;e.insertBefore(r(o[l++],1),r(t[a++],-0).nextSibling),e.insertBefore(r(o[--s],1),p),t[c]=o[s]}else{if(!u){u=new Map;let p=l;for(;p<s;)u.set(o[p],p++)}if(u.has(t[a])){let p=u.get(t[a]);if(l<p&&p<s){let h=a,x=1;for(;++h<c&&h<s&&u.get(t[h])===p+x;)x++;if(x>p-l){let f=r(t[a],0);for(;l<p;)e.insertBefore(r(o[l++],1),f)}else e.replaceChild(r(o[l++],1),r(t[a++],-1))}else a++}else e.removeChild(r(t[a++],-1))}return o};var{isArray:j}=Array,{getPrototypeOf:ce,getOwnPropertyDescriptor:ae}=Object;var bt="http://www.w3.org/2000/svg",v=[],U=()=>document.createRange(),T=(e,t,o)=>(e.set(t,o),o),Tt=(e,t)=>{let o;do o=ae(e,t);while(!o&&(e=ce(e)));return o},Et=(e,t)=>t.reduceRight(pe,e),pe=(e,t)=>e.childNodes[t];var{setPrototypeOf:ue}=Object,At=e=>{function t(o){return ue(o,new.target.prototype)}return t.prototype=e.prototype,t};var F,H=(e,t,o)=>(F||(F=U()),o?F.setStartAfter(e):F.setStartBefore(e),F.setEndAfter(t),F.deleteContents(),e);var rt=({firstChild:e,lastChild:t},o)=>H(e,t,o),Gt=!1,I=(e,t)=>Gt&&e.nodeType===11?1/t<0?t?rt(e,!0):e.lastChild:t?e.valueOf():e.firstChild:e,Rt=e=>document.createComment(e),N,M,A,B=class extends At(DocumentFragment){constructor(o){super(o);K(this,N,Rt("<>"));K(this,M,Rt("</>"));K(this,A,v);this.replaceChildren(E(this,N),...o.childNodes,E(this,M)),Gt=!0}get firstChild(){return E(this,N)}get lastChild(){return E(this,M)}get parentNode(){return E(this,N).parentNode}remove(){rt(this,!1)}replaceWith(o){rt(this,!0).replaceWith(o)}valueOf(){let{parentNode:o}=this;if(o===this)E(this,A)===v&&ot(this,A,[...this.childNodes]);else{if(o){let{firstChild:r,lastChild:n}=this;for(ot(this,A,[r]);r!==n;)E(this,A).push(r=r.nextSibling)}this.replaceChildren(...E(this,A))}return this}};N=new WeakMap,M=new WeakMap,A=new WeakMap;var wt=(e,t,o)=>e.setAttribute(t,o),$=(e,t)=>e.removeAttribute(t),fe=(e,t)=>{for(let o in t){let r=t[o],n=o==="role"?o:`aria-${o}`;r==null?$(e,n):wt(e,n,r)}return t},z,de=(e,t,o)=>{o=o.slice(1),z||(z=new WeakMap);let r=z.get(e)||T(z,e,{}),n=r[o];return n&&n[0]&&e.removeEventListener(o,...n),n=j(t)?t:[t,!1],r[o]=n,n[0]&&e.addEventListener(o,...n),t};var R=(e,t)=>{let{t:o,n:r}=e,n=!1;switch(typeof t){case"object":if(t!==null){(r||o).replaceWith(e.n=t.valueOf());break}case"undefined":n=!0;default:o.data=n?"":t,r&&(e.n=null,r.replaceWith(o));break}return t},he=(e,t)=>st(e,t,t==null?"class":"className"),me=(e,t)=>{let{dataset:o}=e;for(let r in t)t[r]==null?delete o[r]:o[r]=t[r];return t},X=(e,t,o)=>e[o]=t,xe=(e,t,o)=>X(e,t,o.slice(1)),st=(e,t,o)=>t==null?($(e,o),t):X(e,t,o),Ft=(e,t)=>(typeof t=="function"?t(e):t.current=e,t),nt=(e,t,o)=>(t==null?$(e,o):wt(e,o,t),t),Se=(e,t)=>t==null?st(e,t,"style"):X(e.style,t,"cssText"),ye=(e,t,o)=>(e.toggleAttribute(o.slice(1),t),t),G=(e,t,o)=>{let{length:r}=t;if(e.data=`[${r}]`,r)return gt(e.parentNode,o,t,I,e);switch(o.length){case 1:o[0].remove();case 0:break;default:H(I(o[0],0),I(o.at(-1),-0),!1);break}return v},Z=new Map([["aria",fe],["class",he],["data",me],["ref",Ft],["style",Se]]),Nt=(e,t,o)=>{var r;switch(t[0]){case".":return xe;case"?":return ye;case"@":return de;default:return o||"ownerSVGElement"in e?t==="ref"?Ft:nt:Z.get(t)||(t in e?t.startsWith("on")?X:(r=Tt(e,t))!=null&&r.set?st:nt:nt)}},Ot=(e,t)=>(e.textContent=t==null?"":t,t);var O=(e,t,o)=>({a:e,b:t,c:o}),Pt=(e,t)=>({b:e,c:t}),kt=(e,t,o,r)=>({v,u:e,t,n:o,c:r}),g=()=>O(null,null,v);var it=e=>(t,o)=>{let{a:r,b:n,c:i}=e(t,o),c=document.importNode(r,!0),s=v;if(n!==v){s=[];for(let a,l,u=0;u<n.length;u++){let{a:p,b:h,c:x}=n[u],f=p===l?a:a=Et(c,l=p);s[u]=kt(h,f,x,h===G?[]:h===R?g():null)}}return Pt(i?c.firstChild:new B(c),s)};var Mt=/^(?:plaintext|script|style|textarea|title|xmp)$/i,$t=/^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;var Ce=/<([a-zA-Z0-9]+[a-zA-Z0-9:._-]*)([^>]*?)(\/?)>/g,ve=/([^\s\\>"'=]+)\s*=\s*(['"]?)\x01/g,ge=/[\x01\x02]/g,Dt=(e,t,o)=>{let r=0;return e.join("").trim().replace(Ce,(n,i,c,s)=>`<${i}${c.replace(ve,"=$2$1").trimEnd()}${s?o||$t.test(i)?" /":`></${i}`:""}>`).replace(ge,n=>n===""?`<!--${t+r++}-->`:t+r++)};var q=document.createElement("template"),ct,at,_t=(e,t)=>{if(t)return ct||(ct=document.createElementNS(bt,"svg"),at=U(),at.selectNodeContents(ct)),at.createContextualFragment(e);q.innerHTML=e;let{content:o}=q;return q=q.cloneNode(!1),o};var pt=e=>{let t=[],o;for(;o=e.parentNode;)t.push(t.indexOf.call(o.childNodes,e)),e=o;return t},Vt=()=>document.createTextNode(""),Ee=(e,t,o)=>{let r=_t(Dt(e,D,o),o),{length:n}=e,i=v;if(n>1){let a=[],l=document.createTreeWalker(r,129),u=0,p=`${D}${u++}`;for(i=[];u<n;){let h=l.nextNode();if(h.nodeType===8){if(h.data===p){let x=j(t[u-1])?G:R;x===R&&a.push(h),i.push(O(pt(h),x,null)),p=`${D}${u++}`}}else{let x;for(;h.hasAttribute(p);){x||(x=pt(h));let f=h.getAttribute(p);i.push(O(x,Nt(h,f,o),f)),$(h,p),p=`${D}${u++}`}!o&&Mt.test(h.localName)&&h.textContent.trim()===`<!--${p}-->`&&(i.push(O(x||pt(h),Ot,null)),p=`${D}${u++}`)}}for(u=0;u<a.length;u++)a[u].replaceWith(Vt())}let{childNodes:c}=r,{length:s}=c;return s<1?(s=1,r.appendChild(Vt())):s===1&&n!==1&&c[0].nodeType!==1&&(s=0),T(Lt,e,O(r,i,s===1))},Lt=new WeakMap,D="is\xB5",ut=e=>(t,o)=>Lt.get(t)||Ee(t,o,e);var Ae=it(ut(!1)),Re=it(ut(!0)),lt=(e,{s:t,t:o,v:r})=>{if(e.a!==o){let{b:n,c:i}=(t?Re:Ae)(o,r);e.a=o,e.b=n,e.c=i}for(let{c:n}=e,i=0;i<n.length;i++){let c=r[i],s=n[i];switch(s.u){case G:s.v=G(s.t,Ge(s.c,c),s.v);break;case R:let a=c instanceof b?lt(s.c||(s.c=g()),c):(s.c=null,c);a!==s.v&&(s.v=R(s,a));break;default:c!==s.v&&(s.v=s.u(s.t,c,s.n,s.v));break}}return e.b},Ge=(e,t)=>{let o=0,{length:r}=t;for(r<e.length&&e.splice(r);o<r;o++){let n=t[o];n instanceof b?t[o]=lt(e[o]||(e[o]=g()),n):e[o]=null}return t},b=class{constructor(t,o,r){this.s=t,this.t=o,this.v=r}toDOM(t=g()){return lt(t,this)}};var Wt=e=>(t,...o)=>new b(e,t,o),_=Wt(!1),Kt=Wt(!0);var jt=new WeakMap,J=(e,t,o)=>{let r=jt.get(e)||T(jt,e,g()),{b:n}=r,i=o&&typeof t=="function"?t():t,c=i instanceof b?i.toDOM(r):i;return n!==c&&e.replaceChildren((r.b=c).valueOf()),e};var Ut=new WeakMap,Ht=e=>(t,o)=>{function r(i,...c){return new b(e,i,c).toDOM(this)}let n=Ut.get(t)||T(Ut,t,new Map);return n.get(o)||T(n,o,r.bind(g()))},Bt=Ht(!1),we=Ht(!0);var zt=new FinalizationRegistry(([e,t,o])=>{o&&console.debug(`%c${String(t)}`,"font-weight:bold","collected"),e(t)}),It=Object.create(null),Xt=(e,t,{debug:o,handler:r,return:n,token:i=e}=It)=>{let c=n||new Proxy(e,r||It),s=[c,[t,e,!!o]];return i!==!1&&s.push(i),zt.register(...s),c},Zt=e=>zt.unregister(e);var ft=new WeakMap,Fe=e=>e(),Y=!0,dt=e=>(t,o)=>{if(Y=typeof o!="function",qt(t),Y)return J(t,o,!1);Y=!0;let r=new WeakRef(t),n=e(()=>{J(r.deref(),o(),!1)});return ft.set(t,n),Xt(n,Fe,{return:t})},qt=e=>{let t=ft.get(e);t&&(Y&&ft.delete(e),Zt(t),t())};var Ne=Symbol.for("preact-signals");function mt(){if(P>1)P--;else{for(var e,t=!1;V!==void 0;){var o=V;for(V=void 0,ht++;o!==void 0;){var r=o.o;if(o.o=void 0,o.f&=-3,!(8&o.f)&&Qt(o))try{o.c()}catch(n){t||(e=n,t=!0)}o=r}}if(ht=0,P--,t)throw e}}var d=void 0;var V=void 0,P=0,ht=0,Q=0;function Jt(e){if(d!==void 0){var t=e.n;if(t===void 0||t.t!==d)return t={i:0,S:e,p:d.s,n:void 0,t:d,e:void 0,x:void 0,r:t},d.s!==void 0&&(d.s.n=t),d.s=t,e.n=t,32&d.f&&e.S(t),t;if(t.i===-1)return t.i=0,t.n!==void 0&&(t.n.p=t.p,t.p!==void 0&&(t.p.n=t.n),t.p=d.s,t.n=void 0,d.s.n=t,d.s=t),t}}function m(e){this.v=e,this.i=0,this.n=void 0,this.t=void 0}m.prototype.brand=Ne;m.prototype.h=function(){return!0};m.prototype.S=function(e){this.t!==e&&e.e===void 0&&(e.x=this.t,this.t!==void 0&&(this.t.e=e),this.t=e)};m.prototype.U=function(e){if(this.t!==void 0){var t=e.e,o=e.x;t!==void 0&&(t.x=o,e.e=void 0),o!==void 0&&(o.e=t,e.x=void 0),e===this.t&&(this.t=o)}};m.prototype.subscribe=function(e){var t=this;return W(function(){var o=t.value,r=d;d=void 0;try{e(o)}finally{d=r}})};m.prototype.valueOf=function(){return this.value};m.prototype.toString=function(){return this.value+""};m.prototype.toJSON=function(){return this.value};m.prototype.peek=function(){var e=d;d=void 0;try{return this.value}finally{d=e}};Object.defineProperty(m.prototype,"value",{get:function(){var e=Jt(this);return e!==void 0&&(e.i=this.i),this.v},set:function(e){if(e!==this.v){if(ht>100)throw new Error("Cycle detected");this.v=e,this.i++,Q++,P++;try{for(var t=this.t;t!==void 0;t=t.x)t.t.N()}finally{mt()}}}});function Yt(e){return new m(e)}function Qt(e){for(var t=e.s;t!==void 0;t=t.n)if(t.S.i!==t.i||!t.S.h()||t.S.i!==t.i)return!0;return!1}function te(e){for(var t=e.s;t!==void 0;t=t.n){var o=t.S.n;if(o!==void 0&&(t.r=o),t.S.n=t,t.i=-1,t.n===void 0){e.s=t;break}}}function ee(e){for(var t=e.s,o=void 0;t!==void 0;){var r=t.p;t.i===-1?(t.S.U(t),r!==void 0&&(r.n=t.n),t.n!==void 0&&(t.n.p=r)):o=t,t.S.n=t.r,t.r!==void 0&&(t.r=void 0),t=r}e.s=o}function k(e){m.call(this,void 0),this.x=e,this.s=void 0,this.g=Q-1,this.f=4}(k.prototype=new m).h=function(){if(this.f&=-3,1&this.f)return!1;if((36&this.f)==32||(this.f&=-5,this.g===Q))return!0;if(this.g=Q,this.f|=1,this.i>0&&!Qt(this))return this.f&=-2,!0;var e=d;try{te(this),d=this;var t=this.x();(16&this.f||this.v!==t||this.i===0)&&(this.v=t,this.f&=-17,this.i++)}catch(o){this.v=o,this.f|=16,this.i++}return d=e,ee(this),this.f&=-2,!0};k.prototype.S=function(e){if(this.t===void 0){this.f|=36;for(var t=this.s;t!==void 0;t=t.n)t.S.S(t)}m.prototype.S.call(this,e)};k.prototype.U=function(e){if(this.t!==void 0&&(m.prototype.U.call(this,e),this.t===void 0)){this.f&=-33;for(var t=this.s;t!==void 0;t=t.n)t.S.U(t)}};k.prototype.N=function(){if(!(2&this.f)){this.f|=6;for(var e=this.t;e!==void 0;e=e.x)e.t.N()}};Object.defineProperty(k.prototype,"value",{get:function(){if(1&this.f)throw new Error("Cycle detected");var e=Jt(this);if(this.h(),e!==void 0&&(e.i=this.i),16&this.f)throw this.v;return this.v}});function oe(e){return new k(e)}function re(e){var t=e.u;if(e.u=void 0,typeof t=="function"){P++;var o=d;d=void 0;try{t()}catch(r){throw e.f&=-2,e.f|=8,xt(e),r}finally{d=o,mt()}}}function xt(e){for(var t=e.s;t!==void 0;t=t.n)t.S.U(t);e.x=void 0,e.s=void 0,re(e)}function Oe(e){if(d!==this)throw new Error("Out-of-order effect");ee(this),d=e,this.f&=-2,8&this.f&&xt(this),mt()}function L(e){this.x=e,this.u=void 0,this.s=void 0,this.o=void 0,this.f=32}L.prototype.c=function(){var e=this.S();try{if(8&this.f||this.x===void 0)return;var t=this.x();typeof t=="function"&&(this.u=t)}finally{e()}};L.prototype.S=function(){if(1&this.f)throw new Error("Cycle detected");this.f|=1,this.f&=-9,re(this),te(this),P++;var e=d;return d=this,Oe.bind(this,e)};L.prototype.N=function(){2&this.f||(this.f|=2,this.o=V,V=this)};L.prototype.d=function(){this.f|=8,1&this.f||xt(this)};function W(e){var t=new L(e);try{t.c()}catch(o){throw t.d(),o}return t.d.bind(t)}var St=class extends m{emit(t){if(typeof t=="object"&&t!==null&&typeof this.value=="object"){let o=yt(this.value);this.value={...o,...t}}else this.value=t}};function tt(e){let t=Yt(e);return Object.setPrototypeOf(t,St.prototype),t}function yt(e){if(e===null||typeof e!="object")return e;if(Array.isArray(e))return e.map(yt);let t={};for(let o of Reflect.ownKeys(e))t[o]=yt(e[o]);return t}function et(e,t){return oe(()=>t(e.value))}function ne(e){let{state:t,getters:o,computed:r,actions:n}=e,i=tt(t),c=o?Object.entries(o({state:i})).reduce((l,[u,p])=>({...l,[u]:p()}),{}):{},s=r?Object.entries(r({state:i})).reduce((l,[u,p])=>({...l,[u]:et(i,()=>p())}),{}):{},a=n?n({state:i,computed:s}):{};return{state:i,getters:c,computed:s,actions:a}}var w={};function se(e,t){if(w[e])throw new Error(`Store \u0441 \u043A\u043B\u044E\u0447\u043E\u043C "${e}" \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442.`);w[e]=t}function ie(e){let{tagName:t,state:o,getters:r,computed:n,actions:i,connected:c,disconnected:s,render:a,listen:l}=e,u=dt(W);class p extends HTMLElement{constructor(){super();this.slots={};this.cleanup=[];this.state=tt(o),this.getters=this.setupGetters(),this.computed=this.setupComputed(),this.actions=this.setupActions()}get context(){return{state:this.state,getters:this.getters,computed:this.computed,actions:this.actions,element:this,slots:this.slots,store:w}}subscribeToState(f){let S=this.state.peek(),y=W(()=>{let C=this.state.value;f({newValue:C,oldValue:S}),S=C});return this.cleanup.push(y),()=>{let C=this.cleanup.indexOf(y);C>-1&&this.cleanup.splice(C,1),y()}}setupGetters(){if(!r)return{};let f=r({state:this.state,store:w});return Object.entries(f).reduce((S,[y,C])=>({...S,[y]:C()}),{})}setupComputed(){if(!n)return{};let f=n({state:this.state,store:w});return Object.entries(f).reduce((S,[y,C])=>({...S,[y]:et(this.state,()=>C())}),{})}setupActions(){if(!i)return{};let f={state:this.state,getters:this.getters,computed:this.computed,store:w};return i(f)}setupListener(){if(!l)return;let f=this.state.peek(),S=W(()=>{let y=this.state.value;l({...this.context,newValue:y,oldValue:f}),f=y});this.cleanup.push(S)}setupRender(){if(!a)return;let f=u(this,()=>a(this.context));this.cleanup.push(f)}collectSlots(){let f={default:[]};Array.from(this.childNodes).forEach(S=>{var y;if(S instanceof Element){let C=S.getAttribute("data-slot")||"default";f[C]=f[C]||[],f[C].push(S)}else(y=S.textContent)!=null&&y.trim()&&f.default.push(S)}),this.slots=f}connectedCallback(){this.collectSlots(),this.setupListener(),this.setupRender(),c==null||c(this.context)}disconnectedCallback(){this.cleanup.forEach(f=>f()),this.cleanup=[],s==null||s(this.context)}}customElements.get(t)||customElements.define(t,p)}var Pe=ne({state:{count:0},getters:e=>({hi:()=>"hi"}),computed:({state:e})=>({isEven:()=>e.value.count%2===0}),actions:({state:e})=>({inc:()=>e.emit({count:e.value.count+1})})});se("counter",Pe);ie({tagName:"my-counter",state:{count:0},getters:e=>({hi:()=>"hi",counterStore:()=>e.store.counter}),computed:({state:e})=>({doubleCount:()=>e.value.count*2,isEven:()=>e.value.count%2===0}),actions:({state:e})=>({increment:t=>{e.emit({count:e.value.count+t})},reset:()=>{e.emit({count:0})}}),listen(e){console.log(e.getters.hi)},render:({state:e,computed:t,actions:o,getters:{counterStore:r}})=>_`
        <div>
             <button @click="${()=>r.actions.inc()}">Count store: ${r.state.value.count}</button> 
            <p >Count: ${e.value.count}</p>
            <p>Double: ${t.doubleCount.value}</p>
            <p>Is Even: ${t.isEven.value}</p>
            <button onclick=${()=>o.increment(1)}>+1</button>
            <button onclick=${o.reset}>Reset</button>
        </div>
    `});export{St as State,et as compute,tt as createState,ie as defineComponent,_ as html,Bt as htmlFor};
/*! Bundled license information:

uhtml/esm/index.js:
  (*! (c) Andrea Giammarchi - MIT *)

uhtml/esm/keyed.js:
  (*! (c) Andrea Giammarchi - MIT *)
*/