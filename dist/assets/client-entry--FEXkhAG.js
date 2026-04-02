let g=null;function x(){var o,n;if(g)return console.log("[chat-style] ensureIconMap: returning cached",g.size,"persons"),g;const e=new Map;try{console.log("[chat-style] ensureIconMap: sync fetch /_api/v3/page?path=/chat-style-icons");const t=new XMLHttpRequest;if(t.open("GET","/_api/v3/page?path=/chat-style-icons",!1),t.setRequestHeader("Content-Type","application/json"),t.send(),t.status===200){const i=JSON.parse(t.responseText);console.log("[chat-style] ensureIconMap: API response keys:",Object.keys(i));const r=((n=(o=i.page)==null?void 0:o.revision)==null?void 0:n.body)??"";console.log("[chat-style] ensureIconMap: markdown length:",r.length,"first 200 chars:",r.substring(0,200)),j(r,e),console.log("[chat-style] ensureIconMap: parsed",e.size,"persons:",[...e.entries()].map(([c,s])=>`${c}:[${[...s.keys()].join(",")}]`).join(", "))}else console.warn("[chat-style] ensureIconMap: HTTP error",t.status)}catch(t){console.warn("[chat-style] ensureIconMap: error:",t)}return g=e,e}function j(e,o){const n=e.split(`
`);let t=null;const i=/^##\s+(.+)$/,r=/^-\s+(\S+?):\s*!?\[.*?\]\((.+?)\)\s*$/;for(const c of n){const s=c.match(i);if(s){t=s[1].trim(),o.has(t)||o.set(t,new Map);continue}if(t==null)continue;const a=c.match(r);if(a){const u=a[1],l=a[2];o.get(t).set(u,l)}}}function O(e,o,n){const t=e.get(o);return t?t.get(n)??t.get("default")??null:null}const N=function(e){if(e==null)return C;if(typeof e=="function")return m(e);if(typeof e=="object")return Array.isArray(e)?E(e):R(e);if(typeof e=="string")return $(e);throw new Error("Expected function, string, or object as test")};function E(e){const o=[];let n=-1;for(;++n<e.length;)o[n]=N(e[n]);return m(t);function t(...i){let r=-1;for(;++r<o.length;)if(o[r].apply(this,i))return!0;return!1}}function R(e){const o=e;return m(n);function n(t){const i=t;let r;for(r in e)if(i[r]!==o[r])return!1;return!0}}function $(e){return m(o);function o(n){return n&&n.type===e}}function m(e){return o;function o(n,t,i){return!!(F(n)&&e.call(this,n,typeof t=="number"?t:void 0,i||void 0))}}function C(){return!0}function F(e){return e!==null&&typeof e=="object"&&"type"in e}const P=[],S=!0,v=!1,z="skip";function T(e,o,n,t){let i;typeof o=="function"&&typeof n!="function"?(t=n,n=o):i=o;const r=N(i),c=t?-1:1;s(e,void 0,[])();function s(a,u,l){const h=a&&typeof a=="object"?a:{};if(typeof h.type=="string"){const f=typeof h.tagName=="string"?h.tagName:typeof h.name=="string"?h.name:void 0;Object.defineProperty(b,"name",{value:"node ("+(a.type+(f?"<"+f+">":""))+")"})}return b;function b(){let f=P,p,d,w;if((!o||r(a,u,l[l.length-1]||void 0))&&(f=D(n(a,l)),f[0]===v))return f;if("children"in a&&a.children){const y=a;if(y.children&&f[0]!==z)for(d=(t?y.children.length:-1)+c,w=l.concat(y);d>-1&&d<y.children.length;){const A=y.children[d];if(p=s(A,d,w)(),p[0]===v)return p;d=typeof p[1]=="number"?p[1]:d+c}}return f}}}function D(e){return Array.isArray(e)?e:typeof e=="number"?[S,e]:e==null?P:[e]}function G(e,o,n,t){let i,r,c;r=o,c=n,i=t,T(e,r,s,i);function s(a,u){const l=u[u.length-1],h=l?l.children.indexOf(a):void 0;return c(a,h,l)}}function U(e,o){let n,t;if(e.endsWith("-left"))n="left",t=e.slice(0,-5);else if(e.endsWith("-right"))n="right",t=e.slice(0,-6);else return null;if(t.length===0)return null;const i=t.lastIndexOf("-");if(i>0){const r=t.slice(i+1),c=t.slice(0,i);if(o.has(r))return{name:c,emotion:r,position:n}}return{name:t,emotion:"default",position:n}}function k(e){const o=new Set;for(const n of e.values())for(const t of n.keys())o.add(t);return()=>n=>{console.log("[chat-style] remark plugin running, knownEmotions:",[...o]),G(n,"containerDirective",t=>{var i,r;if(t.name==="chat-style"){console.log("[chat-style] found ::::chat-style node, children:",(i=t.children)==null?void 0:i.length,"types:",(r=t.children)==null?void 0:r.map(c=>`${c.type}:${c.name}`)),t.data={hName:"div",hProperties:{className:["chat-style-container"]}};for(const c of t.children??[]){if(c.type!=="containerDirective")continue;const s=U(c.name,o);if(console.log("[chat-style] child directive:",c.name,"→ parsed:",s),!s)continue;const a=O(e,s.name,s.emotion);console.log("[chat-style] iconUrl for",s.name,s.emotion,":",a),c.data={hName:"div",hProperties:{className:["chat-style-message",`chat-style-message-${s.position}`]}};const u=c.children??[];c.children=[{type:"containerDirective",data:{hName:"div",hProperties:{className:["chat-style-avatar"]}},children:a?[{type:"image",url:a,alt:`${s.name} ${s.emotion}`}]:[{type:"text",value:s.name.charAt(0)}]},{type:"containerDirective",data:{hName:"div",hProperties:{className:["chat-style-body"]}},children:[{type:"paragraph",data:{hName:"div",hProperties:{className:["chat-style-name"]}},children:[{type:"text",value:s.name}]},{type:"containerDirective",data:{hName:"div",hProperties:{className:["chat-style-bubble",`chat-style-bubble-${s.position}`]}},children:u}]}]}}})}}const I="chat-style-directive-css",H=`
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
`;function M(){if(document.getElementById(I))return;const e=document.createElement("style");e.id=I,e.textContent=H,document.head.appendChild(e)}const L=()=>{if(console.log("[chat-style] activate() called"),typeof growiFacade>"u"||growiFacade.markdownRenderer==null){console.warn("[chat-style] growiFacade not available");return}console.log("[chat-style] growiFacade.markdownRenderer found");const{optionsGenerators:e}=growiFacade.markdownRenderer,o=e.generateViewOptions;e.customGenerateViewOptions=(...t)=>{const i=o(...t);M();const r=x();return console.log("[chat-style] customGenerateViewOptions: iconMap size =",r.size),i.remarkPlugins.push(k(r)),i};const n=e.generatePreviewOptions;e.customGeneratePreviewOptions=(...t)=>{const i=n(...t);M();const r=x();return console.log("[chat-style] customGeneratePreviewOptions: iconMap size =",r.size),i.remarkPlugins.push(k(r)),i}},V=()=>{},_="growi-plugin-chat-style-directive";window.pluginActivators==null&&(window.pluginActivators={});window.pluginActivators[_]={activate:L,deactivate:V};
