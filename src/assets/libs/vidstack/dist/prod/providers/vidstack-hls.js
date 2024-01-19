import { b as TextTrack, T as TextTrackSymbol, l as loadScript, p as preconnect } from '../chunks/vidstack-UV9ceSS6.js';
import { L as ListSymbol, I as IS_CHROME, i as isHLSSupported } from '../chunks/vidstack-XmoYV57V.js';
import { VideoProvider } from './vidstack-video.js';
import { p as peek, D as DOMEvent, l as listenEvent, e as effect, r as isString, K as camelToKebabCase, i as isUndefined, x as isFunction } from '../chunks/vidstack-s5pw8Cb6.js';
import { Q as QualitySymbol, c as coerceToError } from '../chunks/vidstack-yqTzryo_.js';
import { R as RAFLoop } from '../chunks/vidstack-4jGm7oeB.js';
import './vidstack-html.js';
import '../chunks/vidstack-XcK8ubY-.js';

const toDOMEventType = (type) => camelToKebabCase(type);
class HLSController {
  constructor(_video) {
    this.m = _video;
    this.g = null;
    this.nd = null;
    this.od = {};
    this.pd = /* @__PURE__ */ new Set();
    this.yk = -1;
  }
  get instance() {
    return this.g;
  }
  setup(ctor, ctx) {
    this.b = ctx;
    const isLive = peek(ctx.$state.streamType).includes("live"), isLiveLowLatency = peek(ctx.$state.streamType).includes("ll-");
    this.g = new ctor({
      lowLatencyMode: isLiveLowLatency,
      backBufferLength: isLiveLowLatency ? 4 : isLive ? 8 : void 0,
      renderTextTracksNatively: false,
      ...this.od
    });
    const dispatcher = this.Sg.bind(this);
    for (const event of Object.values(ctor.Events))
      this.g.on(event, dispatcher);
    this.g.on(ctor.Events.ERROR, this.U.bind(this));
    for (const callback of this.pd)
      callback(this.g);
    ctx.player.dispatch(new DOMEvent("hls-instance", { detail: this.g }));
    this.g.attachMedia(this.m);
    this.g.on(ctor.Events.FRAG_LOADING, this.Bk.bind(this));
    this.g.on(ctor.Events.AUDIO_TRACK_SWITCHED, this.Tg.bind(this));
    this.g.on(ctor.Events.LEVEL_SWITCHED, this.Ug.bind(this));
    this.g.on(ctor.Events.LEVEL_LOADED, this.Vg.bind(this));
    this.g.on(ctor.Events.NON_NATIVE_TEXT_TRACKS_FOUND, this.Wg.bind(this));
    this.g.on(ctor.Events.CUES_PARSED, this.Xg.bind(this));
    ctx.qualities[QualitySymbol.Za] = this.Yg.bind(this);
    listenEvent(ctx.qualities, "change", this.fb.bind(this));
    listenEvent(ctx.audioTracks, "change", this.Zg.bind(this));
    this.nd = effect(this._g.bind(this));
  }
  _g() {
    if (!this.b.$state.live())
      return;
    const raf = new RAFLoop(this.$g.bind(this));
    raf.Bb();
    return raf.ra.bind(raf);
  }
  $g() {
    this.b.$state.liveSyncPosition.set(this.g?.liveSyncPosition ?? Infinity);
  }
  Sg(eventType, detail) {
    this.b.player?.dispatch(new DOMEvent(toDOMEventType(eventType), { detail }));
  }
  Wg(eventType, data) {
    const event = new DOMEvent(eventType, { detail: data });
    let currentTrack = -1;
    for (let i = 0; i < data.tracks.length; i++) {
      const nonNativeTrack = data.tracks[i], init = nonNativeTrack.subtitleTrack ?? nonNativeTrack.closedCaptions, track = new TextTrack({
        id: `hls-${nonNativeTrack.kind}${i}`,
        src: init?.url,
        label: nonNativeTrack.label,
        language: init?.lang,
        kind: nonNativeTrack.kind
      });
      track[TextTrackSymbol.M] = 2;
      track[TextTrackSymbol.Ua] = () => {
        if (track.mode === "showing") {
          this.g.subtitleTrack = i;
          currentTrack = i;
        } else if (currentTrack === i) {
          this.g.subtitleTrack = -1;
          currentTrack = -1;
        }
      };
      if (nonNativeTrack.default)
        track.setMode("showing", event);
      this.b.textTracks.add(track, event);
    }
  }
  Xg(eventType, data) {
    const track = this.b.textTracks.getById(`hls-${data.track}`);
    if (!track)
      return;
    const event = new DOMEvent(eventType, { detail: data });
    for (const cue of data.cues) {
      cue.positionAlign = "auto";
      track.addCue(cue, event);
    }
  }
  Tg(eventType, data) {
    const track = this.b.audioTracks[data.id];
    if (track) {
      this.b.audioTracks[ListSymbol.pa](
        track,
        true,
        new DOMEvent(eventType, { detail: data })
      );
    }
  }
  Ug(eventType, data) {
    const quality = this.b.qualities[data.level];
    if (quality) {
      this.b.qualities[ListSymbol.pa](
        quality,
        true,
        new DOMEvent(eventType, { detail: data })
      );
    }
  }
  Vg(eventType, data) {
    if (this.b.$state.canPlay())
      return;
    const { type, live, totalduration: duration, targetduration } = data.details;
    const event = new DOMEvent(eventType, { detail: data });
    this.b.delegate.c(
      "stream-type-change",
      live ? type === "EVENT" && Number.isFinite(duration) && targetduration >= 10 ? "live:dvr" : "live" : "on-demand",
      event
    );
    this.b.delegate.c("duration-change", duration, event);
    const media = this.g.media;
    if (this.g.currentLevel === -1) {
      this.b.qualities[QualitySymbol.Ya](true, event);
    }
    for (const track of this.g.audioTracks) {
      this.b.audioTracks[ListSymbol.oa](
        {
          id: track.id + "",
          label: track.name,
          language: track.lang || "",
          kind: "main"
        },
        event
      );
    }
    for (const level of this.g.levels) {
      this.b.qualities[ListSymbol.oa](
        {
          id: (level.id ?? level.height + "p") + "",
          width: level.width,
          height: level.height,
          codec: level.codecSet,
          bitrate: level.bitrate
        },
        event
      );
    }
    media.dispatchEvent(new DOMEvent("canplay", { trigger: event }));
  }
  U(eventType, data) {
    if (data.fatal) {
      switch (data.type) {
        case "networkError":
          this.Ck(data.error);
          break;
        case "mediaError":
          this.g?.recoverMediaError();
          break;
        default:
          this.Ak(data.error);
          break;
      }
    }
  }
  Bk() {
    if (this.yk >= 0)
      this.zk();
  }
  Ck(error) {
    this.zk();
    this.g?.startLoad();
    this.yk = window.setTimeout(() => {
      this.yk = -1;
      this.Ak(error);
    }, 5e3);
  }
  zk() {
    clearTimeout(this.yk);
    this.yk = -1;
  }
  Ak(error) {
    this.g?.destroy();
    this.g = null;
    this.b.delegate.c("error", {
      message: error.message,
      code: 1,
      error
    });
  }
  Yg() {
    if (this.g)
      this.g.currentLevel = -1;
  }
  fb() {
    const { qualities } = this.b;
    if (!this.g || qualities.auto)
      return;
    this.g[qualities.switch + "Level"] = qualities.selectedIndex;
    if (IS_CHROME)
      this.m.currentTime = this.m.currentTime;
  }
  Zg() {
    const { audioTracks } = this.b;
    if (this.g && this.g.audioTrack !== audioTracks.selectedIndex) {
      this.g.audioTrack = audioTracks.selectedIndex;
    }
  }
  Dk(src) {
    if (!isString(src.src))
      return;
    this.zk();
    this.g?.loadSource(src.src);
  }
  ah() {
    this.zk();
    if (this.b)
      this.b.qualities[QualitySymbol.Za] = void 0;
    this.g?.destroy();
    this.g = null;
    this.nd?.();
    this.nd = null;
  }
}

class HLSLibLoader {
  constructor(_lib, _ctx, _callback) {
    this.W = _lib;
    this.b = _ctx;
    this.Ca = _callback;
    this.bh();
  }
  async bh() {
    const callbacks = {
      onLoadStart: this.Ea.bind(this),
      onLoaded: this.qd.bind(this),
      onLoadError: this.ch.bind(this)
    };
    let ctor = await loadHLSScript(this.W, callbacks);
    if (isUndefined(ctor) && !isString(this.W))
      ctor = await importHLS(this.W, callbacks);
    if (!ctor)
      return null;
    if (!ctor.isSupported()) {
      const message = "[vidstack]: `hls.js` is not supported in this environment";
      this.b.player.dispatch(new DOMEvent("hls-unsupported"));
      this.b.delegate.c("error", { message, code: 4 });
      return null;
    }
    return ctor;
  }
  Ea() {
    this.b.player.dispatch(new DOMEvent("hls-lib-load-start"));
  }
  qd(ctor) {
    this.b.player.dispatch(
      new DOMEvent("hls-lib-loaded", {
        detail: ctor
      })
    );
    this.Ca(ctor);
  }
  ch(e) {
    const error = coerceToError(e);
    this.b.player.dispatch(
      new DOMEvent("hls-lib-load-error", {
        detail: error
      })
    );
    this.b.delegate.c("error", {
      message: error.message,
      code: 4,
      error
    });
  }
}
async function importHLS(loader, callbacks = {}) {
  if (isUndefined(loader))
    return void 0;
  callbacks.onLoadStart?.();
  if (loader.prototype && loader.prototype !== Function) {
    callbacks.onLoaded?.(loader);
    return loader;
  }
  try {
    const ctor = (await loader())?.default;
    if (ctor && !!ctor.isSupported) {
      callbacks.onLoaded?.(ctor);
    } else {
      throw Error(
        false ? "[vidstack] failed importing `hls.js`. Dynamic import returned invalid constructor." : ""
      );
    }
    return ctor;
  } catch (err) {
    callbacks.onLoadError?.(err);
  }
  return void 0;
}
async function loadHLSScript(src, callbacks = {}) {
  if (!isString(src))
    return void 0;
  callbacks.onLoadStart?.();
  try {
    await loadScript(src);
    if (!isFunction(window.Hls)) {
      throw Error(
        false ? "[vidstack] failed loading `hls.js`. Could not find a valid `Hls` constructor on window" : ""
      );
    }
    const ctor = window.Hls;
    callbacks.onLoaded?.(ctor);
    return ctor;
  } catch (err) {
    callbacks.onLoadError?.(err);
  }
  return void 0;
}

const JS_DELIVR_CDN = "https://cdn.jsdelivr.net";
class HLSProvider extends VideoProvider {
  constructor() {
    super(...arguments);
    this.$$PROVIDER_TYPE = "HLS";
    this.Xe = null;
    this.d = new HLSController(this.video);
    this.Gb = `${JS_DELIVR_CDN}/npm/hls.js@^1.0.0/dist/hls${".min.js"}`;
  }
  /**
   * The `hls.js` constructor.
   */
  get ctor() {
    return this.Xe;
  }
  /**
   * The current `hls.js` instance.
   */
  get instance() {
    return this.d.instance;
  }
  static {
    /**
     * Whether `hls.js` is supported in this environment.
     */
    this.supported = isHLSSupported();
  }
  get type() {
    return "hls";
  }
  get canLiveSync() {
    return true;
  }
  /**
   * The `hls.js` configuration object.
   *
   * @see {@link https://github.com/video-dev/hls.js/blob/master/docs/API.md#fine-tuning}
   */
  get config() {
    return this.d.od;
  }
  set config(config) {
    this.d.od = config;
  }
  /**
   * The `hls.js` constructor (supports dynamic imports) or a URL of where it can be found.
   *
   * @defaultValue `https://cdn.jsdelivr.net/npm/hls.js@^1.0.0/dist/hls.min.js`
   */
  get library() {
    return this.Gb;
  }
  set library(library) {
    this.Gb = library;
  }
  preconnect() {
    if (!isString(this.Gb))
      return;
    preconnect(this.Gb);
  }
  setup(ctx) {
    super.setup(ctx);
    new HLSLibLoader(this.Gb, ctx, (ctor) => {
      this.Xe = ctor;
      this.d.setup(ctor, ctx);
      ctx.delegate.c("provider-setup", this);
      const src = peek(ctx.$state.source);
      if (src)
        this.loadSource(src);
    });
  }
  async loadSource(src, preload) {
    if (!isString(src.src))
      return;
    this.a.preload = preload || "";
    this.d.Dk(src);
    this.V = src;
  }
  /**
   * The given callback is invoked when a new `hls.js` instance is created and right before it's
   * attached to media.
   */
  onInstance(callback) {
    const instance = this.d.instance;
    if (instance)
      callback(instance);
    this.d.pd.add(callback);
    return () => this.d.pd.delete(callback);
  }
  destroy() {
    this.d.ah();
  }
}

export { HLSProvider };
