import { N as isNull, v as deferredPromise, r as isString, l as listenEvent, O as EventsTarget, D as DOMEvent, w as isArray, a as isNumber } from './vidstack-s5pw8Cb6.js';

function appendParamsToURL(baseUrl, params) {
  const searchParams = new URLSearchParams();
  for (const key of Object.keys(params)) {
    searchParams.set(key, params[key] + "");
  }
  return baseUrl + "?" + searchParams.toString();
}
function preconnect(url, rel = "preconnect") {
  const exists = document.querySelector(`link[href="${url}"]`);
  if (!isNull(exists))
    return true;
  const link = document.createElement("link");
  link.rel = rel;
  link.href = url;
  link.crossOrigin = "true";
  document.head.append(link);
  return true;
}
const pendingRequests = {};
function loadScript(src) {
  if (pendingRequests[src])
    return pendingRequests[src].promise;
  const promise = deferredPromise(), exists = document.querySelector(`script[src="${src}"]`);
  if (!isNull(exists)) {
    promise.resolve();
    return promise.promise;
  }
  const script = document.createElement("script");
  script.src = src;
  script.onload = () => {
    promise.resolve();
    delete pendingRequests[src];
  };
  script.onerror = () => {
    promise.reject();
    delete pendingRequests[src];
  };
  setTimeout(() => document.head.append(script), 0);
  return promise.promise;
}
function getRequestCredentials(crossorigin) {
  return crossorigin === "use-credentials" ? "include" : isString(crossorigin) ? "same-origin" : void 0;
}

const CROSSORIGIN = Symbol(0), READY_STATE = Symbol(0), UPDATE_ACTIVE_CUES = Symbol(0), CAN_LOAD = Symbol(0), ON_MODE_CHANGE = Symbol(0), NATIVE = Symbol(0), NATIVE_HLS = Symbol(0);
const TextTrackSymbol = {
  Sa: CROSSORIGIN,
  M: READY_STATE,
  Ta: UPDATE_ACTIVE_CUES,
  P: CAN_LOAD,
  Ua: ON_MODE_CHANGE,
  T: NATIVE,
  te: NATIVE_HLS
};

function findActiveCue(cues, time) {
  for (let i = 0, len = cues.length; i < len; i++) {
    if (isCueActive(cues[i], time))
      return cues[i];
  }
  return null;
}
function isCueActive(cue, time) {
  return time >= cue.startTime && time < cue.endTime;
}
function observeActiveTextTrack(tracks, kind, onChange) {
  let currentTrack = null;
  function onModeChange() {
    const kinds = isString(kind) ? [kind] : kind, track = tracks.toArray().find((track2) => kinds.includes(track2.kind) && track2.mode === "showing");
    if (track === currentTrack)
      return;
    if (!track) {
      onChange(null);
      currentTrack = null;
      return;
    }
    if (track.readyState == 2) {
      onChange(track);
    } else {
      onChange(null);
      track.addEventListener("load", () => onChange(track), { once: true });
    }
    currentTrack = track;
  }
  onModeChange();
  return listenEvent(tracks, "mode-change", onModeChange);
}

var _a, _b, _c;
class TextTrack extends EventsTarget {
  constructor(init) {
    super();
    this.id = "";
    this.label = "";
    this.language = "";
    this.default = false;
    this.P = false;
    this.Va = 0;
    this.I = "disabled";
    this.ue = {};
    this.ac = [];
    this.J = [];
    this.Wa = [];
    /* @internal */
    this[_a] = 0;
    /* @internal */
    this[_b] = null;
    /* @internal */
    this[_c] = null;
    for (const prop of Object.keys(init))
      this[prop] = init[prop];
    if (!this.type)
      this.type = "vtt";
    if (init.content) {
      import('media-captions').then(({ parseText, VTTCue, VTTRegion }) => {
        if (init.type === "json") {
          this.ve(init.content, VTTCue, VTTRegion);
        } else {
          parseText(init.content, { type: init.type }).then(({ cues, regions }) => {
            this.J = cues;
            this.ac = regions;
            this.M();
          });
        }
      });
    } else if (!init.src)
      this[TextTrackSymbol.M] = 2;
  }
  static createId(track) {
    return `id::${track.type}-${track.kind}-${track.src ?? track.label}`;
  }
  get metadata() {
    return this.ue;
  }
  get regions() {
    return this.ac;
  }
  get cues() {
    return this.J;
  }
  get activeCues() {
    return this.Wa;
  }
  /**
   * - 0: Not Loading
   * - 1: Loading
   * - 2: Ready
   * - 3: Error
   */
  get readyState() {
    return this[TextTrackSymbol.M];
  }
  get mode() {
    return this.I;
  }
  set mode(mode) {
    this.setMode(mode);
  }
  addCue(cue, trigger) {
    let i = 0, length = this.J.length;
    for (i = 0; i < length; i++)
      if (cue.endTime <= this.J[i].startTime)
        break;
    if (i === length)
      this.J.push(cue);
    else
      this.J.splice(i, 0, cue);
    if (trigger?.type !== "cuechange") {
      this[TextTrackSymbol.T]?.track.addCue(cue);
    }
    this.dispatchEvent(new DOMEvent("add-cue", { detail: cue, trigger }));
    if (isCueActive(cue, this.Va)) {
      this[TextTrackSymbol.Ta](this.Va, trigger);
    }
  }
  removeCue(cue, trigger) {
    const index = this.J.indexOf(cue);
    if (index >= 0) {
      const isActive = this.Wa.includes(cue);
      this.J.splice(index, 1);
      this[TextTrackSymbol.T]?.track.removeCue(cue);
      this.dispatchEvent(new DOMEvent("remove-cue", { detail: cue, trigger }));
      if (isActive) {
        this[TextTrackSymbol.Ta](this.Va, trigger);
      }
    }
  }
  setMode(mode, trigger) {
    if (this.I === mode)
      return;
    this.I = mode;
    if (mode === "disabled") {
      this.Wa = [];
      this.we();
    } else if (this.readyState === 2) {
      this[TextTrackSymbol.Ta](this.Va, trigger);
    } else {
      this.xe();
    }
    this.dispatchEvent(new DOMEvent("mode-change", { detail: this, trigger }));
    this[TextTrackSymbol.Ua]?.();
  }
  /* @internal */
  [(_a = TextTrackSymbol.M, _b = TextTrackSymbol.Ua, _c = TextTrackSymbol.T, TextTrackSymbol.Ta)](currentTime, trigger) {
    this.Va = currentTime;
    if (this.mode === "disabled" || !this.J.length)
      return;
    const activeCues = [];
    for (let i = 0, length = this.J.length; i < length; i++) {
      const cue = this.J[i];
      if (isCueActive(cue, currentTime))
        activeCues.push(cue);
    }
    let changed = activeCues.length !== this.Wa.length;
    if (!changed) {
      for (let i = 0; i < activeCues.length; i++) {
        if (!this.Wa.includes(activeCues[i])) {
          changed = true;
          break;
        }
      }
    }
    this.Wa = activeCues;
    if (changed)
      this.we(trigger);
  }
  /* @internal */
  [TextTrackSymbol.P]() {
    this.P = true;
    if (this.I !== "disabled")
      this.xe();
  }
  async xe() {
    if (!this.P || !this.src || this[TextTrackSymbol.M] > 0)
      return;
    this[TextTrackSymbol.M] = 1;
    this.dispatchEvent(new DOMEvent("load-start"));
    try {
      const { parseResponse, VTTCue, VTTRegion } = await import('media-captions'), crossorigin = this[TextTrackSymbol.Sa]?.();
      const response = fetch(this.src, {
        headers: this.type === "json" ? { "Content-Type": "application/json" } : void 0,
        credentials: getRequestCredentials(crossorigin)
      });
      if (this.type === "json") {
        this.ve(await (await response).text(), VTTCue, VTTRegion);
      } else {
        const { errors, metadata, regions, cues } = await parseResponse(response, {
          type: this.type,
          encoding: this.encoding
        });
        if (errors[0]?.code === 0) {
          throw errors[0];
        } else {
          this.ue = metadata;
          this.ac = regions;
          this.J = cues;
        }
      }
      this.M();
    } catch (error) {
      this.ye(error);
    }
  }
  M() {
    this[TextTrackSymbol.M] = 2;
    if (!this.src || this.type !== "vtt") {
      const nativeTrack = this[TextTrackSymbol.T]?.track;
      if (nativeTrack)
        for (const cue of this.J)
          nativeTrack.addCue(cue);
    }
    const loadEvent = new DOMEvent("load");
    this[TextTrackSymbol.Ta](this.Va, loadEvent);
    this.dispatchEvent(loadEvent);
  }
  ye(error) {
    this[TextTrackSymbol.M] = 3;
    this.dispatchEvent(new DOMEvent("error", { detail: error }));
  }
  ve(json, VTTCue, VTTRegion) {
    try {
      const { regions, cues } = parseJSONCaptionsFile(json, VTTCue, VTTRegion);
      this.ac = regions;
      this.J = cues;
    } catch (error) {
      this.ye(error);
    }
  }
  we(trigger) {
    this.dispatchEvent(new DOMEvent("cue-change", { trigger }));
  }
}
const captionRE = /captions|subtitles/;
function isTrackCaptionKind(track) {
  return captionRE.test(track.kind);
}
function parseJSONCaptionsFile(json, Cue, Region) {
  const content = JSON.parse(json);
  let regions = [], cues = [];
  if (content.regions && Region) {
    regions = content.regions.map((region) => Object.assign(new Region(), region));
  }
  if (content.cues || isArray(content)) {
    cues = (isArray(content) ? content : content.cues).filter((content2) => isNumber(content2.startTime) && isNumber(content2.endTime)).map((cue) => Object.assign(new Cue(0, 0, ""), cue));
  }
  return { regions, cues };
}

export { TextTrackSymbol as T, appendParamsToURL as a, TextTrack as b, parseJSONCaptionsFile as c, isCueActive as d, findActiveCue as f, getRequestCredentials as g, isTrackCaptionKind as i, loadScript as l, observeActiveTextTrack as o, preconnect as p };
