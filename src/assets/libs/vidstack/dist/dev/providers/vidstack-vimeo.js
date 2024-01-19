import { q as createScope, m as signal, e as effect, p as peek, r as isString, v as deferredPromise, l as listenEvent, w as isArray } from '../chunks/vidstack-KTx0QncX.js';
import { T as TimeRange } from '../chunks/vidstack-DTSGQ87h.js';
import { p as preconnect } from '../chunks/vidstack-Yx-0ZQdX.js';
import { L as ListSymbol } from '../chunks/vidstack-S5-ZnP-2.js';
import { c as coerceToError, Q as QualitySymbol } from '../chunks/vidstack-wDXs-Qf-.js';
import { R as RAFLoop } from '../chunks/vidstack-IUoxhowK.js';
import { E as EmbedProvider, t as timedPromise } from '../chunks/vidstack-ZED4myhE.js';

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
    this._played = 0;
    this._playedRange = new TimeRange(0, 0);
    this._seekableRange = new TimeRange(0, 0);
    this._playPromise = null;
    this._pausePromise = null;
    this._videoInfoPromise = null;
    this._videoId = signal("");
    this._pro = signal(false);
    this._hash = null;
    this._currentSrc = null;
    this._currentCue = null;
    this._timeRAF = new RAFLoop(this._onAnimationFrame.bind(this));
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
    this._videoIdRE = /(?:https:\/\/)?(?:player\.)?vimeo(?:\.com)?\/(?:video\/)?(\d+)(?:\?hash=(.*))?/;
  }
  static {
    this._infoCache = /* @__PURE__ */ new Map();
  }
  get _notify() {
    return this._ctx.delegate._notify;
  }
  get type() {
    return "vimeo";
  }
  get currentSrc() {
    return this._currentSrc;
  }
  get videoId() {
    return this._videoId();
  }
  get hash() {
    return this._hash;
  }
  get isPro() {
    return this._pro();
  }
  preconnect() {
    const connections = [
      this._getOrigin(),
      "https://i.vimeocdn.com",
      "https://f.vimeocdn.com",
      "https://fresnel.vimeocdn.com"
    ];
    for (const url of connections) {
      preconnect(url, "preconnect");
    }
  }
  setup(ctx) {
    this._ctx = ctx;
    super.setup(ctx);
    effect(this._watchVideoId.bind(this));
    effect(this._watchVideoInfo.bind(this));
    effect(this._watchPro.bind(this));
    this._notify("provider-setup", this);
  }
  destroy() {
    this._reset();
    this._remote("destroy");
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
      this._remote("play");
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
          return "Timed out.";
      });
      this._remote("pause");
    }
    return this._pausePromise.promise;
  }
  setMuted(muted) {
    this._remote("setMuted", muted);
  }
  setCurrentTime(time) {
    this._remote("seekTo", time);
  }
  setVolume(volume) {
    this._remote("setVolume", volume);
    this._remote("setMuted", peek(this._ctx.$state.muted));
  }
  setPlaybackRate(rate) {
    this._remote("setPlaybackRate", rate);
  }
  async loadSource(src) {
    if (!isString(src.src)) {
      this._currentSrc = null;
      this._hash = null;
      this._videoId.set("");
      return;
    }
    const matches = src.src.match(VimeoProvider._videoIdRE), videoId = matches?.[1], hash = matches?.[2];
    this._videoId.set(videoId ?? "");
    this._hash = hash ?? null;
    this._currentSrc = src;
  }
  _watchVideoId() {
    this._reset();
    const videoId = this._videoId();
    if (!videoId) {
      this._src.set("");
      return;
    }
    this._src.set(`${this._getOrigin()}/video/${videoId}`);
  }
  _watchVideoInfo() {
    const src = this._src(), videoId = this._videoId(), cache = VimeoProvider._infoCache, info = cache.get(videoId);
    if (!videoId)
      return;
    const promise = deferredPromise();
    this._videoInfoPromise = promise;
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
      this._notify("error", {
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
  _watchPro() {
    const isPro = this._pro(), { $state, qualities } = this._ctx;
    $state.canSetPlaybackRate.set(isPro);
    qualities[ListSymbol._setReadonly](!isPro);
    if (isPro) {
      return listenEvent(qualities, "change", () => {
        if (qualities.auto)
          return;
        const id = qualities.selected?.id;
        if (id)
          this._remote("setQuality", id);
      });
    }
  }
  _getOrigin() {
    return "https://player.vimeo.com";
  }
  _buildParams() {
    const { $iosControls } = this._ctx, { keyDisabled } = this._ctx.$props, { controls, playsinline } = this._ctx.$state, showControls = controls() || $iosControls();
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
  _onAnimationFrame() {
    this._remote("getCurrentTime");
  }
  _onTimeUpdate(time, trigger) {
    const { currentTime, paused, seeking, bufferedEnd } = this._ctx.$state;
    if (seeking() && paused()) {
      this._remote("getBuffered");
      if (bufferedEnd() > time)
        this._notify("seeked", time, trigger);
    }
    if (currentTime() === time)
      return;
    const prevTime = currentTime(), detail = {
      currentTime: time,
      played: this._played >= time ? this._playedRange : this._playedRange = new TimeRange(0, this._played = time)
    };
    this._notify("time-update", detail, trigger);
    if (Math.abs(prevTime - time) > 1.5) {
      this._notify("seeking", time, trigger);
      if (!paused() && bufferedEnd() < time) {
        this._notify("waiting", void 0, trigger);
      }
    }
  }
  _onSeeked(time, trigger) {
    this._notify("seeked", time, trigger);
  }
  _onReady(trigger) {
    const videoId = this._videoId();
    this._videoInfoPromise?.promise.then((info) => {
      if (!info)
        return;
      const { title, poster, duration, pro } = info, { $iosControls } = this._ctx, { controls } = this._ctx.$state, showControls = controls() || $iosControls();
      this._timeRAF._start();
      this._pro.set(pro);
      this._seekableRange = new TimeRange(0, duration);
      this._notify("poster-change", poster, trigger);
      this._notify("title-change", title, trigger);
      this._notify("duration-change", duration, trigger);
      const detail = {
        buffered: new TimeRange(0, 0),
        seekable: this._seekableRange,
        duration
      };
      this._ctx.delegate._ready(detail, trigger);
      if (!showControls) {
        this._remote("_hideOverlay");
      }
      this._remote("getQualities");
    }).catch((e) => {
      if (videoId !== this._videoId())
        return;
      this._notify("error", {
        message: `Failed to fetch oembed data`,
        code: 2,
        error: coerceToError(e)
      });
    });
  }
  _onMethod(method, data, trigger) {
    switch (method) {
      case "getCurrentTime":
        this._onTimeUpdate(data, trigger);
        break;
      case "getBuffered":
        if (isArray(data) && data.length) {
          this._onLoadProgress(data[data.length - 1][1], trigger);
        }
        break;
      case "setMuted":
        this._onVolumeChange(peek(this._ctx.$state.volume), data, trigger);
        break;
      case "getChapters":
        break;
      case "getQualities":
        this._onQualitiesChange(data, trigger);
        break;
    }
  }
  _attachListeners() {
    for (const type of trackedVimeoEvents) {
      this._remote("addEventListener", type);
    }
  }
  _onPause(trigger) {
    this._notify("pause", void 0, trigger);
    this._pausePromise?.resolve();
    this._pausePromise = null;
  }
  _onPlay(trigger) {
    this._notify("play", void 0, trigger);
    this._playPromise?.resolve();
    this._playPromise = null;
  }
  _onPlayProgress(trigger) {
    const { paused } = this._ctx.$state;
    if (!paused()) {
      this._notify("playing", void 0, trigger);
    }
  }
  _onLoadProgress(buffered, trigger) {
    const detail = {
      buffered: new TimeRange(0, buffered),
      seekable: this._seekableRange
    };
    this._notify("progress", detail, trigger);
  }
  _onBufferStart(trigger) {
    this._notify("waiting", void 0, trigger);
  }
  _onBufferEnd(trigger) {
    const { paused } = this._ctx.$state;
    if (!paused())
      this._notify("playing", void 0, trigger);
  }
  _onWaiting(trigger) {
    const { paused } = this._ctx.$state;
    if (paused()) {
      this._notify("play", void 0, trigger);
    }
    this._notify("waiting", void 0, trigger);
  }
  _onVolumeChange(volume, muted, trigger) {
    const detail = { volume, muted };
    this._notify("volume-change", detail, trigger);
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
  _onQualitiesChange(qualities, trigger) {
    this._ctx.qualities[QualitySymbol._enableAuto] = qualities.some((q) => q.id === "auto") ? () => {
      this._remote("setQuality", "auto");
    } : void 0;
    for (const quality of qualities) {
      if (quality.id === "auto")
        continue;
      const height = +quality.id.slice(0, -1);
      if (isNaN(height))
        continue;
      this._ctx.qualities[ListSymbol._add](
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
    this._onQualityChange(
      qualities.find((q) => q.active),
      trigger
    );
  }
  _onQualityChange({ id } = {}, trigger) {
    if (!id)
      return;
    const isAuto = id === "auto", newQuality = this._ctx.qualities.toArray().find((q) => q.id === id);
    if (isAuto) {
      this._ctx.qualities[QualitySymbol._setAuto](isAuto, trigger);
      this._ctx.qualities[ListSymbol._select](void 0, true, trigger);
    } else {
      this._ctx.qualities[ListSymbol._select](newQuality, true, trigger);
    }
  }
  _onEvent(event, payload, trigger) {
    switch (event) {
      case "ready":
        this._attachListeners();
        break;
      case "loaded":
        this._onReady(trigger);
        break;
      case "play":
        this._onPlay(trigger);
        break;
      case "playProgress":
        this._onPlayProgress(trigger);
        break;
      case "pause":
        this._onPause(trigger);
        break;
      case "loadProgress":
        this._onLoadProgress(payload.seconds, trigger);
        break;
      case "waiting":
        this._onWaiting(trigger);
        break;
      case "bufferstart":
        this._onBufferStart(trigger);
        break;
      case "bufferend":
        this._onBufferEnd(trigger);
        break;
      case "volumechange":
        this._onVolumeChange(payload.volume, peek(this._ctx.$state.muted), trigger);
        break;
      case "durationchange":
        this._seekableRange = new TimeRange(0, payload.duration);
        this._notify("duration-change", payload.duration, trigger);
        break;
      case "playbackratechange":
        this._notify("rate-change", payload.playbackRate, trigger);
        break;
      case "qualitychange":
        this._onQualityChange(payload, trigger);
        break;
      case "fullscreenchange":
        this._notify("fullscreen-change", payload.fullscreen, trigger);
        break;
      case "enterpictureinpicture":
        this._notify("picture-in-picture-change", true, trigger);
        break;
      case "leavepictureinpicture":
        this._notify("picture-in-picture-change", false, trigger);
        break;
      case "ended":
        this._notify("end", void 0, trigger);
        break;
      case "error":
        this._onError(payload, trigger);
        break;
      case "seeked":
        this._onSeeked(payload.seconds, trigger);
        break;
    }
  }
  _onError(error, trigger) {
    if (error.method === "play") {
      this._playPromise?.reject(error.message);
      return;
    }
    {
      this._ctx.logger?.errorGroup(`[vimeo]: ${error.message}`).labelledLog("Error", error).labelledLog("Provider", this).labelledLog("Event", trigger).dispatch();
    }
  }
  _onMessage(message, event) {
    if (message.event) {
      this._onEvent(message.event, message.data, event);
    } else if (message.method) {
      this._onMethod(message.method, message.value, event);
    }
  }
  _onLoad() {
  }
  _remote(command, arg) {
    return this._postMessage({
      method: command,
      value: arg
    });
  }
  _reset() {
    this._timeRAF._stop();
    this._played = 0;
    this._playedRange = new TimeRange(0, 0);
    this._seekableRange = new TimeRange(0, 0);
    this._playPromise = null;
    this._pausePromise = null;
    this._videoInfoPromise = null;
    this._currentCue = null;
    this._pro.set(false);
  }
}

export { VimeoProvider };
