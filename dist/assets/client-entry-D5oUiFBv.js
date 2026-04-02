let g=null;function b(){return g}async function j(){var o,n;if(g)return console.debug("[chat-style] fetchIconMap: returning cached",g.size,"persons"),g;const e=new Map;try{console.debug("[chat-style] fetchIconMap: fetching /_api/v3/page?path=/chat-style-icons");const t=await fetch("/_api/v3/page?path=/chat-style-icons",{headers:{"Content-Type":"application/json"}});if(!t.ok)return console.warn("[chat-style] fetchIconMap: HTTP error",t.status),e;const i=await t.json();console.debug("[chat-style] fetchIconMap: API response keys:",Object.keys(i));const c=((n=(o=i.page)==null?void 0:o.revision)==null?void 0:n.body)??"";console.debug("[chat-style] fetchIconMap: markdown length:",c.length,"first 200 chars:",c.substring(0,200)),O(c,e),console.debug("[chat-style] fetchIconMap: parsed",e.size,"persons:",[...e.entries()].map(([r,a])=>`${r}:[${[...a.keys()].join(",")}]`).join(", "))}catch(t){console.warn("[chat-style] fetchIconMap: error:",t)}return g=e,e}function O(e,o){const n=e.split(`
`);let t=null;const i=/^##\s+(.+)$/,c=/^-\s+(\S+?):\s*\[.*?\]\((.+?)\)\s*$/;for(const r of n){const a=r.match(i);if(a){t=a[1].trim(),o.has(t)||o.set(t,new Map);continue}if(t==null)continue;const s=r.match(c);if(s){const u=s[1],l=s[2];o.get(t).set(u,l)}}}function C(e,o,n){const t=e.get(o);return t?t.get(n)??t.get("default")??null:null}const P=function(e){if(e==null)return z;if(typeof e=="function")return m(e);if(typeof e=="object")return Array.isArray(e)?E(e):$(e);if(typeof e=="string")return F(e);throw new Error("Expected function, string, or object as test")};function E(e){const o=[];let n=-1;for(;++n<e.length;)o[n]=P(e[n]);return m(t);function t(...i){let c=-1;for(;++c<o.length;)if(o[c].apply(this,i))return!0;return!1}}function $(e){const o=e;return m(n);function n(t){const i=t;let c;for(c in e)if(i[c]!==o[c])return!1;return!0}}function F(e){return m(o);function o(n){return n&&n.type===e}}function m(e){return o;function o(n,t,i){return!!(R(n)&&e.call(this,n,typeof t=="number"?t:void 0,i||void 0))}}function z(){return!0}function R(e){return e!==null&&typeof e=="object"&&"type"in e}const N=[],S=!0,v=!1,D="skip";function G(e,o,n,t){let i;typeof o=="function"&&typeof n!="function"?(t=n,n=o):i=o;const c=P(i),r=t?-1:1;a(e,void 0,[])();function a(s,u,l){const h=s&&typeof s=="object"?s:{};if(typeof h.type=="string"){const f=typeof h.tagName=="string"?h.tagName:typeof h.name=="string"?h.name:void 0;Object.defineProperty(w,"name",{value:"node ("+(s.type+(f?"<"+f+">":""))+")"})}return w;function w(){let f=N,p,d,x;if((!o||c(s,u,l[l.length-1]||void 0))&&(f=T(n(s,l)),f[0]===v))return f;if("children"in s&&s.children){const y=s;if(y.children&&f[0]!==D)for(d=(t?y.children.length:-1)+r,x=l.concat(y);d>-1&&d<y.children.length;){const A=y.children[d];if(p=a(A,d,x)(),p[0]===v)return p;d=typeof p[1]=="number"?p[1]:d+r}}return f}}}function T(e){return Array.isArray(e)?e:typeof e=="number"?[S,e]:e==null?N:[e]}function U(e,o,n,t){let i,c,r;c=o,r=n,i=t,G(e,c,a,i);function a(s,u){const l=u[u.length-1],h=l?l.children.indexOf(s):void 0;return r(s,h,l)}}function V(e,o){let n,t;if(e.endsWith("-left"))n="left",t=e.slice(0,-5);else if(e.endsWith("-right"))n="right",t=e.slice(0,-6);else return null;if(t.length===0)return null;const i=t.lastIndexOf("-");if(i>0){const c=t.slice(i+1),r=t.slice(0,i);if(o.has(c))return{name:r,emotion:c,position:n}}return{name:t,emotion:"default",position:n}}function k(e){const o=new Set;for(const n of e.values())for(const t of n.keys())o.add(t);return()=>n=>{console.debug("[chat-style] remark plugin running, knownEmotions:",[...o]),U(n,"containerDirective",t=>{var i,c;if(t.name==="chat-style"){console.debug("[chat-style] found ::::chat-style node, children:",(i=t.children)==null?void 0:i.length,"types:",(c=t.children)==null?void 0:c.map(r=>`${r.type}:${r.name}`)),t.data={hName:"div",hProperties:{className:["chat-style-container"]}};for(const r of t.children??[]){if(r.type!=="containerDirective")continue;const a=V(r.name,o);if(console.debug("[chat-style] child directive:",r.name,"→ parsed:",a),!a)continue;const s=C(e,a.name,a.emotion);console.debug("[chat-style] iconUrl for",a.name,a.emotion,":",s),r.data={hName:"div",hProperties:{className:["chat-style-message",`chat-style-message-${a.position}`]}};const u=r.children??[];r.children=[{type:"containerDirective",data:{hName:"div",hProperties:{className:["chat-style-avatar"]}},children:s?[{type:"image",url:s,alt:`${a.name} ${a.emotion}`}]:[{type:"text",value:a.name.charAt(0)}]},{type:"containerDirective",data:{hName:"div",hProperties:{className:["chat-style-body"]}},children:[{type:"paragraph",data:{hName:"div",hProperties:{className:["chat-style-name"]}},children:[{type:"text",value:a.name}]},{type:"containerDirective",data:{hName:"div",hProperties:{className:["chat-style-bubble",`chat-style-bubble-${a.position}`]}},children:u}]}]}}})}}const M="chat-style-directive-css",_=`
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
`;function I(){if(document.getElementById(M))return;const e=document.createElement("style");e.id=M,e.textContent=_,document.head.appendChild(e)}const L=()=>{if(console.debug("[chat-style] activate() called"),typeof growiFacade>"u"||growiFacade.markdownRenderer==null){console.warn("[chat-style] growiFacade not available");return}console.debug("[chat-style] growiFacade.markdownRenderer found"),j();const{optionsGenerators:e}=growiFacade.markdownRenderer,o=e.generateViewOptions;e.customGenerateViewOptions=(...t)=>{const i=o(...t);I();const c=b()??new Map;return console.debug("[chat-style] customGenerateViewOptions: iconMap size =",c.size,"(null means fetch not complete yet:",b()===null,")"),i.remarkPlugins.push(k(c)),i};const n=e.generatePreviewOptions;e.customGeneratePreviewOptions=(...t)=>{const i=n(...t);I();const c=b()??new Map;return console.debug("[chat-style] customGeneratePreviewOptions: iconMap size =",c.size),i.remarkPlugins.push(k(c)),i}},B=()=>{},H="growi-plugin-chat-style-directive";window.pluginActivators==null&&(window.pluginActivators={});window.pluginActivators[H]={activate:L,deactivate:B};
