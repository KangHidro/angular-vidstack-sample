import{c as S,L as n}from"./vidstack-79gOJK6z.js";import{m as E,q as g,S as P,t as x,F as L,E as $,a0 as p,D as h,h as m,r as V,a1 as M,W,l as R,P as C,e as v,y as F,k as j}from"./vidstack-T8_rhZ1R.js";class l{get length(){return this.$.length}constructor(e,t){E(e)?this.$=e:!g(e)&&!g(t)?this.$=[[e,t]]:this.$=[]}start(e){return this.$[e][0]??1/0}end(e){return this.$[e][1]??1/0}}function y(r){if(!r.length)return null;let e=r.start(0);for(let t=1;t<r.length;t++){const i=r.start(t);i<e&&(e=i)}return e}function f(r){if(!r.length)return null;let e=r.end(0);for(let t=1;t<r.length;t++){const i=r.end(t);i>e&&(e=i)}return e}const d=new P({audioTracks:[],audioTrack:null,autoplay:!1,autoplayError:null,buffered:new l,duration:0,canLoad:!1,canFullscreen:!1,canOrientScreen:S(),canPictureInPicture:!1,canPlay:!1,controls:!1,controlsVisible:!1,crossorigin:null,currentTime:0,ended:!1,error:null,fullscreen:!1,loop:!1,logLevel:"silent",mediaType:"unknown",muted:!1,paused:!0,played:new l,playing:!1,playsinline:!1,pictureInPicture:!1,preload:"metadata",playbackRate:1,qualities:[],quality:null,autoQuality:!1,canSetQuality:!0,canSetPlaybackRate:!0,canSetVolume:!1,seekable:new l,seeking:!1,source:{src:"",type:""},sources:[],started:!1,textTracks:[],textTrack:null,volume:1,waiting:!1,get title(){return this.providedTitle||this.inferredTitle},get poster(){return this.providedPoster||this.inferredPoster},get viewType(){return this.providedViewType!=="unknown"?this.providedViewType:this.inferredViewType},get streamType(){return this.providedStreamType!=="unknown"?this.providedStreamType:this.inferredStreamType},get currentSrc(){return this.source},get bufferedStart(){return y(this.buffered)??0},get bufferedEnd(){return f(this.buffered)??0},get seekableStart(){return y(this.seekable)??0},get seekableEnd(){return this.canPlay?f(this.seekable)??1/0:0},get seekableWindow(){return Math.max(0,this.seekableEnd-this.seekableStart)},pointer:"fine",orientation:"landscape",width:0,height:0,mediaWidth:0,mediaHeight:0,userBehindLiveEdge:!1,liveEdgeTolerance:10,minLiveDVRWindow:60,get canSeek(){return/unknown|on-demand|:dvr/.test(this.streamType)&&Number.isFinite(this.seekableWindow)&&(!this.live||/:dvr/.test(this.streamType)&&this.seekableWindow>=this.minLiveDVRWindow)},get live(){return this.streamType.includes("live")||!Number.isFinite(this.duration)},get liveEdgeStart(){return this.live&&Number.isFinite(this.seekableEnd)?Math.max(0,(this.liveSyncPosition??this.seekableEnd)-this.liveEdgeTolerance):0},get liveEdge(){return this.live&&(!this.canSeek||!this.userBehindLiveEdge&&this.currentTime>=this.liveEdgeStart)},get liveEdgeWindow(){return this.live&&Number.isFinite(this.seekableEnd)?this.seekableEnd-this.liveEdgeStart:0},autoplaying:!1,providedTitle:"",inferredTitle:"",providedPoster:"",inferredPoster:"",inferredViewType:"unknown",providedViewType:"unknown",providedStreamType:"unknown",inferredStreamType:"unknown",liveSyncPosition:null}),O=new Set(["autoplay","canFullscreen","canLoad","canPictureInPicture","canSetVolume","controls","crossorigin","fullscreen","height","inferredViewType","logLevel","loop","mediaHeight","mediaType","mediaWidth","muted","orientation","pictureInPicture","playsinline","pointer","preload","providedPoster","providedStreamType","providedTitle","providedViewType","source","sources","textTrack","textTracks","volume","width"]);function Y(r){d.reset(r,e=>!O.has(e)),x()}const b=$();function T(){return L(b)}var k;class q extends p{constructor(){super(...arguments),this.r=[],this[k]=!1}get length(){return this.r.length}get readonly(){return this[n.Zb]}toArray(){return[...this.r]}[(k=n.Zb,Symbol.iterator)](){return this.r.values()}[n.oa](e,t){const i=this.r.length;""+i in this||Object.defineProperty(this,i,{get(){return this.r[i]}}),!this.r.includes(e)&&(this.r.push(e),this.dispatchEvent(new h("add",{detail:e,trigger:t})))}[n.Yb](e,t){const i=this.r.indexOf(e);i>=0&&(this[n.oe]?.(e,t),this.r.splice(i,1),this.dispatchEvent(new h("remove",{detail:e,trigger:t})))}[n.H](e){for(const t of[...this.r])this[n.Yb](t,e);this.r=[],this[n.Mc](!1,e),this[n.ne]?.()}[n.Mc](e,t){this[n.Zb]!==e&&(this[n.Zb]=e,this.dispatchEvent(new h("readonly-change",{detail:e,trigger:t})))}}const Z=eval,A=/:\s+'?"?(.*?)'?"?\)/g,D=/\s+not\s+/g,I=/\s+and\s+/g,N=/\s+or\s+/g,X=/(\d)px/g,c=class extends p{constructor(e,t){super(),this.ec=m("true"),this.Xc=new Set,this.Yc=m(!0),this.$matches=V(()=>{let i=this.ec();if(i==="never")return!1;for(const o of this.Xc){const s=this.Le[o](),a=j(s)?`'${s}'`:s+"";i=i.replace(F(o),a)}return Z(`!!(${i})`)&&this.Yc()}),this.Ke=t,this.Le=e,M(i=>{v(this.jg.bind(this)),v(this.kg.bind(this)),this.Me=i})}get query(){return W(this.Ke)}get matches(){return this.$matches()}jg(){const e=this.query;if(e==="")return;if(e==="never"){this.ec.set(e);return}const t=e.trim().split(/\s*,\s*/g),i=t.filter(s=>s.startsWith("@media")).join(","),o=t.filter(s=>!s.startsWith("@media"));if(i.length){const s=window.matchMedia(i.replace(/@media\s/g,"")),a=()=>void this.Yc.set(s.matches);a(),R(s,"change",a)}if(o.length){const s=this.lg(o),a=Object.keys(d.record);for(const w of s.matchAll(/\(([-a-zA-Z]+)\s/g)){const u=C(w[1]);a.includes(u)&&this.Xc.add(u)}this.ec.set(s)}return()=>{this.Xc.clear(),this.ec.set("true"),this.Yc.set(!0)}}kg(){this.$matches(),this.dispatchEvent(new Event("change"))}lg(e){return e.map(t=>"("+t.replace(A,' == "$1")').replace(D,"!").replace(I," && ").replace(N," || ").replace(X,"$1").trim()+")").join(" || ")}destroy(){this.Me()}};c.create=r=>{const e=T();return new c(e.$state,r)};let H=c;export{q as L,H as P,l as T,b as a,d as m,Y as s,T as u};
