let g=null;function x(){var r,n;if(g)return console.log("[chat-style] ensureIconMap: returning cached",g.size,"persons"),g;const e=new Map;try{console.log("[chat-style] ensureIconMap: sync fetch /_api/v3/page?path=/chat-style-icons");const t=new XMLHttpRequest;if(t.open("GET","/_api/v3/page?path=/chat-style-icons",!1),t.setRequestHeader("Content-Type","application/json"),t.send(),t.status===200){const i=JSON.parse(t.responseText);console.log("[chat-style] ensureIconMap: API response keys:",Object.keys(i));const o=((n=(r=i.page)==null?void 0:r.revision)==null?void 0:n.body)??"";console.log("[chat-style] ensureIconMap: markdown length:",o.length,"first 200 chars:",o.substring(0,200)),j(o,e),console.log("[chat-style] ensureIconMap: parsed",e.size,"persons:",[...e.entries()].map(([a,s])=>`${a}:[${[...s.keys()].join(",")}]`).join(", "))}else console.warn("[chat-style] ensureIconMap: HTTP error",t.status)}catch(t){console.warn("[chat-style] ensureIconMap: error:",t)}return g=e,e}function j(e,r){const n=e.split(`
`);let t=null;const i=/^##\s+(.+)$/,o=/^-\s+(\S+?):\s*!?\[.*?\]\((.+?)\)\s*$/;for(const a of n){const s=a.match(i);if(s){t=s[1].trim(),r.has(t)||r.set(t,new Map);continue}if(t==null)continue;const c=a.match(o);if(c){const f=c[1],l=c[2];r.get(t).set(f,l)}}}function O(e,r,n){const t=e.get(r);return t?t.get(n)??t.get("default")??null:null}const M=function(e){if(e==null)return C;if(typeof e=="function")return m(e);if(typeof e=="object")return Array.isArray(e)?E(e):R(e);if(typeof e=="string")return $(e);throw new Error("Expected function, string, or object as test")};function E(e){const r=[];let n=-1;for(;++n<e.length;)r[n]=M(e[n]);return m(t);function t(...i){let o=-1;for(;++o<r.length;)if(r[o].apply(this,i))return!0;return!1}}function R(e){const r=e;return m(n);function n(t){const i=t;let o;for(o in e)if(i[o]!==r[o])return!1;return!0}}function $(e){return m(r);function r(n){return n&&n.type===e}}function m(e){return r;function r(n,t,i){return!!(F(n)&&e.call(this,n,typeof t=="number"?t:void 0,i||void 0))}}function C(){return!0}function F(e){return e!==null&&typeof e=="object"&&"type"in e}const P=[],S=!0,v=!1,z="skip";function T(e,r,n,t){let i;typeof r=="function"&&typeof n!="function"?(t=n,n=r):i=r;const o=M(i),a=t?-1:1;s(e,void 0,[])();function s(c,f,l){const d=c&&typeof c=="object"?c:{};if(typeof d.type=="string"){const u=typeof d.tagName=="string"?d.tagName:typeof d.name=="string"?d.name:void 0;Object.defineProperty(b,"name",{value:"node ("+(c.type+(u?"<"+u+">":""))+")"})}return b;function b(){let u=P,h,p,w;if((!r||o(c,f,l[l.length-1]||void 0))&&(u=D(n(c,l)),u[0]===v))return u;if("children"in c&&c.children){const y=c;if(y.children&&u[0]!==z)for(p=(t?y.children.length:-1)+a,w=l.concat(y);p>-1&&p<y.children.length;){const A=y.children[p];if(h=s(A,p,w)(),h[0]===v)return h;p=typeof h[1]=="number"?h[1]:p+a}}return u}}}function D(e){return Array.isArray(e)?e:typeof e=="number"?[S,e]:e==null?P:[e]}function G(e,r,n,t){let i,o,a;o=r,a=n,i=t,T(e,o,s,i);function s(c,f){const l=f[f.length-1],d=l?l.children.indexOf(c):void 0;return a(c,d,l)}}function U(e,r){let n=e,t=!0;n.endsWith(":noname")&&(t=!1,n=n.slice(0,-7));let i,o;if(n.endsWith("-left"))i="left",o=n.slice(0,-5);else if(n.endsWith("-right"))i="right",o=n.slice(0,-6);else return null;if(o.length===0)return null;const a=o.lastIndexOf("-");if(a>0){const s=o.slice(a+1),c=o.slice(0,a);if(r.has(s))return{name:c,emotion:s,position:i,showName:t}}return{name:o,emotion:"default",position:i,showName:t}}function k(e){const r=new Set;for(const n of e.values())for(const t of n.keys())r.add(t);return()=>n=>{console.log("[chat-style] remark plugin running, knownEmotions:",[...r]),G(n,"containerDirective",t=>{var i,o;if(t.name==="chat-style"){console.log("[chat-style] found ::::chat-style node, children:",(i=t.children)==null?void 0:i.length,"types:",(o=t.children)==null?void 0:o.map(a=>`${a.type}:${a.name}`)),t.data={hName:"div",hProperties:{className:["chat-style-container"]}};for(const a of t.children??[]){if(a.type!=="containerDirective")continue;const s=U(a.name,r);if(console.log("[chat-style] child directive:",a.name,"→ parsed:",s),!s)continue;const c=O(e,s.name,s.emotion);console.log("[chat-style] iconUrl for",s.name,s.emotion,":",c),a.data={hName:"div",hProperties:{className:["chat-style-message",`chat-style-message-${s.position}`]}};const f=a.children??[];a.children=[{type:"containerDirective",data:{hName:"div",hProperties:{className:["chat-style-avatar"]}},children:c?[{type:"image",url:c,alt:`${s.name} ${s.emotion}`}]:[{type:"text",value:s.name.charAt(0)}]},{type:"containerDirective",data:{hName:"div",hProperties:{className:["chat-style-body"]}},children:[...s.showName?[{type:"paragraph",data:{hName:"div",hProperties:{className:["chat-style-name"]}},children:[{type:"text",value:s.name}]}]:[],{type:"containerDirective",data:{hName:"div",hProperties:{className:["chat-style-bubble",`chat-style-bubble-${s.position}`]}},children:f}]}]}}})}}const N="chat-style-directive-css",H=`
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
`;function I(){if(document.getElementById(N))return;const e=document.createElement("style");e.id=N,e.textContent=H,document.head.appendChild(e)}const L=()=>{if(console.log("[chat-style] activate() called"),typeof growiFacade>"u"||growiFacade.markdownRenderer==null){console.warn("[chat-style] growiFacade not available");return}console.log("[chat-style] growiFacade.markdownRenderer found");const{optionsGenerators:e}=growiFacade.markdownRenderer,r=e.generateViewOptions;e.customGenerateViewOptions=(...t)=>{const i=r(...t);I();const o=x();return console.log("[chat-style] customGenerateViewOptions: iconMap size =",o.size),i.remarkPlugins.push(k(o)),i};const n=e.generatePreviewOptions;e.customGeneratePreviewOptions=(...t)=>{const i=n(...t);I();const o=x();return console.log("[chat-style] customGeneratePreviewOptions: iconMap size =",o.size),i.remarkPlugins.push(k(o)),i}},V=()=>{},_="growi-plugin-chat-style-directive";window.pluginActivators==null&&(window.pluginActivators={});window.pluginActivators[_]={activate:L,deactivate:V};
