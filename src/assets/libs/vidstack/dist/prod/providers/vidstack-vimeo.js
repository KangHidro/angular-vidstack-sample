import { q as createScope, m as signal, e as effect, p as peek, r as isString, v as deferredPromise, l as listenEvent, w as isArray } from '../chunks/vidstack-s5pw8Cb6.js';
import { T as TimeRange } from '../chunks/vidstack-8n__KtFR.js';
import { p as preconnect } from '../chunks/vidstack-UV9ceSS6.js';
import { L as ListSymbol } from '../chunks/vidstack-XmoYV57V.js';
import { c as coerceToError, Q as QualitySymbol } from '../chunks/vidstack-yqTzryo_.js';
import { R as RAFLoop } from '../chunks/vidstack-4jGm7oeB.js';
import { E as EmbedProvider, t as timedPromise } from '../chunks/vidstack-cgu9mlil.js';

const trackedVimeoEvents = [
  "bufferend",
  "bufferstart",
  // 'cuechange',
  "durationchange",
  "ended",
  "enterpictureinpicture",
  "error",
  "fullscreenchange",
  "leavepictureinpicture",
  "loaded",
  // 'loadeddata',
  // 'loadedmetadata',
  // 'loadstart',
  "playProgress",
  "loadProgress",
  "pause",
  "play",
  "playbackratechange",
  // 'progress',
  "qualitychange",
  "seeked",
  "seeking",
  // 'texttrackchange',
  "timeupdate",
  "volumechange",
  "waiting"
  // 'adstarted',
  // 'adcompleted',
  // 'aderror',
  // 'adskipped',
  // 'adallcompleted',
  // 'adclicked',
  // 'chapterchange',
  // 'chromecastconnected',
  // 'remoteplaybackavailabilitychange',
  // 'remoteplaybackconnecting',
  // 'remoteplaybackconnect',
  // 'remoteplaybackdisconnect',
  // 'liveeventended',
  // 'liveeventstarted',
  // 'livestreamoffline',
  // 'livestreamonline',
];

class VimeoProvider extends EmbedProvider {
  constructor() {
    super(...arguments);
    this.$$PROVIDER_TYPE = "VIMEO";
    this.scope = createScope();
    this.Fa = 0;
    this.Ga = new TimeRange(0, 0);
    this.Hb = new TimeRange(0, 0);
    this.E = null;
    this.G = null;
    this.rd = null;
    this.N = signal("");
    this.oc = signal(false);
    this.sd = null;
    this.V = null;
    this.eh = null;
    this.Da = new RAFLoop(this.bd.bind(this));
    /**
     * Whether tracking session data should be enabled on the embed, including cookies and analytics.
     * This is turned off by default to be GDPR-compliant.
     *
     * @defaultValue `false`
     */
    this.cookies = false;
    this.title = true;
    this.byline = true;
    this.portrait = true;
    this.color = "00ADEF";
  }
  static {
    this.jd = /(?:https:\/\/)?(?:player\.)?vimeo(?:\.com)?\/(?:video\/)?(\d+)(?:\?hash=(.*))?/;
  }
  static {
    this.dh = /* @__PURE__ */ new Map();
  }
  get c() {
    return this.b.delegate.c;
  }
  get type() {
    return "vimeo";
  }
  get currentSrc() {
    return this.V;
  }
  get videoId() {
    return this.N();
  }
  get hash() {
    return this.sd;
  }
  get isPro() {
    return this.oc();
  }
  preconnect() {
    const connections = [
      this.eb(),
      "https://i.vimeocdn.com",
      "https://f.vimeocdn.com",
      "https://fresnel.vimeocdn.com"
    ];
    for (const url of connections) {
      preconnect(url, "preconnect");
    }
  }
  setup(ctx) {
    this.b = ctx;
    super.setup(ctx);
    effect(this.kd.bind(this));
    effect(this.fh.bind(this));
    effect(this.gh.bind(this));
    this.c("provider-setup", this);
  }
  destroy() {
    this.H();
    this.q("destroy");
  }
  async play() {
    const { paused } = this.b.$state;
    if (!peek(paused))
      return;
    if (!this.E) {
      this.E = timedPromise(() => {
        this.E = null;
        if (paused())
          return "Timed out.";
      });
      this.q("play");
    }
    return this.E.promise;
  }
  async pause() {
    const { paused } = this.b.$state;
    if (peek(paused))
      return;
    if (!this.G) {
      this.G = timedPromise(() => {
        this.G = null;
        if (!paused())
          return "Timed out.";
      });
      this.q("pause");
    }
    return this.G.promise;
  }
  setMuted(muted) {
    this.q("setMuted", muted);
  }
  setCurrentTime(time) {
    this.q("seekTo", time);
  }
  setVolume(volume) {
    this.q("setVolume", volume);
    this.q("setMuted", peek(this.b.$state.muted));
  }
  setPlaybackRate(rate) {
    this.q("setPlaybackRate", rate);
  }
  async loadSource(src) {
    if (!isString(src.src)) {
      this.V = null;
      this.sd = null;
      this.N.set("");
      return;
    }
    const matches = src.src.match(VimeoProvider.jd), videoId = matches?.[1], hash = matches?.[2];
    this.N.set(videoId ?? "");
    this.sd = hash ?? null;
    this.V = src;
  }
  kd() {
    this.H();
    const videoId = this.N();
    if (!videoId) {
      this.cb.set("");
      return;
    }
    this.cb.set(`${this.eb()}/video/${videoId}`);
  }
  fh() {
    const src = this.cb(), videoId = this.N(), cache = VimeoProvider.dh, info = cache.get(videoId);
    if (!videoId)
      return;
    const promise = deferredPromise();
    this.rd = promise;
    if (info) {
      promise.resolve(info);
      return;
    }
    const oembedSrc = `https://vimeo.com/api/oembed.json?url=${src}`, abort = new AbortController();
    window.fetch(oembedSrc, {
      mode: "cors",
      signal: abort.signal
    }).then((response) => response.json()).then((data) => {
      const thumnailRegex = /vimeocdn.com\/video\/(.*)?_/, thumbnailId = data?.thumbnail_url?.match(thumnailRegex)?.[1], poster = thumbnailId ? `https://i.vimeocdn.com/video/${thumbnailId}_1920x1080.webp` : "", info2 = {
        title: data?.title ?? "",
        duration: data?.duration ?? 0,
        poster,
        pro: data.account_type !== "basic"
      };
      cache.set(videoId, info2);
      promise.resolve(info2);
    }).catch((e) => {
      promise.reject();
      this.c("error", {
        message: `Failed to fetch vimeo video info from \`${oembedSrc}\`.`,
        code: 1,
        error: coerceToError(e)
      });
    });
    return () => {
      promise.reject();
      abort.abort();
    };
  }
  gh() {
    const isPro = this.oc(), { $state, qualities } = this.b;
    $state.canSetPlaybackRate.set(isPro);
    qualities[ListSymbol.Mc](!isPro);
    if (isPro) {
      return listenEvent(qualities, "change", () => {
        if (qualities.auto)
          return;
        const id = qualities.selected?.id;
        if (id)
          this.q("setQuality", id);
      });
    }
  }
  eb() {
    return "https://player.vimeo.com";
  }
  Te() {
    const { $iosControls } = this.b, { keyDisabled } = this.b.$props, { controls, playsinline } = this.b.$state, showControls = controls() || $iosControls();
    return {
      title: this.title,
      byline: this.byline,
      color: this.color,
      portrait: this.portrait,
      controls: showControls,
      h: this.hash,
      keyboard: showControls && !keyDisabled(),
      transparent: true,
      playsinline: playsinline(),
      dnt: !this.cookies
    };
  }
  bd() {
    this.q("getCurrentTime");
  }
  Eb(time, trigger) {
    const { currentTime, paused, seeking, bufferedEnd } = this.b.$state;
    if (seeking() && paused()) {
      this.q("getBuffered");
      if (bufferedEnd() > time)
        this.c("seeked", time, trigger);
    }
    if (currentTime() === time)
      return;
    const prevTime = currentTime(), detail = {
      currentTime: time,
      played: this.Fa >= time ? this.Ga : this.Ga = new TimeRange(0, this.Fa = time)
    };
    this.c("time-update", detail, trigger);
    if (Math.abs(prevTime - time) > 1.5) {
      this.c("seeking", time, trigger);
      if (!paused() && bufferedEnd() < time) {
        this.c("waiting", void 0, trigger);
      }
    }
  }
  bb(time, trigger) {
    this.c("seeked", time, trigger);
  }
  md(trigger) {
    const videoId = this.N();
    this.rd?.promise.then((info) => {
      if (!info)
        return;
      const { title, poster, duration, pro } = info, { $iosControls } = this.b, { controls } = this.b.$state, showControls = controls() || $iosControls();
      this.Da.Bb();
      this.oc.set(pro);
      this.Hb = new TimeRange(0, duration);
      this.c("poster-change", poster, trigger);
      this.c("title-change", title, trigger);
      this.c("duration-change", duration, trigger);
      const detail = {
        buffered: new TimeRange(0, 0),
        seekable: this.Hb,
        duration
      };
      this.b.delegate.jc(detail, trigger);
      if (!showControls) {
        this.q("_hideOverlay");
      }
      this.q("getQualities");
    }).catch((e) => {
      if (videoId !== this.N())
        return;
      this.c("error", {
        message: `Failed to fetch oembed data`,
        code: 2,
        error: coerceToError(e)
      });
    });
  }
  hh(method, data, trigger) {
    switch (method) {
      case "getCurrentTime":
        this.Eb(data, trigger);
        break;
      case "getBuffered":
        if (isArray(data) && data.length) {
          this.Ye(data[data.length - 1][1], trigger);
        }
        break;
      case "setMuted":
        this.ab(peek(this.b.$state.volume), data, trigger);
        break;
      case "getChapters":
        break;
      case "getQualities":
        this.pc(data, trigger);
        break;
    }
  }
  ih() {
    for (const type of trackedVimeoEvents) {
      this.q("addEventListener", type);
    }
  }
  Aa(trigger) {
    this.c("pause", void 0, trigger);
    this.G?.resolve();
    this.G = null;
  }
  xb(trigger) {
    this.c("play", void 0, trigger);
    this.E?.resolve();
    this.E = null;
  }
  jh(trigger) {
    const { paused } = this.b.$state;
    if (!paused()) {
      this.c("playing", void 0, trigger);
    }
  }
  Ye(buffered, trigger) {
    const detail = {
      buffered: new TimeRange(0, buffered),
      seekable: this.Hb
    };
    this.c("progress", detail, trigger);
  }
  kh(trigger) {
    this.c("waiting", void 0, trigger);
  }
  lh(trigger) {
    const { paused } = this.b.$state;
    if (!paused())
      this.c("playing", void 0, trigger);
  }
  dd(trigger) {
    const { paused } = this.b.$state;
    if (paused()) {
      this.c("play", void 0, trigger);
    }
    this.c("waiting", void 0, trigger);
  }
  ab(volume, muted, trigger) {
    const detail = { volume, muted };
    this.c("volume-change", detail, trigger);
  }
  // protected _onTextTrackChange(track: VimeoTextTrack, trigger: Event) {
  //   const textTrack = this._ctx.textTracks.toArray().find((t) => t.language === track.language);
  //   if (textTrack) textTrack.mode = track.mode;
  // }
  // protected _onTextTracksChange(tracks: VimeoTextTrack[], trigger: Event) {
  //   for (const init of tracks) {
  //     const textTrack = new TextTrack({
  //       ...init,
  //       label: init.label.replace('auto-generated', 'auto'),
  //     });
  //     textTrack[TextTrackSymbol._readyState] = 2;
  //     this._ctx.textTracks.add(textTrack, trigger);
  //     textTrack.setMode(init.mode, trigger);
  //   }
  // }
  // protected _onCueChange(cue: VimeoTextCue, trigger: Event) {
  //   const { textTracks, $state } = this._ctx,
  //     { currentTime } = $state,
  //     track = textTracks.selected;
  //   if (this._currentCue) track?.removeCue(this._currentCue, trigger);
  //   this._currentCue = new window.VTTCue(currentTime(), Number.MAX_SAFE_INTEGER, cue.text);
  //   track?.addCue(this._currentCue, trigger);
  // }
  pc(qualities, trigger) {
    this.b.qualities[QualitySymbol.Za] = qualities.some((q) => q.id === "auto") ? () => {
      this.q("setQuality", "auto");
    } : void 0;
    for (const quality of qualities) {
      if (quality.id === "auto")
        continue;
      const height = +quality.id.slice(0, -1);
      if (isNaN(height))
        continue;
      this.b.qualities[ListSymbol.oa](
        {
          id: quality.id,
          width: height * (16 / 9),
          height,
          codec: "avc1,h.264",
          bitrate: -1
        },
        trigger
      );
    }
    this.fb(
      qualities.find((q) => q.active),
      trigger
    );
  }
  fb({ id } = {}, trigger) {
    if (!id)
      return;
    const isAuto = id === "auto", newQuality = this.b.qualities.toArray().find((q) => q.id === id);
    if (isAuto) {
      this.b.qualities[QualitySymbol.Ya](isAuto, trigger);
      this.b.qualities[ListSymbol.pa](void 0, true, trigger);
    } else {
      this.b.qualities[ListSymbol.pa](newQuality, true, trigger);
    }
  }
  mh(event, payload, trigger) {
    switch (event) {
      case "ready":
        this.ih();
        break;
      case "loaded":
        this.md(trigger);
        break;
      case "play":
        this.xb(trigger);
        break;
      case "playProgress":
        this.jh(trigger);
        break;
      case "pause":
        this.Aa(trigger);
        break;
      case "loadProgress":
        this.Ye(payload.seconds, trigger);
        break;
      case "waiting":
        this.dd(trigger);
        break;
      case "bufferstart":
        this.kh(trigger);
        break;
      case "bufferend":
        this.lh(trigger);
        break;
      case "volumechange":
        this.ab(payload.volume, peek(this.b.$state.muted), trigger);
        break;
      case "durationchange":
        this.Hb = new TimeRange(0, payload.duration);
        this.c("duration-change", payload.duration, trigger);
        break;
      case "playbackratechange":
        this.c("rate-change", payload.playbackRate, trigger);
        break;
      case "qualitychange":
        this.fb(payload, trigger);
        break;
      case "fullscreenchange":
        this.c("fullscreen-change", payload.fullscreen, trigger);
        break;
      case "enterpictureinpicture":
        this.c("picture-in-picture-change", true, trigger);
        break;
      case "leavepictureinpicture":
        this.c("picture-in-picture-change", false, trigger);
        break;
      case "ended":
        this.c("end", void 0, trigger);
        break;
      case "error":
        this.U(payload, trigger);
        break;
      case "seeked":
        this.bb(payload.seconds, trigger);
        break;
    }
  }
  U(error, trigger) {
    if (error.method === "play") {
      this.E?.reject(error.message);
      return;
    }
  }
  hd(message, event) {
    if (message.event) {
      this.mh(message.event, message.data, event);
    } else if (message.method) {
      this.hh(message.method, message.value, event);
    }
  }
  lc() {
  }
  q(command, arg) {
    return this.gd({
      method: command,
      value: arg
    });
  }
  H() {
    this.Da.ra();
    this.Fa = 0;
    this.Ga = new TimeRange(0, 0);
    this.Hb = new TimeRange(0, 0);
    this.E = null;
    this.G = null;
    this.rd = null;
    this.eh = null;
    this.oc.set(false);
  }
}

export { VimeoProvider };
