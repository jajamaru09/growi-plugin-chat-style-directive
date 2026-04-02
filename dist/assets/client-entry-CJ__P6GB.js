let g=null;function w(){var o,n;if(g)return console.log("[chat-style] ensureIconMap: returning cached",g.size,"persons"),g;const e=new Map;try{console.log("[chat-style] ensureIconMap: sync fetch /_api/v3/page?path=/chat-style-icons");const t=new XMLHttpRequest;if(t.open("GET","/_api/v3/page?path=/chat-style-icons",!1),t.setRequestHeader("Content-Type","application/json"),t.send(),t.status===200){const r=JSON.parse(t.responseText);console.log("[chat-style] ensureIconMap: API response keys:",Object.keys(r));const i=((n=(o=r.page)==null?void 0:o.revision)==null?void 0:n.body)??"";console.log("[chat-style] ensureIconMap: markdown length:",i.length,"first 200 chars:",i.substring(0,200)),j(i,e),console.log("[chat-style] ensureIconMap: parsed",e.size,"persons:",[...e.entries()].map(([s,c])=>`${s}:[${[...c.keys()].join(",")}]`).join(", "))}else console.warn("[chat-style] ensureIconMap: HTTP error",t.status)}catch(t){console.warn("[chat-style] ensureIconMap: error:",t)}return g=e,e}function j(e,o){const n=e.split(`
`);let t=null;const r=/^##\s+(.+)$/,i=/^-\s+(\S+?):\s*!?\[.*?\]\((.+?)\)\s*$/;for(const s of n){const c=s.match(r);if(c){t=c[1].trim(),o.has(t)||o.set(t,new Map);continue}if(t==null)continue;const a=s.match(i);if(a){const f=a[1],l=a[2];o.get(t).set(f,l)}}}function O(e,o,n){const t=e.get(o);return t?t.get(n)??t.get("default")??null:null}const N=function(e){if(e==null)return C;if(typeof e=="function")return m(e);if(typeof e=="object")return Array.isArray(e)?E(e):R(e);if(typeof e=="string")return $(e);throw new Error("Expected function, string, or object as test")};function E(e){const o=[];let n=-1;for(;++n<e.length;)o[n]=N(e[n]);return m(t);function t(...r){let i=-1;for(;++i<o.length;)if(o[i].apply(this,r))return!0;return!1}}function R(e){const o=e;return m(n);function n(t){const r=t;let i;for(i in e)if(r[i]!==o[i])return!1;return!0}}function $(e){return m(o);function o(n){return n&&n.type===e}}function m(e){return o;function o(n,t,r){return!!(F(n)&&e.call(this,n,typeof t=="number"?t:void 0,r||void 0))}}function C(){return!0}function F(e){return e!==null&&typeof e=="object"&&"type"in e}const P=[],S=!0,v=!1,z="skip";function T(e,o,n,t){let r;typeof o=="function"&&typeof n!="function"?(t=n,n=o):r=o;const i=N(r),s=t?-1:1;c(e,void 0,[])();function c(a,f,l){const d=a&&typeof a=="object"?a:{};if(typeof d.type=="string"){const u=typeof d.tagName=="string"?d.tagName:typeof d.name=="string"?d.name:void 0;Object.defineProperty(b,"name",{value:"node ("+(a.type+(u?"<"+u+">":""))+")"})}return b;function b(){let u=P,h,p,x;if((!o||i(a,f,l[l.length-1]||void 0))&&(u=D(n(a,l)),u[0]===v))return u;if("children"in a&&a.children){const y=a;if(y.children&&u[0]!==z)for(p=(t?y.children.length:-1)+s,x=l.concat(y);p>-1&&p<y.children.length;){const A=y.children[p];if(h=c(A,p,x)(),h[0]===v)return h;p=typeof h[1]=="number"?h[1]:p+s}}return u}}}function D(e){return Array.isArray(e)?e:typeof e=="number"?[S,e]:e==null?P:[e]}function G(e,o,n,t){let r,i,s;i=o,s=n,r=t,T(e,i,c,r);function c(a,f){const l=f[f.length-1],d=l?l.children.indexOf(a):void 0;return s(a,d,l)}}function U(e,o){let n,t;if(e.endsWith("-left"))n="left",t=e.slice(0,-5);else if(e.endsWith("-right"))n="right",t=e.slice(0,-6);else return null;if(t.length===0)return null;const r=t.lastIndexOf("-");if(r>0){const i=t.slice(r+1),s=t.slice(0,r);if(o.has(i))return{name:s,emotion:i,position:n}}return{name:t,emotion:"default",position:n}}function k(e){const o=new Set;for(const n of e.values())for(const t of n.keys())o.add(t);return()=>n=>{console.log("[chat-style] remark plugin running, knownEmotions:",[...o]),G(n,"containerDirective",t=>{var r,i;if(t.name==="chat-style"){console.log("[chat-style] found ::::chat-style node, children:",(r=t.children)==null?void 0:r.length,"types:",(i=t.children)==null?void 0:i.map(s=>`${s.type}:${s.name}`)),t.data={hName:"div",hProperties:{className:["chat-style-container"]}};for(const s of t.children??[]){if(s.type!=="containerDirective")continue;const c=U(s.name,o);if(console.log("[chat-style] child directive:",s.name,"→ parsed:",c),!c)continue;const a=O(e,c.name,c.emotion);console.log("[chat-style] iconUrl for",c.name,c.emotion,":",a),s.data={hName:"div",hProperties:{className:["chat-style-message",`chat-style-message-${c.position}`]}};const f=s.children??[];s.children=[{type:"containerDirective",data:{hName:"div",hProperties:{className:["chat-style-avatar"]}},children:a?[{type:"image",url:a,alt:`${c.name} ${c.emotion}`}]:[{type:"text",value:c.name.charAt(0)}]},{type:"containerDirective",data:{hName:"div",hProperties:{className:["chat-style-body"]}},children:[{type:"paragraph",data:{hName:"div",hProperties:{className:["chat-style-name"]}},children:[{type:"text",value:c.name}]},{type:"containerDirective",data:{hName:"div",hProperties:{className:["chat-style-bubble",`chat-style-bubble-${c.position}`]}},children:f}]}]}}})}}const I="chat-style-directive-css",H=`
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
`;function M(){if(document.getElementById(I))return;const e=document.createElement("style");e.id=I,e.textContent=H,document.head.appendChild(e)}const L=()=>{if(console.log("[chat-style] activate() called"),typeof growiFacade>"u"||growiFacade.markdownRenderer==null){console.warn("[chat-style] growiFacade not available");return}console.log("[chat-style] growiFacade.markdownRenderer found");const{optionsGenerators:e}=growiFacade.markdownRenderer,o=e.generateViewOptions;e.customGenerateViewOptions=(...t)=>{const r=o(...t);M();const i=w();return console.log("[chat-style] customGenerateViewOptions: iconMap size =",i.size),r.remarkPlugins.push(k(i)),r};const n=e.generatePreviewOptions;e.customGeneratePreviewOptions=(...t)=>{const r=n(...t);M();const i=w();return console.log("[chat-style] customGeneratePreviewOptions: iconMap size =",i.size),r.remarkPlugins.push(k(i)),r}},V=()=>{},_="growi-plugin-chat-style-directive";window.pluginActivators==null&&(window.pluginActivators={});window.pluginActivators[_]={activate:L,deactivate:V};
