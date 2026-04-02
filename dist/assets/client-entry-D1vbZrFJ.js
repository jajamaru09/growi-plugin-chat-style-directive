let b=null;function w(){var o,r;if(b)return b;const e=new Map;try{const t=new XMLHttpRequest;if(t.open("GET","/_api/v3/page?path=/chat-style-icons",!1),t.setRequestHeader("Content-Type","application/json"),t.send(),t.status===200){const n=((r=(o=JSON.parse(t.responseText).page)==null?void 0:o.revision)==null?void 0:r.body)??"";E(n,e)}else console.warn("[chat-style] ensureIconMap: HTTP error",t.status)}catch(t){console.warn("[chat-style] ensureIconMap: error:",t)}return b=e,e}function E(e,o){const r=e.split(`
`);let t=null;const i=/^##\s+(.+)$/,n=/^-\s+(\S+?):\s*!?\[.*?\]\((.+?)\)\s*$/;for(const c of r){const s=c.match(i);if(s){t=s[1].trim(),o.has(t)||o.set(t,new Map);continue}if(t==null)continue;const a=c.match(n);if(a){const p=a[1],l=a[2];o.get(t).set(p,l)}}}function j(e,o,r){const t=e.get(o);return t?t.get(r)??t.get("default")??null:null}const A=function(e){if(e==null)return S;if(typeof e=="function")return m(e);if(typeof e=="object")return Array.isArray(e)?C(e):O(e);if(typeof e=="string")return R(e);throw new Error("Expected function, string, or object as test")};function C(e){const o=[];let r=-1;for(;++r<e.length;)o[r]=A(e[r]);return m(t);function t(...i){let n=-1;for(;++n<o.length;)if(o[n].apply(this,i))return!0;return!1}}function O(e){const o=e;return m(r);function r(t){const i=t;let n;for(n in e)if(i[n]!==o[n])return!1;return!0}}function R(e){return m(o);function o(r){return r&&r.type===e}}function m(e){return o;function o(r,t,i){return!!(F(r)&&e.call(this,r,typeof t=="number"?t:void 0,i||void 0))}}function S(){return!0}function F(e){return e!==null&&typeof e=="object"&&"type"in e}const I=[],T=!0,v=!1,D="skip";function $(e,o,r,t){let i;typeof o=="function"&&typeof r!="function"?(t=r,r=o):i=o;const n=A(i),c=t?-1:1;s(e,void 0,[])();function s(a,p,l){const u=a&&typeof a=="object"?a:{};if(typeof u.type=="string"){const f=typeof u.tagName=="string"?u.tagName:typeof u.name=="string"?u.name:void 0;Object.defineProperty(g,"name",{value:"node ("+(a.type+(f?"<"+f+">":""))+")"})}return g;function g(){let f=I,h,d,x;if((!o||n(a,p,l[l.length-1]||void 0))&&(f=G(r(a,l)),f[0]===v))return f;if("children"in a&&a.children){const y=a;if(y.children&&f[0]!==D)for(d=(t?y.children.length:-1)+c,x=l.concat(y);d>-1&&d<y.children.length;){const M=y.children[d];if(h=s(M,d,x)(),h[0]===v)return h;d=typeof h[1]=="number"?h[1]:d+c}}return f}}}function G(e){return Array.isArray(e)?e:typeof e=="number"?[T,e]:e==null?I:[e]}function H(e,o,r,t){let i,n,c;n=o,c=r,i=t,$(e,n,s,i);function s(a,p){const l=p[p.length-1],u=l?l.children.indexOf(a):void 0;return c(a,u,l)}}function L(e,o,r){const t=!(r&&"noname"in r);let i,n;if(e.endsWith("-left"))i="left",n=e.slice(0,-5);else if(e.endsWith("-right"))i="right",n=e.slice(0,-6);else return null;if(n.length===0)return null;const c=n.lastIndexOf("-");if(c>0){const s=n.slice(c+1),a=n.slice(0,c);if(o.has(s))return{name:a,emotion:s,position:i,showName:t}}return{name:n,emotion:"default",position:i,showName:t}}function k(e){const o=new Set;for(const r of e.values())for(const t of r.keys())o.add(t);return()=>r=>{H(r,"containerDirective",t=>{if(t.name==="chat-style"){t.data={hName:"div",hProperties:{className:["chat-style-container"]}};for(const i of t.children??[]){if(i.type!=="containerDirective")continue;const n=L(i.name,o,i.attributes);if(!n)continue;const c=j(e,n.name,n.emotion);i.data={hName:"div",hProperties:{className:["chat-style-message",`chat-style-message-${n.position}`]}};const s=i.children??[];i.children=[{type:"containerDirective",data:{hName:"div",hProperties:{className:["chat-style-avatar"]}},children:c?[{type:"image",url:c,alt:`${n.name} ${n.emotion}`}]:[{type:"text",value:n.name.charAt(0)}]},{type:"containerDirective",data:{hName:"div",hProperties:{className:["chat-style-body"]}},children:[...n.showName?[{type:"paragraph",data:{hName:"div",hProperties:{className:["chat-style-name"]}},children:[{type:"text",value:n.name}]}]:[],{type:"containerDirective",data:{hName:"div",hProperties:{className:["chat-style-bubble",`chat-style-bubble-${n.position}`]}},children:s}]}]}}})}}const N="chat-style-directive-css",U=`
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
  position: relative;
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 0 12px 12px 12px;
  color: #212529;
}

.chat-style-bubble-left::before {
  content: '';
  position: absolute;
  top: 10px;
  left: -8px;
  border-width: 6px 8px 6px 0;
  border-style: solid;
  border-color: transparent #dee2e6 transparent transparent;
}

.chat-style-bubble-left::after {
  content: '';
  position: absolute;
  top: 11px;
  left: -6px;
  border-width: 5px 6px 5px 0;
  border-style: solid;
  border-color: transparent #ffffff transparent transparent;
}

.chat-style-bubble-right {
  position: relative;
  background: #6f5de0;
  border-radius: 12px 0 12px 12px;
  color: #ffffff;
}

.chat-style-bubble-right::before {
  content: '';
  position: absolute;
  top: 10px;
  right: -8px;
  border-width: 6px 0 6px 8px;
  border-style: solid;
  border-color: transparent transparent transparent #6f5de0;
}

.chat-style-bubble-right a {
  color: #c4b5fd;
}
`;function P(){if(document.getElementById(N))return;const e=document.createElement("style");e.id=N,e.textContent=U,document.head.appendChild(e)}const V=()=>{if(typeof growiFacade>"u"||growiFacade.markdownRenderer==null){console.warn("[chat-style] growiFacade not available");return}const{optionsGenerators:e}=growiFacade.markdownRenderer,o=e.generateViewOptions;e.customGenerateViewOptions=(...t)=>{const i=o(...t);P();const n=w();return i.remarkPlugins.push(k(n)),i};const r=e.generatePreviewOptions;e.customGeneratePreviewOptions=(...t)=>{const i=r(...t);P();const n=w();return i.remarkPlugins.push(k(n)),i}},_=()=>{},q="growi-plugin-chat-style-directive";window.pluginActivators==null&&(window.pluginActivators={});window.pluginActivators[q]={activate:V,deactivate:_};
