import { q as createScope, m as signal, e as effect, p as peek, r as isString, t as isObject, a as isNumber, u as isBoolean } from '../chunks/vidstack-s5pw8Cb6.js';
import { T as TimeRange } from '../chunks/vidstack-8n__KtFR.js';
import { p as preconnect } from '../chunks/vidstack-UV9ceSS6.js';
import { E as EmbedProvider, t as timedPromise } from '../chunks/vidstack-cgu9mlil.js';
import '../chunks/vidstack-XmoYV57V.js';

const YouTubePlayerState = {
  Qj: -1,
  Ue: 0,
  Ve: 1,
  Mg: 2,
  Ng: 3,
  Og: 5
};

class YouTubeProvider extends EmbedProvider {
  constructor() {
    super(...arguments);
    this.$$PROVIDER_TYPE = "YOUTUBE";
    this.scope = createScope();
    this.N = signal("");
    this.mc = -1;
    this.nc = -1;
    this.Fa = 0;
    this.Ga = new TimeRange(0, 0);
    this.V = null;
    this.E = null;
    this.G = null;
    /**
     * Sets the player's interface language. The parameter value is an ISO 639-1 two-letter
     * language code or a fully specified locale. For example, fr and fr-ca are both valid values.
     * Other language input codes, such as IETF language tags (BCP 47) might also be handled properly.
     *
     * The interface language is used for tooltips in the player and also affects the default caption
     * track. Note that YouTube might select a different caption track language for a particular
     * user based on the user's individual language preferences and the availability of caption tracks.
     *
     * @defaultValue 'en'
     */
    this.language = "en";
    this.color = "red";
    /**
     * Whether cookies should be enabled on the embed. This is turned off by default to be
     * GDPR-compliant.
     *
     * @defaultValue `false`
     */
    this.cookies = false;
  }
  static {
    this.jd = /(?:youtu\.be|youtube|youtube\.com|youtube-nocookie\.com)\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|)((?:\w|-){11})/;
  }
  static {
    this.We = /* @__PURE__ */ new Map();
  }
  get c() {
    return this.b.delegate.c;
  }
  get currentSrc() {
    return this.V;
  }
  get type() {
    return "youtube";
  }
  get videoId() {
    return this.N();
  }
  preconnect() {
    const connections = [
      this.eb(),
      // Botguard script.
      "https://www.google.com",
      // Poster.
      "https://i.ytimg.com",
      // Ads.
      "https://googleads.g.doubleclick.net",
      "https://static.doubleclick.net"
    ];
    for (const url of connections) {
      preconnect(url, "preconnect");
    }
  }
  setup(ctx) {
    this.b = ctx;
    super.setup(ctx);
    effect(this.kd.bind(this));
    effect(this.ld.bind(this));
    this.c("provider-setup", this);
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
      this.q("playVideo");
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
          ;
      });
      this.q("pauseVideo");
    }
    return this.G.promise;
  }
  setMuted(muted) {
    if (muted)
      this.q("mute");
    else
      this.q("unMute");
  }
  setCurrentTime(time) {
    this.q("seekTo", time);
  }
  setVolume(volume) {
    this.q("setVolume", volume * 100);
  }
  setPlaybackRate(rate) {
    this.q("setPlaybackRate", rate);
  }
  async loadSource(src) {
    if (!isString(src.src)) {
      this.V = null;
      this.N.set("");
      return;
    }
    const videoId = src.src.match(YouTubeProvider.jd)?.[1];
    this.N.set(videoId ?? "");
    this.V = src;
  }
  eb() {
    return !this.cookies ? "https://www.youtube-nocookie.com" : "https://www.youtube.com";
  }
  kd() {
    this.H();
    const videoId = this.N();
    if (!videoId) {
      this.cb.set("");
      return;
    }
    this.cb.set(`${this.eb()}/embed/${videoId}`);
  }
  ld() {
    const videoId = this.N(), cache = YouTubeProvider.We;
    if (!videoId)
      return;
    if (cache.has(videoId)) {
      const url = cache.get(videoId);
      this.c("poster-change", url);
      return;
    }
    const abort = new AbortController();
    this.Pg(videoId, abort);
    return () => {
      abort.abort();
    };
  }
  async Pg(videoId, abort) {
    try {
      const sizes = ["maxresdefault", "sddefault", "hqdefault"];
      for (const size of sizes) {
        for (const webp of [true, false]) {
          const url = this.Qg(videoId, size, webp), response = await fetch(url, {
            mode: "no-cors",
            signal: abort.signal
          });
          if (response.status < 400) {
            YouTubeProvider.We.set(videoId, url);
            this.c("poster-change", url);
            return;
          }
        }
      }
    } catch (e) {
    }
    this.c("poster-change", "");
  }
  Qg(videoId, size, webp) {
    const type = webp ? "webp" : "jpg";
    return `https://i.ytimg.com/${webp ? "vi_webp" : "vi"}/${videoId}/${size}.${type}`;
  }
  Te() {
    const { keyDisabled } = this.b.$props, { $iosControls } = this.b, { controls, muted, playsinline } = this.b.$state, showControls = controls() || $iosControls();
    return {
      autoplay: 0,
      cc_lang_pref: this.language,
      cc_load_policy: showControls ? 1 : void 0,
      color: this.color,
      controls: showControls ? 1 : 0,
      disablekb: !showControls || keyDisabled() ? 1 : 0,
      enablejsapi: 1,
      fs: 1,
      hl: this.language,
      iv_load_policy: showControls ? 1 : 3,
      mute: muted() ? 1 : 0,
      playsinline: playsinline() ? 1 : 0
    };
  }
  q(command, arg) {
    this.gd({
      event: "command",
      func: command,
      args: arg ? [arg] : void 0
    });
  }
  lc() {
    window.setTimeout(() => this.gd({ event: "listening" }), 100);
  }
  md(trigger) {
    this.b.delegate.jc(void 0, trigger);
  }
  Aa(trigger) {
    this.G?.resolve();
    this.G = null;
    this.c("pause", void 0, trigger);
  }
  Eb(time, trigger) {
    const { duration, currentTime } = this.b.$state, boundTime = this.mc === YouTubePlayerState.Ue ? duration() : time, detail = {
      currentTime: boundTime,
      played: this.Fa >= boundTime ? this.Ga : this.Ga = new TimeRange(0, this.Fa = time)
    };
    this.c("time-update", detail, trigger);
    if (Math.abs(boundTime - currentTime()) > 1) {
      this.c("seeking", boundTime, trigger);
    }
  }
  ic(buffered, seekable, trigger) {
    const detail = {
      buffered: new TimeRange(0, buffered),
      seekable
    };
    this.c("progress", detail, trigger);
    const { seeking, currentTime } = this.b.$state;
    if (seeking() && buffered > currentTime()) {
      this.bb(trigger);
    }
  }
  bb(trigger) {
    const { paused, currentTime } = this.b.$state;
    window.clearTimeout(this.nc);
    this.nc = window.setTimeout(
      () => {
        this.c("seeked", currentTime(), trigger);
        this.nc = -1;
      },
      paused() ? 100 : 0
    );
  }
  Db(trigger) {
    const { seeking } = this.b.$state;
    if (seeking())
      this.bb(trigger);
    this.c("end", void 0, trigger);
  }
  Rg(state, trigger) {
    const { paused } = this.b.$state, isPlaying = state === YouTubePlayerState.Ve, isBuffering = state === YouTubePlayerState.Ng;
    if (isBuffering)
      this.c("waiting", void 0, trigger);
    if (paused() && (isBuffering || isPlaying)) {
      this.E?.resolve();
      this.E = null;
      this.c("play", void 0, trigger);
    }
    switch (state) {
      case YouTubePlayerState.Og:
        this.md(trigger);
        break;
      case YouTubePlayerState.Ve:
        this.c("playing", void 0, trigger);
        break;
      case YouTubePlayerState.Mg:
        this.Aa(trigger);
        break;
      case YouTubePlayerState.Ue:
        this.Db(trigger);
        break;
    }
    this.mc = state;
  }
  hd({ info }, event) {
    if (!info)
      return;
    const { title, duration, playbackRate } = this.b.$state;
    if (isObject(info.videoData) && info.videoData.title !== title()) {
      this.c("title-change", info.videoData.title, event);
    }
    if (isNumber(info.duration) && info.duration !== duration()) {
      if (isNumber(info.videoLoadedFraction)) {
        const buffered = info.progressState?.loaded ?? info.videoLoadedFraction * info.duration, seekable = new TimeRange(0, info.duration);
        this.ic(buffered, seekable, event);
      }
      this.c("duration-change", info.duration, event);
    }
    if (isNumber(info.playbackRate) && info.playbackRate !== playbackRate()) {
      this.c("rate-change", info.playbackRate, event);
    }
    if (info.progressState) {
      const {
        current,
        seekableStart,
        seekableEnd,
        loaded,
        duration: _duration
      } = info.progressState;
      this.Eb(current, event);
      this.ic(loaded, new TimeRange(seekableStart, seekableEnd), event);
      if (_duration !== duration()) {
        this.c("duration-change", _duration, event);
      }
    }
    if (isNumber(info.volume) && isBoolean(info.muted)) {
      const detail = {
        muted: info.muted,
        volume: info.volume / 100
      };
      this.c("volume-change", detail, event);
    }
    if (isNumber(info.playerState) && info.playerState !== this.mc) {
      this.Rg(info.playerState, event);
    }
  }
  H() {
    this.mc = -1;
    this.nc = -1;
    this.Fa = 0;
    this.Ga = new TimeRange(0, 0);
    this.E = null;
    this.G = null;
  }
}

export { YouTubeProvider };
