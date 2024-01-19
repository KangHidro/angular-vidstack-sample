import { q as createScope, m as signal, e as effect, p as peek, r as isString, t as isObject, a as isNumber, u as isBoolean } from '../chunks/vidstack-KTx0QncX.js';
import { T as TimeRange } from '../chunks/vidstack-DTSGQ87h.js';
import { p as preconnect } from '../chunks/vidstack-Yx-0ZQdX.js';
import { E as EmbedProvider, t as timedPromise } from '../chunks/vidstack-ZED4myhE.js';
import '../chunks/vidstack-S5-ZnP-2.js';

const YouTubePlayerState = {
  _Unstarted: -1,
  _Ended: 0,
  _Playing: 1,
  _Paused: 2,
  _Buffering: 3,
  _Cued: 5
};

class YouTubeProvider extends EmbedProvider {
  constructor() {
    super(...arguments);
    this.$$PROVIDER_TYPE = "YOUTUBE";
    this.scope = createScope();
    this._videoId = signal("");
    this._state = -1;
    this._seekingTimer = -1;
    this._played = 0;
    this._playedRange = new TimeRange(0, 0);
    this._currentSrc = null;
    this._playPromise = null;
    this._pausePromise = null;
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
    this._videoIdRE = /(?:youtu\.be|youtube|youtube\.com|youtube-nocookie\.com)\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|)((?:\w|-){11})/;
  }
  static {
    this._posterCache = /* @__PURE__ */ new Map();
  }
  get _notify() {
    return this._ctx.delegate._notify;
  }
  get currentSrc() {
    return this._currentSrc;
  }
  get type() {
    return "youtube";
  }
  get videoId() {
    return this._videoId();
  }
  preconnect() {
    const connections = [
      this._getOrigin(),
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
    this._ctx = ctx;
    super.setup(ctx);
    effect(this._watchVideoId.bind(this));
    effect(this._watchPoster.bind(this));
    this._notify("provider-setup", this);
  }
  async play() {
    const { paused } = this._ctx.$state;
    if (!peek(paused))
      return;
    if (!this._playPromise) {
      this._playPromise = timedPromise(() => {
        this._playPromise = null;
        if (paused())
          return "Timed out.";
      });
      this._remote("playVideo");
    }
    return this._playPromise.promise;
  }
  async pause() {
    const { paused } = this._ctx.$state;
    if (peek(paused))
      return;
    if (!this._pausePromise) {
      this._pausePromise = timedPromise(() => {
        this._pausePromise = null;
        if (!paused())
          ;
      });
      this._remote("pauseVideo");
    }
    return this._pausePromise.promise;
  }
  setMuted(muted) {
    if (muted)
      this._remote("mute");
    else
      this._remote("unMute");
  }
  setCurrentTime(time) {
    this._remote("seekTo", time);
  }
  setVolume(volume) {
    this._remote("setVolume", volume * 100);
  }
  setPlaybackRate(rate) {
    this._remote("setPlaybackRate", rate);
  }
  async loadSource(src) {
    if (!isString(src.src)) {
      this._currentSrc = null;
      this._videoId.set("");
      return;
    }
    const videoId = src.src.match(YouTubeProvider._videoIdRE)?.[1];
    this._videoId.set(videoId ?? "");
    this._currentSrc = src;
  }
  _getOrigin() {
    return !this.cookies ? "https://www.youtube-nocookie.com" : "https://www.youtube.com";
  }
  _watchVideoId() {
    this._reset();
    const videoId = this._videoId();
    if (!videoId) {
      this._src.set("");
      return;
    }
    this._src.set(`${this._getOrigin()}/embed/${videoId}`);
  }
  _watchPoster() {
    const videoId = this._videoId(), cache = YouTubeProvider._posterCache;
    if (!videoId)
      return;
    if (cache.has(videoId)) {
      const url = cache.get(videoId);
      this._notify("poster-change", url);
      return;
    }
    const abort = new AbortController();
    this._findPoster(videoId, abort);
    return () => {
      abort.abort();
    };
  }
  async _findPoster(videoId, abort) {
    try {
      const sizes = ["maxresdefault", "sddefault", "hqdefault"];
      for (const size of sizes) {
        for (const webp of [true, false]) {
          const url = this._resolvePosterURL(videoId, size, webp), response = await fetch(url, {
            mode: "no-cors",
            signal: abort.signal
          });
          if (response.status < 400) {
            YouTubeProvider._posterCache.set(videoId, url);
            this._notify("poster-change", url);
            return;
          }
        }
      }
    } catch (e) {
    }
    this._notify("poster-change", "");
  }
  _resolvePosterURL(videoId, size, webp) {
    const type = webp ? "webp" : "jpg";
    return `https://i.ytimg.com/${webp ? "vi_webp" : "vi"}/${videoId}/${size}.${type}`;
  }
  _buildParams() {
    const { keyDisabled } = this._ctx.$props, { $iosControls } = this._ctx, { controls, muted, playsinline } = this._ctx.$state, showControls = controls() || $iosControls();
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
  _remote(command, arg) {
    this._postMessage({
      event: "command",
      func: command,
      args: arg ? [arg] : void 0
    });
  }
  _onLoad() {
    window.setTimeout(() => this._postMessage({ event: "listening" }), 100);
  }
  _onReady(trigger) {
    this._ctx.delegate._ready(void 0, trigger);
  }
  _onPause(trigger) {
    this._pausePromise?.resolve();
    this._pausePromise = null;
    this._notify("pause", void 0, trigger);
  }
  _onTimeUpdate(time, trigger) {
    const { duration, currentTime } = this._ctx.$state, boundTime = this._state === YouTubePlayerState._Ended ? duration() : time, detail = {
      currentTime: boundTime,
      played: this._played >= boundTime ? this._playedRange : this._playedRange = new TimeRange(0, this._played = time)
    };
    this._notify("time-update", detail, trigger);
    if (Math.abs(boundTime - currentTime()) > 1) {
      this._notify("seeking", boundTime, trigger);
    }
  }
  _onProgress(buffered, seekable, trigger) {
    const detail = {
      buffered: new TimeRange(0, buffered),
      seekable
    };
    this._notify("progress", detail, trigger);
    const { seeking, currentTime } = this._ctx.$state;
    if (seeking() && buffered > currentTime()) {
      this._onSeeked(trigger);
    }
  }
  _onSeeked(trigger) {
    const { paused, currentTime } = this._ctx.$state;
    window.clearTimeout(this._seekingTimer);
    this._seekingTimer = window.setTimeout(
      () => {
        this._notify("seeked", currentTime(), trigger);
        this._seekingTimer = -1;
      },
      paused() ? 100 : 0
    );
  }
  _onEnded(trigger) {
    const { seeking } = this._ctx.$state;
    if (seeking())
      this._onSeeked(trigger);
    this._notify("end", void 0, trigger);
  }
  _onStateChange(state, trigger) {
    const { paused } = this._ctx.$state, isPlaying = state === YouTubePlayerState._Playing, isBuffering = state === YouTubePlayerState._Buffering;
    if (isBuffering)
      this._notify("waiting", void 0, trigger);
    if (paused() && (isBuffering || isPlaying)) {
      this._playPromise?.resolve();
      this._playPromise = null;
      this._notify("play", void 0, trigger);
    }
    switch (state) {
      case YouTubePlayerState._Cued:
        this._onReady(trigger);
        break;
      case YouTubePlayerState._Playing:
        this._notify("playing", void 0, trigger);
        break;
      case YouTubePlayerState._Paused:
        this._onPause(trigger);
        break;
      case YouTubePlayerState._Ended:
        this._onEnded(trigger);
        break;
    }
    this._state = state;
  }
  _onMessage({ info }, event) {
    if (!info)
      return;
    const { title, duration, playbackRate } = this._ctx.$state;
    if (isObject(info.videoData) && info.videoData.title !== title()) {
      this._notify("title-change", info.videoData.title, event);
    }
    if (isNumber(info.duration) && info.duration !== duration()) {
      if (isNumber(info.videoLoadedFraction)) {
        const buffered = info.progressState?.loaded ?? info.videoLoadedFraction * info.duration, seekable = new TimeRange(0, info.duration);
        this._onProgress(buffered, seekable, event);
      }
      this._notify("duration-change", info.duration, event);
    }
    if (isNumber(info.playbackRate) && info.playbackRate !== playbackRate()) {
      this._notify("rate-change", info.playbackRate, event);
    }
    if (info.progressState) {
      const {
        current,
        seekableStart,
        seekableEnd,
        loaded,
        duration: _duration
      } = info.progressState;
      this._onTimeUpdate(current, event);
      this._onProgress(loaded, new TimeRange(seekableStart, seekableEnd), event);
      if (_duration !== duration()) {
        this._notify("duration-change", _duration, event);
      }
    }
    if (isNumber(info.volume) && isBoolean(info.muted)) {
      const detail = {
        muted: info.muted,
        volume: info.volume / 100
      };
      this._notify("volume-change", detail, event);
    }
    if (isNumber(info.playerState) && info.playerState !== this._state) {
      this._onStateChange(info.playerState, event);
    }
  }
  _reset() {
    this._state = -1;
    this._seekingTimer = -1;
    this._played = 0;
    this._playedRange = new TimeRange(0, 0);
    this._playPromise = null;
    this._pausePromise = null;
  }
}

export { YouTubeProvider };
