import{n as o,h as n,e as c,l as i,p as a,k as d}from"./vidstack-T8_rhZ1R.js";import{d as h}from"./vidstack-JHQBm8kb.js";function l(r,e=3e3){const t=o();return setTimeout(()=>{const s=r();s&&t.reject(s)},e),t}class u{constructor(e){this.db=e,this.cb=n(""),this.referrerPolicy=null,e.setAttribute("frameBorder","0"),e.setAttribute("allow","autoplay; fullscreen; encrypted-media; picture-in-picture; accelerometer; gyroscope"),this.referrerPolicy!==null&&e.setAttribute("referrerpolicy",this.referrerPolicy)}get iframe(){return this.db}setup(e){c(this.fd.bind(this)),i(window,"message",this.Lg.bind(this)),i(this.db,"load",this.lc.bind(this))}fd(){const e=this.cb();if(!e.length){this.db.setAttribute("src","");return}const t=a(()=>this.Te());this.db.setAttribute("src",h(e,t))}gd(e,t){this.db.contentWindow?.postMessage(JSON.stringify(e),t??"*")}Lg(e){const t=this.eb();if(e.source===this.db?.contentWindow&&(!d(t)||t===e.origin)){try{const s=JSON.parse(e.data);s&&this.hd(s,e);return}catch{}e.data&&this.hd(e.data,e)}}}export{u as E,l as t};