import { i as isHLSSrc, g as getNumberOfDecimalPlaces, a as isMediaStream } from '../chunks/vidstack-XcK8ubY-.js';
import { L as useDisposalBin, e as effect, o as onDispose, l as listenEvent, p as peek, M as isNil, D as DOMEvent, q as createScope, k as setAttribute, r as isString } from '../chunks/vidstack-s5pw8Cb6.js';
import { R as RAFLoop } from '../chunks/vidstack-4jGm7oeB.js';
import { g as IS_SAFARI, L as ListSymbol } from '../chunks/vidstack-XmoYV57V.js';

class HTMLMediaEvents {
  constructor(_provider, _ctx) {
    this.i = _provider;
    this.b = _ctx;
    this.sa = useDisposalBin();
    this.Cb = false;
    this.$c = false;
    this.ad = false;
    this.Da = new RAFLoop(this.bd.bind(this));
    this.Qe = void 0;
    this.Dg = void 0;
    this.pg();
    effect(this.qg.bind(this));
    onDispose(this.cd.bind(this));
  }
  get a() {
    return this.i.media;
  }
  get c() {
    return this.b.delegate.c;
  }
  cd() {
    this.$c = false;
    this.ad = false;
    this.Da.ra();
    this.sa.empty();
  }
  /**
   * The `timeupdate` event fires surprisingly infrequently during playback, meaning your progress
   * bar (or whatever else is synced to the currentTime) moves in a choppy fashion. This helps
   * resolve that by retrieving time updates in a request animation frame loop.
   */
  bd() {
    const newTime = this.a.currentTime;
    if (this.b.$state.currentTime() !== newTime)
      this.$a(newTime);
  }
  pg() {
    this.t("loadstart", this.Ea);
    this.t("abort", this.Pe);
    this.t("emptied", this.rg);
    this.t("error", this.U);
    this.t("volumechange", this.ab);
  }
  sg() {
    if (this.$c)
      return;
    this.sa.add(
      this.t("loadeddata", this.tg),
      this.t("loadedmetadata", this.ug),
      this.t("canplay", this.hc),
      this.t("canplaythrough", this.vg),
      this.t("durationchange", this.wg),
      this.t("play", this.xb),
      this.t("progress", this.ic),
      this.t("stalled", this.xg),
      this.t("suspend", this.yg)
    );
    this.$c = true;
  }
  zg() {
    if (this.ad)
      return;
    this.sa.add(
      this.t("pause", this.Aa),
      this.t("playing", this.Ag),
      this.t("ratechange", this.Bg),
      this.t("seeked", this.bb),
      this.t("seeking", this.Cg),
      this.t("ended", this.Db),
      this.t("waiting", this.dd)
    );
    this.ad = true;
  }
  t(eventType, handler) {
    return listenEvent(
      this.a,
      eventType,
      handler.bind(this)
    );
  }
  Eg(event2) {
    return;
  }
  $a(time, trigger) {
    const detail = {
      // Avoid errors where `currentTime` can have higher precision.
      currentTime: Math.min(time, this.b.$state.seekableEnd()),
      played: this.a.played
    };
    this.c("time-update", detail, trigger);
  }
  Ea(event2) {
    if (this.a.networkState === 3) {
      this.Pe(event2);
      return;
    }
    this.sg();
    this.c("load-start", void 0, event2);
  }
  Pe(event2) {
    this.c("abort", void 0, event2);
  }
  rg() {
    this.c("emptied", void 0, event);
  }
  tg(event2) {
    this.c("loaded-data", void 0, event2);
  }
  ug(event2) {
    this.zg();
    this.c("loaded-metadata", void 0, event2);
    if (IS_SAFARI && isHLSSrc(this.b.$state.source())) {
      this.b.delegate.jc(this.ed(), event2);
    }
  }
  ed() {
    return {
      provider: peek(this.b.$provider),
      duration: this.a.duration,
      buffered: this.a.buffered,
      seekable: this.a.seekable
    };
  }
  xb(event2) {
    if (!this.b.$state.canPlay)
      return;
    this.c("play", void 0, event2);
  }
  Aa(event2) {
    if (this.a.readyState === 1 && !this.Cb)
      return;
    this.Cb = false;
    this.Da.ra();
    this.c("pause", void 0, event2);
  }
  hc(event2) {
    this.b.delegate.jc(this.ed(), event2);
  }
  vg(event2) {
    if (this.b.$state.started())
      return;
    this.c("can-play-through", this.ed(), event2);
  }
  Ag(event2) {
    this.Cb = false;
    this.c("playing", void 0, event2);
    this.Da.Bb();
  }
  xg(event2) {
    this.c("stalled", void 0, event2);
    if (this.a.readyState < 3) {
      this.Cb = true;
      this.c("waiting", void 0, event2);
    }
  }
  dd(event2) {
    if (this.a.readyState < 3) {
      this.Cb = true;
      this.c("waiting", void 0, event2);
    }
  }
  Db(event2) {
    this.Da.ra();
    this.$a(this.a.duration, event2);
    this.c("end", void 0, event2);
    if (this.b.$state.loop()) {
      const hasCustomControls = isNil(this.a.controls);
      if (hasCustomControls)
        this.a.controls = false;
    }
  }
  qg() {
    if (this.b.$state.paused()) {
      listenEvent(this.a, "timeupdate", this.Eb.bind(this));
    }
  }
  Eb(event2) {
    this.$a(this.a.currentTime, event2);
  }
  wg(event2) {
    if (this.b.$state.ended()) {
      this.$a(this.a.duration, event2);
    }
    this.c("duration-change", this.a.duration, event2);
  }
  ab(event2) {
    const detail = {
      volume: this.a.volume,
      muted: this.a.muted
    };
    this.c("volume-change", detail, event2);
  }
  bb(event2) {
    this.$a(this.a.currentTime, event2);
    this.c("seeked", this.a.currentTime, event2);
    if (Math.trunc(this.a.currentTime) === Math.trunc(this.a.duration) && getNumberOfDecimalPlaces(this.a.duration) > getNumberOfDecimalPlaces(this.a.currentTime)) {
      this.$a(this.a.duration, event2);
      if (!this.a.ended) {
        this.b.player.dispatch(
          new DOMEvent("media-play-request", {
            trigger: event2
          })
        );
      }
    }
  }
  Cg(event2) {
    this.c("seeking", this.a.currentTime, event2);
  }
  ic(event2) {
    const detail = {
      buffered: this.a.buffered,
      seekable: this.a.seekable
    };
    this.c("progress", detail, event2);
  }
  yg(event2) {
    this.c("suspend", void 0, event2);
  }
  Bg(event2) {
    this.c("rate-change", this.a.playbackRate, event2);
  }
  U(event2) {
    const error = this.a.error;
    if (!error)
      return;
    const detail = {
      message: error.message,
      code: error.code,
      mediaError: error
    };
    this.c("error", detail, event2);
  }
}

class NativeAudioTracks {
  constructor(_provider, _ctx) {
    this.i = _provider;
    this.b = _ctx;
    this.Fb.onaddtrack = this.Fg.bind(this);
    this.Fb.onremovetrack = this.Gg.bind(this);
    this.Fb.onchange = this.Hg.bind(this);
    listenEvent(this.b.audioTracks, "change", this.Ig.bind(this));
  }
  get Fb() {
    return this.i.media.audioTracks;
  }
  Fg(event) {
    const _track = event.track;
    if (_track.label === "")
      return;
    const audioTrack = {
      id: _track.id + "",
      label: _track.label,
      language: _track.language,
      kind: _track.kind,
      selected: false
    };
    this.b.audioTracks[ListSymbol.oa](audioTrack, event);
    if (_track.enabled)
      audioTrack.selected = true;
  }
  Gg(event) {
    const track = this.b.audioTracks.getById(event.track.id);
    if (track)
      this.b.audioTracks[ListSymbol.Yb](track, event);
  }
  Hg(event) {
    let enabledTrack = this.Re();
    if (!enabledTrack)
      return;
    const track = this.b.audioTracks.getById(enabledTrack.id);
    if (track)
      this.b.audioTracks[ListSymbol.pa](track, true, event);
  }
  Re() {
    return Array.from(this.Fb).find((track) => track.enabled);
  }
  Ig(event) {
    const { current } = event.detail;
    if (!current)
      return;
    const track = this.Fb.getTrackById(current.id);
    if (track) {
      const prev = this.Re();
      if (prev)
        prev.enabled = false;
      track.enabled = true;
    }
  }
}

class HTMLMediaProvider {
  constructor(_media) {
    this.a = _media;
    this.scope = createScope();
    this.V = null;
  }
  setup(ctx) {
    new HTMLMediaEvents(this, ctx);
    if ("audioTracks" in this.media)
      new NativeAudioTracks(this, ctx);
    onDispose(() => {
      this.a.setAttribute("src", "");
      this.a.load();
    });
  }
  get type() {
    return "";
  }
  get media() {
    return this.a;
  }
  get currentSrc() {
    return this.V;
  }
  setPlaybackRate(rate) {
    this.a.playbackRate = rate;
  }
  async play() {
    return this.a.play();
  }
  async pause() {
    return this.a.pause();
  }
  setMuted(muted) {
    this.a.muted = muted;
  }
  setVolume(volume) {
    this.a.volume = volume;
  }
  setCurrentTime(time) {
    this.a.currentTime = time;
  }
  setPlaysinline(playsinline) {
    setAttribute(this.a, "playsinline", playsinline);
  }
  async loadSource({ src, type }, preload) {
    this.a.preload = preload || "";
    if (isMediaStream(src)) {
      this.a.srcObject = src;
    } else {
      this.a.srcObject = null;
      this.a.src = isString(src) ? src : window.URL.createObjectURL(src);
    }
    this.a.load();
    this.V = {
      src,
      type
    };
  }
}

export { HTMLMediaProvider };
