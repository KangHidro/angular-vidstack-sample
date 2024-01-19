import{M as w,h as v,e as p,p as c,k as E,n as $,l as P,m as T}from"../chunks/vidstack-NzoiA7c4.js";import{T as o}from"../chunks/vidstack-sRfFZ5md.js";import{p as G}from"../chunks/vidstack-d7FbT_Ml.js";import{L as l}from"../chunks/vidstack-ukgjEQ1O.js";import{c as k,Q as y}from"../chunks/vidstack-t8cI5qlS.js";import{R as j}from"../chunks/vidstack-JNT5N8yA.js";import{E as N,t as q}from"../chunks/vidstack-PqOXJXOO.js";const V=["bufferend","bufferstart","durationchange","ended","enterpictureinpicture","error","fullscreenchange","leavepictureinpicture","loaded","playProgress","loadProgress","pause","play","playbackratechange","qualitychange","seeked","seeking","timeupdate","volumechange","waiting"],m=class f extends N{constructor(){super(...arguments),this.$$PROVIDER_TYPE="VIMEO",this.scope=w(),this.Fa=0,this.Ga=new o(0,0),this.Hb=new o(0,0),this.E=null,this.G=null,this.rd=null,this.N=v(""),this.oc=v(!1),this.sd=null,this.V=null,this.eh=null,this.Da=new j(this.bd.bind(this)),this.cookies=!1,this.title=!0,this.byline=!0,this.portrait=!0,this.color="00ADEF"}get c(){return this.b.delegate.c}get type(){return"vimeo"}get currentSrc(){return this.V}get videoId(){return this.N()}get hash(){return this.sd}get isPro(){return this.oc()}preconnect(){const t=[this.eb(),"https://i.vimeocdn.com","https://f.vimeocdn.com","https://fresnel.vimeocdn.com"];for(const e of t)G(e,"preconnect")}setup(t){this.b=t,super.setup(t),p(this.kd.bind(this)),p(this.fh.bind(this)),p(this.gh.bind(this)),this.c("provider-setup",this)}destroy(){this.H(),this.q("destroy")}async play(){const{paused:t}=this.b.$state;if(c(t))return this.E||(this.E=q(()=>{if(this.E=null,t())return"Timed out."}),this.q("play")),this.E.promise}async pause(){const{paused:t}=this.b.$state;if(!c(t))return this.G||(this.G=q(()=>{if(this.G=null,!t())return"Timed out."}),this.q("pause")),this.G.promise}setMuted(t){this.q("setMuted",t)}setCurrentTime(t){this.q("seekTo",t)}setVolume(t){this.q("setVolume",t),this.q("setMuted",c(this.b.$state.muted))}setPlaybackRate(t){this.q("setPlaybackRate",t)}async loadSource(t){if(!E(t.src)){this.V=null,this.sd=null,this.N.set("");return}const e=t.src.match(f.jd),s=e?.[1],i=e?.[2];this.N.set(s??""),this.sd=i??null,this.V=t}kd(){this.H();const t=this.N();if(!t){this.cb.set("");return}this.cb.set(`${this.eb()}/video/${t}`)}fh(){const t=this.cb(),e=this.N(),s=f.dh,i=s.get(e);if(!e)return;const a=$();if(this.rd=a,i){a.resolve(i);return}const r=`https://vimeo.com/api/oembed.json?url=${t}`,n=new AbortController;return window.fetch(r,{mode:"cors",signal:n.signal}).then(h=>h.json()).then(h=>{const u=/vimeocdn.com\/video\/(.*)?_/,d=h?.thumbnail_url?.match(u)?.[1],b=d?`https://i.vimeocdn.com/video/${d}_1920x1080.webp`:"",g={title:h?.title??"",duration:h?.duration??0,poster:b,pro:h.account_type!=="basic"};s.set(e,g),a.resolve(g)}).catch(h=>{a.reject(),this.c("error",{message:`Failed to fetch vimeo video info from \`${r}\`.`,code:1,error:k(h)})}),()=>{a.reject(),n.abort()}}gh(){const t=this.oc(),{$state:e,qualities:s}=this.b;if(e.canSetPlaybackRate.set(t),s[l.Mc](!t),t)return P(s,"change",()=>{if(s.auto)return;const i=s.selected?.id;i&&this.q("setQuality",i)})}eb(){return"https://player.vimeo.com"}Te(){const{$iosControls:t}=this.b,{keyDisabled:e}=this.b.$props,{controls:s,playsinline:i}=this.b.$state,a=s()||t();return{title:this.title,byline:this.byline,color:this.color,portrait:this.portrait,controls:a,h:this.hash,keyboard:a&&!e(),transparent:!0,playsinline:i(),dnt:!this.cookies}}bd(){this.q("getCurrentTime")}Eb(t,e){const{currentTime:s,paused:i,seeking:a,bufferedEnd:r}=this.b.$state;if(a()&&i()&&(this.q("getBuffered"),r()>t&&this.c("seeked",t,e)),s()===t)return;const n=s(),h={currentTime:t,played:this.Fa>=t?this.Ga:this.Ga=new o(0,this.Fa=t)};this.c("time-update",h,e),Math.abs(n-t)>1.5&&(this.c("seeking",t,e),!i()&&r()<t&&this.c("waiting",void 0,e))}bb(t,e){this.c("seeked",t,e)}md(t){const e=this.N();this.rd?.promise.then(s=>{if(!s)return;const{title:i,poster:a,duration:r,pro:n}=s,{$iosControls:h}=this.b,{controls:u}=this.b.$state,d=u()||h();this.Da.Bb(),this.oc.set(n),this.Hb=new o(0,r),this.c("poster-change",a,t),this.c("title-change",i,t),this.c("duration-change",r,t);const b={buffered:new o(0,0),seekable:this.Hb,duration:r};this.b.delegate.jc(b,t),d||this.q("_hideOverlay"),this.q("getQualities")}).catch(s=>{e===this.N()&&this.c("error",{message:"Failed to fetch oembed data",code:2,error:k(s)})})}hh(t,e,s){switch(t){case"getCurrentTime":this.Eb(e,s);break;case"getBuffered":T(e)&&e.length&&this.Ye(e[e.length-1][1],s);break;case"setMuted":this.ab(c(this.b.$state.volume),e,s);break;case"getChapters":break;case"getQualities":this.pc(e,s);break}}ih(){for(const t of V)this.q("addEventListener",t)}Aa(t){this.c("pause",void 0,t),this.G?.resolve(),this.G=null}xb(t){this.c("play",void 0,t),this.E?.resolve(),this.E=null}jh(t){const{paused:e}=this.b.$state;e()||this.c("playing",void 0,t)}Ye(t,e){const s={buffered:new o(0,t),seekable:this.Hb};this.c("progress",s,e)}kh(t){this.c("waiting",void 0,t)}lh(t){const{paused:e}=this.b.$state;e()||this.c("playing",void 0,t)}dd(t){const{paused:e}=this.b.$state;e()&&this.c("play",void 0,t),this.c("waiting",void 0,t)}ab(t,e,s){const i={volume:t,muted:e};this.c("volume-change",i,s)}pc(t,e){this.b.qualities[y.Za]=t.some(s=>s.id==="auto")?()=>{this.q("setQuality","auto")}:void 0;for(const s of t){if(s.id==="auto")continue;const i=+s.id.slice(0,-1);isNaN(i)||this.b.qualities[l.oa]({id:s.id,width:i*(16/9),height:i,codec:"avc1,h.264",bitrate:-1},e)}this.fb(t.find(s=>s.active),e)}fb({id:t}={},e){if(!t)return;const s=t==="auto",i=this.b.qualities.toArray().find(a=>a.id===t);s?(this.b.qualities[y.Ya](s,e),this.b.qualities[l.pa](void 0,!0,e)):this.b.qualities[l.pa](i,!0,e)}mh(t,e,s){switch(t){case"ready":this.ih();break;case"loaded":this.md(s);break;case"play":this.xb(s);break;case"playProgress":this.jh(s);break;case"pause":this.Aa(s);break;case"loadProgress":this.Ye(e.seconds,s);break;case"waiting":this.dd(s);break;case"bufferstart":this.kh(s);break;case"bufferend":this.lh(s);break;case"volumechange":this.ab(e.volume,c(this.b.$state.muted),s);break;case"durationchange":this.Hb=new o(0,e.duration),this.c("duration-change",e.duration,s);break;case"playbackratechange":this.c("rate-change",e.playbackRate,s);break;case"qualitychange":this.fb(e,s);break;case"fullscreenchange":this.c("fullscreen-change",e.fullscreen,s);break;case"enterpictureinpicture":this.c("picture-in-picture-change",!0,s);break;case"leavepictureinpicture":this.c("picture-in-picture-change",!1,s);break;case"ended":this.c("end",void 0,s);break;case"error":this.U(e,s);break;case"seeked":this.bb(e.seconds,s);break}}U(t,e){if(t.method==="play"){this.E?.reject(t.message);return}}hd(t,e){t.event?this.mh(t.event,t.data,e):t.method&&this.hh(t.method,t.value,e)}lc(){}q(t,e){return this.gd({method:t,value:e})}H(){this.Da.ra(),this.Fa=0,this.Ga=new o(0,0),this.Hb=new o(0,0),this.E=null,this.G=null,this.rd=null,this.eh=null,this.oc.set(!1)}};m.jd=/(?:https:\/\/)?(?:player\.)?vimeo(?:\.com)?\/(?:video\/)?(\d+)(?:\?hash=(.*))?/,m.dh=new Map;let H=m;export{H as VimeoProvider};
