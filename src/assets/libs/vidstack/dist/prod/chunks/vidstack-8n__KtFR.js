import { L as ListSymbol, a as canOrientScreen } from './vidstack-XmoYV57V.js';
import { O as EventsTarget, D as DOMEvent, w as isArray, i as isUndefined, S as State, P as tick, Q as createContext, J as useContext, m as signal, n as computed, R as root, T as unwrap, l as listenEvent, U as kebabToCamelCase, e as effect, K as camelToKebabCase, r as isString } from './vidstack-s5pw8Cb6.js';

var _a$1;
const GROUPED_LOG = Symbol(0);
class GroupedLog {
  constructor(logger, level, title, root, parent) {
    this.logger = logger;
    this.level = level;
    this.title = title;
    this.root = root;
    this.parent = parent;
    this[_a$1] = true;
    this.logs = [];
  }
  static {
    _a$1 = GROUPED_LOG;
  }
  log(...data) {
    this.logs.push({ data });
    return this;
  }
  labelledLog(label, ...data) {
    this.logs.push({ label, data });
    return this;
  }
  groupStart(title) {
    return new GroupedLog(this.logger, this.level, title, this.root ?? this, this);
  }
  groupEnd() {
    this.parent?.logs.push(this);
    return this.parent ?? this;
  }
  dispatch() {
    return this.logger.dispatch(this.level, this.root ?? this);
  }
}

var _a;
class List extends EventsTarget {
  constructor() {
    super(...arguments);
    this.r = [];
    /* @internal */
    this[_a] = false;
  }
  get length() {
    return this.r.length;
  }
  get readonly() {
    return this[ListSymbol.Zb];
  }
  /**
   * Transform list to an array.
   */
  toArray() {
    return [...this.r];
  }
  [(_a = ListSymbol.Zb, Symbol.iterator)]() {
    return this.r.values();
  }
  /* @internal */
  [ListSymbol.oa](item, trigger) {
    const index = this.r.length;
    if (!("" + index in this)) {
      Object.defineProperty(this, index, {
        get() {
          return this.r[index];
        }
      });
    }
    if (this.r.includes(item))
      return;
    this.r.push(item);
    this.dispatchEvent(new DOMEvent("add", { detail: item, trigger }));
  }
  /* @internal */
  [ListSymbol.Yb](item, trigger) {
    const index = this.r.indexOf(item);
    if (index >= 0) {
      this[ListSymbol.oe]?.(item, trigger);
      this.r.splice(index, 1);
      this.dispatchEvent(new DOMEvent("remove", { detail: item, trigger }));
    }
  }
  /* @internal */
  [ListSymbol.H](trigger) {
    for (const item of [...this.r])
      this[ListSymbol.Yb](item, trigger);
    this.r = [];
    this[ListSymbol.Mc](false, trigger);
    this[ListSymbol.ne]?.();
  }
  /* @internal */
  [ListSymbol.Mc](readonly, trigger) {
    if (this[ListSymbol.Zb] === readonly)
      return;
    this[ListSymbol.Zb] = readonly;
    this.dispatchEvent(new DOMEvent("readonly-change", { detail: readonly, trigger }));
  }
}

class TimeRange {
  get length() {
    return this.$.length;
  }
  constructor(start, end) {
    if (isArray(start)) {
      this.$ = start;
    } else if (!isUndefined(start) && !isUndefined(end)) {
      this.$ = [[start, end]];
    } else {
      this.$ = [];
    }
  }
  start(index) {
    return this.$[index][0] ?? Infinity;
  }
  end(index) {
    return this.$[index][1] ?? Infinity;
  }
}
function getTimeRangesStart(range) {
  if (!range.length)
    return null;
  let min = range.start(0);
  for (let i = 1; i < range.length; i++) {
    const value = range.start(i);
    if (value < min)
      min = value;
  }
  return min;
}
function getTimeRangesEnd(range) {
  if (!range.length)
    return null;
  let max = range.end(0);
  for (let i = 1; i < range.length; i++) {
    const value = range.end(i);
    if (value > max)
      max = value;
  }
  return max;
}

const mediaState = new State({
  audioTracks: [],
  audioTrack: null,
  autoplay: false,
  autoplayError: null,
  buffered: new TimeRange(),
  duration: 0,
  canLoad: false,
  canFullscreen: false,
  canOrientScreen: canOrientScreen(),
  canPictureInPicture: false,
  canPlay: false,
  controls: false,
  controlsVisible: false,
  crossorigin: null,
  currentTime: 0,
  ended: false,
  error: null,
  fullscreen: false,
  loop: false,
  logLevel: "silent",
  mediaType: "unknown",
  muted: false,
  paused: true,
  played: new TimeRange(),
  playing: false,
  playsinline: false,
  pictureInPicture: false,
  preload: "metadata",
  playbackRate: 1,
  qualities: [],
  quality: null,
  autoQuality: false,
  canSetQuality: true,
  canSetPlaybackRate: true,
  canSetVolume: false,
  seekable: new TimeRange(),
  seeking: false,
  source: { src: "", type: "" },
  sources: [],
  started: false,
  textTracks: [],
  textTrack: null,
  volume: 1,
  waiting: false,
  get title() {
    return this.providedTitle || this.inferredTitle;
  },
  get poster() {
    return this.providedPoster || this.inferredPoster;
  },
  get viewType() {
    return this.providedViewType !== "unknown" ? this.providedViewType : this.inferredViewType;
  },
  get streamType() {
    return this.providedStreamType !== "unknown" ? this.providedStreamType : this.inferredStreamType;
  },
  get currentSrc() {
    return this.source;
  },
  get bufferedStart() {
    return getTimeRangesStart(this.buffered) ?? 0;
  },
  get bufferedEnd() {
    return getTimeRangesEnd(this.buffered) ?? 0;
  },
  get seekableStart() {
    return getTimeRangesStart(this.seekable) ?? 0;
  },
  get seekableEnd() {
    return this.canPlay ? getTimeRangesEnd(this.seekable) ?? Infinity : 0;
  },
  get seekableWindow() {
    return Math.max(0, this.seekableEnd - this.seekableStart);
  },
  // ~~ responsive design ~~
  pointer: "fine",
  orientation: "landscape",
  width: 0,
  height: 0,
  mediaWidth: 0,
  mediaHeight: 0,
  // ~~ user props ~~
  userBehindLiveEdge: false,
  // ~~ live props ~~
  liveEdgeTolerance: 10,
  minLiveDVRWindow: 60,
  get canSeek() {
    return /unknown|on-demand|:dvr/.test(this.streamType) && Number.isFinite(this.seekableWindow) && (!this.live || /:dvr/.test(this.streamType) && this.seekableWindow >= this.minLiveDVRWindow);
  },
  get live() {
    return this.streamType.includes("live") || !Number.isFinite(this.duration);
  },
  get liveEdgeStart() {
    return this.live && Number.isFinite(this.seekableEnd) ? Math.max(0, (this.liveSyncPosition ?? this.seekableEnd) - this.liveEdgeTolerance) : 0;
  },
  get liveEdge() {
    return this.live && (!this.canSeek || !this.userBehindLiveEdge && this.currentTime >= this.liveEdgeStart);
  },
  get liveEdgeWindow() {
    return this.live && Number.isFinite(this.seekableEnd) ? this.seekableEnd - this.liveEdgeStart : 0;
  },
  // ~~ internal props ~~
  autoplaying: false,
  providedTitle: "",
  inferredTitle: "",
  providedPoster: "",
  inferredPoster: "",
  inferredViewType: "unknown",
  providedViewType: "unknown",
  providedStreamType: "unknown",
  inferredStreamType: "unknown",
  liveSyncPosition: null
});
const DO_NOT_RESET_ON_SRC_CHANGE = /* @__PURE__ */ new Set([
  "autoplay",
  "canFullscreen",
  "canLoad",
  "canPictureInPicture",
  "canSetVolume",
  "controls",
  "crossorigin",
  "fullscreen",
  "height",
  "inferredViewType",
  "logLevel",
  "loop",
  "mediaHeight",
  "mediaType",
  "mediaWidth",
  "muted",
  "orientation",
  "pictureInPicture",
  "playsinline",
  "pointer",
  "preload",
  "providedPoster",
  "providedStreamType",
  "providedTitle",
  "providedViewType",
  "source",
  "sources",
  "textTrack",
  "textTracks",
  "volume",
  "width"
]);
function softResetMediaState($media) {
  mediaState.reset($media, (prop) => !DO_NOT_RESET_ON_SRC_CHANGE.has(prop));
  tick();
}

const mediaContext = createContext();
function useMediaContext() {
  return useContext(mediaContext);
}

const globalEval = eval;
const equalsRE = /:\s+'?"?(.*?)'?"?\)/g, notRE = /\s+not\s+/g, andRE = /\s+and\s+/g, orRE = /\s+or\s+/g, pxRE = /(\d)px/g;
class PlayerQueryList extends EventsTarget {
  constructor(store, query) {
    super();
    this.ec = signal("true");
    this.Xc = /* @__PURE__ */ new Set();
    this.Yc = signal(true);
    this.$matches = computed(() => {
      let currentEval = this.ec();
      if (currentEval === "never")
        return false;
      for (const prop of this.Xc) {
        const value = this.Le[prop](), replaceValue = isString(value) ? `'${value}'` : value + "";
        currentEval = currentEval.replace(camelToKebabCase(prop), replaceValue);
      }
      return globalEval(`!!(${currentEval})`) && this.Yc();
    });
    this.Ke = query;
    this.Le = store;
    root((dispose) => {
      effect(this.jg.bind(this));
      effect(this.kg.bind(this));
      this.Me = dispose;
    });
  }
  static {
    this.create = (query) => {
      const media = useMediaContext();
      return new PlayerQueryList(media.$state, query);
    };
  }
  get query() {
    return unwrap(this.Ke);
  }
  get matches() {
    return this.$matches();
  }
  jg() {
    const query = this.query;
    if (query === "")
      return;
    if (query === "never") {
      this.ec.set(query);
      return;
    }
    const queryList = query.trim().split(/\s*,\s*/g), mediaQueries = queryList.filter((q) => q.startsWith("@media")).join(","), playerQueries = queryList.filter((q) => !q.startsWith("@media"));
    if (mediaQueries.length) {
      const mediaQuery = window.matchMedia(mediaQueries.replace(/@media\s/g, "")), onChange = () => void this.Yc.set(mediaQuery.matches);
      onChange();
      listenEvent(mediaQuery, "change", onChange);
    }
    if (playerQueries.length) {
      const evaluation = this.lg(playerQueries), validProps = Object.keys(mediaState.record);
      for (const query2 of evaluation.matchAll(/\(([-a-zA-Z]+)\s/g)) {
        const prop = kebabToCamelCase(query2[1]);
        if (validProps.includes(prop)) {
          this.Xc.add(prop);
        }
      }
      this.ec.set(evaluation);
    }
    return () => {
      this.Xc.clear();
      this.ec.set("true");
      this.Yc.set(true);
    };
  }
  kg() {
    this.$matches();
    this.dispatchEvent(new Event("change"));
  }
  lg(queryList) {
    return queryList.map(
      (query) => "(" + query.replace(equalsRE, ' == "$1")').replace(notRE, "!").replace(andRE, " && ").replace(orRE, " || ").replace(pxRE, "$1").trim() + ")"
    ).join(" || ");
  }
  destroy() {
    this.Me();
  }
}

export { GroupedLog as G, List as L, PlayerQueryList as P, TimeRange as T, mediaState as a, getTimeRangesEnd as b, getTimeRangesStart as g, mediaContext as m, softResetMediaState as s, useMediaContext as u };
