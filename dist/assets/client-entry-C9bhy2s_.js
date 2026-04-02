let m=null;function x(){return m}async function j(){var i,n;if(m)return m;const e=new Map;try{const t=await fetch("/_api/v3/page?path=/chat-style-icons",{headers:{"Content-Type":"application/json"}});if(!t.ok)return console.warn("[chat-style-directive] Failed to fetch /chat-style-icons:",t.status),e;const r=((n=(i=(await t.json()).page)==null?void 0:i.revision)==null?void 0:n.body)??"";C(r,e)}catch(t){console.warn("[chat-style-directive] Error fetching icon map:",t)}return m=e,e}function C(e,i){const n=e.split(`
`);let t=null;const o=/^##\s+(.+)$/,r=/^-\s+(\S+?):\s*\[.*?\]\((.+?)\)\s*$/;for(const a of n){const l=a.match(o);if(l){t=l[1].trim(),i.has(t)||i.set(t,new Map);continue}if(t==null)continue;const c=a.match(r);if(c){const h=c[1],s=c[2];i.get(t).set(h,s)}}}function E(e,i,n){const t=e.get(i);return t?t.get(n)??t.get("default")??null:null}const A=function(e){if(e==null)return D;if(typeof e=="function")return g(e);if(typeof e=="object")return Array.isArray(e)?F(e):O(e);if(typeof e=="string")return S(e);throw new Error("Expected function, string, or object as test")};function F(e){const i=[];let n=-1;for(;++n<e.length;)i[n]=A(e[n]);return g(t);function t(...o){let r=-1;for(;++r<i.length;)if(i[r].apply(this,o))return!0;return!1}}function O(e){const i=e;return g(n);function n(t){const o=t;let r;for(r in e)if(o[r]!==i[r])return!1;return!0}}function S(e){return g(i);function i(n){return n&&n.type===e}}function g(e){return i;function i(n,t,o){return!!(R(n)&&e.call(this,n,typeof t=="number"?t:void 0,o||void 0))}}function D(){return!0}function R(e){return e!==null&&typeof e=="object"&&"type"in e}const I=[],$=!0,v=!1,G="skip";function T(e,i,n,t){let o;typeof i=="function"&&typeof n!="function"?(t=n,n=i):o=i;const r=A(o),a=t?-1:1;l(e,void 0,[])();function l(c,h,s){const u=c&&typeof c=="object"?c:{};if(typeof u.type=="string"){const f=typeof u.tagName=="string"?u.tagName:typeof u.name=="string"?u.name:void 0;Object.defineProperty(b,"name",{value:"node ("+(c.type+(f?"<"+f+">":""))+")"})}return b;function b(){let f=I,p,d,w;if((!i||r(c,h,s[s.length-1]||void 0))&&(f=U(n(c,s)),f[0]===v))return f;if("children"in c&&c.children){const y=c;if(y.children&&f[0]!==G)for(d=(t?y.children.length:-1)+a,w=s.concat(y);d>-1&&d<y.children.length;){const M=y.children[d];if(p=l(M,d,w)(),p[0]===v)return p;d=typeof p[1]=="number"?p[1]:d+a}}return f}}}function U(e){return Array.isArray(e)?e:typeof e=="number"?[$,e]:e==null?I:[e]}function L(e,i,n,t){let o,r,a;r=i,a=n,o=t,T(e,r,l,o);function l(c,h){const s=h[h.length-1],u=s?s.children.indexOf(c):void 0;return a(c,u,s)}}function V(e,i){let n,t;if(e.endsWith("-left"))n="left",t=e.slice(0,-5);else if(e.endsWith("-right"))n="right",t=e.slice(0,-6);else return null;if(t.length===0)return null;const o=t.lastIndexOf("-");if(o>0){const r=t.slice(o+1),a=t.slice(0,o);if(i.has(r))return{name:a,emotion:r,position:n}}return{name:t,emotion:"default",position:n}}function k(e){const i=new Set;for(const n of e.values())for(const t of n.keys())i.add(t);return()=>n=>{L(n,"containerDirective",t=>{if(t.name==="chat-style"){t.data={hName:"div",hProperties:{className:["chat-style-container"]}};for(const o of t.children??[]){if(o.type!=="containerDirective")continue;const r=V(o.name,i);if(!r)continue;const a=E(e,r.name,r.emotion);o.data={hName:"div",hProperties:{className:["chat-style-message",`chat-style-message-${r.position}`]}};const l=o.children??[];o.children=[{type:"containerDirective",data:{hName:"div",hProperties:{className:["chat-style-avatar"]}},children:a?[{type:"image",url:a,alt:`${r.name} ${r.emotion}`}]:[{type:"text",value:r.name.charAt(0)}]},{type:"containerDirective",data:{hName:"div",hProperties:{className:["chat-style-body"]}},children:[{type:"paragraph",data:{hName:"div",hProperties:{className:["chat-style-name"]}},children:[{type:"text",value:r.name}]},{type:"containerDirective",data:{hName:"div",hProperties:{className:["chat-style-bubble",`chat-style-bubble-${r.position}`]}},children:l}]}]}}})}}const N="chat-style-directive-css",_=`
.chat-style-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 0;
}

.chat-style-message {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  max-width: 85%;
}

.chat-style-message-left {
  flex-direction: row;
  margin-right: auto;
}

.chat-style-message-right {
  flex-direction: row-reverse;
  margin-left: auto;
}

.chat-style-avatar {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  background: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
  font-size: 18px;
}

.chat-style-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.chat-style-body {
  min-width: 0;
}

.chat-style-message-right .chat-style-body {
  text-align: right;
}

.chat-style-name {
  font-size: 0.75rem;
  color: #6c757d;
  margin-bottom: 4px;
}

.chat-style-bubble {
  padding: 10px 16px;
  line-height: 1.5;
  word-break: break-word;
}

.chat-style-bubble > *:first-child {
  margin-top: 0;
}

.chat-style-bubble > *:last-child {
  margin-bottom: 0;
}

.chat-style-bubble-left {
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 0 12px 12px 12px;
  color: #212529;
}

.chat-style-bubble-right {
  background: #6f5de0;
  border-radius: 12px 0 12px 12px;
  color: #ffffff;
}

.chat-style-bubble-right a {
  color: #c4b5fd;
}
`;function P(){if(document.getElementById(N))return;const e=document.createElement("style");e.id=N,e.textContent=_,document.head.appendChild(e)}const z=()=>{if(typeof growiFacade>"u"||growiFacade.markdownRenderer==null){console.warn("[chat-style-directive] growiFacade not available");return}j();const{optionsGenerators:e}=growiFacade.markdownRenderer,i=e.generateViewOptions;e.customGenerateViewOptions=(...t)=>{const o=i(...t);P();const r=x()??new Map;return o.remarkPlugins.push(k(r)),o};const n=e.generatePreviewOptions;e.customGeneratePreviewOptions=(...t)=>{const o=n(...t);P();const r=x()??new Map;return o.remarkPlugins.push(k(r)),o}},B=()=>{},W="growi-plugin-chat-style-directive";window.pluginActivators==null&&(window.pluginActivators={});window.pluginActivators[W]={activate:z,deactivate:B};
