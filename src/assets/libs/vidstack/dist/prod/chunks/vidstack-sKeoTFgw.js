import { X as ViewController, l as listenEvent, o as onDispose, m as signal, p as peek, D as DOMEvent, I as Component, e as effect, G as isKeyboardEvent, r as isString, w as isArray, b as isKeyboardClick, Y as waitIdlePeriod, P as tick, v as deferredPromise, i as isUndefined, k as setAttribute, g as getScope, n as computed, Z as provideContext, V as animationFrameThrottle, _ as uppercaseFirstChar, K as camelToKebabCase, f as setStyle, s as scoped, $ as prop, a0 as method, a1 as noop, S as State, Q as createContext, J as useContext, a2 as ariaBool$1, a3 as isWriteSignal, N as isNull, a as isNumber, a4 as hasProvidedContext, z as useState, q as createScope, F as isPointerEvent, c as isTouchEvent, a5 as isMouseEvent, U as kebabToCamelCase, a6 as createDisposalBin } from './vidstack-s5pw8Cb6.js';
import { L as List, u as useMediaContext, s as softResetMediaState, a as mediaState, P as PlayerQueryList, m as mediaContext } from './vidstack-8n__KtFR.js';
import { i as isTrackCaptionKind, T as TextTrackSymbol, b as TextTrack, g as getRequestCredentials, p as preconnect, c as parseJSONCaptionsFile, f as findActiveCue, o as observeActiveTextTrack, d as isCueActive } from './vidstack-UV9ceSS6.js';
import { i as isTouchPinchEvent, s as setAttributeIfEmpty, h as hasAnimation, r as requestScopedAnimationFrame, d as autoPlacement, o as onPress, e as setARIALabel, f as isElementParent } from './vidstack-PYaZQCX6.js';
import { a as canOrientScreen, L as ListSymbol, b as canPlayHLSNatively, i as isHLSSupported, h as IS_IPHONE, c as canChangeVolume, g as IS_SAFARI } from './vidstack-XmoYV57V.js';
import { Q as QualitySymbol, c as coerceToError } from './vidstack-yqTzryo_.js';
import { A as AUDIO_EXTENSIONS, b as AUDIO_TYPES, V as VIDEO_EXTENSIONS, c as VIDEO_TYPES, i as isHLSSrc, d as clampNumber, r as round, g as getNumberOfDecimalPlaces } from './vidstack-XcK8ubY-.js';

var key = {
    fullscreenEnabled: 0,
    fullscreenElement: 1,
    requestFullscreen: 2,
    exitFullscreen: 3,
    fullscreenchange: 4,
    fullscreenerror: 5,
    fullscreen: 6
};
var webkit = [
    'webkitFullscreenEnabled',
    'webkitFullscreenElement',
    'webkitRequestFullscreen',
    'webkitExitFullscreen',
    'webkitfullscreenchange',
    'webkitfullscreenerror',
    '-webkit-full-screen',
];
var moz = [
    'mozFullScreenEnabled',
    'mozFullScreenElement',
    'mozRequestFullScreen',
    'mozCancelFullScreen',
    'mozfullscreenchange',
    'mozfullscreenerror',
    '-moz-full-screen',
];
var ms = [
    'msFullscreenEnabled',
    'msFullscreenElement',
    'msRequestFullscreen',
    'msExitFullscreen',
    'MSFullscreenChange',
    'MSFullscreenError',
    '-ms-fullscreen',
];
// so it doesn't throw if no window or document
var document$1 = typeof window !== 'undefined' && typeof window.document !== 'undefined' ? window.document : {};
var vendor = (('fullscreenEnabled' in document$1 && Object.keys(key)) ||
    (webkit[0] in document$1 && webkit) ||
    (moz[0] in document$1 && moz) ||
    (ms[0] in document$1 && ms) ||
    []);
var fscreen = {
    requestFullscreen: function (element) { return element[vendor[key.requestFullscreen]](); },
    requestFullscreenFunction: function (element) { return element[vendor[key.requestFullscreen]]; },
    get exitFullscreen() { return document$1[vendor[key.exitFullscreen]].bind(document$1); },
    get fullscreenPseudoClass() { return ":" + vendor[key.fullscreen]; },
    addEventListener: function (type, handler, options) { return document$1.addEventListener(vendor[key[type]], handler, options); },
    removeEventListener: function (type, handler, options) { return document$1.removeEventListener(vendor[key[type]], handler, options); },
    get fullscreenEnabled() { return Boolean(document$1[vendor[key.fullscreenEnabled]]); },
    set fullscreenEnabled(val) { },
    get fullscreenElement() { return document$1[vendor[key.fullscreenElement]]; },
    set fullscreenElement(val) { },
    get onfullscreenchange() { return document$1[("on" + vendor[key.fullscreenchange]).toLowerCase()]; },
    set onfullscreenchange(handler) { return document$1[("on" + vendor[key.fullscreenchange]).toLowerCase()] = handler; },
    get onfullscreenerror() { return document$1[("on" + vendor[key.fullscreenerror]).toLowerCase()]; },
    set onfullscreenerror(handler) { return document$1[("on" + vendor[key.fullscreenerror]).toLowerCase()] = handler; },
};

var fscreen$1 = fscreen;

const CAN_FULLSCREEN = fscreen$1.fullscreenEnabled;
class FullscreenController extends ViewController {
  constructor() {
    super(...arguments);
    /**
     * Tracks whether we're the active fullscreen event listener. Fullscreen events can only be
     * listened to globally on the document so we need to know if they relate to the current host
     * element or not.
     */
    this.ub = false;
    this.Nc = false;
  }
  get active() {
    return this.Nc;
  }
  get supported() {
    return CAN_FULLSCREEN;
  }
  onConnect() {
    listenEvent(fscreen$1, "fullscreenchange", this.Oc.bind(this));
    listenEvent(fscreen$1, "fullscreenerror", this._b.bind(this));
    onDispose(this.ya.bind(this));
  }
  async ya() {
    if (CAN_FULLSCREEN)
      await this.exit();
  }
  Oc(event) {
    const active = isFullscreen(this.el);
    if (active === this.Nc)
      return;
    if (!active)
      this.ub = false;
    this.Nc = active;
    this.dispatch("fullscreen-change", { detail: active, trigger: event });
  }
  _b(event) {
    if (!this.ub)
      return;
    this.dispatch("fullscreen-error", { detail: null, trigger: event });
    this.ub = false;
  }
  async enter() {
    try {
      this.ub = true;
      if (!this.el || isFullscreen(this.el))
        return;
      assertFullscreenAPI();
      return fscreen$1.requestFullscreen(this.el);
    } catch (error) {
      this.ub = false;
      throw error;
    }
  }
  async exit() {
    if (!this.el || !isFullscreen(this.el))
      return;
    assertFullscreenAPI();
    return fscreen$1.exitFullscreen();
  }
}
function canFullscreen() {
  return CAN_FULLSCREEN;
}
function isFullscreen(host) {
  if (fscreen$1.fullscreenElement === host)
    return true;
  try {
    return host.matches(
      // @ts-expect-error - `fullscreenPseudoClass` is missing from `@types/fscreen`.
      fscreen$1.fullscreenPseudoClass
    );
  } catch (error) {
    return false;
  }
}
function assertFullscreenAPI() {
  if (CAN_FULLSCREEN)
    return;
  throw Error(
    "[vidstack] no fullscreen API"
  );
}

class ScreenOrientationController extends ViewController {
  constructor() {
    super(...arguments);
    this.vb = signal(this.qe());
    this.Ra = signal(false);
  }
  /**
   * The current screen orientation type.
   *
   * @signal
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation}
   * @see https://w3c.github.io/screen-orientation/#screen-orientation-types-and-locks
   */
  get type() {
    return this.vb();
  }
  /**
   * Whether the screen orientation is currently locked.
   *
   * @signal
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation}
   * @see https://w3c.github.io/screen-orientation/#screen-orientation-types-and-locks
   */
  get locked() {
    return this.Ra();
  }
  /**
   * Whether the viewport is in a portrait orientation.
   *
   * @signal
   */
  get portrait() {
    return this.vb().startsWith("portrait");
  }
  /**
   * Whether the viewport is in a landscape orientation.
   *
   * @signal
   */
  get landscape() {
    return this.vb().startsWith("landscape");
  }
  static {
    /**
     * Whether the native Screen Orientation API is available.
     */
    this.supported = canOrientScreen();
  }
  /**
   * Whether the native Screen Orientation API is available.
   */
  get supported() {
    return ScreenOrientationController.supported;
  }
  onConnect() {
    if (this.supported) {
      listenEvent(screen.orientation, "change", this.re.bind(this));
    } else {
      const query = window.matchMedia("(orientation: landscape)");
      query.onchange = this.re.bind(this);
      onDispose(() => query.onchange = null);
    }
    onDispose(this.ya.bind(this));
  }
  async ya() {
    if (this.supported && this.Ra())
      await this.unlock();
  }
  re(event) {
    this.vb.set(this.qe());
    this.dispatch("orientation-change", {
      detail: {
        orientation: peek(this.vb),
        lock: this.$b
      },
      trigger: event
    });
  }
  /**
   * Locks the orientation of the screen to the desired orientation type using the
   * Screen Orientation API.
   *
   * @param lockType - The screen lock orientation type.
   * @throws Error - If screen orientation API is unavailable.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation}
   * @see {@link https://w3c.github.io/screen-orientation}
   */
  async lock(lockType) {
    if (peek(this.Ra) || this.$b === lockType)
      return;
    this.se();
    await screen.orientation.lock(lockType);
    this.Ra.set(true);
    this.$b = lockType;
  }
  /**
   * Unlocks the orientation of the screen to it's default state using the Screen Orientation
   * API. This method will throw an error if the API is unavailable.
   *
   * @throws Error - If screen orientation API is unavailable.
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation}
   * @see {@link https://w3c.github.io/screen-orientation}
   */
  async unlock() {
    if (!peek(this.Ra))
      return;
    this.se();
    this.$b = void 0;
    await screen.orientation.unlock();
    this.Ra.set(false);
  }
  se() {
    if (this.supported)
      return;
    throw Error(
      "[vidstack] no orientation API"
    );
  }
  qe() {
    if (this.supported)
      return window.screen.orientation.type;
    return window.innerWidth >= window.innerHeight ? "landscape-primary" : "portrait-primary";
  }
}

class MediaRemoteControl {
  constructor(_logger = void 0) {
    this.tb = _logger;
    this.A = null;
    this.aa = null;
    this.Pc = -1;
  }
  /**
   * Set the target from which to dispatch media requests events from. The events should bubble
   * up from this target to the `<media-player>` element.
   *
   * @example
   * ```ts
   * const button = document.querySelector('button');
   * remote.setTarget(button);
   * ```
   */
  setTarget(target) {
    this.A = target;
  }
  /**
   * Returns the current `<media-player>` element. This method will attempt to find the player by
   * searching up from either the given `target` or default target set via `remote.setTarget`.
   *
   * @example
   * ```ts
   * const player = remote.getPlayer();
   * ```
   */
  getPlayer(target) {
    if (this.aa)
      return this.aa;
    (target ?? this.A)?.dispatchEvent(
      new DOMEvent("find-media-player", {
        detail: (player) => void (this.aa = player),
        bubbles: true,
        composed: true
      })
    );
    return this.aa;
  }
  /**
   * Set the current `<media-player>` element so the remote can support toggle methods such as
   * `togglePaused` as they rely on the current media state.
   */
  setPlayer(player) {
    this.aa = player;
  }
  /**
   * Dispatch a request to start the media loading process. This will only work if the media
   * player has been initialized with a custom loading strategy `<media-player load="custom">`.
   *
   * @docs {@link https://www.vidstack.io/docs/player/core-concepts/loading#loading-strategies}
   */
  startLoading(trigger) {
    this.s("media-start-loading", trigger);
  }
  /**
   * Dispatch a request to begin/resume media playback.
   */
  play(trigger) {
    this.s("media-play-request", trigger);
  }
  /**
   * Dispatch a request to pause media playback.
   */
  pause(trigger) {
    this.s("media-pause-request", trigger);
  }
  /**
   * Dispatch a request to set the media volume to mute (0).
   */
  mute(trigger) {
    this.s("media-mute-request", trigger);
  }
  /**
   * Dispatch a request to unmute the media volume and set it back to it's previous state.
   */
  unmute(trigger) {
    this.s("media-unmute-request", trigger);
  }
  /**
   * Dispatch a request to enter fullscreen.
   *
   * @docs {@link https://www.vidstack.io/docs/player/core-concepts/fullscreen#remote-control}
   */
  enterFullscreen(target, trigger) {
    this.s("media-enter-fullscreen-request", trigger, target);
  }
  /**
   * Dispatch a request to exit fullscreen.
   *
   * @docs {@link https://www.vidstack.io/docs/player/core-concepts/fullscreen#remote-control}
   */
  exitFullscreen(target, trigger) {
    this.s("media-exit-fullscreen-request", trigger, target);
  }
  /**
   * Dispatch a request to lock the screen orientation.
   *
   * @docs {@link https://www.vidstack.io/docs/player/core-concepts/screen-orientation#remote-control}
   */
  lockScreenOrientation(lockType, trigger) {
    this.s("media-orientation-lock-request", trigger, lockType);
  }
  /**
   * Dispatch a request to unlock the screen orientation.
   *
   * @docs {@link https://www.vidstack.io/docs/player/core-concepts/screen-orientation#remote-control}
   */
  unlockScreenOrientation(trigger) {
    this.s("media-orientation-unlock-request", trigger);
  }
  /**
   * Dispatch a request to enter picture-in-picture mode.
   *
   * @docs {@link https://www.vidstack.io/docs/player/core-concepts/picture-in-picture#remote-control}
   */
  enterPictureInPicture(trigger) {
    this.s("media-enter-pip-request", trigger);
  }
  /**
   * Dispatch a request to exit picture-in-picture mode.
   *
   * @docs {@link https://www.vidstack.io/docs/player/core-concepts/picture-in-picture#remote-control}
   */
  exitPictureInPicture(trigger) {
    this.s("media-exit-pip-request", trigger);
  }
  /**
   * Notify the media player that a seeking process is happening and to seek to the given `time`.
   */
  seeking(time, trigger) {
    this.s("media-seeking-request", trigger, time);
  }
  /**
   * Notify the media player that a seeking operation has completed and to seek to the given `time`.
   * This is generally called after a series of `remote.seeking()` calls.
   */
  seek(time, trigger) {
    this.s("media-seek-request", trigger, time);
  }
  seekToLiveEdge(trigger) {
    this.s("media-live-edge-request", trigger);
  }
  /**
   * Dispatch a request to update the media volume to the given `volume` level which is a value
   * between 0 and 1.
   *
   * @example
   * ```ts
   * remote.changeVolume(0); // 0%
   * remote.changeVolume(0.05); // 5%
   * remote.changeVolume(0.5); // 50%
   * remote.changeVolume(0.75); // 70%
   * remote.changeVolume(1); // 100%
   * ```
   */
  changeVolume(volume, trigger) {
    this.s("media-volume-change-request", trigger, Math.max(0, Math.min(1, volume)));
  }
  /**
   * Dispatch a request to change the current audio track.
   *
   * @example
   * ```ts
   * remote.changeAudioTrack(1); // track at index 1
   * ```
   */
  changeAudioTrack(index, trigger) {
    this.s("media-audio-track-change-request", trigger, index);
  }
  /**
   * Dispatch a request to change the video quality. The special value `-1` represents auto quality
   * selection.
   *
   * @example
   * ```ts
   * remote.changeQuality(-1); // auto
   * remote.changeQuality(1); // quality at index 1
   * ```
   */
  changeQuality(index, trigger) {
    this.s("media-quality-change-request", trigger, index);
  }
  /**
   * Request auto quality selection.
   */
  requestAutoQuality(trigger) {
    this.changeQuality(-1, trigger);
  }
  /**
   * Dispatch a request to change the mode of the text track at the given index.
   *
   * @example
   * ```ts
   * remote.changeTextTrackMode(1, 'showing'); // track at index 1
   * ```
   */
  changeTextTrackMode(index, mode, trigger) {
    this.s("media-text-track-change-request", trigger, {
      index,
      mode
    });
  }
  /**
   * Dispatch a request to change the media playback rate.
   *
   * @example
   * ```ts
   * remote.changePlaybackRate(0.5); // Half the normal speed
   * remote.changePlaybackRate(1); // Normal speed
   * remote.changePlaybackRate(1.5); // 50% faster than normal
   * remote.changePlaybackRate(2); // Double the normal speed
   * ```
   */
  changePlaybackRate(rate, trigger) {
    this.s("media-rate-change-request", trigger, rate);
  }
  /**
   * Dispatch a request to resume idle tracking on controls.
   */
  resumeControls(trigger) {
    this.s("media-resume-controls-request", trigger);
  }
  /**
   * Dispatch a request to pause controls idle tracking. Pausing tracking will result in the
   * controls being visible until `remote.resumeControls()` is called. This method
   * is generally used when building custom controls and you'd like to prevent the UI from
   * disappearing.
   *
   * @example
   * ```ts
   * // Prevent controls hiding while menu is being interacted with.
   * function onSettingsOpen() {
   *   remote.pauseControls();
   * }
   *
   * function onSettingsClose() {
   *   remote.resumeControls();
   * }
   * ```
   */
  pauseControls(trigger) {
    this.s("media-pause-controls-request", trigger);
  }
  /**
   * Dispatch a request to toggle the media playback state.
   */
  togglePaused(trigger) {
    const player = this.getPlayer(trigger?.target);
    if (!player) {
      return;
    }
    if (player.state.paused)
      this.play(trigger);
    else
      this.pause(trigger);
  }
  /**
   * Dispatch a request to toggle the controls visibility.
   */
  toggleControls(trigger) {
    const player = this.getPlayer(trigger?.target);
    if (!player) {
      return;
    }
    if (!player.controls.showing) {
      player.controls.show(0, trigger);
    } else {
      player.controls.hide(0, trigger);
    }
  }
  /**
   * Dispatch a request to toggle the media muted state.
   */
  toggleMuted(trigger) {
    const player = this.getPlayer(trigger?.target);
    if (!player) {
      return;
    }
    if (player.state.muted)
      this.unmute(trigger);
    else
      this.mute(trigger);
  }
  /**
   * Dispatch a request to toggle the media fullscreen state.
   *
   * @docs {@link https://www.vidstack.io/docs/player/core-concepts/fullscreen#remote-control}
   */
  toggleFullscreen(target, trigger) {
    const player = this.getPlayer(trigger?.target);
    if (!player) {
      return;
    }
    if (player.state.fullscreen)
      this.exitFullscreen(target, trigger);
    else
      this.enterFullscreen(target, trigger);
  }
  /**
   * Dispatch a request to toggle the media picture-in-picture mode.
   *
   * @docs {@link https://www.vidstack.io/docs/player/core-concepts/picture-in-picture#remote-control}
   */
  togglePictureInPicture(trigger) {
    const player = this.getPlayer(trigger?.target);
    if (!player) {
      return;
    }
    if (player.state.pictureInPicture)
      this.exitPictureInPicture(trigger);
    else
      this.enterPictureInPicture(trigger);
  }
  /**
   * Turn captions off.
   */
  disableCaptions(trigger) {
    const player = this.getPlayer(trigger?.target);
    if (!player) {
      return;
    }
    const tracks = player.state.textTracks, track = player.state.textTrack;
    if (track) {
      const index = tracks.indexOf(track);
      this.changeTextTrackMode(index, "disabled", trigger);
    }
  }
  /**
   * Dispatch a request to toggle the current captions mode.
   */
  toggleCaptions(trigger) {
    const player = this.getPlayer(trigger?.target);
    if (!player) {
      return;
    }
    const tracks = player.state.textTracks, track = player.state.textTrack;
    if (track) {
      const index = tracks.indexOf(track);
      this.changeTextTrackMode(index, "disabled", trigger);
      this.Pc = index;
    } else {
      let index = this.Pc;
      if (!tracks[index] || !isTrackCaptionKind(tracks[index])) {
        index = -1;
      }
      if (index === -1) {
        index = tracks.findIndex((track2) => isTrackCaptionKind(track2) && track2.default);
      }
      if (index === -1) {
        index = tracks.findIndex((track2) => isTrackCaptionKind(track2));
      }
      if (index >= 0)
        this.changeTextTrackMode(index, "showing", trigger);
      this.Pc = -1;
    }
  }
  s(type, trigger, detail) {
    const request = new DOMEvent(type, {
      bubbles: true,
      composed: true,
      detail,
      trigger
    });
    let target = trigger?.target || null;
    if (target && target instanceof Component)
      target = target.el;
    const shouldUsePlayer = !target || target === document || target === window || target === document.body || this.aa?.el && target instanceof Node && !this.aa.el.contains(target);
    target = shouldUsePlayer ? this.A ?? this.getPlayer()?.el : target ?? this.A;
    if (this.aa) {
      this.aa.canPlayQueue.k(type, () => target?.dispatchEvent(request));
    } else {
      target?.dispatchEvent(request);
    }
  }
  za(method) {
  }
}

class MediaPlayerController extends ViewController {
}

class MediaControls extends MediaPlayerController {
  constructor() {
    super(...arguments);
    this.Qc = -2;
    this.Xa = false;
    this.ze = signal(false);
    this.Rc = signal(false);
    this.wb = null;
    /**
     * The default amount of delay in milliseconds while media playback is progressing without user
     * activity to indicate an idle state (i.e., hide controls).
     *
     * @defaultValue 2000
     */
    this.defaultDelay = 2e3;
  }
  /**
   * Whether controls visibility should be toggled when the mouse enters and leaves the player
   * container.
   *
   * @defaultValue false
   */
  get hideOnMouseLeave() {
    const { hideControlsOnMouseLeave } = this.$props;
    return this.ze() || hideControlsOnMouseLeave();
  }
  set hideOnMouseLeave(hide) {
    this.ze.set(hide);
  }
  /**
   * Whether media controls are currently visible.
   */
  get showing() {
    return this.$state.controlsVisible();
  }
  /**
   * Show controls.
   */
  show(delay = 0, trigger) {
    this.Sc();
    if (!this.Xa) {
      this.bc(true, delay, trigger);
    }
  }
  /**
   * Hide controls.
   */
  hide(delay = this.defaultDelay, trigger) {
    this.Sc();
    if (!this.Xa) {
      this.bc(false, delay, trigger);
    }
  }
  /**
   * Whether all idle tracking on controls should be paused until resumed again.
   */
  pause(trigger) {
    this.Xa = true;
    this.Sc();
    this.bc(true, 0, trigger);
  }
  resume(trigger) {
    this.Xa = false;
    if (this.$state.paused())
      return;
    this.bc(false, this.defaultDelay, trigger);
  }
  onConnect() {
    effect(this.bg.bind(this));
    effect(this.Tc.bind(this));
    const onPlay = this.xb.bind(this), onPause = this.Aa.bind(this);
    this.listen("can-play", (event) => this.show(0, event));
    this.listen("play", onPlay);
    this.listen("pause", onPause);
    this.listen("autoplay-fail", onPause);
  }
  bg() {
    const { started, pointer, paused } = this.$state;
    if (!started() || pointer() !== "fine")
      return;
    const shouldHideOnMouseLeave = this.hideOnMouseLeave;
    if (!shouldHideOnMouseLeave || !this.Rc()) {
      effect(() => {
        if (!paused())
          this.listen("pointermove", this.Ae.bind(this));
      });
    }
    if (shouldHideOnMouseLeave) {
      this.listen("mouseenter", this.cg.bind(this));
      this.listen("mouseleave", this.dg.bind(this));
    }
  }
  Tc() {
    const { paused, started, autoplayError } = this.$state;
    if (paused() || autoplayError() && !started())
      return;
    const onStopIdle = this.Ae.bind(this);
    effect(() => {
      const pointer = this.$state.pointer(), isTouch = pointer === "coarse", events = [isTouch ? "touchend" : "pointerup", "keydown"];
      for (const eventType of events) {
        this.listen(eventType, onStopIdle, { passive: false });
      }
    });
  }
  xb(event) {
    this.show(0, event);
    this.hide(void 0, event);
  }
  Aa(event) {
    this.show(0, event);
  }
  cg(event) {
    this.Rc.set(false);
    this.show(0, event);
    this.hide(void 0, event);
  }
  dg(event) {
    this.Rc.set(true);
    this.hide(0, event);
  }
  Sc() {
    window.clearTimeout(this.Qc);
    this.Qc = -1;
  }
  Ae(event) {
    if (
      // @ts-expect-error
      event.MEDIA_GESTURE || this.Xa || isTouchPinchEvent(event)
    ) {
      return;
    }
    if (isKeyboardEvent(event)) {
      if (event.key === "Escape") {
        this.el?.focus();
        this.wb = null;
      } else if (this.wb) {
        event.preventDefault();
        requestAnimationFrame(() => {
          this.wb?.focus();
          this.wb = null;
        });
      }
    }
    this.show(0, event);
    this.hide(this.defaultDelay, event);
  }
  bc(visible, delay, trigger) {
    if (delay === 0) {
      this.B(visible, trigger);
      return;
    }
    this.Qc = window.setTimeout(() => {
      if (!this.scope)
        return;
      this.B(visible && !this.Xa, trigger);
    }, delay);
  }
  B(visible, trigger) {
    if (this.$state.controlsVisible() === visible)
      return;
    this.$state.controlsVisible.set(visible);
    if (!visible && document.activeElement && this.el?.contains(document.activeElement)) {
      this.wb = document.activeElement;
      requestAnimationFrame(() => this.el?.focus());
    }
    this.dispatch("controls-change", {
      detail: visible,
      trigger
    });
  }
}

class NativeTextRenderer {
  constructor() {
    this.priority = 0;
    this.Be = true;
    this.m = null;
    this.z = null;
    this.yb = /* @__PURE__ */ new Set();
  }
  canRender(_, video) {
    return !!video;
  }
  attach(video) {
    this.m = video;
    if (video)
      video.textTracks.onchange = this.B.bind(this);
  }
  addTrack(track) {
    this.yb.add(track);
    this.eg(track);
  }
  removeTrack(track) {
    track[TextTrackSymbol.T]?.remove?.();
    track[TextTrackSymbol.T] = null;
    this.yb.delete(track);
  }
  changeTrack(track) {
    const current = track?.[TextTrackSymbol.T];
    if (current && current.track.mode !== "showing") {
      current.track.mode = "showing";
    }
    this.z = track;
  }
  setDisplay(display) {
    this.Be = display;
    this.B();
  }
  detach() {
    if (this.m)
      this.m.textTracks.onchange = null;
    for (const track of this.yb)
      this.removeTrack(track);
    this.yb.clear();
    this.m = null;
    this.z = null;
  }
  eg(track) {
    if (!this.m)
      return;
    const el = track[TextTrackSymbol.T] ??= this.fg(track);
    if (el instanceof HTMLElement) {
      this.m.append(el);
      el.track.mode = el.default ? "showing" : "hidden";
    }
  }
  fg(track) {
    const el = document.createElement("track"), isDefault = track.default || track.mode === "showing", isSupported = track.src && track.type === "vtt";
    el.id = track.id;
    el.src = isSupported ? track.src : "https://cdn.jsdelivr.net/npm/vidstack@next/empty.vtt";
    el.label = track.label;
    el.kind = track.kind;
    el.default = isDefault;
    track.language && (el.srclang = track.language);
    if (isDefault && !isSupported) {
      this.Ce(track, el.track);
    }
    return el;
  }
  Ce(track, native) {
    if (track.src && track.type === "vtt" || native.cues?.length)
      return;
    for (const cue of track.cues)
      native.addCue(cue);
  }
  B(event) {
    for (const track of this.yb) {
      const nativeTrack = track[TextTrackSymbol.T]?.track;
      if (!nativeTrack)
        continue;
      if (!this.Be) {
        nativeTrack.mode = "disabled";
        continue;
      }
      const isShowing = nativeTrack.mode === "showing";
      if (isShowing)
        this.Ce(track, nativeTrack);
      track.setMode(isShowing ? "showing" : "disabled", event);
    }
  }
}

class TextRenderers {
  constructor(_media) {
    this.a = _media;
    this.m = null;
    this.cc = [];
    this.De = false;
    this.ba = null;
    this.Ba = null;
    const textTracks = _media.textTracks;
    this.Uc = textTracks;
    effect(this.Vc.bind(this));
    onDispose(this.Ee.bind(this));
    listenEvent(textTracks, "add", this.Wc.bind(this));
    listenEvent(textTracks, "remove", this.gg.bind(this));
    listenEvent(textTracks, "mode-change", this.ea.bind(this));
  }
  Vc() {
    const { $state, $iosControls } = this.a;
    this.De = $state.controls() || $iosControls();
    this.ea();
  }
  add(renderer) {
    this.cc.push(renderer);
    this.ea();
  }
  remove(renderer) {
    renderer.detach();
    this.cc.splice(this.cc.indexOf(renderer), 1);
    this.ea();
  }
  /* @internal */
  Fe(video) {
    requestAnimationFrame(() => {
      this.m = video;
      if (video) {
        this.ba = new NativeTextRenderer();
        this.ba.attach(video);
        for (const track of this.Uc)
          this.Ge(track);
      }
      this.ea();
    });
  }
  Ge(track) {
    if (!isTrackCaptionKind(track))
      return;
    this.ba?.addTrack(track);
  }
  hg(track) {
    if (!isTrackCaptionKind(track))
      return;
    this.ba?.removeTrack(track);
  }
  Wc(event) {
    this.Ge(event.detail);
  }
  gg(event) {
    this.hg(event.detail);
  }
  ea() {
    const currentTrack = this.Uc.selected;
    if (this.m && (this.De || currentTrack?.[TextTrackSymbol.te])) {
      this.Ba?.changeTrack(null);
      this.ba?.setDisplay(true);
      this.ba?.changeTrack(currentTrack);
      return;
    }
    this.ba?.setDisplay(false);
    this.ba?.changeTrack(null);
    if (!currentTrack) {
      this.Ba?.changeTrack(null);
      return;
    }
    const customRenderer = this.cc.sort((a, b) => a.priority - b.priority).find((renderer) => renderer.canRender(currentTrack, this.m));
    if (this.Ba !== customRenderer) {
      this.Ba?.detach();
      customRenderer?.attach(this.m);
      this.Ba = customRenderer ?? null;
    }
    customRenderer?.changeTrack(currentTrack);
  }
  Ee() {
    this.ba?.detach();
    this.ba = null;
    this.Ba?.detach();
    this.Ba = null;
  }
}

class TextTrackList extends List {
  constructor() {
    super(...arguments);
    this.P = false;
    this.dc = {};
    this.Je = this.ig.bind(this);
  }
  get selected() {
    const track = this.r.find((t) => t.mode === "showing" && isTrackCaptionKind(t));
    return track ?? null;
  }
  add(init, trigger) {
    const isTrack = init instanceof TextTrack, track = isTrack ? init : new TextTrack(init);
    if (this.dc[init.kind] && init.default)
      delete init.default;
    track.addEventListener("mode-change", this.Je);
    this[ListSymbol.oa](track, trigger);
    track[TextTrackSymbol.Sa] = this[TextTrackSymbol.Sa];
    if (this.P)
      track[TextTrackSymbol.P]();
    if (init.default) {
      this.dc[init.kind] = track;
      track.mode = "showing";
    }
    return this;
  }
  remove(track, trigger) {
    if (!this.r.includes(track))
      return;
    if (track === this.dc[track.kind])
      delete this.dc[track.kind];
    track.mode = "disabled";
    track[TextTrackSymbol.Ua] = null;
    track.removeEventListener("mode-change", this.Je);
    this[ListSymbol.Yb](track, trigger);
    return this;
  }
  clear(trigger) {
    for (const track of [...this.r]) {
      this.remove(track, trigger);
    }
    return this;
  }
  getById(id) {
    return this.r.find((track) => track.id === id) ?? null;
  }
  getByKind(kind) {
    const kinds = Array.isArray(kind) ? kind : [kind];
    return this.r.filter((track) => kinds.includes(track.kind));
  }
  /* @internal */
  [(TextTrackSymbol.P)]() {
    if (this.P)
      return;
    for (const track of this.r)
      track[TextTrackSymbol.P]();
    this.P = true;
  }
  ig(event) {
    const track = event.detail;
    if (track.mode === "showing") {
      const kinds = isTrackCaptionKind(track) ? ["captions", "subtitles"] : [track.kind];
      for (const t of this.r) {
        if (t.mode === "showing" && t != track && kinds.includes(t.kind)) {
          t.mode = "disabled";
        }
      }
    }
    this.dispatchEvent(
      new DOMEvent("mode-change", {
        detail: event.detail,
        trigger: event
      })
    );
  }
}

const SELECTED = Symbol(0);
class SelectList extends List {
  get selected() {
    return this.r.find((item) => item.selected) ?? null;
  }
  get selectedIndex() {
    return this.r.findIndex((item) => item.selected);
  }
  /* @internal */
  [ListSymbol.oe](item, trigger) {
    this[ListSymbol.pa](item, false, trigger);
  }
  /* @internal */
  [ListSymbol.oa](item, trigger) {
    item[SELECTED] = false;
    Object.defineProperty(item, "selected", {
      get() {
        return this[SELECTED];
      },
      set: (selected) => {
        if (this.readonly)
          return;
        this[ListSymbol.pe]?.();
        this[ListSymbol.pa](item, selected);
      }
    });
    super[ListSymbol.oa](item, trigger);
  }
  /* @internal */
  [ListSymbol.pa](item, selected, trigger) {
    if (selected === item?.[SELECTED])
      return;
    const prev = this.selected;
    if (item)
      item[SELECTED] = selected;
    const changed = !selected ? prev === item : prev !== item;
    if (changed) {
      if (prev)
        prev[SELECTED] = false;
      this.dispatchEvent(
        new DOMEvent("change", {
          detail: {
            prev,
            current: this.selected
          },
          trigger
        })
      );
    }
  }
}

class AudioTrackList extends SelectList {
  getById(id) {
    if (id === "")
      return null;
    return this.r.find((track) => track.id === id) ?? null;
  }
}

class VideoQualityList extends SelectList {
  constructor() {
    super(...arguments);
    this.fc = false;
    /**
     * Configures quality switching:
     *
     * - `current`: Trigger an immediate quality level switch. This will abort the current fragment
     * request if any, flush the whole buffer, and fetch fragment matching with current position
     * and requested quality level.
     *
     * - `next`: Trigger a quality level switch for next fragment. This could eventually flush
     * already buffered next fragment.
     *
     * - `load`: Set quality level for next loaded fragment.
     *
     * @see {@link https://www.vidstack.io/docs/player/api/video-quality#switch}
     * @see {@link https://github.com/video-dev/hls.js/blob/master/docs/API.md#quality-switch-control-api}
     */
    this.switch = "current";
  }
  /**
   * Whether automatic quality selection is enabled.
   */
  get auto() {
    return this.fc || this.readonly;
  }
  /* @internal */
  [(ListSymbol.pe)]() {
    this[QualitySymbol.Ya](false);
  }
  /* @internal */
  [ListSymbol.ne](trigger) {
    this[QualitySymbol.Ya](false, trigger);
  }
  /**
   * Request automatic quality selection (if supported). This will be a no-op if the list is
   * `readonly` as that already implies auto-selection.
   */
  autoSelect(trigger) {
    if (this.readonly || this.fc || !this[QualitySymbol.Za])
      return;
    this[QualitySymbol.Za]?.();
    this[QualitySymbol.Ya](true, trigger);
  }
  /* @internal */
  [QualitySymbol.Ya](auto, trigger) {
    if (this.fc === auto)
      return;
    this.fc = auto;
    this.dispatchEvent(
      new DOMEvent("auto-change", {
        detail: auto,
        trigger
      })
    );
  }
}

function isAudioProvider(provider) {
  return provider?.$$PROVIDER_TYPE === "AUDIO";
}
function isVideoProvider(provider) {
  return provider?.$$PROVIDER_TYPE === "VIDEO";
}
function isHLSProvider(provider) {
  return provider?.$$PROVIDER_TYPE === "HLS";
}
function isYouTubeProvider(provider) {
  return provider?.$$PROVIDER_TYPE === "YOUTUBE";
}
function isVimeoProvider(provider) {
  return provider?.$$PROVIDER_TYPE === "VIMEO";
}
function isHTMLAudioElement(element) {
  return element instanceof HTMLAudioElement;
}
function isHTMLVideoElement(element) {
  return element instanceof HTMLVideoElement;
}
function isHTMLMediaElement(element) {
  return isHTMLAudioElement(element) || isHTMLVideoElement(element);
}
function isHTMLIFrameElement(element) {
  return element instanceof HTMLIFrameElement;
}

const MEDIA_KEY_SHORTCUTS = {
  togglePaused: "k Space",
  toggleMuted: "m",
  toggleFullscreen: "f",
  togglePictureInPicture: "i",
  toggleCaptions: "c",
  seekBackward: "j J ArrowLeft",
  seekForward: "l L ArrowRight",
  volumeUp: "ArrowUp",
  volumeDown: "ArrowDown",
  speedUp: ">",
  slowDown: "<"
};
const MODIFIER_KEYS = /* @__PURE__ */ new Set(["Shift", "Alt", "Meta", "Control"]), BUTTON_SELECTORS = 'button, [role="button"]', IGNORE_SELECTORS = 'input, textarea, select, [contenteditable], [role^="menuitem"]';
class MediaKeyboardController extends MediaPlayerController {
  constructor(_media) {
    super();
    this.a = _media;
    this._a = null;
  }
  onConnect() {
    effect(this.mg.bind(this));
  }
  mg() {
    const { keyDisabled, keyTarget } = this.$props;
    if (keyDisabled())
      return;
    const target = keyTarget() === "player" ? this.el : document, $active = signal(false);
    if (target === this.el) {
      this.listen("focusin", () => $active.set(true));
      this.listen("focusout", (event) => {
        if (!this.el.contains(event.target))
          $active.set(false);
      });
    } else {
      if (!peek($active))
        $active.set(document.querySelector("[data-media-player]") === this.el);
      listenEvent(document, "focusin", (event) => {
        const activePlayer = event.composedPath().find((el) => el instanceof Element && el.localName === "media-player");
        if (activePlayer !== void 0)
          $active.set(this.el === activePlayer);
      });
    }
    effect(() => {
      if (!$active())
        return;
      listenEvent(target, "keyup", this.zb.bind(this));
      listenEvent(target, "keydown", this.Ab.bind(this));
      listenEvent(target, "keydown", this.ng.bind(this), { capture: true });
    });
  }
  zb(event) {
    const focusedEl = document.activeElement;
    if (!event.key || !this.$state.canSeek() || focusedEl?.matches(IGNORE_SELECTORS)) {
      return;
    }
    let { method, value } = this.Zc(event);
    if (!isString(value) && !isArray(value)) {
      value?.callback(event);
      return;
    }
    if (method?.startsWith("seek")) {
      event.preventDefault();
      event.stopPropagation();
      if (this._a) {
        this.Ne(event, method === "seekForward");
        this._a = null;
      } else {
        this.a.remote.seek(this.gc, event);
        this.gc = void 0;
      }
    }
    if (method?.startsWith("volume")) {
      const volumeSlider = this.el.querySelector("[data-media-volume-slider]");
      volumeSlider?.dispatchEvent(
        new KeyboardEvent("keyup", {
          key: method === "volumeUp" ? "Up" : "Down",
          shiftKey: event.shiftKey,
          trigger: event
        })
      );
    }
  }
  Ab(event) {
    if (!event.key || MODIFIER_KEYS.has(event.key))
      return;
    const focusedEl = document.activeElement;
    if (focusedEl?.matches(IGNORE_SELECTORS) || isKeyboardClick(event) && focusedEl?.matches(BUTTON_SELECTORS)) {
      return;
    }
    let { method, value } = this.Zc(event);
    if (!isString(value) && !isArray(value)) {
      value?.callback(event);
      return;
    }
    if (!method && !event.metaKey && /[0-9]/.test(event.key)) {
      event.preventDefault();
      event.stopPropagation();
      this.a.remote.seek(this.$state.duration() / 10 * Number(event.key), event);
      return;
    }
    if (!method)
      return;
    event.preventDefault();
    event.stopPropagation();
    switch (method) {
      case "seekForward":
      case "seekBackward":
        this.qa(event, method, method === "seekForward");
        break;
      case "volumeUp":
      case "volumeDown":
        const volumeSlider = this.el.querySelector("[data-media-volume-slider]");
        if (volumeSlider) {
          volumeSlider.dispatchEvent(
            new KeyboardEvent("keydown", {
              key: method === "volumeUp" ? "Up" : "Down",
              shiftKey: event.shiftKey,
              trigger: event
            })
          );
        } else {
          const value2 = event.shiftKey ? 0.1 : 0.05;
          this.a.remote.changeVolume(
            this.$state.volume() + (method === "volumeUp" ? +value2 : -value2),
            event
          );
        }
        break;
      case "toggleFullscreen":
        this.a.remote.toggleFullscreen("prefer-media", event);
        break;
      case "speedUp":
      case "slowDown":
        const playbackRate = this.$state.playbackRate();
        this.a.remote.changePlaybackRate(
          Math.max(0.25, Math.min(2, playbackRate + (method === "speedUp" ? 0.25 : -0.25))),
          event
        );
        break;
      default:
        this.a.remote[method]?.(event);
    }
  }
  ng(event) {
    if (isHTMLMediaElement(event.target) && this.Zc(event).method) {
      event.preventDefault();
    }
  }
  Zc(event) {
    const keyShortcuts = {
      ...this.$props.keyShortcuts(),
      ...this.a.ariaKeys
    };
    const method = Object.keys(keyShortcuts).find((method2) => {
      const value = keyShortcuts[method2], keys = isArray(value) ? value.join(" ") : isString(value) ? value : value?.keys;
      return (isArray(keys) ? keys : keys?.split(" "))?.some((keys2) => {
        return replaceSymbolKeys(keys2).replace(/Control/g, "Ctrl").split("+").every(
          (key) => MODIFIER_KEYS.has(key) ? event[key.toLowerCase() + "Key"] : event.key === key.replace("Space", " ")
        );
      });
    });
    return {
      method,
      value: method ? keyShortcuts[method] : null
    };
  }
  og(event, type) {
    const seekBy = event.shiftKey ? 10 : 5;
    return this.gc = Math.max(
      0,
      Math.min(
        (this.gc ?? this.$state.currentTime()) + (type === "seekForward" ? +seekBy : -seekBy),
        this.$state.duration()
      )
    );
  }
  Ne(event, forward) {
    this._a?.dispatchEvent(
      new KeyboardEvent(event.type, {
        key: !forward ? "Left" : "Right",
        shiftKey: event.shiftKey,
        trigger: event
      })
    );
  }
  qa(event, type, forward) {
    if (!this.$state.canSeek())
      return;
    if (!this._a)
      this._a = this.el.querySelector("[data-media-time-slider]");
    if (this._a) {
      this.Ne(event, forward);
    } else {
      this.a.remote.seeking(this.og(event, type), event);
    }
  }
}
const SYMBOL_KEY_MAP = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"];
function replaceSymbolKeys(key) {
  return key.replace(/Shift\+(\d)/g, (_, num) => SYMBOL_KEY_MAP[num - 1]);
}

class ARIAKeyShortcuts extends ViewController {
  constructor(_shortcut) {
    super();
    this._c = _shortcut;
  }
  onAttach(el) {
    const { $props, ariaKeys } = useMediaContext(), keys = el.getAttribute("aria-keyshortcuts");
    if (keys) {
      ariaKeys[this._c] = keys;
      {
        onDispose(() => {
          delete ariaKeys[this._c];
        });
      }
      return;
    }
    const shortcuts = $props.keyShortcuts()[this._c];
    if (shortcuts) {
      const keys2 = isArray(shortcuts) ? shortcuts.join(" ") : isString(shortcuts) ? shortcuts : shortcuts?.keys;
      el.setAttribute("aria-keyshortcuts", isArray(keys2) ? keys2.join(" ") : keys2);
    }
  }
}

class AudioProviderLoader {
  canPlay({ src, type }) {
    return isString(src) ? AUDIO_EXTENSIONS.test(src) || AUDIO_TYPES.has(type) || src.startsWith("blob:") && type === "audio/object" : type === "audio/object";
  }
  mediaType() {
    return "audio";
  }
  async load() {
    return new (await import('../providers/vidstack-audio.js')).AudioProvider(this.target);
  }
}

class VideoProviderLoader {
  canPlay(src) {
    return isString(src.src) ? VIDEO_EXTENSIONS.test(src.src) || VIDEO_TYPES.has(src.type) || src.src.startsWith("blob:") && src.type === "video/object" || isHLSSrc(src) && canPlayHLSNatively() : src.type === "video/object";
  }
  mediaType() {
    return "video";
  }
  async load(ctx) {
    return new (await import('../providers/vidstack-video.js')).VideoProvider(this.target, ctx);
  }
}

class YouTubeProviderLoader {
  canPlay(src) {
    return isString(src.src) && src.type === "video/youtube";
  }
  mediaType() {
    return "video";
  }
  async load(ctx) {
    return new (await import('../providers/vidstack-youtube.js')).YouTubeProvider(this.target);
  }
}

class HLSProviderLoader extends VideoProviderLoader {
  static {
    this.supported = isHLSSupported();
  }
  canPlay(src) {
    return HLSProviderLoader.supported && isHLSSrc(src);
  }
  async load(context) {
    return new (await import('../providers/vidstack-hls.js')).HLSProvider(this.target, context);
  }
}

class VimeoProviderLoader {
  canPlay(src) {
    return isString(src.src) && src.type === "video/vimeo";
  }
  mediaType() {
    return "video";
  }
  async load(ctx) {
    return new (await import('../providers/vidstack-vimeo.js')).VimeoProvider(this.target);
  }
}

const MEDIA_ATTRIBUTES = Symbol(0);
const mediaAttributes = [
  "autoplay",
  "canFullscreen",
  "canPictureInPicture",
  "canLoad",
  "canPlay",
  "canSeek",
  "ended",
  "fullscreen",
  "loop",
  "live",
  "liveEdge",
  "mediaType",
  "muted",
  "paused",
  "pictureInPicture",
  "playing",
  "playsinline",
  "seeking",
  "started",
  "streamType",
  "viewType",
  "waiting"
];

const mediaPlayerProps = {
  autoplay: false,
  controls: false,
  currentTime: 0,
  crossorigin: null,
  fullscreenOrientation: "landscape",
  load: "visible",
  logLevel: "silent",
  loop: false,
  muted: false,
  paused: true,
  playsinline: false,
  playbackRate: 1,
  poster: "",
  preload: "metadata",
  preferNativeHLS: false,
  src: "",
  title: "",
  controlsDelay: 2e3,
  hideControlsOnMouseLeave: false,
  viewType: "unknown",
  streamType: "unknown",
  volume: 1,
  liveEdgeTolerance: 10,
  minLiveDVRWindow: 60,
  keyDisabled: false,
  keyTarget: "player",
  keyShortcuts: MEDIA_KEY_SHORTCUTS
};

class MediaLoadController extends MediaPlayerController {
  constructor(_callback) {
    super();
    this.Ca = _callback;
  }
  async onAttach(el) {
    const load = this.$props.load();
    if (load === "eager") {
      requestAnimationFrame(this.Ca);
    } else if (load === "idle") {
      waitIdlePeriod(this.Ca);
    } else if (load === "visible") {
      const observer = new IntersectionObserver((entries) => {
        if (!this.scope)
          return;
        if (entries[0].isIntersecting) {
          observer.disconnect();
          this.Ca();
        }
      });
      observer.observe(el);
      return observer.disconnect.bind(observer);
    }
  }
}

class MediaPlayerDelegate {
  constructor(_handle, _media) {
    this.X = _handle;
    this.a = _media;
    this.c = (type, ...init) => {
      this.X(
        new DOMEvent(type, {
          detail: init?.[0],
          trigger: init?.[1]
        })
      );
    };
  }
  async jc(info, trigger) {
    const { $state, logger } = this.a;
    if (peek($state.canPlay))
      return;
    const detail = {
      duration: info?.duration ?? peek($state.duration),
      seekable: info?.seekable ?? peek($state.seekable),
      buffered: info?.buffered ?? peek($state.buffered),
      provider: peek(this.a.$provider)
    };
    this.c("can-play", detail, trigger);
    tick();
    const provider = peek(this.a.$provider), { muted, volume, playsinline } = this.a.$props;
    if (provider) {
      provider.setVolume(peek(volume));
      provider.setMuted(peek(muted));
      provider.setPlaysinline?.(peek(playsinline));
    }
    if ($state.canPlay() && $state.autoplay() && !$state.started()) {
      await this.oh(trigger);
    }
  }
  async oh(trigger) {
    const { player, $state } = this.a;
    $state.autoplaying.set(true);
    const attemptEvent = new DOMEvent("autoplay-attempt", { trigger });
    try {
      await player.play(attemptEvent);
    } catch (error) {
    }
  }
}

class Queue {
  constructor() {
    this.e = /* @__PURE__ */ new Map();
  }
  /**
   * Queue the given `item` under the given `key` to be processed at a later time by calling
   * `serve(key)`.
   */
  k(key, item) {
    if (!this.e.has(key))
      this.e.set(key, /* @__PURE__ */ new Set());
    this.e.get(key).add(item);
  }
  /**
   * Process all items in queue for the given `key`.
   */
  td(key, callback) {
    const items = this.e.get(key);
    if (items)
      for (const item of items)
        callback(item);
    this.e.delete(key);
  }
  /**
   * Removes all queued items under the given `key`.
   */
  qc(key) {
    this.e.delete(key);
  }
  /**
   * The number of items currently queued under the given `key`.
   */
  ph(key) {
    return this.e.get(key)?.size ?? 0;
  }
  /**
   * Clear all items in the queue.
   */
  H() {
    this.e.clear();
  }
}

class RequestQueue {
  constructor() {
    this.Mb = false;
    this.Ed = deferredPromise();
    this.e = /* @__PURE__ */ new Map();
  }
  /**
   * The number of callbacks that are currently in queue.
   */
  get ph() {
    return this.e.size;
  }
  /**
   * Whether items in the queue are being served immediately, otherwise they're queued to
   * be processed later.
   */
  get Rj() {
    return this.Mb;
  }
  /**
   * Waits for the queue to be flushed (ie: start serving).
   */
  async Sj() {
    if (this.Mb)
      return;
    await this.Ed.promise;
  }
  /**
   * Queue the given `callback` to be invoked at a later time by either calling the `serve()` or
   * `start()` methods. If the queue has started serving (i.e., `start()` was already called),
   * then the callback will be invoked immediately.
   *
   * @param key - Uniquely identifies this callback so duplicates are ignored.
   * @param callback - The function to call when this item in the queue is being served.
   */
  k(key, callback) {
    if (this.Mb) {
      callback();
      return;
    }
    this.e.delete(key);
    this.e.set(key, callback);
  }
  /**
   * Invokes the callback with the given `key` in the queue (if it exists).
   */
  td(key) {
    this.e.get(key)?.();
    this.e.delete(key);
  }
  /**
   * Flush all queued items and start serving future requests immediately until `stop()` is called.
   */
  Bb() {
    this.jf();
    this.Mb = true;
    if (this.e.size > 0)
      this.jf();
  }
  /**
   * Stop serving requests, they'll be queued until you begin processing again by calling `start()`.
   */
  ra() {
    this.Mb = false;
  }
  /**
   * Stop serving requests, empty the request queue, and release any promises waiting for the
   * queue to flush.
   */
  H() {
    this.ra();
    this.e.clear();
    this.kf();
  }
  jf() {
    for (const key of this.e.keys())
      this.td(key);
    this.kf();
  }
  kf() {
    this.Ed.resolve();
    this.Ed = deferredPromise();
  }
}

class MediaRequestManager extends MediaPlayerController {
  constructor(_stateMgr, _request, _media) {
    super();
    this.ga = _stateMgr;
    this.f = _request;
    this.a = _media;
    this.vk = new RequestQueue();
    this.vd = false;
    this.uk = _media.$provider;
    this.Ib = new MediaControls();
    this.rc = new FullscreenController();
    this.ta = new ScreenOrientationController();
  }
  onAttach() {
    this.listen("fullscreen-change", this.Oc.bind(this));
  }
  onConnect() {
    const names = Object.getOwnPropertyNames(Object.getPrototypeOf(this)), handle = this.qh.bind(this);
    for (const name of names) {
      if (name.startsWith("media-")) {
        this.listen(name, handle);
      }
    }
    effect(this.wk.bind(this));
    effect(this.rh.bind(this));
    effect(this.sh.bind(this));
    effect(this.th.bind(this));
  }
  onDestroy() {
    this.vk.H();
  }
  wk() {
    const provider = this.uk(), canPlay = this.$state.canPlay();
    if (provider && canPlay) {
      this.vk.Bb();
    }
    return () => {
      this.vk.ra();
    };
  }
  qh(event) {
    event.stopPropagation();
    if (!this[event.type])
      return;
    if (peek(this.uk)) {
      this[event.type](event);
    } else {
      this.vk.k(event.type, () => {
        if (peek(this.uk))
          this[event.type](event);
      });
    }
  }
  async sc(trigger) {
    const { canPlay, paused, ended, autoplaying, seekableStart } = this.$state;
    if (!peek(paused))
      return;
    if (trigger?.type === "media-play-request") {
      this.f.e.k("play", trigger);
    }
    try {
      const provider = peek(this.uk);
      throwIfNotReadyForPlayback(provider, peek(canPlay));
      if (peek(ended)) {
        provider.setCurrentTime(seekableStart() + 0.1);
      }
      return await provider.play();
    } catch (error) {
      const errorEvent = this.createEvent("play-fail", {
        detail: coerceToError(error),
        trigger
      });
      errorEvent.autoplay = autoplaying();
      this.ga.X(errorEvent);
      throw error;
    }
  }
  async ud(trigger) {
    const { canPlay, paused } = this.$state;
    if (peek(paused))
      return;
    if (trigger?.type === "media-pause-request") {
      this.f.e.k("pause", trigger);
    }
    const provider = peek(this.uk);
    throwIfNotReadyForPlayback(provider, peek(canPlay));
    return provider.pause();
  }
  Ze(trigger) {
    const { canPlay, live, liveEdge, canSeek, liveSyncPosition, seekableEnd, userBehindLiveEdge } = this.$state;
    userBehindLiveEdge.set(false);
    if (peek(() => !live() || liveEdge() || !canSeek()))
      return;
    const provider = peek(this.uk);
    throwIfNotReadyForPlayback(provider, peek(canPlay));
    provider.setCurrentTime(liveSyncPosition() ?? seekableEnd() - 2);
  }
  async _e(target = "prefer-media", trigger) {
    const adapter = this.$e(target);
    throwIfFullscreenNotSupported(target, adapter);
    if (adapter.active)
      return;
    if (peek(this.$state.pictureInPicture)) {
      this.vd = true;
      await this.wd(trigger);
    }
    if (trigger?.type === "media-enter-fullscreen-request") {
      this.f.e.k("fullscreen", trigger);
    }
    return adapter.enter();
  }
  async af(target = "prefer-media", trigger) {
    const adapter = this.$e(target);
    throwIfFullscreenNotSupported(target, adapter);
    if (!adapter.active)
      return;
    if (trigger?.type === "media-exit-fullscreen-request") {
      this.f.e.k("fullscreen", trigger);
    }
    try {
      const result = await adapter.exit();
      if (this.vd && peek(this.$state.canPictureInPicture)) {
        await this.xd();
      }
      return result;
    } finally {
      this.vd = false;
    }
  }
  $e(target) {
    const provider = peek(this.uk);
    return target === "prefer-media" && this.rc.supported || target === "media" ? this.rc : provider?.fullscreen;
  }
  async xd(trigger) {
    this.bf();
    if (this.$state.pictureInPicture())
      return;
    if (trigger?.type === "media-enter-pip-request") {
      this.f.e.k("pip", trigger);
    }
    return await this.uk().pictureInPicture.enter();
  }
  async wd(trigger) {
    this.bf();
    if (!this.$state.pictureInPicture())
      return;
    if (trigger?.type === "media-exit-pip-request") {
      this.f.e.k("pip", trigger);
    }
    return await this.uk().pictureInPicture.exit();
  }
  bf() {
    if (this.$state.canPictureInPicture())
      return;
    throw Error(
      "[vidstack] no pip support"
    );
  }
  rh() {
    this.Ib.defaultDelay = this.$props.controlsDelay();
  }
  sh() {
    const { canLoad, canFullscreen } = this.$state, supported = this.rc.supported || this.uk()?.fullscreen?.supported || false;
    if (canLoad() && peek(canFullscreen) === supported)
      return;
    canFullscreen.set(supported);
  }
  th() {
    const { canLoad, canPictureInPicture } = this.$state, supported = this.uk()?.pictureInPicture?.supported || false;
    if (canLoad() && peek(canPictureInPicture) === supported)
      return;
    canPictureInPicture.set(supported);
  }
  ["media-audio-track-change-request"](event) {
    if (this.a.audioTracks.readonly) {
      return;
    }
    const index = event.detail, track = this.a.audioTracks[index];
    if (track) {
      this.f.e.k("audioTrack", event);
      track.selected = true;
    }
  }
  async ["media-enter-fullscreen-request"](event) {
    try {
      await this._e(event.detail, event);
    } catch (error) {
      this._b(error, event);
    }
  }
  async ["media-exit-fullscreen-request"](event) {
    try {
      await this.af(event.detail, event);
    } catch (error) {
      this._b(error, event);
    }
  }
  async Oc(event) {
    const lockType = peek(this.$props.fullscreenOrientation), isFullscreen = event.detail;
    if (isUndefined(lockType) || !this.ta.supported)
      return;
    if (isFullscreen) {
      if (this.ta.locked)
        return;
      this.dispatch("media-orientation-lock-request", {
        detail: lockType,
        trigger: event
      });
    } else if (this.ta.locked) {
      this.dispatch("media-orientation-unlock-request", {
        trigger: event
      });
    }
  }
  _b(error, request) {
    this.ga.X(
      this.createEvent("fullscreen-error", {
        detail: coerceToError(error)
      })
    );
  }
  async ["media-orientation-lock-request"](event) {
    try {
      this.f.e.k("orientation", event);
      await this.ta.lock(event.detail);
    } catch (error) {
      this.f.e.qc("orientation");
    }
  }
  async ["media-orientation-unlock-request"](event) {
    try {
      this.f.e.k("orientation", event);
      await this.ta.unlock();
    } catch (error) {
      this.f.e.qc("orientation");
    }
  }
  async ["media-enter-pip-request"](event) {
    try {
      await this.xd(event);
    } catch (error) {
      this.cf(error, event);
    }
  }
  async ["media-exit-pip-request"](event) {
    try {
      await this.wd(event);
    } catch (error) {
      this.cf(error, event);
    }
  }
  cf(error, request) {
    this.ga.X(
      this.createEvent("picture-in-picture-error", {
        detail: coerceToError(error)
      })
    );
  }
  ["media-live-edge-request"](event) {
    const { live, liveEdge, canSeek } = this.$state;
    if (!live() || liveEdge() || !canSeek())
      return;
    this.f.e.k("seeked", event);
    try {
      this.Ze();
    } catch (error) {
    }
  }
  async ["media-loop-request"](event) {
    try {
      this.f.Ha = true;
      this.f.gb = true;
      await this.sc(event);
    } catch (e) {
      this.f.Ha = false;
      this.f.gb = false;
    }
  }
  async ["media-pause-request"](event) {
    if (this.$state.paused())
      return;
    try {
      await this.ud(event);
    } catch (error) {
      this.f.e.qc("pause");
    }
  }
  async ["media-play-request"](event) {
    if (!this.$state.paused())
      return;
    try {
      await this.sc(event);
    } catch (e) {
    }
  }
  ["media-rate-change-request"](event) {
    const { playbackRate, canSetPlaybackRate } = this.$state;
    if (playbackRate() === event.detail || !canSetPlaybackRate())
      return;
    const provider = this.uk();
    if (!provider?.setPlaybackRate)
      return;
    this.f.e.k("rate", event);
    provider.setPlaybackRate(event.detail);
  }
  ["media-quality-change-request"](event) {
    if (this.a.qualities.readonly) {
      return;
    }
    this.f.e.k("quality", event);
    const index = event.detail;
    if (index < 0) {
      this.a.qualities.autoSelect(event);
    } else {
      const quality = this.a.qualities[index];
      if (quality) {
        quality.selected = true;
      }
    }
  }
  ["media-pause-controls-request"](event) {
    this.f.e.k("controls", event);
    this.Ib.pause(event);
  }
  ["media-resume-controls-request"](event) {
    this.f.e.k("controls", event);
    this.Ib.resume(event);
  }
  ["media-seek-request"](event) {
    const { seekableStart, seekableEnd, ended, canSeek, live, userBehindLiveEdge } = this.$state;
    if (ended())
      this.f.gb = true;
    this.f.qa = false;
    this.f.e.qc("seeking");
    const boundTime = Math.min(Math.max(seekableStart() + 0.1, event.detail), seekableEnd() - 0.1);
    if (!Number.isFinite(boundTime) || !canSeek())
      return;
    this.f.e.k("seeked", event);
    this.uk().setCurrentTime(boundTime);
    if (live() && event.isOriginTrusted && Math.abs(seekableEnd() - boundTime) >= 2) {
      userBehindLiveEdge.set(true);
    }
  }
  ["media-seeking-request"](event) {
    this.f.e.k("seeking", event);
    this.$state.seeking.set(true);
    this.f.qa = true;
  }
  ["media-start-loading"](event) {
    if (this.$state.canLoad())
      return;
    this.f.e.k("load", event);
    this.ga.X(this.createEvent("can-load"));
  }
  ["media-text-track-change-request"](event) {
    const { index, mode } = event.detail, track = this.a.textTracks[index];
    if (track) {
      this.f.e.k("textTrack", event);
      track.setMode(mode, event);
    }
  }
  ["media-mute-request"](event) {
    if (this.$state.muted())
      return;
    this.f.e.k("volume", event);
    this.uk().setMuted(true);
  }
  ["media-unmute-request"](event) {
    const { muted, volume } = this.$state;
    if (!muted())
      return;
    this.f.e.k("volume", event);
    this.a.$provider().setMuted(false);
    if (volume() === 0) {
      this.f.e.k("volume", event);
      this.uk().setVolume(0.25);
    }
  }
  ["media-volume-change-request"](event) {
    const { muted, volume } = this.$state;
    const newVolume = event.detail;
    if (volume() === newVolume)
      return;
    this.f.e.k("volume", event);
    this.uk().setVolume(newVolume);
    if (newVolume > 0 && muted()) {
      this.f.e.k("volume", event);
      this.uk().setMuted(false);
    }
  }
}
function throwIfNotReadyForPlayback(provider, canPlay) {
  if (provider && canPlay)
    return;
  throw Error(
    "[vidstack] media not ready"
  );
}
function throwIfFullscreenNotSupported(target, fullscreen) {
  if (fullscreen?.supported)
    return;
  throw Error(
    "[vidstack] no fullscreen support"
  );
}
class MediaRequestContext {
  constructor() {
    this.qa = false;
    this.Ha = false;
    this.gb = false;
    this.e = new Queue();
  }
}

var functionDebounce = debounce;

function debounce(fn, wait, callFirst) {
  var timeout = null;
  var debouncedFn = null;

  var clear = function() {
    if (timeout) {
      clearTimeout(timeout);

      debouncedFn = null;
      timeout = null;
    }
  };

  var flush = function() {
    var call = debouncedFn;
    clear();

    if (call) {
      call();
    }
  };

  var debounceWrapper = function() {
    if (!wait) {
      return fn.apply(this, arguments);
    }

    var context = this;
    var args = arguments;
    var callNow = callFirst && !timeout;
    clear();

    debouncedFn = function() {
      fn.apply(context, args);
    };

    timeout = setTimeout(function() {
      timeout = null;

      if (!callNow) {
        var call = debouncedFn;
        debouncedFn = null;

        return call();
      }
    }, wait);

    if (callNow) {
      return debouncedFn();
    }
  };

  debounceWrapper.cancel = clear;
  debounceWrapper.flush = flush;

  return debounceWrapper;
}

var functionThrottle = throttle;

function throttle(fn, interval, options) {
  var timeoutId = null;
  var throttledFn = null;
  var leading = (options && options.leading);
  var trailing = (options && options.trailing);

  if (leading == null) {
    leading = true; // default
  }

  if (trailing == null) {
    trailing = !leading; //default
  }

  if (leading == true) {
    trailing = false; // forced because there should be invocation per call
  }

  var cancel = function() {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  var flush = function() {
    var call = throttledFn;
    cancel();

    if (call) {
      call();
    }
  };

  var throttleWrapper = function() {
    var callNow = leading && !timeoutId;
    var context = this;
    var args = arguments;

    throttledFn = function() {
      return fn.apply(context, args);
    };

    if (!timeoutId) {
      timeoutId = setTimeout(function() {
        timeoutId = null;

        if (trailing) {
          return throttledFn();
        }
      }, interval);
    }

    if (callNow) {
      callNow = false;
      return throttledFn();
    }
  };

  throttleWrapper.cancel = cancel;
  throttleWrapper.flush = flush;

  return throttleWrapper;
}

const TRACKED_EVENT = /* @__PURE__ */ new Set([
  "autoplay",
  "autoplay-fail",
  "can-load",
  "sources-change",
  "source-change",
  "load-start",
  "abort",
  "error",
  "loaded-metadata",
  "loaded-data",
  "can-play",
  "play",
  "play-fail",
  "pause",
  "playing",
  "seeking",
  "seeked",
  "waiting"
]);

class MediaStateManager extends MediaPlayerController {
  constructor(_request, _media) {
    super();
    this.f = _request;
    this.a = _media;
    this.p = /* @__PURE__ */ new Map();
    this.tc = false;
    this.Jb = false;
    this["seeking"] = functionThrottle(
      (event) => {
        const { seeking, currentTime, paused } = this.$state;
        seeking.set(true);
        currentTime.set(event.detail);
        this.F("seeking", event);
        if (paused()) {
          this.hb = event;
          this.zd();
        }
      },
      150,
      { leading: true }
    );
    this.zd = functionDebounce(() => {
      if (!this.hb)
        return;
      this.tc = true;
      const { waiting, playing } = this.$state;
      waiting.set(true);
      playing.set(false);
      const event = this.createEvent("waiting", { trigger: this.hb });
      this.p.set("waiting", event);
      this.dispatch(event);
      this.hb = void 0;
      this.tc = false;
    }, 300);
  }
  onAttach(el) {
    el.setAttribute("aria-busy", "true");
    this.listen("fullscreen-change", this["fullscreen-change"].bind(this));
    this.listen("fullscreen-error", this["fullscreen-error"].bind(this));
    this.listen("orientation-change", this["orientation-change"].bind(this));
  }
  onConnect(el) {
    this.uh();
    this.vh();
    this.wh();
    this.xh();
    onDispose(this.yh.bind(this));
  }
  X(event) {
    if (!this.scope)
      return;
    const type = event.type;
    this[event.type]?.(event);
    {
      if (TRACKED_EVENT.has(type))
        this.p.set(type, event);
      this.dispatch(event);
    }
  }
  xh() {
    if (!this.Jb)
      return;
    if (this.a.$provider()?.paused) {
      requestAnimationFrame(() => {
        if (!this.scope)
          return;
        this.a.remote.play(new DOMEvent("dom-connect"));
      });
    }
    this.Jb = false;
  }
  yh() {
    if (this.Jb)
      return;
    this.Jb = !this.a.$state.paused();
    this.a.$provider()?.pause();
  }
  ib() {
    this.df();
    this.f.gb = false;
    this.f.Ha = false;
    this.tc = false;
    this.hb = void 0;
    this.p.clear();
  }
  F(request, event) {
    this.f.e.td(request, (requestEvent) => {
      event.request = requestEvent;
      event.triggers.add(requestEvent);
    });
  }
  uh() {
    this.yd();
    this.ef();
    const textTracks = this.a.textTracks;
    listenEvent(textTracks, "add", this.yd.bind(this));
    listenEvent(textTracks, "remove", this.yd.bind(this));
    listenEvent(textTracks, "mode-change", this.ef.bind(this));
  }
  vh() {
    const qualities = this.a.qualities;
    listenEvent(qualities, "add", this.pc.bind(this));
    listenEvent(qualities, "remove", this.pc.bind(this));
    listenEvent(qualities, "change", this.fb.bind(this));
    listenEvent(qualities, "auto-change", this.zh.bind(this));
    listenEvent(qualities, "readonly-change", this.Ah.bind(this));
  }
  wh() {
    const audioTracks = this.a.audioTracks;
    listenEvent(audioTracks, "add", this.ff.bind(this));
    listenEvent(audioTracks, "remove", this.ff.bind(this));
    listenEvent(audioTracks, "change", this.Bh.bind(this));
  }
  yd(event) {
    const { textTracks } = this.$state;
    textTracks.set(this.a.textTracks.toArray());
    this.dispatch("text-tracks-change", {
      detail: textTracks(),
      trigger: event
    });
  }
  ef(event) {
    if (event)
      this.F("textTrack", event);
    const current = this.a.textTracks.selected, { textTrack } = this.$state;
    if (textTrack() !== current) {
      textTrack.set(current);
      this.dispatch("text-track-change", {
        detail: current,
        trigger: event
      });
    }
  }
  ff(event) {
    const { audioTracks } = this.$state;
    audioTracks.set(this.a.audioTracks.toArray());
    this.dispatch("audio-tracks-change", {
      detail: audioTracks(),
      trigger: event
    });
  }
  Bh(event) {
    const { audioTrack } = this.$state;
    audioTrack.set(this.a.audioTracks.selected);
    this.F("audioTrack", event);
    this.dispatch("audio-track-change", {
      detail: audioTrack(),
      trigger: event
    });
  }
  pc(event) {
    const { qualities } = this.$state;
    qualities.set(this.a.qualities.toArray());
    this.dispatch("qualities-change", {
      detail: qualities(),
      trigger: event
    });
  }
  fb(event) {
    const { quality } = this.$state;
    quality.set(this.a.qualities.selected);
    this.F("quality", event);
    this.dispatch("quality-change", {
      detail: quality(),
      trigger: event
    });
  }
  zh() {
    this.$state.autoQuality.set(this.a.qualities.auto);
  }
  Ah() {
    this.$state.canSetQuality.set(!this.a.qualities.readonly);
  }
  ["provider-change"](event) {
    const prevProvider = this.a.$provider(), newProvider = event.detail;
    if (prevProvider?.type === newProvider?.type)
      return;
    prevProvider?.destroy?.();
    prevProvider?.scope?.dispose();
    this.a.$provider.set(event.detail);
    if (prevProvider && event.detail === null)
      this.gf(event);
  }
  ["provider-loader-change"](event) {
  }
  ["autoplay"](event) {
    this.$state.autoplayError.set(null);
  }
  ["autoplay-fail"](event) {
    this.$state.autoplayError.set(event.detail);
    this.ib();
  }
  ["can-load"](event) {
    this.$state.canLoad.set(true);
    this.p.set("can-load", event);
    this.F("load", event);
    this.a.textTracks[TextTrackSymbol.P]();
  }
  ["media-type-change"](event) {
    const sourceChangeEvent = this.p.get("source-change");
    if (sourceChangeEvent)
      event.triggers.add(sourceChangeEvent);
    const viewType = this.$state.viewType();
    this.$state.mediaType.set(event.detail);
    const providedViewType = this.$state.providedViewType(), currentViewType = providedViewType === "unknown" ? event.detail : providedViewType;
    if (viewType !== currentViewType) {
      {
        setTimeout(() => {
          requestAnimationFrame(() => {
            if (!this.scope)
              return;
            this.$state.inferredViewType.set(event.detail);
            this.dispatch("view-type-change", {
              detail: currentViewType,
              trigger: event
            });
          });
        }, 0);
      }
    }
  }
  ["stream-type-change"](event) {
    const sourceChangeEvent = this.p.get("source-change");
    if (sourceChangeEvent)
      event.triggers.add(sourceChangeEvent);
    const { streamType, inferredStreamType } = this.$state;
    inferredStreamType.set(event.detail);
    event.detail = streamType();
  }
  ["rate-change"](event) {
    this.$state.playbackRate.set(event.detail);
    this.F("rate", event);
  }
  ["sources-change"](event) {
    this.$state.sources.set(event.detail);
  }
  ["source-change"](event) {
    const sourcesChangeEvent = this.p.get("sources-change");
    if (sourcesChangeEvent)
      event.triggers.add(sourcesChangeEvent);
    this.gf(event);
    this.p.set(event.type, event);
    this.$state.source.set(event.detail);
    this.el?.setAttribute("aria-busy", "true");
  }
  gf(event) {
    this.a.audioTracks[ListSymbol.H](event);
    this.a.qualities[ListSymbol.H](event);
    this.ib();
    softResetMediaState(this.a.$state);
  }
  ["abort"](event) {
    const sourceChangeEvent = this.p.get("source-change");
    if (sourceChangeEvent)
      event.triggers.add(sourceChangeEvent);
    const canLoadEvent = this.p.get("can-load");
    if (canLoadEvent && !event.triggers.hasType("can-load")) {
      event.triggers.add(canLoadEvent);
    }
  }
  ["load-start"](event) {
    const sourceChangeEvent = this.p.get("source-change");
    if (sourceChangeEvent)
      event.triggers.add(sourceChangeEvent);
  }
  ["error"](event) {
    this.$state.error.set(event.detail);
    const abortEvent = this.p.get("abort");
    if (abortEvent)
      event.triggers.add(abortEvent);
  }
  ["loaded-metadata"](event) {
    const loadStartEvent = this.p.get("load-start");
    if (loadStartEvent)
      event.triggers.add(loadStartEvent);
  }
  ["loaded-data"](event) {
    const loadStartEvent = this.p.get("load-start");
    if (loadStartEvent)
      event.triggers.add(loadStartEvent);
  }
  ["can-play"](event) {
    const loadedMetadata = this.p.get("loaded-metadata");
    if (loadedMetadata)
      event.triggers.add(loadedMetadata);
    this.hf(event.detail);
    this.el?.setAttribute("aria-busy", "false");
  }
  ["can-play-through"](event) {
    this.hf(event.detail);
    const canPlay = this.p.get("can-play");
    if (canPlay)
      event.triggers.add(canPlay);
  }
  hf(detail) {
    const { seekable, seekableEnd, buffered, duration, canPlay } = this.$state;
    canPlay.set(true);
    buffered.set(detail.buffered);
    seekable.set(detail.seekable);
    duration.set(seekableEnd());
  }
  ["duration-change"](event) {
    const { live, duration } = this.$state, time = event.detail;
    if (!live())
      duration.set(!Number.isNaN(time) ? time : 0);
  }
  ["progress"](event) {
    const { buffered, seekable, live, duration, seekableEnd } = this.$state, detail = event.detail;
    buffered.set(detail.buffered);
    seekable.set(detail.seekable);
    if (live()) {
      duration.set(seekableEnd);
      this.dispatch("duration-change", {
        detail: seekableEnd(),
        trigger: event
      });
    }
  }
  ["play"](event) {
    const { paused, autoplayError, ended, autoplaying, playsinline, pointer, muted, viewType } = this.$state;
    event.autoplay = autoplaying();
    if (this.f.Ha || !paused()) {
      event.stopImmediatePropagation();
      return;
    }
    const waitingEvent = this.p.get("waiting");
    if (waitingEvent)
      event.triggers.add(waitingEvent);
    this.F("play", event);
    this.p.set("play", event);
    paused.set(false);
    autoplayError.set(null);
    if (event.autoplay) {
      this.X(
        this.createEvent("autoplay", {
          detail: { muted: muted() },
          trigger: event
        })
      );
      autoplaying.set(false);
    }
    if (ended() || this.f.gb) {
      this.f.gb = false;
      ended.set(false);
      this.X(this.createEvent("replay", { trigger: event }));
    }
    if (!playsinline() && viewType() === "video" && pointer() === "coarse") {
      this.a.remote.enterFullscreen("prefer-media", event);
    }
  }
  ["play-fail"](event) {
    const { muted, autoplaying } = this.$state;
    const playEvent = this.p.get("play");
    if (playEvent)
      event.triggers.add(playEvent);
    this.F("play", event);
    const { paused, playing } = this.$state;
    paused.set(true);
    playing.set(false);
    this.ib();
    this.p.set("play-fail", event);
    if (event.autoplay) {
      this.X(
        this.createEvent("autoplay-fail", {
          detail: {
            muted: muted(),
            error: event.detail
          },
          trigger: event
        })
      );
      autoplaying.set(false);
    }
  }
  ["playing"](event) {
    const playEvent = this.p.get("play"), seekedEvent = this.p.get("seeked");
    if (playEvent)
      event.triggers.add(playEvent);
    else if (seekedEvent)
      event.triggers.add(seekedEvent);
    setTimeout(() => this.ib(), 0);
    const {
      paused,
      playing,
      live,
      liveSyncPosition,
      seekableEnd,
      started,
      currentTime,
      seeking,
      ended
    } = this.$state;
    paused.set(false);
    playing.set(true);
    seeking.set(false);
    ended.set(false);
    if (this.f.Ha) {
      event.stopImmediatePropagation();
      this.f.Ha = false;
      return;
    }
    if (live() && !started() && currentTime() === 0) {
      const end = liveSyncPosition() ?? seekableEnd() - 2;
      if (Number.isFinite(end))
        this.a.$provider().setCurrentTime(end);
    }
    this["started"](event);
  }
  ["started"](event) {
    const { started } = this.$state;
    if (!started()) {
      started.set(true);
      this.X(this.createEvent("started", { trigger: event }));
    }
  }
  ["pause"](event) {
    if (!this.el?.isConnected) {
      this.Jb = true;
    }
    if (this.f.Ha) {
      event.stopImmediatePropagation();
      return;
    }
    const seekedEvent = this.p.get("seeked");
    if (seekedEvent)
      event.triggers.add(seekedEvent);
    this.F("pause", event);
    const { paused, playing } = this.$state;
    paused.set(true);
    playing.set(false);
    this.ib();
  }
  ["time-update"](event) {
    const { currentTime, played, waiting } = this.$state, detail = event.detail;
    currentTime.set(detail.currentTime);
    played.set(detail.played);
    waiting.set(false);
    for (const track of this.a.textTracks) {
      track[TextTrackSymbol.Ta](detail.currentTime, event);
    }
  }
  ["volume-change"](event) {
    const { volume, muted } = this.$state, detail = event.detail;
    volume.set(detail.volume);
    muted.set(detail.muted || detail.volume === 0);
    this.F("volume", event);
  }
  ["seeked"](event) {
    const { seeking, currentTime, paused, duration, ended } = this.$state;
    if (this.f.qa) {
      seeking.set(true);
      event.stopImmediatePropagation();
    } else if (seeking()) {
      const waitingEvent = this.p.get("waiting");
      if (waitingEvent)
        event.triggers.add(waitingEvent);
      const seekingEvent = this.p.get("seeking");
      if (seekingEvent && !event.triggers.has(seekingEvent)) {
        event.triggers.add(seekingEvent);
      }
      if (paused())
        this.df();
      seeking.set(false);
      if (event.detail !== duration())
        ended.set(false);
      currentTime.set(event.detail);
      this.F("seeked", event);
      const origin = event?.originEvent;
      if (origin?.isTrusted && !/seek/.test(origin.type)) {
        this["started"](event);
      }
    }
  }
  ["waiting"](event) {
    if (this.tc || this.f.qa)
      return;
    event.stopImmediatePropagation();
    this.hb = event;
    this.zd();
  }
  ["end"](event) {
    const { loop } = this.$state;
    if (loop()) {
      setTimeout(() => {
        requestAnimationFrame(() => {
          this.dispatch("media-loop-request", {
            trigger: event
          });
        });
      }, 0);
      return;
    }
    this.Db(event);
  }
  Db(event) {
    const { paused, seeking, ended, duration } = this.$state;
    if (!paused()) {
      this.dispatch("pause", { trigger: event });
    }
    if (seeking()) {
      this.dispatch("seeked", {
        detail: duration(),
        trigger: event
      });
    }
    ended.set(true);
    this.ib();
    this.dispatch("ended", {
      trigger: event
    });
  }
  df() {
    this.zd.cancel();
    this.$state.waiting.set(false);
  }
  ["fullscreen-change"](event) {
    this.$state.fullscreen.set(event.detail);
    this.F("fullscreen", event);
  }
  ["fullscreen-error"](event) {
    this.F("fullscreen", event);
  }
  ["orientation-change"](event) {
    this.F("orientation", event);
  }
  ["picture-in-picture-change"](event) {
    this.$state.pictureInPicture.set(event.detail);
    this.F("pip", event);
  }
  ["picture-in-picture-error"](event) {
    this.F("pip", event);
  }
  ["title-change"](event) {
    event.stopImmediatePropagation();
    this.$state.inferredTitle.set(event.detail);
  }
  ["poster-change"](event) {
    event.stopImmediatePropagation();
    this.$state.inferredPoster.set(event.detail);
  }
}

class MediaStateSync extends MediaPlayerController {
  onSetup() {
    this.Ch();
    effect(this.Eh.bind(this));
    effect(this.uc.bind(this));
    effect(this.Fh.bind(this));
    effect(this.ld.bind(this));
    effect(this.Gh.bind(this));
    effect(this.Vc.bind(this));
    effect(this.Hh.bind(this));
    effect(this.Ad.bind(this));
    effect(this.Ih.bind(this));
    effect(this.Jh.bind(this));
    effect(this.Kh.bind(this));
  }
  Ch() {
    const providedProps = {
      poster: "providedPoster",
      streamType: "providedStreamType",
      title: "providedTitle",
      viewType: "providedViewType"
    };
    for (const prop of Object.keys(this.$props)) {
      this.$state[providedProps[prop] ?? prop]?.set(this.$props[prop]());
    }
    this.$state.muted.set(this.$props.muted() || this.$props.volume() === 0);
  }
  // Sync "provided" props with internal state. Provided props are used to differentiate from
  // provider inferred values.
  Eh() {
    const { viewType, streamType, title, poster } = this.$props;
    this.$state.providedPoster.set(poster());
    this.$state.providedStreamType.set(streamType());
    this.$state.providedViewType.set(viewType());
    this.$state.providedTitle.set(title());
  }
  Dh() {
    return;
  }
  uc() {
    const { title } = this.$state;
    this.dispatch("title-change", { detail: title() });
  }
  Fh() {
    const autoplay = this.$props.autoplay();
    this.$state.autoplay.set(autoplay);
    this.dispatch("autoplay-change", { detail: autoplay });
  }
  Gh() {
    const loop = this.$props.loop();
    this.$state.loop.set(loop);
    this.dispatch("loop-change", { detail: loop });
  }
  Vc() {
    const controls = this.$props.controls();
    this.$state.controls.set(controls);
  }
  ld() {
    const { poster } = this.$state;
    this.dispatch("poster-change", { detail: poster() });
  }
  Hh() {
    const crossorigin = this.$props.crossorigin();
    this.$state.crossorigin.set(crossorigin === true ? "" : crossorigin);
  }
  Ad() {
    const playsinline = this.$props.playsinline();
    this.$state.playsinline.set(playsinline);
    this.dispatch("playsinline-change", { detail: playsinline });
  }
  Jh() {
    this.dispatch("live-change", { detail: this.$state.live() });
  }
  Ih() {
    this.$state.liveEdgeTolerance.set(this.$props.liveEdgeTolerance());
    this.$state.minLiveDVRWindow.set(this.$props.minLiveDVRWindow());
  }
  Kh() {
    this.dispatch("live-edge-change", { detail: this.$state.liveEdge() });
  }
}

let $keyboard = signal(false);
{
  listenEvent(document, "pointerdown", () => {
    $keyboard.set(false);
  });
  listenEvent(document, "keydown", (e) => {
    if (e.metaKey || e.altKey || e.ctrlKey)
      return;
    $keyboard.set(true);
  });
}
class FocusVisibleController extends ViewController {
  constructor() {
    super(...arguments);
    this.Kb = signal(false);
  }
  onConnect(el) {
    effect(() => {
      if (!$keyboard()) {
        this.Kb.set(false);
        updateFocusAttr(el, false);
        this.listen("pointerenter", this.Cd.bind(this));
        this.listen("pointerleave", this.Dd.bind(this));
        return;
      }
      const active = document.activeElement === el;
      this.Kb.set(active);
      updateFocusAttr(el, active);
      this.listen("focus", this.Lb.bind(this));
      this.listen("blur", this.Nh.bind(this));
    });
  }
  focused() {
    return this.Kb();
  }
  Lb() {
    this.Kb.set(true);
    updateFocusAttr(this.el, true);
  }
  Nh() {
    this.Kb.set(false);
    updateFocusAttr(this.el, false);
  }
  Cd() {
    updateHoverAttr(this.el, true);
  }
  Dd() {
    updateHoverAttr(this.el, false);
  }
}
function updateFocusAttr(el, isFocused) {
  setAttribute(el, "data-focus", isFocused);
  setAttribute(el, "data-hocus", isFocused);
}
function updateHoverAttr(el, isHovering) {
  setAttribute(el, "data-hocus", isHovering);
  setAttribute(el, "data-hover", isHovering);
}

var __defProp$f = Object.defineProperty;
var __getOwnPropDesc$f = Object.getOwnPropertyDescriptor;
var __decorateClass$f = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$f(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$f(target, key, result);
  return result;
};
const _MediaPlayer = class _MediaPlayer extends Component {
  constructor() {
    super();
    this.canPlayQueue = new RequestQueue();
    this.wc = false;
    new MediaStateSync();
    const context = {
      player: this,
      scope: getScope(),
      qualities: new VideoQualityList(),
      audioTracks: new AudioTrackList(),
      $provider: signal(null),
      $providerSetup: signal(false),
      $props: this.$props,
      $state: this.$state
    };
    context.remote = new MediaRemoteControl(void 0);
    context.remote.setPlayer(this);
    context.$iosControls = computed(this.Oh.bind(this));
    context.textTracks = new TextTrackList();
    context.textTracks[TextTrackSymbol.Sa] = this.$state.crossorigin;
    context.textRenderers = new TextRenderers(context);
    context.ariaKeys = {};
    this.a = context;
    provideContext(mediaContext, context);
    this.orientation = new ScreenOrientationController();
    new FocusVisibleController();
    new MediaKeyboardController(context);
    const request = new MediaRequestContext();
    this.ga = new MediaStateManager(request, context);
    this.Y = new MediaRequestManager(this.ga, request, context);
    context.delegate = new MediaPlayerDelegate(
      this.ga.X.bind(this.ga),
      context
    );
    new MediaLoadController(this.startLoading.bind(this));
  }
  static {
    this.props = mediaPlayerProps;
  }
  static {
    this.state = mediaState;
  }
  get i() {
    return this.a.$provider();
  }
  onSetup() {
    this.Ph();
    effect(this.Qh.bind(this));
    effect(this.Rh.bind(this));
    effect(this.Tc.bind(this));
    effect(this.Fd.bind(this));
    effect(this.jb.bind(this));
    effect(this.Ad.bind(this));
    effect(this.Sh.bind(this));
  }
  onAttach(el) {
    el.setAttribute("data-media-player", "");
    setAttributeIfEmpty(el, "tabindex", "0");
    setAttributeIfEmpty(el, "role", "region");
    effect(this.uc.bind(this));
    effect(this.lf.bind(this));
    listenEvent(el, "find-media-player", this.Th.bind(this));
  }
  onConnect(el) {
    if (IS_IPHONE)
      setAttribute(el, "data-iphone", "");
    canChangeVolume().then(this.$state.canSetVolume.set);
    const pointerQuery = window.matchMedia("(pointer: coarse)");
    this.mf(pointerQuery);
    pointerQuery.onchange = this.mf.bind(this);
    const resize = new ResizeObserver(animationFrameThrottle(this.O.bind(this)));
    resize.observe(el);
    effect(this.O.bind(this));
    this.dispatch("media-player-connect", {
      detail: this,
      bubbles: true,
      composed: true
    });
    onDispose(() => {
      resize.disconnect();
      pointerQuery.onchange = null;
    });
  }
  onDestroy() {
    this.a.player = null;
    this.canPlayQueue.H();
  }
  uc() {
    if (this.wc) {
      this.wc = false;
      return;
    }
    const { title, live, viewType } = this.$state, isLive = live(), type = uppercaseFirstChar(viewType()), typeText = type !== "Unknown" ? `${isLive ? "Live " : ""}${type}` : isLive ? "Live" : "Media";
    const currentTitle = title();
    setAttribute(
      this.el,
      "aria-label",
      currentTitle ? `${typeText} - ${currentTitle}` : typeText + " Player"
    );
    if (this.el && customElements.get(this.el.localName)) {
      this.wc = true;
    }
    this.el?.removeAttribute("title");
  }
  lf() {
    const orientation = this.orientation.landscape ? "landscape" : "portrait";
    this.$state.orientation.set(orientation);
    setAttribute(this.el, "data-orientation", orientation);
    this.O();
  }
  Qh() {
    if (this.$state.canPlay() && this.i)
      this.canPlayQueue.Bb();
    else
      this.canPlayQueue.ra();
  }
  Ph() {
    if (_MediaPlayer[MEDIA_ATTRIBUTES]) {
      this.setAttributes(_MediaPlayer[MEDIA_ATTRIBUTES]);
      return;
    }
    const $attrs = {
      "data-captions": function() {
        const track = this.$state.textTrack();
        return !!track && isTrackCaptionKind(track);
      },
      "data-ios-controls": function() {
        return this.a.$iosControls();
      },
      "data-controls": function() {
        return this.controls.showing;
      },
      "data-buffering": function() {
        const { canPlay, waiting } = this.$state;
        return !canPlay() || waiting();
      },
      "data-error": function() {
        const { error } = this.$state;
        return !!error();
      },
      "data-autoplay-error": function() {
        const { autoplayError } = this.$state;
        return !!autoplayError();
      }
    };
    const alias = {
      canPictureInPicture: "can-pip",
      pictureInPicture: "pip"
    };
    for (const prop2 of mediaAttributes) {
      const attrName = "data-" + (alias[prop2] ?? camelToKebabCase(prop2));
      $attrs[attrName] = function() {
        return this.$state[prop2]();
      };
    }
    delete $attrs.title;
    _MediaPlayer[MEDIA_ATTRIBUTES] = $attrs;
    this.setAttributes($attrs);
  }
  Th(event) {
    event.detail(this);
  }
  O() {
    if (!this.el)
      return;
    const width = this.el.clientWidth, height = this.el.clientHeight;
    this.$state.width.set(width);
    this.$state.height.set(height);
    setStyle(this.el, "--player-width", width + "px");
    setStyle(this.el, "--player-height", height + "px");
  }
  mf(queryList) {
    const pointer = queryList.matches ? "coarse" : "fine";
    setAttribute(this.el, "data-pointer", pointer);
    this.$state.pointer.set(pointer);
    this.O();
  }
  Oh() {
    const { playsinline, fullscreen } = this.$state;
    return IS_IPHONE && !canFullscreen() && this.$state.mediaType() === "video" && (!playsinline() || fullscreen());
  }
  get provider() {
    return this.i;
  }
  get controls() {
    return this.Y.Ib;
  }
  get title() {
    return peek(this.$state.providedTitle);
  }
  set title(newTitle) {
    if (this.wc)
      return;
    this.$state.providedTitle.set(newTitle);
  }
  get qualities() {
    return this.a.qualities;
  }
  get audioTracks() {
    return this.a.audioTracks;
  }
  get textTracks() {
    return this.a.textTracks;
  }
  get textRenderers() {
    return this.a.textRenderers;
  }
  get paused() {
    return peek(this.$state.paused);
  }
  set paused(paused) {
    this.nf(paused);
  }
  Tc() {
    this.nf(this.$props.paused());
  }
  nf(paused) {
    if (paused) {
      this.canPlayQueue.k("paused", () => this.Y.ud());
    } else
      this.canPlayQueue.k("paused", () => this.Y.sc());
  }
  get muted() {
    return peek(this.$state.muted);
  }
  set muted(muted) {
    const $props = this.$props;
    $props.muted.set(muted);
  }
  Rh() {
    this.Uh(this.$props.muted());
  }
  Uh(muted) {
    this.canPlayQueue.k("muted", () => {
      if (this.i)
        this.i.setMuted(muted);
    });
  }
  get currentTime() {
    return peek(this.$state.currentTime);
  }
  set currentTime(time) {
    this.of(time);
  }
  jb() {
    this.of(this.$props.currentTime());
  }
  of(time) {
    this.canPlayQueue.k("currentTime", () => {
      if (time === peek(this.$state.currentTime))
        return;
      peek(() => {
        if (!this.i)
          return;
        const boundTime = Math.min(
          Math.max(this.$state.seekableStart() + 0.1, time),
          this.$state.seekableEnd() - 0.1
        );
        if (Number.isFinite(boundTime))
          this.i.setCurrentTime(boundTime);
      });
    });
  }
  get volume() {
    return peek(this.$state.volume);
  }
  set volume(volume) {
    const $props = this.$props;
    $props.volume.set(volume);
  }
  Fd() {
    this.Vh(this.$props.volume());
  }
  Vh(volume) {
    const clampedVolume = clampNumber(0, volume, 1);
    this.canPlayQueue.k("volume", () => {
      if (this.i)
        this.i.setVolume(clampedVolume);
    });
  }
  get playbackRate() {
    return peek(this.$state.playbackRate);
  }
  set playbackRate(rate) {
    this.pf(rate);
  }
  Sh() {
    this.pf(this.$props.playbackRate());
  }
  pf(rate) {
    this.canPlayQueue.k("rate", () => {
      if (this.i)
        this.i.setPlaybackRate?.(rate);
    });
  }
  Ad() {
    this.Wh(this.$props.playsinline());
  }
  Wh(inline) {
    this.canPlayQueue.k("playsinline", () => {
      if (this.i)
        this.i.setPlaysinline?.(inline);
    });
  }
  async play(trigger) {
    return this.Y.sc(trigger);
  }
  async pause(trigger) {
    return this.Y.ud(trigger);
  }
  async enterFullscreen(target, trigger) {
    return this.Y._e(target, trigger);
  }
  async exitFullscreen(target, trigger) {
    return this.Y.af(target, trigger);
  }
  enterPictureInPicture(trigger) {
    return this.Y.xd(trigger);
  }
  exitPictureInPicture(trigger) {
    return this.Y.wd(trigger);
  }
  seekToLiveEdge(trigger) {
    this.Y.Ze(trigger);
  }
  startLoading(trigger) {
    this.a.delegate.c("can-load", void 0, trigger);
  }
  matchQuery(query) {
    return scoped(() => PlayerQueryList.create(query), this.scope);
  }
  destroy() {
    this.a.remote.setPlayer(null);
    this.dispatch("destroy");
  }
};
__decorateClass$f([
  prop
], _MediaPlayer.prototype, "canPlayQueue", 2);
__decorateClass$f([
  prop
], _MediaPlayer.prototype, "provider", 1);
__decorateClass$f([
  prop
], _MediaPlayer.prototype, "controls", 1);
__decorateClass$f([
  prop
], _MediaPlayer.prototype, "orientation", 2);
__decorateClass$f([
  prop
], _MediaPlayer.prototype, "title", 1);
__decorateClass$f([
  prop
], _MediaPlayer.prototype, "qualities", 1);
__decorateClass$f([
  prop
], _MediaPlayer.prototype, "audioTracks", 1);
__decorateClass$f([
  prop
], _MediaPlayer.prototype, "textTracks", 1);
__decorateClass$f([
  prop
], _MediaPlayer.prototype, "textRenderers", 1);
__decorateClass$f([
  prop
], _MediaPlayer.prototype, "paused", 1);
__decorateClass$f([
  prop
], _MediaPlayer.prototype, "muted", 1);
__decorateClass$f([
  prop
], _MediaPlayer.prototype, "currentTime", 1);
__decorateClass$f([
  prop
], _MediaPlayer.prototype, "volume", 1);
__decorateClass$f([
  prop
], _MediaPlayer.prototype, "playbackRate", 1);
__decorateClass$f([
  method
], _MediaPlayer.prototype, "play", 1);
__decorateClass$f([
  method
], _MediaPlayer.prototype, "pause", 1);
__decorateClass$f([
  method
], _MediaPlayer.prototype, "enterFullscreen", 1);
__decorateClass$f([
  method
], _MediaPlayer.prototype, "exitFullscreen", 1);
__decorateClass$f([
  method
], _MediaPlayer.prototype, "enterPictureInPicture", 1);
__decorateClass$f([
  method
], _MediaPlayer.prototype, "exitPictureInPicture", 1);
__decorateClass$f([
  method
], _MediaPlayer.prototype, "seekToLiveEdge", 1);
__decorateClass$f([
  method
], _MediaPlayer.prototype, "startLoading", 1);
__decorateClass$f([
  method
], _MediaPlayer.prototype, "matchQuery", 1);
let MediaPlayer = _MediaPlayer;

function resolveStreamTypeFromHLSManifest(manifestSrc, requestInit) {
  return fetch(manifestSrc, requestInit).then((res) => res.text()).then((manifest) => {
    const renditionURI = resolveHLSRenditionURI(manifest);
    if (renditionURI) {
      return resolveStreamTypeFromHLSManifest(
        /^https?:/.test(renditionURI) ? renditionURI : new URL(renditionURI, manifestSrc).href,
        requestInit
      );
    }
    const streamType = /EXT-X-PLAYLIST-TYPE:\s*VOD/.test(manifest) ? "on-demand" : "live";
    if (streamType === "live" && resolveTargetDuration(manifest) >= 10 && (/#EXT-X-DVR-ENABLED:\s*true/.test(manifest) || manifest.includes("#EXT-X-DISCONTINUITY"))) {
      return "live:dvr";
    }
    return streamType;
  });
}
function resolveHLSRenditionURI(manifest) {
  const matches = manifest.match(/#EXT-X-STREAM-INF:[^\n]+(\n[^\n]+)*/g);
  return matches ? matches[0].split("\n")[1].trim() : null;
}
function resolveTargetDuration(manifest) {
  const lines = manifest.split("\n");
  for (const line of lines) {
    if (line.startsWith("#EXT-X-TARGETDURATION")) {
      const duration = parseFloat(line.split(":")[1]);
      if (!isNaN(duration)) {
        return duration;
      }
    }
  }
  return -1;
}

const sourceTypes = /* @__PURE__ */ new Map();
class SourceSelection {
  constructor(_domSources, _media, _loader, customLoaders = []) {
    this.xc = _domSources;
    this.a = _media;
    this.ha = _loader;
    this.Gd = false;
    const HLS_LOADER = new HLSProviderLoader(), VIDEO_LOADER = new VideoProviderLoader(), AUDIO_LOADER = new AudioProviderLoader(), YOUTUBE_LOADER = new YouTubeProviderLoader(), VIMEO_LOADER = new VimeoProviderLoader(), EMBED_LOADERS = [YOUTUBE_LOADER, VIMEO_LOADER];
    this.Hd = computed(() => {
      return _media.$props.preferNativeHLS() ? [VIDEO_LOADER, AUDIO_LOADER, HLS_LOADER, ...EMBED_LOADERS, ...customLoaders] : [HLS_LOADER, VIDEO_LOADER, AUDIO_LOADER, ...EMBED_LOADERS, ...customLoaders];
    });
    const { $state } = _media;
    $state.sources.set(normalizeSrc(_media.$props.src()));
    for (const src of $state.sources()) {
      const loader = this.Hd().find((loader2) => loader2.canPlay(src));
      if (!loader)
        continue;
      const mediaType = loader.mediaType(src);
      this.a.$state.source.set(src);
      this.a.$state.mediaType.set(mediaType);
      this.a.$state.inferredViewType.set(mediaType);
      this.ha.set(loader);
      this.Gd = true;
    }
  }
  get c() {
    return this.a.delegate.c;
  }
  connect() {
    const loader = this.ha();
    if (this.Gd) {
      this.qf(this.a.$state.source(), loader);
      this.rf(loader);
      this.Gd = false;
    }
    effect(this.Xh.bind(this));
    effect(this.Yh.bind(this));
    effect(this.Zh.bind(this));
    effect(this._h.bind(this));
  }
  Xh() {
    this.c("sources-change", [
      ...normalizeSrc(this.a.$props.src()),
      ...this.xc()
    ]);
  }
  Yh() {
    const { $state } = this.a;
    const sources = $state.sources(), currentSource = peek($state.source), newSource = this.sf(currentSource, sources), noMatch = sources[0]?.src && !newSource.src && !newSource.type;
    if (noMatch) {
      const { crossorigin } = $state, credentials = getRequestCredentials(crossorigin()), abort = new AbortController();
      Promise.all(
        sources.map(
          (source) => isString(source.src) && source.type === "?" ? fetch(source.src, {
            method: "HEAD",
            credentials,
            signal: abort.signal
          }).then((res) => {
            source.type = res.headers.get("content-type") || "??";
            sourceTypes.set(source.src, source.type);
            return source;
          }).catch(() => source) : source
        )
      ).then((sources2) => {
        if (abort.signal.aborted)
          return;
        this.sf(peek($state.source), sources2);
        tick();
      });
      return () => abort.abort();
    }
    tick();
  }
  sf(currentSource, sources) {
    let newSource = { src: "", type: "" }, newLoader = null;
    for (const src of sources) {
      const loader = peek(this.Hd).find((loader2) => loader2.canPlay(src));
      if (loader) {
        newSource = src;
        newLoader = loader;
      }
    }
    if (!isSameSrc(currentSource, newSource)) {
      this.qf(newSource, newLoader);
    }
    if (newLoader !== peek(this.ha)) {
      this.rf(newLoader);
    }
    return newSource;
  }
  qf(src, loader) {
    this.c("source-change", src);
    this.c("media-type-change", loader?.mediaType(src) || "unknown");
  }
  rf(loader) {
    this.a.$providerSetup.set(false);
    this.c("provider-change", null);
    loader && peek(() => loader.preconnect?.(this.a));
    this.ha.set(loader);
    this.c("provider-loader-change", loader);
  }
  Zh() {
    const provider = this.a.$provider();
    if (!provider || peek(this.a.$providerSetup))
      return;
    if (this.a.$state.canLoad()) {
      scoped(() => provider.setup(this.a), provider.scope);
      this.a.$providerSetup.set(true);
      return;
    }
    peek(() => provider.preconnect?.(this.a));
  }
  _h() {
    if (!this.a.$providerSetup())
      return;
    const provider = this.a.$provider(), source = this.a.$state.source(), crossorigin = peek(this.a.$state.crossorigin);
    if (isSameSrc(provider?.currentSrc, source)) {
      return;
    }
    if (this.a.$state.canLoad()) {
      const abort = new AbortController();
      if (isHLSSrc(source)) {
        if (!isHLSSupported()) {
          resolveStreamTypeFromHLSManifest(source.src, {
            credentials: getRequestCredentials(crossorigin),
            signal: abort.signal
          }).then((streamType) => {
            this.c("stream-type-change", streamType);
          }).catch(noop);
        }
      } else {
        this.c("stream-type-change", "on-demand");
      }
      peek(() => provider?.loadSource(source, peek(this.a.$state.preload)));
      return () => abort.abort();
    }
    try {
      isString(source.src) && preconnect(new URL(source.src).origin, "preconnect");
    } catch (error) {
    }
  }
}
function normalizeSrc(src) {
  return (isArray(src) ? src : [!isString(src) && "src" in src ? src : { src }]).map(
    ({ src: src2, type, ...props }) => ({
      src: src2,
      type: type ?? (isString(src2) ? sourceTypes.get(src2) : null) ?? (!isString(src2) || src2.startsWith("blob:") ? "video/object" : src2.includes("youtube") ? "video/youtube" : src2.includes("vimeo") ? "video/vimeo" : "?"),
      ...props
    })
  );
}
function isSameSrc(a, b) {
  return a?.src === b?.src && a?.type === b?.type;
}

class Tracks {
  constructor(_domTracks, _media) {
    this.yc = _domTracks;
    this.a = _media;
    this.tf = [];
    effect(this.$h.bind(this));
  }
  $h() {
    const newTracks = this.yc();
    for (const oldTrack of this.tf) {
      if (!newTracks.some((t) => t.id === oldTrack.id)) {
        const track = oldTrack.id && this.a.textTracks.getById(oldTrack.id);
        if (track)
          this.a.textTracks.remove(track);
      }
    }
    for (const newTrack of newTracks) {
      const id = newTrack.id || TextTrack.createId(newTrack);
      if (!this.a.textTracks.getById(id)) {
        newTrack.id = id;
        this.a.textTracks.add(newTrack);
      }
    }
    this.tf = newTracks;
  }
}

var __defProp$e = Object.defineProperty;
var __getOwnPropDesc$e = Object.getOwnPropertyDescriptor;
var __decorateClass$e = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$e(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$e(target, key, result);
  return result;
};
class MediaProvider extends Component {
  constructor() {
    super(...arguments);
    this.xc = signal([]);
    this.yc = signal([]);
    this.ha = null;
    this.Id = -1;
  }
  static {
    this.props = {
      loaders: []
    };
  }
  static {
    this.state = new State({
      loader: null
    });
  }
  onSetup() {
    this.a = useMediaContext();
    this.uf = new SourceSelection(
      this.xc,
      this.a,
      this.$state.loader,
      this.$props.loaders()
    );
  }
  onAttach(el) {
    el.setAttribute("data-media-provider", "");
  }
  onConnect(el) {
    this.uf.connect();
    new Tracks(this.yc, this.a);
    const resize = new ResizeObserver(animationFrameThrottle(this.O.bind(this)));
    resize.observe(el);
    const mutation = new MutationObserver(this.vf.bind(this));
    mutation.observe(el, { attributes: true, childList: true });
    this.O();
    this.vf();
    onDispose(() => {
      resize.disconnect();
      mutation.disconnect();
    });
  }
  load(target) {
    window.cancelAnimationFrame(this.Id);
    this.Id = requestAnimationFrame(() => this.ai(target));
    onDispose(() => {
      window.cancelAnimationFrame(this.Id);
    });
  }
  ai(target) {
    if (!this.scope)
      return;
    const loader = this.$state.loader(), { $provider } = this.a;
    if (this.ha === loader && loader?.target === target && peek($provider))
      return;
    this.wf();
    this.ha = loader;
    if (loader)
      loader.target = target || null;
    if (!loader || !target)
      return;
    loader.load(this.a).then((provider) => {
      if (!this.scope)
        return;
      if (peek(this.$state.loader) !== loader)
        return;
      this.a.delegate.c("provider-change", provider);
    });
  }
  onDestroy() {
    this.ha = null;
    this.wf();
  }
  wf() {
    this.a.delegate.c("provider-change", null);
  }
  O() {
    if (!this.el)
      return;
    const player = this.a.player, width = this.el.offsetWidth, height = this.el.offsetHeight;
    if (!player)
      return;
    player.$state.mediaWidth.set(width);
    player.$state.mediaHeight.set(height);
    if (player.el) {
      setStyle(player.el, "--media-width", width + "px");
      setStyle(player.el, "--media-height", height + "px");
    }
  }
  vf() {
    const sources = [], tracks = [], children = this.el.children;
    for (const el of children) {
      if (el instanceof HTMLSourceElement) {
        sources.push({
          src: el.src,
          type: el.type
        });
      } else if (el instanceof HTMLTrackElement) {
        tracks.push({
          id: el.id,
          src: el.src,
          kind: el.track.kind,
          language: el.srclang,
          label: el.label,
          default: el.default,
          type: el.getAttribute("data-type")
        });
      }
    }
    this.xc.set(sources);
    this.yc.set(tracks);
    tick();
  }
}
__decorateClass$e([
  method
], MediaProvider.prototype, "load", 1);

class Controls extends Component {
  static {
    this.props = {
      hideDelay: 2e3,
      hideOnMouseLeave: false
    };
  }
  onSetup() {
    this.a = useMediaContext();
    effect(this.bi.bind(this));
  }
  onAttach(el) {
    const { pictureInPicture, fullscreen } = this.a.$state;
    setStyle(el, "pointer-events", "none");
    setAttributeIfEmpty(el, "role", "group");
    this.setAttributes({
      "data-visible": this.xf.bind(this),
      "data-fullscreen": fullscreen,
      "data-pip": pictureInPicture
    });
    effect(() => {
      this.dispatch("change", { detail: this.xf() });
    });
    effect(this.ci.bind(this));
    effect(() => {
      const isFullscreen = fullscreen();
      for (const side of ["top", "right", "bottom", "left"]) {
        setStyle(el, `padding-${side}`, isFullscreen && `env(safe-area-inset-${side})`);
      }
    });
  }
  ci() {
    if (!this.el)
      return;
    const { $iosControls } = this.a, { controls } = this.a.$state, isHidden = controls() || $iosControls();
    setAttribute(this.el, "aria-hidden", isHidden ? "true" : null);
    setStyle(this.el, "display", isHidden ? "none" : null);
  }
  bi() {
    const { controls } = this.a.player, { hideDelay, hideOnMouseLeave } = this.$props;
    controls.defaultDelay = hideDelay() === 2e3 ? this.a.$props.controlsDelay() : hideDelay();
    controls.hideOnMouseLeave = hideOnMouseLeave();
  }
  xf() {
    const { controlsVisible } = this.a.$state;
    return controlsVisible();
  }
}

class Popper extends ViewController {
  constructor(_delegate) {
    super();
    this.j = _delegate;
    this.Ac = -1;
    this.Bc = -1;
    this.Ia = null;
    effect(this.di.bind(this));
  }
  onDestroy() {
    this.Ia?.();
    this.Ia = null;
  }
  di() {
    const trigger = this.j.C();
    if (!trigger) {
      this.hide();
      return;
    }
    const show = this.show.bind(this), hide = this.hide.bind(this);
    this.j.zc(trigger, show, hide);
  }
  show(trigger) {
    window.cancelAnimationFrame(this.Bc);
    this.Bc = -1;
    this.Ia?.();
    this.Ia = null;
    this.Ac = window.setTimeout(
      () => {
        this.Ac = -1;
        const content = this.j.u();
        if (content)
          content.style.removeProperty("display");
        peek(() => this.j.B(true, trigger));
      },
      this.j.yf?.() ?? 0
    );
  }
  hide(trigger) {
    window.clearTimeout(this.Ac);
    this.Ac = -1;
    peek(() => this.j.B(false, trigger));
    this.Bc = requestAnimationFrame(() => {
      this.Bc = -1;
      const content = this.j.u();
      if (content) {
        const isAnimated = hasAnimation(content);
        const onHide = () => {
          content.style.display = "none";
          this.Ia = null;
        };
        if (isAnimated) {
          this.Ia?.();
          const stop = listenEvent(content, "animationend", onHide, { once: true });
          this.Ia = stop;
        } else {
          onHide();
        }
      }
    });
  }
}

const tooltipContext = createContext();

let id = 0;
class Tooltip extends Component {
  constructor() {
    super();
    this.ca = `media-tooltip-${++id}`;
    this.C = signal(null);
    this.u = signal(null);
    new FocusVisibleController();
    const { showDelay } = this.$props;
    new Popper({
      C: this.C,
      u: this.u,
      yf: showDelay,
      zc(trigger, show, hide) {
        listenEvent(trigger, "touchstart", (e) => e.preventDefault(), {
          passive: false
        });
        listenEvent(trigger, "focus", show);
        listenEvent(trigger, "blur", hide);
        listenEvent(trigger, "mouseenter", show);
        listenEvent(trigger, "mouseleave", hide);
      },
      B: this.ei.bind(this)
    });
  }
  static {
    this.props = {
      showDelay: 500
    };
  }
  onAttach(el) {
    el.style.setProperty("display", "contents");
  }
  onSetup() {
    provideContext(tooltipContext, {
      C: this.C,
      u: this.u,
      Jd: this.Jd.bind(this),
      Kd: this.Kd.bind(this),
      Ld: this.Ld.bind(this),
      Md: this.Md.bind(this)
    });
  }
  Jd(el) {
    this.C.set(el);
    let tooltipName = el.getAttribute("data-media-tooltip");
    if (tooltipName) {
      this.el?.setAttribute(`data-media-${tooltipName}-tooltip`, "");
    }
    setAttribute(el, "data-describedby", this.ca);
  }
  Kd(el) {
    el.removeAttribute("data-describedby");
    el.removeAttribute("aria-describedby");
    this.C.set(null);
  }
  Ld(el) {
    el.setAttribute("id", this.ca);
    el.style.display = "none";
    setAttributeIfEmpty(el, "role", "tooltip");
    this.u.set(el);
  }
  Md(el) {
    el.removeAttribute("id");
    el.removeAttribute("role");
    this.u.set(null);
  }
  ei(isShowing) {
    const trigger = this.C(), content = this.u();
    if (trigger) {
      setAttribute(trigger, "aria-describedby", isShowing ? this.ca : null);
    }
    for (const el of [this.el, trigger, content]) {
      el && setAttribute(el, "data-visible", isShowing);
    }
  }
}

class TooltipContent extends Component {
  static {
    this.props = {
      placement: "top center",
      offset: 0,
      alignOffset: 0
    };
  }
  constructor() {
    super();
    new FocusVisibleController();
    const { placement } = this.$props;
    this.setAttributes({
      "data-placement": placement
    });
  }
  onAttach(el) {
    this.Ja(el);
    Object.assign(el.style, {
      position: "absolute",
      top: 0,
      left: 0,
      width: "max-content"
    });
  }
  onConnect(el) {
    this.Ja(el);
    const tooltip = useContext(tooltipContext);
    onDispose(() => tooltip.Md(el));
    onDispose(
      requestScopedAnimationFrame(() => {
        if (!this.connectScope)
          return;
        effect(this.Nd.bind(this));
      })
    );
  }
  Ja(el) {
    const tooltip = useContext(tooltipContext);
    tooltip.Ld(el);
  }
  Nd() {
    const { placement, offset: mainOffset, alignOffset } = this.$props;
    return autoPlacement(this.el, this.fi(), placement(), {
      offsetVarName: "media-tooltip",
      xOffset: alignOffset(),
      yOffset: mainOffset()
    });
  }
  fi() {
    return useContext(tooltipContext).C();
  }
}

class ToggleButtonController extends ViewController {
  constructor(_delegate) {
    super();
    this.j = _delegate;
    new FocusVisibleController();
    if (_delegate.kb) {
      new ARIAKeyShortcuts(_delegate.kb);
    }
  }
  static {
    this.props = {
      disabled: false
    };
  }
  onSetup() {
    const { disabled } = this.$props;
    this.setAttributes({
      "data-pressed": this.j.n,
      "aria-pressed": this.gi.bind(this),
      "aria-disabled": () => disabled() ? "true" : null
    });
  }
  onAttach(el) {
    setAttributeIfEmpty(el, "tabindex", "0");
    setAttributeIfEmpty(el, "role", "button");
    setAttributeIfEmpty(el, "type", "button");
  }
  onConnect(el) {
    onPress(el, this.hi.bind(this));
    for (const type of ["click", "touchstart"]) {
      this.listen(type, this.ii.bind(this));
    }
  }
  gi() {
    return ariaBool$1(this.j.n());
  }
  ji(event) {
    if (isWriteSignal(this.j.n)) {
      this.j.n.set((p) => !p);
    }
  }
  hi(event) {
    const disabled = this.$props.disabled() || this.el.hasAttribute("data-disabled");
    if (disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    event.preventDefault();
    (this.j.v ?? this.ji).call(this, event);
  }
  ii(event) {
    if (this.$props.disabled()) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
}

var __defProp$d = Object.defineProperty;
var __getOwnPropDesc$d = Object.getOwnPropertyDescriptor;
var __decorateClass$d = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$d(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$d(target, key, result);
  return result;
};
class ToggleButton extends Component {
  constructor() {
    super();
    this.zf = signal(false);
    new ToggleButtonController({
      n: this.zf
    });
  }
  static {
    this.props = {
      disabled: false,
      defaultPressed: false
    };
  }
  get pressed() {
    return this.zf();
  }
}
__decorateClass$d([
  prop
], ToggleButton.prototype, "pressed", 1);

class PlayButton extends Component {
  constructor() {
    super();
    new ToggleButtonController({
      n: this.n.bind(this),
      kb: "togglePaused",
      v: this.v.bind(this)
    });
  }
  static {
    this.props = ToggleButtonController.props;
  }
  onSetup() {
    this.a = useMediaContext();
    const { paused, ended } = this.a.$state;
    this.setAttributes({
      "data-paused": paused,
      "data-ended": ended
    });
  }
  onAttach(el) {
    el.setAttribute("data-media-tooltip", "play");
    setARIALabel(el, this.Z.bind(this));
  }
  v(event) {
    const remote = this.a.remote;
    this.n() ? remote.pause(event) : remote.play(event);
  }
  n() {
    const { paused } = this.a.$state;
    return !paused();
  }
  Z() {
    const { paused } = this.a.$state;
    return paused() ? "Play" : "Pause";
  }
}

function ariaBool(value) {
  return value ? "true" : "false";
}
function $ariaBool(signal) {
  return () => ariaBool(signal());
}

class CaptionButton extends Component {
  constructor() {
    super();
    new ToggleButtonController({
      n: this.n.bind(this),
      kb: "toggleCaptions",
      v: this.v.bind(this)
    });
  }
  static {
    this.props = ToggleButtonController.props;
  }
  onSetup() {
    this.a = useMediaContext();
    this.setAttributes({
      "data-active": this.n.bind(this),
      "data-supported": () => !this.lb(),
      "aria-hidden": $ariaBool(this.lb.bind(this))
    });
  }
  onAttach(el) {
    el.setAttribute("data-media-tooltip", "caption");
    setARIALabel(el, this.Z.bind(this));
  }
  v(event) {
    this.a.remote.toggleCaptions(event);
  }
  n() {
    const { textTrack } = this.a.$state, track = textTrack();
    return !!track && isTrackCaptionKind(track);
  }
  lb() {
    const { textTracks } = this.a.$state;
    return textTracks().filter(isTrackCaptionKind).length == 0;
  }
  Z() {
    const { textTrack } = this.a.$state;
    return textTrack() ? "Closed-Captions Off" : "Closed-Captions On";
  }
}

class FullscreenButton extends Component {
  constructor() {
    super();
    new ToggleButtonController({
      n: this.n.bind(this),
      kb: "toggleFullscreen",
      v: this.v.bind(this)
    });
  }
  static {
    this.props = {
      ...ToggleButtonController.props,
      target: "prefer-media"
    };
  }
  onSetup() {
    this.a = useMediaContext();
    const { fullscreen } = this.a.$state, isSupported = this.Nb.bind(this);
    this.setAttributes({
      "data-active": fullscreen,
      "data-supported": isSupported,
      "aria-hidden": $ariaBool(() => !isSupported())
    });
  }
  onAttach(el) {
    el.setAttribute("data-media-tooltip", "fullscreen");
    setARIALabel(el, this.Z.bind(this));
  }
  v(event) {
    const remote = this.a.remote, target = this.$props.target();
    this.n() ? remote.exitFullscreen(target, event) : remote.enterFullscreen(target, event);
  }
  n() {
    const { fullscreen } = this.a.$state;
    return fullscreen();
  }
  Nb() {
    const { canFullscreen } = this.a.$state;
    return canFullscreen();
  }
  Z() {
    const { fullscreen } = this.a.$state;
    return fullscreen() ? "Exit Fullscreen" : "Enter Fullscreen";
  }
}

class MuteButton extends Component {
  constructor() {
    super();
    new ToggleButtonController({
      n: this.n.bind(this),
      kb: "toggleMuted",
      v: this.v.bind(this)
    });
  }
  static {
    this.props = ToggleButtonController.props;
  }
  onSetup() {
    this.a = useMediaContext();
    this.setAttributes({
      "data-muted": this.n.bind(this),
      "data-state": this.ki.bind(this)
    });
  }
  onAttach(el) {
    el.setAttribute("data-media-mute-button", "");
    el.setAttribute("data-media-tooltip", "mute");
    setARIALabel(el, this.Z.bind(this));
  }
  v(event) {
    const remote = this.a.remote;
    this.n() ? remote.unmute(event) : remote.mute(event);
  }
  n() {
    const { muted, volume } = this.a.$state;
    return muted() || volume() === 0;
  }
  Z() {
    return this.n() ? "Unmute" : "Mute";
  }
  ki() {
    const { muted, volume } = this.a.$state, $volume = volume();
    if (muted() || $volume === 0)
      return "muted";
    else if ($volume >= 0.5)
      return "high";
    else if ($volume < 0.5)
      return "low";
  }
}

class PIPButton extends Component {
  constructor() {
    super();
    new ToggleButtonController({
      n: this.n.bind(this),
      kb: "togglePictureInPicture",
      v: this.v.bind(this)
    });
  }
  static {
    this.props = ToggleButtonController.props;
  }
  onSetup() {
    this.a = useMediaContext();
    const { pictureInPicture } = this.a.$state, isSupported = this.Nb.bind(this);
    this.setAttributes({
      "data-active": pictureInPicture,
      "data-supported": isSupported,
      "aria-hidden": $ariaBool(() => !isSupported())
    });
  }
  onAttach(el) {
    el.setAttribute("data-media-tooltip", "pip");
    setARIALabel(el, this.Z.bind(this));
  }
  v(event) {
    const remote = this.a.remote;
    this.n() ? remote.exitPictureInPicture(event) : remote.enterPictureInPicture(event);
  }
  n() {
    const { pictureInPicture } = this.a.$state;
    return pictureInPicture();
  }
  Nb() {
    const { canPictureInPicture } = this.a.$state;
    return canPictureInPicture();
  }
  Z() {
    const { pictureInPicture } = this.a.$state;
    return pictureInPicture() ? "Exit Picture In Picture" : "Enter Picture In Picture";
  }
}

class SeekButton extends Component {
  constructor() {
    super();
    new FocusVisibleController();
  }
  static {
    this.props = {
      disabled: false,
      seconds: 30
    };
  }
  onSetup() {
    this.a = useMediaContext();
    const { seeking } = this.a.$state, { seconds } = this.$props, isSupported = this.Nb.bind(this);
    this.setAttributes({
      seconds,
      "data-seeking": seeking,
      "data-supported": isSupported,
      "aria-hidden": $ariaBool(() => !isSupported())
    });
  }
  onAttach(el) {
    setAttributeIfEmpty(el, "tabindex", "0");
    setAttributeIfEmpty(el, "role", "button");
    setAttributeIfEmpty(el, "type", "button");
    el.setAttribute("data-media-tooltip", "seek");
    setARIALabel(el, this.Z.bind(this));
  }
  onConnect(el) {
    onPress(el, this.v.bind(this));
  }
  Nb() {
    const { canSeek } = this.a.$state;
    return canSeek();
  }
  Z() {
    const { seconds } = this.$props;
    return `Seek ${seconds() > 0 ? "forward" : "backward"} ${seconds()} seconds`;
  }
  v(event) {
    const { seconds, disabled } = this.$props;
    if (disabled())
      return;
    const { currentTime } = this.a.$state, seekTo = currentTime() + seconds();
    this.a.remote.seek(seekTo, event);
  }
}

class LiveButton extends Component {
  constructor() {
    super();
    new FocusVisibleController();
  }
  static {
    this.props = {
      disabled: false
    };
  }
  onSetup() {
    this.a = useMediaContext();
    const { disabled } = this.$props, { live, liveEdge } = this.a.$state, isHidden = () => !live();
    this.setAttributes({
      "data-edge": liveEdge,
      "data-hidden": isHidden,
      "aria-disabled": $ariaBool(() => disabled() || liveEdge()),
      "aria-hidden": $ariaBool(isHidden)
    });
  }
  onAttach(el) {
    setAttributeIfEmpty(el, "tabindex", "0");
    setAttributeIfEmpty(el, "role", "button");
    setAttributeIfEmpty(el, "type", "button");
    el.setAttribute("data-media-tooltip", "live");
  }
  onConnect(el) {
    onPress(el, this.v.bind(this));
  }
  v(event) {
    const { disabled } = this.$props, { liveEdge } = this.a.$state;
    if (disabled() || liveEdge())
      return;
    this.a.remote.seekToLiveEdge(event);
  }
}

const sliderState = new State({
  min: 0,
  max: 100,
  value: 0,
  pointerValue: 0,
  focused: false,
  dragging: false,
  pointing: false,
  get active() {
    return this.dragging || this.focused || this.pointing;
  },
  get fillRate() {
    return calcRate(this.min, this.max, this.value);
  },
  get fillPercent() {
    return this.fillRate * 100;
  },
  get pointerRate() {
    return calcRate(this.min, this.max, this.pointerValue);
  },
  get pointerPercent() {
    return this.pointerRate * 100;
  }
});
function calcRate(min, max, value) {
  const range = max - min, offset = value - min;
  return range > 0 ? offset / range : 0;
}

function getClampedValue(min, max, value, step) {
  return clampNumber(min, round(value, getNumberOfDecimalPlaces(step)), max);
}
function getValueFromRate(min, max, rate, step) {
  const boundRate = clampNumber(0, rate, 1), range = max - min, fill = range * boundRate, stepRatio = fill / step, steps = step * stepRatio;
  return min + steps;
}

const SliderKeyDirection = {
  Left: -1,
  ArrowLeft: -1,
  Up: 1,
  ArrowUp: 1,
  Right: 1,
  ArrowRight: 1,
  Down: -1,
  ArrowDown: -1
};
class SliderEventsController extends ViewController {
  constructor(_delegate, _media) {
    super();
    this.j = _delegate;
    this.a = _media;
    this.i = null;
    this.ua = null;
    this.mb = null;
    this.ti = functionThrottle(
      (event) => {
        this.va(this.Dc(event), event);
      },
      20,
      { leading: true }
    );
  }
  onConnect() {
    effect(this.li.bind(this));
    effect(this.mi.bind(this));
    if (this.j.ni) {
      const provider = this.a.player.el?.querySelector(
        "media-provider,[data-media-provider]"
      );
      if (provider) {
        this.i = provider;
        listenEvent(provider, "touchstart", this.oi.bind(this), {
          passive: true
        });
        listenEvent(provider, "touchmove", this.pi.bind(this), {
          passive: false
        });
      }
    }
  }
  oi(event) {
    this.ua = event.touches[0];
  }
  pi(event) {
    if (isNull(this.ua) || isTouchPinchEvent(event))
      return;
    const touch = event.touches[0], xDiff = touch.clientX - this.ua.clientX, yDiff = touch.clientY - this.ua.clientY, isDragging = this.$state.dragging();
    if (!isDragging && Math.abs(yDiff) > 20) {
      return;
    }
    if (isDragging)
      return;
    if (Math.abs(xDiff) > 20) {
      this.ua = touch;
      this.mb = this.$state.value();
      this.Od(this.mb, event);
    }
  }
  li() {
    if (this.j.K())
      return;
    this.listen("focus", this.Lb.bind(this));
    this.listen("pointerenter", this.Cd.bind(this));
    this.listen("pointermove", this.qi.bind(this));
    this.listen("pointerleave", this.Dd.bind(this));
    this.listen("pointerdown", this.ri.bind(this));
    this.listen("keydown", this.Ab.bind(this));
    this.listen("keyup", this.zb.bind(this));
  }
  mi() {
    if (this.j.K() || !this.$state.dragging())
      return;
    listenEvent(document, "pointerup", this.si.bind(this));
    listenEvent(document, "pointermove", this.ti.bind(this));
    if (IS_SAFARI) {
      listenEvent(document, "touchmove", this.ui.bind(this), {
        passive: false
      });
    }
  }
  Lb() {
    this.va(this.$state.value());
  }
  Pd(newValue, trigger) {
    const { value, min, max, dragging } = this.$state;
    const clampedValue = Math.max(min(), Math.min(newValue, max()));
    value.set(clampedValue);
    const event = this.createEvent("value-change", { detail: clampedValue, trigger });
    this.dispatch(event);
    this.j.o?.(event);
    if (dragging()) {
      const event2 = this.createEvent("drag-value-change", { detail: clampedValue, trigger });
      this.dispatch(event2);
      this.j.nb?.(event2);
    }
  }
  va(value, trigger) {
    const { pointerValue, dragging } = this.$state;
    pointerValue.set(value);
    this.dispatch("pointer-value-change", { detail: value, trigger });
    if (dragging()) {
      this.Pd(value, trigger);
    }
  }
  Dc(event) {
    let thumbPositionRate, rect = this.el.getBoundingClientRect(), { min, max } = this.$state;
    if (this.$props.orientation() === "vertical") {
      const { bottom: trackBottom, height: trackHeight } = rect;
      thumbPositionRate = (trackBottom - event.clientY) / trackHeight;
    } else {
      if (this.ua && isNumber(this.mb)) {
        const { width } = this.i.getBoundingClientRect(), rate = (event.clientX - this.ua.clientX) / width, range = max() - min(), diff = range * Math.abs(rate);
        thumbPositionRate = (rate < 0 ? this.mb - diff : this.mb + diff) / range;
      } else {
        const { left: trackLeft, width: trackWidth } = rect;
        thumbPositionRate = (event.clientX - trackLeft) / trackWidth;
      }
    }
    return Math.max(
      min(),
      Math.min(
        max(),
        this.j.Ob(
          getValueFromRate(min(), max(), thumbPositionRate, this.j.Ka())
        )
      )
    );
  }
  Cd(event) {
    this.$state.pointing.set(true);
  }
  qi(event) {
    const { dragging } = this.$state;
    if (dragging())
      return;
    this.va(this.Dc(event), event);
  }
  Dd(event) {
    this.$state.pointing.set(false);
  }
  ri(event) {
    if (event.button !== 0)
      return;
    const value = this.Dc(event);
    this.Od(value, event);
    this.va(value, event);
  }
  Od(value, trigger) {
    const { dragging } = this.$state;
    if (dragging())
      return;
    dragging.set(true);
    this.a.remote.pauseControls(trigger);
    const event = this.createEvent("drag-start", { detail: value, trigger });
    this.dispatch(event);
    this.j.Qd?.(event);
  }
  Af(value, trigger) {
    const { dragging } = this.$state;
    if (!dragging())
      return;
    dragging.set(false);
    this.a.remote.resumeControls(trigger);
    const event = this.createEvent("drag-end", { detail: value, trigger });
    this.dispatch(event);
    this.j.Ec?.(event);
    this.ua = null;
    this.mb = null;
  }
  Ab(event) {
    const { key } = event, { min, max } = this.$state;
    let newValue;
    if (key === "Home" || key === "PageUp") {
      newValue = min();
    } else if (key === "End" || key === "PageDown") {
      newValue = max();
    } else if (!event.metaKey && /[0-9]/.test(key)) {
      newValue = (max() - min()) / 10 * Number(key);
    }
    if (!isUndefined(newValue)) {
      this.va(newValue, event);
      this.Pd(newValue, event);
      return;
    }
    const value = this.Bf(event);
    if (isUndefined(value))
      return;
    const repeat = key === this.Rd;
    if (!this.$state.dragging() && repeat)
      this.Od(value, event);
    this.va(value, event);
    if (!repeat)
      this.Pd(value, event);
    this.Rd = key;
  }
  zb(event) {
    this.Rd = "";
    const { dragging, value } = this.$state;
    if (!dragging())
      return;
    const newValue = this.Bf(event) ?? value();
    this.va(newValue);
    this.Af(newValue, event);
  }
  Bf(event) {
    const { key, shiftKey } = event, isValidKey = Object.keys(SliderKeyDirection).includes(key);
    if (!isValidKey)
      return;
    event.preventDefault();
    event.stopPropagation();
    const { shiftKeyMultiplier } = this.$props;
    const { value, min, max } = this.$state, step = this.j.Ka(), keyStep = this.j.Pb();
    const modifiedStep = !shiftKey ? keyStep : keyStep * shiftKeyMultiplier(), direction = Number(SliderKeyDirection[key]), diff = modifiedStep * direction, steps = (value() + diff) / step;
    return Math.max(min(), Math.min(max(), Number((step * steps).toFixed(3))));
  }
  // -------------------------------------------------------------------------------------------
  // Document (Pointer Events)
  // -------------------------------------------------------------------------------------------
  si(event) {
    if (event.button !== 0)
      return;
    const value = this.Dc(event);
    this.va(value, event);
    this.Af(value, event);
  }
  ui(event) {
    event.preventDefault();
  }
}

const sliderValueFormatContext = createContext(() => ({}));

const sliderContext = createContext();

class SliderController extends ViewController {
  constructor(_delegate) {
    super();
    this.j = _delegate;
    this.xi = animationFrameThrottle(
      (fillPercent, pointerPercent) => {
        this.el?.style.setProperty("--slider-fill", fillPercent + "%");
        this.el?.style.setProperty("--slider-pointer", pointerPercent + "%");
      }
    );
  }
  static {
    this.props = {
      disabled: false,
      step: 1,
      keyStep: 1,
      orientation: "horizontal",
      shiftKeyMultiplier: 5
    };
  }
  onSetup() {
    this.a = useMediaContext();
    const focus = new FocusVisibleController();
    focus.attach(this);
    this.$state.focused = focus.focused.bind(focus);
    if (!hasProvidedContext(sliderValueFormatContext)) {
      provideContext(sliderValueFormatContext, {
        default: "value"
      });
    }
    provideContext(sliderContext, {
      ta: this.$props.orientation,
      Fc: this.j.K,
      Cf: signal(null)
    });
    effect(this.D.bind(this));
    effect(this.Qb.bind(this));
    this.vi();
    new SliderEventsController(this.j, this.a).attach(this);
  }
  onAttach(el) {
    setAttributeIfEmpty(el, "role", "slider");
    setAttributeIfEmpty(el, "tabindex", "0");
    setAttributeIfEmpty(el, "autocomplete", "off");
    effect(this.Df.bind(this));
  }
  // -------------------------------------------------------------------------------------------
  // Watch
  // -------------------------------------------------------------------------------------------
  D() {
    const { dragging, value, min, max } = this.$state;
    if (peek(dragging))
      return;
    value.set(getClampedValue(min(), max(), value(), this.j.Ka()));
  }
  Qb() {
    if (!this.j.K())
      return;
    const { dragging, pointing } = this.$state;
    dragging.set(false);
    pointing.set(false);
  }
  // -------------------------------------------------------------------------------------------
  // ARIA
  // -------------------------------------------------------------------------------------------
  wi() {
    return ariaBool$1(this.j.K());
  }
  // -------------------------------------------------------------------------------------------
  // Attributes
  // -------------------------------------------------------------------------------------------
  vi() {
    const { orientation } = this.$props, { dragging, active, pointing } = this.$state;
    this.setAttributes({
      "data-dragging": dragging,
      "data-pointing": pointing,
      "data-active": active,
      "aria-disabled": this.wi.bind(this),
      "aria-valuemin": this.$state.min,
      "aria-valuemax": this.$state.max,
      "aria-valuenow": this.j.ia,
      "aria-valuetext": this.j.ja,
      "aria-orientation": orientation
    });
  }
  Df() {
    const { fillPercent, pointerPercent } = this.$state;
    this.xi(round(fillPercent(), 3), round(pointerPercent(), 3));
  }
}

class Slider extends Component {
  static {
    this.props = {
      ...SliderController.props,
      min: 0,
      max: 100,
      value: 0
    };
  }
  static {
    this.state = sliderState;
  }
  constructor() {
    super();
    new SliderController({
      Ka: this.$props.step,
      Pb: this.$props.keyStep,
      Ob: Math.round,
      K: this.$props.disabled,
      ia: this.ia.bind(this),
      ja: this.ja.bind(this)
    });
  }
  onSetup() {
    effect(this.D.bind(this));
    effect(this.yi.bind(this));
  }
  // -------------------------------------------------------------------------------------------
  // Props
  // -------------------------------------------------------------------------------------------
  ia() {
    const { value } = this.$state;
    return Math.round(value());
  }
  ja() {
    const { value, max } = this.$state;
    return round(value() / max() * 100, 2) + "%";
  }
  // -------------------------------------------------------------------------------------------
  // Watch
  // -------------------------------------------------------------------------------------------
  D() {
    const { value } = this.$props;
    this.$state.value.set(value());
  }
  yi() {
    const { min, max } = this.$props;
    this.$state.min.set(min());
    this.$state.max.set(max());
  }
}

const cache = /* @__PURE__ */ new Map(), pending = /* @__PURE__ */ new Set(), registry = /* @__PURE__ */ new Set();
class ThumbnailsLoader {
  constructor($src, _media) {
    this.$src = $src;
    this.a = _media;
    this.$cues = signal([]);
    effect(this.zi.bind(this));
    registry.add(this);
    onDispose(() => registry.delete(this));
  }
  static create($src) {
    const media = useMediaContext();
    return new ThumbnailsLoader($src, media);
  }
  zi() {
    const { canLoad } = this.a.$state;
    if (!canLoad())
      return;
    const controller = new AbortController(), { crossorigin } = this.a.$state;
    const src = this.$src();
    if (!src)
      return;
    if (cache.has(src)) {
      const cues = cache.get(src);
      cache.delete(src);
      cache.set(src, cues);
      if (cache.size > 30) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }
      this.$cues.set(cache.get(src));
    } else if (!pending.has(src)) {
      pending.add(src);
      import('media-captions').then(async ({ parseResponse }) => {
        try {
          const response = await fetch(src, {
            signal: controller.signal,
            credentials: getRequestCredentials(crossorigin())
          }), isJSON = response.headers.get("content-type") === "application/json";
          if (isJSON) {
            try {
              const { cues: cues2 } = parseJSONCaptionsFile(await response.text(), window.VTTCue);
              this.Ef(src, cues2);
            } catch (e) {
            }
            return;
          }
          const { cues } = await parseResponse(response);
          this.Ef(src, cues);
        } catch (e) {
        }
      });
    }
    return () => {
      controller.abort();
      this.$cues.set([]);
    };
  }
  Ef(currentSrc, cues) {
    this.$cues.set(cues);
    for (const t of registry) {
      if (peek(t.$src) === currentSrc)
        t.$cues.set(cues);
    }
    cache.set(currentSrc, cues);
    pending.delete(currentSrc);
  }
}

class Thumbnail extends Component {
  constructor() {
    super(...arguments);
    this.Td = [];
    this.Ff = animationFrameThrottle(this.Fi.bind(this));
  }
  static {
    this.props = {
      src: "",
      time: 0
    };
  }
  static {
    this.state = new State({
      src: "",
      img: null,
      coords: null,
      activeCue: null,
      loading: false,
      error: null,
      hidden: false
    });
  }
  onSetup() {
    this.a = useMediaContext();
    this.Sd = ThumbnailsLoader.create(this.$props.src);
    this.setAttributes({
      "data-loading": this.Rb.bind(this),
      "data-error": this.wa.bind(this),
      "data-hidden": this.$state.hidden,
      "aria-hidden": $ariaBool(this.$state.hidden)
    });
  }
  onConnect(el) {
    effect(this.Ud.bind(this));
    effect(this.ob.bind(this));
    effect(this.Ea.bind(this));
    effect(this.Ai.bind(this));
    effect(this.Bi.bind(this));
  }
  Ud() {
    const img = this.$state.img();
    if (!img)
      return;
    listenEvent(img, "load", this.qd.bind(this));
    listenEvent(img, "error", this.U.bind(this));
  }
  Ea() {
    const { src, loading, error } = this.$state;
    src();
    loading.set(true);
    error.set(null);
  }
  qd() {
    const { loading, error } = this.$state;
    loading.set(false);
    error.set(null);
    this.Ff();
  }
  U(event) {
    const { loading, error } = this.$state;
    loading.set(false);
    error.set(event);
  }
  Rb() {
    const { loading, hidden } = this.$state;
    return !hidden() && loading();
  }
  wa() {
    const { error } = this.$state;
    return !isNull(error());
  }
  ob() {
    const { hidden } = this.$state, { duration } = this.a.$state, cues = this.Sd.$cues();
    hidden.set(this.wa() || !Number.isFinite(duration()) || cues.length === 0);
  }
  Gf() {
    return this.$props.time();
  }
  Ai() {
    const time = this.Gf(), { activeCue } = this.$state, { duration } = this.a.$state, cues = this.Sd.$cues();
    if (!cues || !Number.isFinite(duration())) {
      activeCue.set(null);
      return;
    }
    activeCue.set(findActiveCue(cues, time));
  }
  Bi() {
    let { activeCue } = this.$state, cue = activeCue(), baseURL = peek(this.$props.src);
    if (!/^https?:/.test(baseURL)) {
      baseURL = location.href;
    }
    if (!baseURL || !cue) {
      this.$state.src.set("");
      this.Ci();
      return;
    }
    const [src, coords = ""] = (cue.text || "").split("#");
    this.$state.coords.set(this.Di(coords));
    this.$state.src.set(this.Ei(src, baseURL));
    this.Ff();
  }
  Ei(src, baseURL) {
    return /^https?:/.test(src) ? src : new URL(src, baseURL).href;
  }
  Di(coords) {
    const [props, values] = coords.split("="), resolvedCoords = {}, coordValues = values?.split(",");
    if (!props || !values)
      return null;
    for (let i = 0; i < props.length; i++)
      resolvedCoords[props[i]] = +coordValues[i];
    return resolvedCoords;
  }
  Fi() {
    if (!this.scope)
      return;
    const img = this.$state.img(), coords = this.$state.coords();
    if (!img || !this.el)
      return;
    const w = coords?.w ?? img.naturalWidth, h = coords?.h ?? img.naturalHeight, { maxWidth, maxHeight, minWidth, minHeight } = getComputedStyle(this.el), minRatio = Math.max(parseInt(minWidth) / w, parseInt(minHeight) / h), maxRatio = Math.min(parseInt(maxWidth) / w, parseInt(maxHeight) / h), scale = maxRatio < 1 ? maxRatio : minRatio > 1 ? minRatio : 1;
    this.pb(this.el, "--thumbnail-width", `${w * scale}px`);
    this.pb(this.el, "--thumbnail-height", `${h * scale}px`);
    this.pb(img, "width", `${img.naturalWidth * scale}px`);
    this.pb(img, "height", `${img.naturalHeight * scale}px`);
    this.pb(
      img,
      "transform",
      coords ? `translate(-${coords.x * scale}px, -${coords.y * scale}px)` : ""
    );
    this.pb(img, "max-width", "none");
  }
  pb(el, name, value) {
    el.style.setProperty(name, value);
    this.Td.push(() => el.style.removeProperty(name));
  }
  Ci() {
    for (const reset of this.Td)
      reset();
    this.Td = [];
  }
}

var __defProp$c = Object.defineProperty;
var __getOwnPropDesc$c = Object.getOwnPropertyDescriptor;
var __decorateClass$c = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$c(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$c(target, key, result);
  return result;
};
class SliderVideo extends Component {
  static {
    this.props = {
      src: null
    };
  }
  static {
    this.state = new State({
      video: null,
      src: null,
      canPlay: false,
      error: null,
      hidden: false
    });
  }
  get video() {
    return this.$state.video();
  }
  onSetup() {
    this.a = useMediaContext();
    this.Q = useState(Slider.state);
    this.setAttributes({
      "data-loading": this.Rb.bind(this),
      "data-hidden": this.$state.hidden,
      "data-error": this.wa.bind(this),
      "aria-hidden": $ariaBool(this.$state.hidden)
    });
  }
  onAttach(el) {
    effect(this.Gi.bind(this));
    effect(this.fd.bind(this));
    effect(this.ob.bind(this));
    effect(this.Hi.bind(this));
    effect(this.Ii.bind(this));
  }
  Gi() {
    const video = this.$state.video();
    if (!video)
      return;
    if (video.readyState >= 2)
      this.hc();
    listenEvent(video, "canplay", this.hc.bind(this));
    listenEvent(video, "error", this.U.bind(this));
  }
  fd() {
    const { src } = this.$state, { canLoad } = this.a.$state;
    src.set(canLoad() ? this.$props.src() : null);
  }
  Rb() {
    const { canPlay, hidden } = this.$state;
    return !canPlay() && !hidden();
  }
  wa() {
    const { error } = this.$state;
    return !isNull(error);
  }
  ob() {
    const { src, hidden } = this.$state, { canLoad, duration } = this.a.$state;
    hidden.set(canLoad() && (!src() || this.wa() || !Number.isFinite(duration())));
  }
  Hi() {
    const { src, canPlay, error } = this.$state;
    src();
    canPlay.set(false);
    error.set(null);
  }
  hc(event) {
    const { canPlay, error } = this.$state;
    canPlay.set(true);
    error.set(null);
    this.dispatch("can-play", { trigger: event });
  }
  U(event) {
    const { canPlay, error } = this.$state;
    canPlay.set(false);
    error.set(event);
    this.dispatch("error", { trigger: event });
  }
  Ii() {
    const { video, canPlay } = this.$state, { duration } = this.a.$state, { pointerRate } = this.Q, media = video(), canUpdate = canPlay() && media && Number.isFinite(duration()) && Number.isFinite(pointerRate());
    if (canUpdate) {
      media.currentTime = pointerRate() * duration();
    }
  }
}
__decorateClass$c([
  prop
], SliderVideo.prototype, "video", 1);

function padNumberWithZeroes(num, expectedLength) {
  const str = String(num);
  const actualLength = str.length;
  const shouldPad = actualLength < expectedLength;
  if (shouldPad) {
    const padLength = expectedLength - actualLength;
    const padding = `0`.repeat(padLength);
    return `${padding}${num}`;
  }
  return str;
}
function parseTime(duration) {
  const hours = Math.trunc(duration / 3600);
  const minutes = Math.trunc(duration % 3600 / 60);
  const seconds = Math.trunc(duration % 60);
  const fraction = Number((duration - Math.trunc(duration)).toPrecision(3));
  return {
    hours,
    minutes,
    seconds,
    fraction
  };
}
function formatTime(duration, shouldPadHours = null, shouldPadMinutes = null, shouldAlwaysShowHours = false) {
  const { hours, minutes, seconds } = parseTime(duration), paddedHours = shouldPadHours ? padNumberWithZeroes(hours, 2) : hours, paddedMinutes = shouldPadMinutes || isNull(shouldPadMinutes) && duration >= 3600 ? padNumberWithZeroes(minutes, 2) : minutes, paddedSeconds = padNumberWithZeroes(seconds, 2);
  if (hours > 0 || shouldAlwaysShowHours) {
    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
  }
  return `${paddedMinutes}:${paddedSeconds}`;
}
function formatSpokenTime(duration) {
  const spokenParts = [];
  const { hours, minutes, seconds } = parseTime(duration);
  if (hours > 0) {
    spokenParts.push(`${hours} hour`);
  }
  if (minutes > 0) {
    spokenParts.push(`${minutes} min`);
  }
  if (seconds > 0 || spokenParts.length === 0) {
    spokenParts.push(`${seconds} sec`);
  }
  return spokenParts.join(" ");
}

var __defProp$b = Object.defineProperty;
var __getOwnPropDesc$b = Object.getOwnPropertyDescriptor;
var __decorateClass$b = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$b(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$b(target, key, result);
  return result;
};
class SliderValue extends Component {
  static {
    this.props = {
      type: "pointer",
      format: null,
      showHours: false,
      padHours: null,
      padMinutes: null,
      decimalPlaces: 2
    };
  }
  onSetup() {
    this.Q = useState(Slider.state);
    this.Sb = useContext(sliderValueFormatContext);
    this.Ji = computed(this.getValueText.bind(this));
  }
  getValueText() {
    const { type, format, decimalPlaces, padHours, padMinutes, showHours } = this.$props, { value: sliderValue, pointerValue, min, max } = this.Q, _format = format() ?? this.Sb.default;
    const value = type() === "current" ? sliderValue() : pointerValue();
    if (_format === "percent") {
      const range = max() - min();
      const percent = value / range * 100;
      return (this.Sb.percent ?? round)(percent, decimalPlaces()) + "\uFE6A";
    } else if (_format === "time") {
      return (this.Sb.time ?? formatTime)(value, padHours(), padMinutes(), showHours());
    } else {
      return this.Sb.value?.(value) ?? value.toFixed(2);
    }
  }
}
__decorateClass$b([
  method
], SliderValue.prototype, "getValueText", 1);

class SliderPreview extends Component {
  static {
    this.props = {
      offset: 0,
      noClamp: false
    };
  }
  onSetup() {
    this.Q = useContext(sliderContext);
    const { active } = useState(Slider.state);
    this.setAttributes({
      "data-visible": active
    });
  }
  onAttach(el) {
    Object.assign(el.style, {
      position: "absolute",
      top: 0,
      left: 0,
      width: "max-content"
    });
  }
  onConnect(el) {
    const { Cf: _preview } = this.Q;
    _preview.set(el);
    onDispose(() => _preview.set(null));
    effect(this.Hf.bind(this));
    const resize = new ResizeObserver(this.Hf.bind(this));
    resize.observe(el);
    onDispose(() => resize.disconnect());
  }
  Hf() {
    const { Fc: _disabled, ta: _orientation } = this.Q;
    if (_disabled())
      return;
    const el = this.el, { offset, noClamp } = this.$props;
    updateSliderPreviewPlacement(el, {
      clamp: !noClamp(),
      offset: offset(),
      orientation: _orientation()
    });
  }
}
function updateSliderPreviewPlacement(el, {
  clamp,
  offset,
  orientation
}) {
  const { width, height } = el.getBoundingClientRect(), styles = {
    top: null,
    right: null,
    bottom: null,
    left: null
  };
  styles[orientation === "horizontal" ? "bottom" : "left"] = `calc(100% + var(--media-slider-preview-offset, ${offset}px))`;
  if (orientation === "horizontal") {
    const widthHalf = width / 2;
    if (!clamp) {
      styles.left = `calc(var(--slider-pointer) - ${widthHalf}px)`;
    } else {
      const leftClamp = `max(0px, calc(var(--slider-pointer) - ${widthHalf}px))`, rightClamp = `calc(100% - ${width}px)`;
      styles.left = `min(${leftClamp}, ${rightClamp})`;
    }
  } else {
    const heightHalf = height / 2;
    if (!clamp) {
      styles.bottom = `calc(var(--slider-pointer) - ${heightHalf}px)`;
    } else {
      const topClamp = `max(${heightHalf}px, calc(var(--slider-pointer) - ${heightHalf}px))`, bottomClamp = `calc(100% - ${height}px)`;
      styles.bottom = `min(${topClamp}, ${bottomClamp})`;
    }
  }
  Object.assign(el.style, styles);
}

class VolumeSlider extends Component {
  constructor() {
    super(...arguments);
    this.If = functionThrottle(this.ab.bind(this), 25);
  }
  static {
    this.props = {
      ...SliderController.props,
      keyStep: 5,
      shiftKeyMultiplier: 2
    };
  }
  static {
    this.state = sliderState;
  }
  onSetup() {
    this.a = useMediaContext();
    provideContext(sliderValueFormatContext, {
      default: "percent"
    });
    new SliderController({
      Ka: this.$props.step,
      Pb: this.$props.keyStep,
      K: this.$props.disabled,
      Ob: Math.round,
      ia: this.ia.bind(this),
      ja: this.ja.bind(this),
      nb: this.nb.bind(this),
      o: this.o.bind(this)
    }).attach(this);
    effect(this.Fd.bind(this));
  }
  onAttach(el) {
    el.setAttribute("data-media-volume-slider", "");
    setAttributeIfEmpty(el, "aria-label", "Volume");
    const { canSetVolume } = this.a.$state;
    this.setAttributes({
      "data-supported": canSetVolume,
      "aria-hidden": $ariaBool(() => !canSetVolume())
    });
  }
  ia() {
    const { value } = this.$state;
    return Math.round(value());
  }
  ja() {
    const { value, max } = this.$state;
    return round(value() / max() * 100, 2) + "%";
  }
  Fd() {
    const { muted, volume } = this.a.$state;
    const newValue = muted() ? 0 : volume() * 100;
    this.$state.value.set(newValue);
    this.dispatch("value-change", { detail: newValue });
  }
  ab(event) {
    if (!event.trigger)
      return;
    const mediaVolume = round(event.detail / 100, 3);
    this.a.remote.changeVolume(mediaVolume, event);
  }
  o(event) {
    this.If(event);
  }
  nb(event) {
    this.If(event);
  }
}

class TimeSlider extends Component {
  constructor() {
    super();
    this.Jf = signal(null);
    this.Wd = false;
    new SliderController({
      ni: true,
      Ka: this.Ka.bind(this),
      Pb: this.Pb.bind(this),
      K: this.K.bind(this),
      Ob: this.Ob,
      ia: this.ia.bind(this),
      ja: this.ja.bind(this),
      Qd: this.Qd.bind(this),
      nb: this.nb.bind(this),
      Ec: this.Ec.bind(this),
      o: this.o.bind(this)
    });
  }
  static {
    this.props = {
      ...SliderController.props,
      step: 0.1,
      keyStep: 5,
      shiftKeyMultiplier: 2,
      pauseWhileDragging: false,
      seekingRequestThrottle: 100
    };
  }
  static {
    this.state = sliderState;
  }
  onSetup() {
    this.a = useMediaContext();
    provideContext(sliderValueFormatContext, {
      default: "time",
      value: this.Ki.bind(this),
      time: this.Li.bind(this)
    });
    this.setAttributes({
      "data-chapters": this.Mi.bind(this)
    });
    this.setStyles({
      "--slider-progress": this.Ni.bind(this)
    });
    effect(this.jb.bind(this));
    effect(this.Oi.bind(this));
  }
  onAttach(el) {
    el.setAttribute("data-media-time-slider", "");
    setAttributeIfEmpty(el, "aria-label", "Seek");
  }
  onConnect(el) {
    effect(this.Pi.bind(this));
    observeActiveTextTrack(this.a.textTracks, "chapters", this.Jf.set);
  }
  Ni() {
    const { bufferedEnd, duration } = this.a.$state;
    return round(Math.min(bufferedEnd() / Math.max(duration(), 1), 1) * 100, 3) + "%";
  }
  Mi() {
    const { duration } = this.a.$state;
    return this.Jf()?.cues.length && Number.isFinite(duration()) && duration() > 0;
  }
  Oi() {
    this.Vd = functionThrottle(
      this.qa.bind(this),
      this.$props.seekingRequestThrottle()
    );
  }
  jb() {
    const { currentTime } = this.a.$state, { value, dragging } = this.$state, newValue = this.Qi(currentTime());
    if (!peek(dragging)) {
      value.set(newValue);
      this.dispatch("value-change", { detail: newValue });
    }
  }
  Pi() {
    const player = this.a.player.el, { Cf: _preview } = useContext(sliderContext);
    player && _preview() && setAttribute(player, "data-preview", this.$state.active());
  }
  qa(time, event) {
    this.a.remote.seeking(time, event);
  }
  Ri(time, percent, event) {
    this.Vd.cancel();
    const { live } = this.a.$state;
    if (live() && percent >= 99) {
      this.a.remote.seekToLiveEdge(event);
      return;
    }
    this.a.remote.seek(time, event);
  }
  Qd(event) {
    const { pauseWhileDragging } = this.$props;
    if (pauseWhileDragging()) {
      const { paused } = this.a.$state;
      this.Wd = !paused();
      this.a.remote.pause(event);
    }
  }
  nb(event) {
    this.Vd(this.Tb(event.detail), event);
  }
  Ec(event) {
    const percent = event.detail;
    this.Ri(this.Tb(percent), percent, event);
    const { pauseWhileDragging } = this.$props;
    if (pauseWhileDragging() && this.Wd) {
      this.a.remote.play(event);
      this.Wd = false;
    }
  }
  o(event) {
    const { dragging } = this.$state;
    if (dragging() || !event.trigger)
      return;
    this.Ec(event);
  }
  // -------------------------------------------------------------------------------------------
  // Props
  // -------------------------------------------------------------------------------------------
  Ka() {
    const value = this.$props.step() / this.a.$state.duration() * 100;
    return Number.isFinite(value) ? value : 1;
  }
  Pb() {
    const value = this.$props.keyStep() / this.a.$state.duration() * 100;
    return Number.isFinite(value) ? value : 1;
  }
  Ob(value) {
    return round(value, 3);
  }
  K() {
    const { canSeek } = this.a.$state;
    return this.$props.disabled() || !canSeek();
  }
  // -------------------------------------------------------------------------------------------
  // ARIA
  // -------------------------------------------------------------------------------------------
  ia() {
    const { value } = this.$state;
    return Math.round(value());
  }
  ja() {
    const time = this.Tb(this.$state.value()), { duration } = this.a.$state;
    return Number.isFinite(time) ? `${formatSpokenTime(time)} out of ${formatSpokenTime(duration())}` : "live";
  }
  // -------------------------------------------------------------------------------------------
  // Format
  // -------------------------------------------------------------------------------------------
  Tb(percent) {
    const { duration } = this.a.$state;
    return round(percent / 100 * duration(), 5);
  }
  Qi(time) {
    const { liveEdge, duration } = this.a.$state, rate = Math.max(0, Math.min(1, liveEdge() ? 1 : Math.min(time, duration()) / duration()));
    return Number.isNaN(rate) ? 0 : Number.isFinite(rate) ? rate * 100 : 100;
  }
  Ki(percent) {
    const time = this.Tb(percent), { live, duration } = this.a.$state;
    return Number.isFinite(time) ? (live() ? time - duration() : time).toFixed(0) : "LIVE";
  }
  Li(percent, padHours, padMinutes, showHours) {
    const time = this.Tb(percent), { live, duration } = this.a.$state, value = live() ? time - duration() : time;
    return Number.isFinite(time) ? `${value < 0 ? "-" : ""}${formatTime(Math.abs(value), padHours, padMinutes, showHours)}` : "LIVE";
  }
}

var __defProp$a = Object.defineProperty;
var __getOwnPropDesc$a = Object.getOwnPropertyDescriptor;
var __decorateClass$a = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$a(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$a(target, key, result);
  return result;
};
class SliderChapters extends Component {
  constructor() {
    super(...arguments);
    this.La = null;
    this.R = [];
    this.Gc = signal(null);
    this._ = signal([]);
    this.Ub = signal(-1);
    this.Hc = signal(-1);
    this.Zd = 0;
    this.Xi = animationFrameThrottle((bufferedPercent) => {
      let percent, cues = this._();
      for (let i = this.Zd; i < this.R.length; i++) {
        percent = this.ae(cues[i], bufferedPercent);
        this.R[i]?.style.setProperty("--chapter-progress", percent + "%");
        if (percent < 100) {
          this.Zd = i;
          break;
        }
      }
    });
    this.Yi = computed(this.Zi.bind(this));
    this.$i = functionDebounce(
      () => {
        const track = peek(this.Gc);
        if (!this.scope || !track || !track.cues.length)
          return;
        this._.set(this._i(track.cues));
        this.Ub.set(0);
      },
      150,
      true
    );
  }
  static {
    this.props = {
      disabled: false
    };
  }
  get cues() {
    return this._();
  }
  get activeCue() {
    return this._()[this.Ub()] || null;
  }
  get activePointerCue() {
    return this._()[this.Hc()] || null;
  }
  onSetup() {
    this.a = useMediaContext();
    this.Xd = useState(TimeSlider.state);
  }
  onAttach(el) {
    observeActiveTextTrack(this.a.textTracks, "chapters", this.Kf.bind(this));
    effect(this._d.bind(this));
  }
  onConnect() {
    onDispose(() => this.H.bind(this));
  }
  onDestroy() {
    this.Kf(null);
  }
  setRefs(refs) {
    this.R = refs;
    this.Yd?.dispose();
    if (this.R.length === 1) {
      const el = this.R[0];
      el.style.width = "100%";
      el.style.setProperty("--chapter-fill", "var(--slider-fill)");
      el.style.setProperty("--chapter-progress", "var(--slider-progress)");
    } else if (this.R.length > 0) {
      scoped(() => this.Si(), this.Yd = createScope());
    }
  }
  Kf(track) {
    if (peek(this.Gc) === track)
      return;
    this.H();
    this.Gc.set(track);
  }
  H() {
    this.R = [];
    this._.set([]);
    this.Ub.set(-1);
    this.Hc.set(-1);
    this.Zd = 0;
    this.Yd?.dispose();
  }
  Si() {
    if (!this.R.length)
      return;
    effect(this.Ti.bind(this));
    effect(this.Ui.bind(this));
    effect(this.Vi.bind(this));
    effect(this.Wi.bind(this));
  }
  Ti() {
    let cue, cues = this._(), endTime = cues[cues.length - 1].endTime;
    for (let i = 0; i < cues.length; i++) {
      cue = cues[i];
      if (this.R[i]) {
        this.R[i].style.width = round((cue.endTime - cue.startTime) / endTime * 100, 3) + "%";
      }
    }
  }
  Ui() {
    let { liveEdge, ended } = this.a.$state, { fillPercent, value } = this.Xd, cues = this._(), isLiveEdge = liveEdge(), prevActiveIndex = peek(this.Ub), currentChapter = cues[prevActiveIndex];
    let currentActiveIndex = isLiveEdge ? this._.length - 1 : this.Lf(
      currentChapter ? currentChapter.startTime <= peek(value) ? prevActiveIndex : 0 : 0,
      fillPercent()
    );
    if (isLiveEdge || ended() || !currentChapter) {
      this.$d(0, cues.length, "100%");
    } else if (currentActiveIndex > prevActiveIndex) {
      this.$d(prevActiveIndex, currentActiveIndex, "100%");
    } else if (currentActiveIndex < prevActiveIndex) {
      this.$d(currentActiveIndex + 1, prevActiveIndex + 1, "0%");
    }
    const percent = isLiveEdge ? "100%" : this.ae(cues[currentActiveIndex], fillPercent()) + "%";
    this.Mf(this.R[currentActiveIndex], percent);
    this.Ub.set(currentActiveIndex);
  }
  Vi() {
    let { pointing, pointerPercent } = this.Xd;
    if (!pointing()) {
      this.Hc.set(-1);
      return;
    }
    const activeIndex = this.Lf(0, pointerPercent());
    this.Hc.set(activeIndex);
  }
  $d(start, end, percent) {
    for (let i = start; i < end; i++)
      this.Mf(this.R[i], percent);
  }
  Mf(ref, percent) {
    ref && ref.style.setProperty("--chapter-fill", percent);
  }
  Lf(startIndex, percent) {
    let chapterPercent = 0, cues = this._();
    for (let i = startIndex; i < cues.length; i++) {
      chapterPercent = this.ae(cues[i], percent);
      if (chapterPercent >= 0 && chapterPercent < 100)
        return i;
    }
    return 0;
  }
  Wi() {
    this.Xi(this.Yi());
  }
  Zi() {
    const { bufferedEnd, duration } = this.a.$state;
    return round(Math.min(bufferedEnd() / Math.max(duration(), 1), 1), 3) * 100;
  }
  ae(cue, percent) {
    const cues = this._();
    if (cues.length === 0)
      return 0;
    const lastChapter = cues[cues.length - 1], startPercent = cue.startTime / lastChapter.endTime * 100, endPercent = cue.endTime / lastChapter.endTime * 100;
    return Math.max(
      0,
      round(
        percent >= endPercent ? 100 : (percent - startPercent) / (endPercent - startPercent) * 100,
        3
      )
    );
  }
  _i(cues) {
    const chapters = [];
    if (cues[0].startTime !== 0) {
      chapters.push(new window.VTTCue(0, cues[0].startTime, ""));
    }
    for (let i = 0; i < cues.length - 1; i++) {
      const currentCue = cues[i], nextCue = cues[i + 1];
      chapters.push(currentCue);
      if (nextCue) {
        const timeDiff = nextCue.startTime - currentCue.endTime;
        if (timeDiff > 0) {
          chapters.push(new window.VTTCue(currentCue.endTime, currentCue.endTime + timeDiff, ""));
        }
      }
    }
    chapters.push(cues[cues.length - 1]);
    return chapters;
  }
  _d() {
    if (!this.scope)
      return;
    const { disabled } = this.$props;
    if (disabled())
      return;
    const track = this.Gc();
    if (track) {
      const onCuesChange = this.$i.bind(this);
      onCuesChange();
      onDispose(listenEvent(track, "add-cue", onCuesChange));
      onDispose(listenEvent(track, "remove-cue", onCuesChange));
    }
    this.La = this.aj();
    if (this.La)
      effect(this.bj.bind(this));
    return () => {
      if (this.La) {
        this.La.textContent = "";
        this.La = null;
      }
    };
  }
  bj() {
    const cue = this.activePointerCue || this.activeCue;
    if (this.La)
      this.La.textContent = cue?.text || "";
  }
  cj() {
    let node = this.el;
    while (node && node.getAttribute("role") !== "slider") {
      node = node.parentElement;
    }
    return node;
  }
  aj() {
    const slider = this.cj();
    return slider ? slider.querySelector('[data-part="chapter-title"]') : null;
  }
}
__decorateClass$a([
  prop
], SliderChapters.prototype, "cues", 1);
__decorateClass$a([
  prop
], SliderChapters.prototype, "activeCue", 1);
__decorateClass$a([
  prop
], SliderChapters.prototype, "activePointerCue", 1);
__decorateClass$a([
  method
], SliderChapters.prototype, "setRefs", 1);

const menuContext = createContext();

const FOCUSABLE_ELEMENTS_SELECTOR = /* @__PURE__ */ [
  "a[href]",
  "[tabindex]",
  "input",
  "select",
  "button"
].map((selector) => `${selector}:not([aria-hidden])`).join(",");
const VALID_KEYS = /* @__PURE__ */ new Set([
  "Escape",
  "Tab",
  "ArrowUp",
  "ArrowDown",
  "Home",
  "PageUp",
  "End",
  "PageDown",
  "Enter",
  " "
]);
class MenuFocusController {
  constructor(_delegate) {
    this.j = _delegate;
    this.ka = 0;
    this.xa = null;
    this.da = [];
  }
  get r() {
    return this.da;
  }
  Nf(el) {
    listenEvent(el, "focus", this.Lb.bind(this));
    this.xa = el;
    onDispose(() => {
      this.xa = null;
    });
    return this;
  }
  zc() {
    if (!this.xa)
      return;
    this.ea();
    listenEvent(this.xa, "keyup", this.zb.bind(this));
    listenEvent(this.xa, "keydown", this.Ab.bind(this));
    onDispose(() => {
      this.ka = 0;
      this.da = [];
    });
  }
  ea() {
    this.ka = 0;
    this.da = this.dj();
  }
  Of(index = this.Pf()) {
    const element = this.da[index], container = this.j.ej();
    if (element && container) {
      requestAnimationFrame(() => {
        container.scrollTop = element.offsetTop - container.offsetHeight / 2 + element.offsetHeight / 2;
      });
    }
  }
  qb(index) {
    this.ka = index;
    this.da[index]?.focus();
    this.Of(index);
  }
  Pf() {
    return this.da.findIndex((el) => el.getAttribute("aria-checked") === "true");
  }
  Lb() {
    this.ea();
    setTimeout(() => {
      const index = this.Pf();
      this.qb(index >= 0 ? index : 0);
    }, 100);
  }
  zb(event) {
    if (!VALID_KEYS.has(event.key))
      return;
    event.stopPropagation();
    event.preventDefault();
  }
  Ab(event) {
    if (!VALID_KEYS.has(event.key))
      return;
    event.stopPropagation();
    event.preventDefault();
    switch (event.key) {
      case "Escape":
        this.j.fj(event);
        break;
      case "Tab":
        this.qb(this.be(event.shiftKey ? -1 : 1));
        break;
      case "ArrowUp":
        this.qb(this.be(-1));
        break;
      case "ArrowDown":
        this.qb(this.be(1));
        break;
      case "Home":
      case "PageUp":
        this.qb(0);
        break;
      case "End":
      case "PageDown":
        this.qb(this.da.length - 1);
        break;
    }
  }
  be(delta) {
    let index = this.ka;
    do {
      index = (index + delta + this.da.length) % this.da.length;
    } while (this.da[index]?.offsetParent === null);
    return index;
  }
  dj() {
    if (!this.xa)
      return [];
    const focusableElements = this.xa.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR), elements = [];
    const is = (node) => {
      return node.getAttribute("role") === "menu";
    };
    for (const el of focusableElements) {
      if (el instanceof HTMLElement && el.offsetParent !== null && // does not have display: none
      isElementParent(this.xa, el, is)) {
        elements.push(el);
      }
    }
    return elements;
  }
}

var __defProp$9 = Object.defineProperty;
var __getOwnPropDesc$9 = Object.getOwnPropertyDescriptor;
var __decorateClass$9 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$9(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$9(target, key, result);
  return result;
};
let idCount = 0;
class Menu extends Component {
  constructor() {
    super();
    this.L = signal(false);
    this.Fc = signal(false);
    this.C = signal(null);
    this.u = signal(null);
    this.Qf = signal(false);
    this.Vb = /* @__PURE__ */ new Set();
    this.Ic = null;
    this.rj = this.sj.bind(this);
    this.pj = this.tj.bind(this);
    this.qj = this.uj.bind(this);
    const { showDelay } = this.$props;
    this.Jc = new Popper({
      C: this.C,
      u: this.u,
      yf: showDelay,
      zc: (trigger, show, hide) => {
        onPress(trigger, (event) => {
          if (this.L())
            hide(event);
          else
            show(event);
        });
        const closeTarget = this.gj();
        if (closeTarget) {
          onPress(closeTarget, (event) => {
            event.stopPropagation();
            hide(event);
          });
        }
      },
      B: this.hj.bind(this)
    });
  }
  static {
    this.props = {
      showDelay: 0
    };
  }
  get triggerElement() {
    return this.C();
  }
  get contentElement() {
    return this.u();
  }
  get isSubmenu() {
    return !!this.ee;
  }
  onSetup() {
    this.a = useMediaContext();
    const currentIdCount = ++idCount;
    this.ce = `media-menu-${currentIdCount}`;
    this.de = `media-menu-button-${currentIdCount}`;
    this.rb = new MenuFocusController({
      ej: this.ij.bind(this),
      fj: this.close.bind(this)
    });
    if (hasProvidedContext(menuContext)) {
      this.ee = useContext(menuContext);
    }
    this.setAttributes({
      "data-open": this.L,
      "data-submenu": this.isSubmenu,
      "data-disabled": this.K.bind(this)
    });
    provideContext(menuContext, {
      jj: this.C,
      L: this.L,
      Wb: signal(""),
      Ma: this.Ma.bind(this),
      fe: this.fe.bind(this),
      ge: this.ge.bind(this),
      he: this.he.bind(this),
      ie: this.ie.bind(this),
      je: this.je.bind(this)
    });
  }
  onAttach(el) {
    el.style.setProperty("display", "contents");
    this.rb.Nf(el);
  }
  onConnect(el) {
    effect(this.kj.bind(this));
    if (this.isSubmenu)
      this.ee?.je(this);
    requestAnimationFrame(() => {
      this.O();
    });
  }
  onDestroy() {
    this.C.set(null);
    this.u.set(null);
    this.Ic = null;
  }
  kj() {
    const expanded = this.lj();
    this.O();
    this.Rf(expanded);
    if (!expanded)
      return;
    effect(() => {
      const { height } = this.a.$state, content = this.u();
      content && setStyle(content, "--player-height", height() + "px");
    });
    this.rb.zc();
    this.listen("pointerup", this.mj.bind(this));
    listenEvent(window, "pointerup", this.nj.bind(this));
  }
  fe(button) {
    const el = button.el, isMenuItem = this.isSubmenu, isARIADisabled = $ariaBool(this.K.bind(this));
    setAttributeIfEmpty(el, "tabindex", isMenuItem ? "-1" : "0");
    setAttributeIfEmpty(el, "role", isMenuItem ? "menuitem" : "button");
    setAttribute(el, "id", this.de);
    setAttribute(el, "aria-haspopup", "menu");
    setAttribute(el, "aria-expanded", "false");
    setAttribute(el, "data-submenu", this.isSubmenu);
    if (!this.isSubmenu) {
      this.Sf(el);
    }
    const watchAttrs = () => {
      setAttribute(el, "data-open", this.L());
      setAttribute(el, "aria-disabled", isARIADisabled());
    };
    effect(watchAttrs);
    this.C.set(el);
    onDispose(() => {
      this.C.set(null);
    });
  }
  ge(items) {
    const el = items.el;
    el.style.setProperty("display", "none");
    setAttribute(el, "id", this.ce);
    setAttributeIfEmpty(el, "role", "menu");
    setAttributeIfEmpty(el, "tabindex", "-1");
    setAttribute(el, "data-submenu", this.isSubmenu);
    this.u.set(el);
    onDispose(() => this.u.set(null));
    if (!this.isSubmenu) {
      this.Sf(el);
    }
    const watchAttrs = () => {
      setAttribute(el, "data-open", this.L());
    };
    effect(watchAttrs);
    this.rb.Nf(el);
    this.Rf(false);
    {
      const onResize = animationFrameThrottle(this.O.bind(this)), mutations = new MutationObserver(onResize);
      onResize();
      mutations.observe(el, { childList: true, subtree: true });
      onDispose(() => mutations.disconnect());
    }
  }
  he(observer) {
    this.Ic = observer;
  }
  Sf(el) {
    listenEvent(el, "click", (e) => e.stopPropagation());
    listenEvent(el, "pointerup", (e) => e.stopPropagation());
  }
  Rf(expanded) {
    const content = peek(this.u);
    if (content)
      setAttribute(content, "aria-hidden", ariaBool$1(!expanded));
  }
  ie(disabled) {
    this.Qf.set(disabled);
  }
  hj(isExpanded, event) {
    event?.stopPropagation();
    if (this.L() === isExpanded)
      return;
    if (this.K()) {
      if (isExpanded)
        this.Jc.hide(event);
      return;
    }
    const trigger = this.C(), content = this.u();
    if (trigger) {
      setAttribute(trigger, "aria-controls", isExpanded && this.ce);
      setAttribute(trigger, "aria-expanded", ariaBool$1(isExpanded));
    }
    if (content)
      setAttribute(content, "aria-labelledby", isExpanded && this.de);
    this.L.set(isExpanded);
    this.oj(event);
    tick();
    if (isKeyboardEvent(event)) {
      if (isExpanded) {
        content?.focus();
      } else {
        trigger?.focus();
      }
      for (const el of [this.el, content]) {
        el && el.setAttribute("data-keyboard", "");
      }
    } else {
      for (const el of [this.el, content]) {
        el && el.removeAttribute("data-keyboard");
      }
    }
    this.dispatch(isExpanded ? "open" : "close", { trigger: event });
    if (isExpanded) {
      if (!this.isSubmenu && this.a.activeMenu !== this) {
        this.a.activeMenu?.close(event);
        this.a.activeMenu = this;
      }
      this.Ic?.ke?.(event);
    } else {
      if (this.isSubmenu) {
        setTimeout(() => {
          for (const el of this.Vb)
            el.close(event);
        }, 300);
      } else {
        this.a.activeMenu = null;
      }
      this.Ic?.Tj?.(event);
    }
    if (isExpanded && !isKeyboardEvent(event)) {
      requestAnimationFrame(() => {
        this.rb.ea();
        setTimeout(() => {
          this.rb.Of();
        }, 100);
      });
    }
  }
  lj() {
    return !this.K() && this.L();
  }
  K() {
    return this.Fc() || this.Qf();
  }
  Ma(disabled) {
    this.Fc.set(disabled);
  }
  mj(event) {
    event.stopPropagation();
  }
  nj(event) {
    if (this.isSubmenu)
      return setTimeout(this.close.bind(this, event), 800);
    else
      this.close(event);
  }
  gj() {
    const target = this.el.querySelector('[data-part="close-target"]');
    return isElementParent(this.el, target, (node) => node.getAttribute("role") === "menu") ? target : null;
  }
  ij() {
    if (!this.isSubmenu) {
      const content = peek(this.u);
      return content || null;
    } else {
      let el = this.el;
      while (el && el.tagName !== "media-menu" && el.hasAttribute("data-submenu")) {
        el = el.parentNode;
      }
      return el;
    }
  }
  oj(trigger) {
    if (this.isSubmenu)
      return;
    if (this.L())
      this.a.remote.pauseControls(trigger);
    else
      this.a.remote.resumeControls(trigger);
  }
  je(menu) {
    this.Vb.add(menu);
    listenEvent(menu, "open", this.pj);
    listenEvent(menu, "close", this.qj);
    onDispose(this.rj);
  }
  sj(menu) {
    this.Vb.delete(menu);
  }
  tj(event) {
    for (const target of this.Vb) {
      if (target !== event.target) {
        for (const el of [target.el, target.triggerElement]) {
          el?.setAttribute("aria-hidden", "true");
        }
      }
    }
    requestAnimationFrame(() => {
      this.O();
    });
  }
  uj() {
    for (const target of this.Vb) {
      for (const el of [target.el, target.triggerElement]) {
        el?.setAttribute("aria-hidden", "false");
      }
    }
    requestAnimationFrame(() => {
      this.O();
    });
  }
  O() {
    const content = peek(this.u);
    if (!content || false)
      return;
    let { paddingTop, paddingBottom, borderTopWidth, borderBottomWidth } = getComputedStyle(content), height = parseFloat(paddingTop) + parseFloat(paddingBottom) + parseFloat(borderTopWidth) + parseFloat(borderBottomWidth), children = [...content.children];
    for (const child of children) {
      if (child instanceof HTMLElement && child.style.display === "contents") {
        children.push(...child.children);
      } else if (child.nodeType === 3) {
        height += parseInt(window.getComputedStyle(child).fontSize, 10);
      } else {
        height += child.offsetHeight || 0;
      }
    }
    requestAnimationFrame(() => {
      if (!content)
        return;
      setAttribute(content, "data-resizing", "");
      setTimeout(() => {
        if (content)
          setAttribute(content, "data-resizing", false);
      }, 400);
      setStyle(content, "--menu-height", height + "px");
    });
  }
  open(trigger) {
    if (peek(this.L))
      return;
    this.Jc.show(trigger);
    tick();
  }
  close(trigger) {
    if (!peek(this.L))
      return;
    this.Jc.hide(trigger);
    tick();
  }
}
__decorateClass$9([
  prop
], Menu.prototype, "triggerElement", 1);
__decorateClass$9([
  prop
], Menu.prototype, "contentElement", 1);
__decorateClass$9([
  prop
], Menu.prototype, "isSubmenu", 1);
__decorateClass$9([
  method
], Menu.prototype, "open", 1);
__decorateClass$9([
  method
], Menu.prototype, "close", 1);

var __defProp$8 = Object.defineProperty;
var __getOwnPropDesc$8 = Object.getOwnPropertyDescriptor;
var __decorateClass$8 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$8(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$8(target, key, result);
  return result;
};
class MenuButton extends Component {
  constructor() {
    super();
    new FocusVisibleController();
  }
  static {
    this.props = {
      disabled: false
    };
  }
  get expanded() {
    return this.l?.L() ?? false;
  }
  onSetup() {
    this.l = useContext(menuContext);
  }
  onAttach(el) {
    this.l.fe(this);
    effect(this.Qb.bind(this));
    setAttributeIfEmpty(el, "type", "button");
  }
  onConnect(el) {
    const hint = Array.from(el.querySelectorAll('[data-part="hint"]')).pop();
    if (hint) {
      effect(() => {
        const text = this.l.Wb();
        if (text)
          hint.textContent = text;
      });
    }
    onPress(el, (trigger) => {
      this.dispatch("select", { trigger });
    });
  }
  Qb() {
    this.l.ie(this.$props.disabled());
  }
}
__decorateClass$8([
  prop
], MenuButton.prototype, "expanded", 1);

class MenuPortal extends Component {
  constructor() {
    super(...arguments);
    this.A = null;
  }
  static {
    this.props = {
      container: null,
      disabled: false
    };
  }
  onSetup() {
    this.a = useMediaContext();
    provideContext(menuPortalContext, {
      Ja: this.vj.bind(this)
    });
  }
  onAttach(el) {
    el.style.setProperty("display", "contents");
  }
  // Need this so connect scope is defined.
  onConnect(el) {
  }
  onDestroy() {
    this.A?.remove();
    this.A = null;
  }
  vj(el) {
    this.Tf(false);
    this.A = el;
    requestScopedAnimationFrame(() => {
      requestScopedAnimationFrame(() => {
        if (!this.connectScope)
          return;
        effect(this.Qb.bind(this));
      });
    });
  }
  Qb() {
    const { fullscreen } = this.a.$state, { disabled } = this.$props, _disabled = disabled();
    this.Tf(_disabled === "fullscreen" ? !fullscreen() : !_disabled);
  }
  Tf(shouldPortal) {
    if (!this.A)
      return;
    let container = this.wj(this.$props.container());
    if (!container)
      return;
    const isPortalled = this.A.parentElement === container;
    setAttribute(this.A, "data-portal", shouldPortal);
    if (shouldPortal) {
      if (!isPortalled) {
        this.A.remove();
        container.append(this.A);
      }
    } else if (isPortalled && this.A.parentElement === container) {
      this.A.remove();
      this.el?.append(this.A);
    }
  }
  wj(selector) {
    if (selector instanceof HTMLElement)
      return selector;
    return selector ? document.querySelector(selector) : document.body;
  }
}
const menuPortalContext = createContext();

class MenuItems extends Component {
  constructor() {
    super();
    new FocusVisibleController();
    const { placement } = this.$props;
    this.setAttributes({
      "data-placement": placement
    });
  }
  static {
    this.props = {
      placement: null,
      offset: 0,
      alignOffset: 0
    };
  }
  onAttach(el) {
    this.l = useContext(menuContext);
    this.l.ge(this);
    if (hasProvidedContext(menuPortalContext)) {
      const portal = useContext(menuPortalContext);
      if (portal) {
        provideContext(menuPortalContext, null);
        portal.Ja(el);
        onDispose(() => portal.Ja(null));
      }
    }
  }
  onConnect(el) {
    effect(this.Nd.bind(this));
  }
  Nd() {
    if (!this.el)
      return;
    const placement = this.$props.placement();
    if (placement) {
      Object.assign(this.el.style, {
        position: "absolute",
        top: 0,
        left: 0,
        width: "max-content"
      });
      const { offset: mainOffset, alignOffset } = this.$props;
      return autoPlacement(this.el, this.Cc(), placement, {
        offsetVarName: "media-menu",
        xOffset: alignOffset(),
        yOffset: mainOffset()
      });
    } else {
      this.el.removeAttribute("style");
      this.el.style.display = "none";
    }
  }
  Cc() {
    return this.l.jj();
  }
}

const radioControllerContext = createContext();

class RadioGroupController extends ViewController {
  constructor() {
    super(...arguments);
    this.sb = /* @__PURE__ */ new Set();
    this.la = signal("");
    this.d = null;
    this.Aj = this.B.bind(this);
  }
  get xj() {
    return Array.from(this.sb).map((radio) => radio.la());
  }
  get value() {
    return this.la();
  }
  set value(value) {
    this.B(value);
  }
  onSetup() {
    provideContext(radioControllerContext, {
      add: this.yj.bind(this),
      remove: this.zj.bind(this)
    });
  }
  onAttach(el) {
    const isMenuItem = hasProvidedContext(menuContext);
    if (!isMenuItem)
      setAttributeIfEmpty(el, "role", "radiogroup");
    this.setAttributes({ value: this.la });
  }
  onDestroy() {
    this.sb.clear();
  }
  yj(radio) {
    if (this.sb.has(radio))
      return;
    this.sb.add(radio);
    radio.Kc = this.Aj;
    radio.Xb(radio.la() === this.la());
  }
  zj(radio) {
    radio.Kc = null;
    this.sb.delete(radio);
  }
  B(newValue, trigger) {
    const currentValue = peek(this.la);
    if (!newValue || newValue === currentValue)
      return;
    const currentRadio = this.Uf(currentValue), newRadio = this.Uf(newValue);
    currentRadio?.Xb(false, trigger);
    newRadio?.Xb(true, trigger);
    this.la.set(newValue);
    this.o?.(newValue, trigger);
  }
  Uf(newValue) {
    for (const radio of this.sb) {
      if (newValue === peek(radio.la))
        return radio;
    }
    return null;
  }
}

var __defProp$7 = Object.defineProperty;
var __getOwnPropDesc$7 = Object.getOwnPropertyDescriptor;
var __decorateClass$7 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$7(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$7(target, key, result);
  return result;
};
class RadioGroup extends Component {
  constructor() {
    super();
    this.d = new RadioGroupController();
    this.d.o = this.o.bind(this);
  }
  static {
    this.props = {
      value: ""
    };
  }
  get values() {
    return this.d.xj;
  }
  get value() {
    return this.d.value;
  }
  set value(newValue) {
    this.d.value = newValue;
  }
  onSetup() {
    effect(this.D.bind(this));
  }
  D() {
    this.d.value = this.$props.value();
  }
  o(value, trigger) {
    const event = this.createEvent("change", { detail: value, trigger });
    this.dispatch(event);
  }
}
__decorateClass$7([
  prop
], RadioGroup.prototype, "values", 1);
__decorateClass$7([
  prop
], RadioGroup.prototype, "value", 1);

var __defProp$6 = Object.defineProperty;
var __getOwnPropDesc$6 = Object.getOwnPropertyDescriptor;
var __decorateClass$6 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$6(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$6(target, key, result);
  return result;
};
class Radio extends Component {
  constructor() {
    super();
    this.Na = signal(false);
    this.d = {
      la: this.$props.value,
      Xb: this.Xb.bind(this),
      Kc: null
    };
    new FocusVisibleController();
  }
  static {
    this.props = {
      value: ""
    };
  }
  get checked() {
    return this.Na();
  }
  onSetup() {
    this.setAttributes({
      value: this.$props.value,
      "data-checked": this.Na,
      "aria-checked": $ariaBool(this.Na)
    });
  }
  onAttach(el) {
    const isMenuItem = hasProvidedContext(menuContext);
    setAttributeIfEmpty(el, "tabindex", isMenuItem ? "-1" : "0");
    setAttributeIfEmpty(el, "role", isMenuItem ? "menuitemradio" : "radio");
    effect(this.D.bind(this));
  }
  onConnect(el) {
    this.Bj();
    onPress(el, this.v.bind(this));
    onDispose(this.ya.bind(this));
  }
  ya() {
    scoped(() => {
      const group = useContext(radioControllerContext);
      group.remove(this.d);
    }, this.connectScope);
  }
  Bj() {
    const group = useContext(radioControllerContext);
    group.add(this.d);
  }
  D() {
    const { value } = this.$props, newValue = value();
    if (peek(this.Na)) {
      this.d.Kc?.(newValue);
    }
  }
  v(event) {
    if (peek(this.Na))
      return;
    this.B(true, event);
    this.Cj(event);
    this.d.Kc?.(peek(this.$props.value), event);
  }
  Xb(value, trigger) {
    if (peek(this.Na) === value)
      return;
    this.B(value, trigger);
  }
  B(value, trigger) {
    this.Na.set(value);
    this.dispatch("change", { detail: value, trigger });
  }
  Cj(trigger) {
    this.dispatch("select", { trigger });
  }
}
__decorateClass$6([
  prop
], Radio.prototype, "checked", 1);

var __defProp$5 = Object.defineProperty;
var __getOwnPropDesc$5 = Object.getOwnPropertyDescriptor;
var __decorateClass$5 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$5(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$5(target, key, result);
  return result;
};
class ChaptersRadioGroup extends Component {
  constructor() {
    super();
    this.ka = signal(0);
    this.z = signal(null);
    this.J = signal([]);
    this.d = new RadioGroupController();
    this.d.o = this.o.bind(this);
  }
  static {
    this.props = {
      thumbnails: ""
    };
  }
  get value() {
    return this.d.value;
  }
  get disabled() {
    return !this.J()?.length;
  }
  onSetup() {
    this.a = useMediaContext();
    if (hasProvidedContext(menuContext)) {
      this.l = useContext(menuContext);
    }
    const { thumbnails } = this.$props;
    this.setAttributes({
      "data-thumbnails": () => !!thumbnails()
    });
  }
  onAttach(el) {
    this.l?.he({
      ke: this.ke.bind(this)
    });
  }
  getOptions() {
    return this.J().map((cue, i) => ({
      cue,
      value: i + "",
      label: cue.text,
      startTime: formatTime(cue.startTime, false),
      duration: formatSpokenTime(cue.endTime - cue.startTime)
    }));
  }
  ke() {
    peek(() => this.jb());
  }
  onConnect(el) {
    effect(this.D.bind(this));
    effect(this.jb.bind(this));
    effect(this.ma.bind(this));
    effect(this.tk.bind(this));
    observeActiveTextTrack(this.a.textTracks, "chapters", this.z.set);
  }
  tk() {
    const track = this.z();
    if (!track)
      return;
    const onCuesChange = this.$i.bind(this, track);
    onCuesChange();
    listenEvent(track, "add-cue", onCuesChange);
    listenEvent(track, "remove-cue", onCuesChange);
    return () => {
      this.J.set([]);
    };
  }
  $i(track) {
    this.J.set([...track.cues]);
  }
  D() {
    this.d.value = this.na();
  }
  jb() {
    if (!this.l?.L())
      return;
    const track = this.z();
    if (!track) {
      this.ka.set(-1);
      return;
    }
    const { currentTime } = this.a.$state, time = currentTime(), activeCueIndex = track.cues.findIndex((cue) => isCueActive(cue, time));
    this.ka.set(activeCueIndex);
    if (activeCueIndex >= 0) {
      const cue = track.cues[activeCueIndex], radio = this.el.querySelector(`[aria-checked='true']`), playedPercent = (time - cue.startTime) / (cue.endTime - cue.startTime) * 100;
      radio && setStyle(radio, "--progress", round(playedPercent, 3) + "%");
    }
  }
  ma() {
    this.l?.Ma(this.disabled);
  }
  na() {
    return this.ka() + "";
  }
  o(value, trigger) {
    if (this.disabled || !trigger)
      return;
    const index = +value, cues = this.z()?.cues;
    if (isNumber(index) && cues?.[index]) {
      this.ka.set(index);
      this.a.remote.seek(cues[index].startTime, trigger);
      this.dispatch("change", { detail: cues[index], trigger });
    }
  }
}
__decorateClass$5([
  prop
], ChaptersRadioGroup.prototype, "value", 1);
__decorateClass$5([
  prop
], ChaptersRadioGroup.prototype, "disabled", 1);
__decorateClass$5([
  method
], ChaptersRadioGroup.prototype, "getOptions", 1);

var __defProp$4 = Object.defineProperty;
var __getOwnPropDesc$4 = Object.getOwnPropertyDescriptor;
var __decorateClass$4 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$4(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$4(target, key, result);
  return result;
};
class AudioRadioGroup extends Component {
  constructor() {
    super();
    this.d = new RadioGroupController();
    this.d.o = this.o.bind(this);
  }
  static {
    this.props = {
      emptyLabel: "Default"
    };
  }
  get value() {
    return this.d.value;
  }
  get disabled() {
    const { audioTracks } = this.a.$state;
    return audioTracks().length === 0;
  }
  onSetup() {
    this.a = useMediaContext();
    if (hasProvidedContext(menuContext)) {
      this.l = useContext(menuContext);
    }
  }
  onConnect(el) {
    effect(this.D.bind(this));
    effect(this.ma.bind(this));
    effect(this.Oa.bind(this));
  }
  getOptions() {
    const { audioTracks } = this.a.$state;
    return audioTracks().map((track) => ({
      track,
      label: track.label,
      value: track.label.toLowerCase()
    }));
  }
  D() {
    this.d.value = this.na();
  }
  Oa() {
    const { emptyLabel } = this.$props, { audioTrack } = this.a.$state, track = audioTrack();
    this.l?.Wb.set(track?.label ?? emptyLabel());
  }
  ma() {
    this.l?.Ma(this.disabled);
  }
  na() {
    const { audioTrack } = this.a.$state;
    const track = audioTrack();
    return track ? track.label.toLowerCase() : "";
  }
  o(value, trigger) {
    if (this.disabled)
      return;
    const index = this.a.audioTracks.toArray().findIndex((track) => track.label.toLowerCase() === value);
    if (index >= 0) {
      const track = this.a.audioTracks[index];
      this.a.remote.changeAudioTrack(index, trigger);
      this.dispatch("change", { detail: track, trigger });
    }
  }
}
__decorateClass$4([
  prop
], AudioRadioGroup.prototype, "value", 1);
__decorateClass$4([
  prop
], AudioRadioGroup.prototype, "disabled", 1);
__decorateClass$4([
  method
], AudioRadioGroup.prototype, "getOptions", 1);

var __defProp$3 = Object.defineProperty;
var __getOwnPropDesc$3 = Object.getOwnPropertyDescriptor;
var __decorateClass$3 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$3(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$3(target, key, result);
  return result;
};
class CaptionsRadioGroup extends Component {
  constructor() {
    super();
    this.d = new RadioGroupController();
    this.d.o = this.o.bind(this);
  }
  static {
    this.props = {
      offLabel: "Off"
    };
  }
  get value() {
    return this.d.value;
  }
  get disabled() {
    const { textTracks } = this.a.$state;
    return textTracks().filter(isTrackCaptionKind).length === 0;
  }
  onSetup() {
    this.a = useMediaContext();
    if (hasProvidedContext(menuContext)) {
      this.l = useContext(menuContext);
    }
  }
  onConnect(el) {
    super.onConnect?.(el);
    effect(this.D.bind(this));
    effect(this.ma.bind(this));
    effect(this.Oa.bind(this));
  }
  getOptions() {
    const { offLabel } = this.$props, { textTracks } = this.a.$state;
    return [
      { value: "off", label: offLabel },
      ...textTracks().filter(isTrackCaptionKind).map((track) => ({
        track,
        label: track.label,
        value: this.xk(track)
      }))
    ];
  }
  D() {
    this.d.value = this.na();
  }
  Oa() {
    const { offLabel } = this.$props, { textTrack } = this.a.$state, track = textTrack();
    this.l?.Wb.set(
      track && isTrackCaptionKind(track) && track.mode === "showing" ? track.label : offLabel()
    );
  }
  ma() {
    this.l?.Ma(this.disabled);
  }
  na() {
    const { textTrack } = this.a.$state, track = textTrack();
    return track && isTrackCaptionKind(track) && track.mode === "showing" ? this.xk(track) : "off";
  }
  o(value, trigger) {
    if (this.disabled)
      return;
    if (value === "off") {
      const track = this.a.textTracks.selected;
      if (track) {
        const index2 = this.a.textTracks.toArray().indexOf(track);
        this.a.remote.changeTextTrackMode(index2, "disabled", trigger);
        this.dispatch("change", { detail: null, trigger });
      }
      return;
    }
    const index = this.a.textTracks.toArray().findIndex((track) => this.xk(track) === value);
    if (index >= 0) {
      const track = this.a.textTracks[index];
      this.a.remote.changeTextTrackMode(index, "showing", trigger);
      this.dispatch("change", { detail: track, trigger });
    }
  }
  xk(track) {
    return track.id + ":" + track.kind + "-" + track.label.toLowerCase();
  }
}
__decorateClass$3([
  prop
], CaptionsRadioGroup.prototype, "value", 1);
__decorateClass$3([
  prop
], CaptionsRadioGroup.prototype, "disabled", 1);
__decorateClass$3([
  method
], CaptionsRadioGroup.prototype, "getOptions", 1);

var __defProp$2 = Object.defineProperty;
var __getOwnPropDesc$2 = Object.getOwnPropertyDescriptor;
var __decorateClass$2 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$2(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$2(target, key, result);
  return result;
};
class SpeedRadioGroup extends Component {
  constructor() {
    super();
    this.d = new RadioGroupController();
    this.d.o = this.o.bind(this);
  }
  static {
    this.props = {
      normalLabel: "Normal",
      rates: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]
    };
  }
  get value() {
    return this.d.value;
  }
  get disabled() {
    const { rates } = this.$props, { canSetPlaybackRate } = this.a.$state;
    return !canSetPlaybackRate() || rates().length === 0;
  }
  onSetup() {
    this.a = useMediaContext();
    if (hasProvidedContext(menuContext)) {
      this.l = useContext(menuContext);
    }
  }
  onConnect(el) {
    effect(this.D.bind(this));
    effect(this.Oa.bind(this));
    effect(this.ma.bind(this));
  }
  getOptions() {
    const { rates, normalLabel } = this.$props;
    return rates().map((rate) => ({
      label: rate === 1 ? normalLabel : rate + "\xD7",
      value: rate + ""
    }));
  }
  D() {
    this.d.value = this.na();
  }
  Oa() {
    const { normalLabel } = this.$props, { playbackRate } = this.a.$state, rate = playbackRate();
    this.l?.Wb.set(rate === 1 ? normalLabel() : rate + "\xD7");
  }
  ma() {
    this.l?.Ma(this.disabled);
  }
  na() {
    const { playbackRate } = this.a.$state;
    return playbackRate() + "";
  }
  o(value, trigger) {
    if (this.disabled)
      return;
    const rate = +value;
    this.a.remote.changePlaybackRate(rate, trigger);
    this.dispatch("change", { detail: rate, trigger });
  }
}
__decorateClass$2([
  prop
], SpeedRadioGroup.prototype, "value", 1);
__decorateClass$2([
  prop
], SpeedRadioGroup.prototype, "disabled", 1);
__decorateClass$2([
  method
], SpeedRadioGroup.prototype, "getOptions", 1);

var __defProp$1 = Object.defineProperty;
var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __decorateClass$1 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$1(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp$1(target, key, result);
  return result;
};
class QualityRadioGroup extends Component {
  constructor() {
    super();
    this.Dj = computed(() => {
      const { qualities } = this.a.$state;
      return [...qualities()].sort(
        (a, b) => b.height === a.height ? b.bitrate - a.bitrate : b.height - a.height
      );
    });
    this.d = new RadioGroupController();
    this.d.o = this.o.bind(this);
  }
  static {
    this.props = {
      autoLabel: "Auto",
      hideBitrate: false
    };
  }
  get value() {
    return this.d.value;
  }
  get disabled() {
    const { canSetQuality, qualities } = this.a.$state;
    return !canSetQuality() || qualities().length === 0;
  }
  onSetup() {
    this.a = useMediaContext();
    if (hasProvidedContext(menuContext)) {
      this.l = useContext(menuContext);
    }
  }
  onConnect(el) {
    effect(this.D.bind(this));
    effect(this.ma.bind(this));
    effect(this.Oa.bind(this));
  }
  getOptions() {
    const { autoLabel, hideBitrate } = this.$props;
    return [
      { value: "auto", label: autoLabel },
      ...this.Dj().map((quality) => {
        const rate = quality.bitrate >= 0 ? `${round(quality.bitrate / 1e6, 2)} Mbps` : null;
        return {
          quality,
          label: quality.height + "p",
          value: this.le(quality),
          bitrate: () => !hideBitrate() ? rate : null
        };
      })
    ];
  }
  D() {
    this.d.value = this.na();
  }
  Oa() {
    const { autoLabel } = this.$props, { autoQuality, quality } = this.a.$state, qualityText = quality() ? quality().height + "p" : "";
    this.l?.Wb.set(
      !autoQuality() ? qualityText : autoLabel() + (qualityText ? ` (${qualityText})` : "")
    );
  }
  ma() {
    this.l?.Ma(this.disabled);
  }
  o(value, trigger) {
    if (this.disabled)
      return;
    if (value === "auto") {
      this.a.remote.changeQuality(-1, trigger);
      this.dispatch("change", { detail: "auto", trigger });
      return;
    }
    const { qualities } = this.a.$state, index = peek(qualities).findIndex((quality) => this.le(quality) === value);
    if (index >= 0) {
      const quality = peek(qualities)[index];
      this.a.remote.changeQuality(index, trigger);
      this.dispatch("change", { detail: quality, trigger });
    }
  }
  na() {
    const { quality, autoQuality } = this.a.$state;
    if (autoQuality())
      return "auto";
    const currentQuality = quality();
    return currentQuality ? this.le(currentQuality) : "auto";
  }
  le(quality) {
    return quality.height + "_" + quality.bitrate;
  }
}
__decorateClass$1([
  prop
], QualityRadioGroup.prototype, "value", 1);
__decorateClass$1([
  prop
], QualityRadioGroup.prototype, "disabled", 1);
__decorateClass$1([
  method
], QualityRadioGroup.prototype, "getOptions", 1);

class Gesture extends Component {
  constructor() {
    super(...arguments);
    this.i = null;
    this.Pa = 0;
    this.Vf = -1;
  }
  static {
    this.props = {
      event: void 0,
      action: void 0
    };
  }
  onSetup() {
    this.a = useMediaContext();
    const { event, action } = this.$props;
    this.setAttributes({
      event,
      action
    });
  }
  onAttach(el) {
    el.setAttribute("data-media-gesture", "");
    el.style.setProperty("pointer-events", "none");
  }
  onConnect(el) {
    this.i = this.a.player.el?.querySelector(
      "[data-media-provider]"
    );
    effect(this.Ej.bind(this));
  }
  Ej() {
    let eventType = this.$props.event();
    if (!this.i || !eventType)
      return;
    if (/^dbl/.test(eventType)) {
      eventType = eventType.split(/^dbl/)[1];
    }
    if (eventType === "pointerup" || eventType === "pointerdown") {
      const pointer = this.a.$state.pointer();
      if (pointer === "coarse") {
        eventType = eventType === "pointerup" ? "touchend" : "touchstart";
      }
    }
    listenEvent(
      this.i,
      eventType,
      this.Fj.bind(this),
      { passive: false }
    );
  }
  Fj(event) {
    if (isPointerEvent(event) && (event.button !== 0 || this.a.activeMenu) || isTouchEvent(event) && this.a.activeMenu || isTouchPinchEvent(event) || !this.Gj(event)) {
      return;
    }
    event.MEDIA_GESTURE = true;
    event.preventDefault();
    const eventType = peek(this.$props.event), isDblEvent = eventType?.startsWith("dbl");
    if (!isDblEvent) {
      if (this.Pa === 0) {
        setTimeout(() => {
          if (this.Pa === 1)
            this.Wf(event);
        }, 250);
      }
    } else if (this.Pa === 1) {
      queueMicrotask(() => this.Wf(event));
      clearTimeout(this.Vf);
      this.Pa = 0;
      return;
    }
    if (this.Pa === 0) {
      this.Vf = window.setTimeout(() => {
        this.Pa = 0;
      }, 275);
    }
    this.Pa++;
  }
  Wf(event) {
    this.el.setAttribute("data-triggered", "");
    requestAnimationFrame(() => {
      if (this.Hj()) {
        this.Ij(peek(this.$props.action), event);
      }
      requestAnimationFrame(() => {
        this.el.removeAttribute("data-triggered");
      });
    });
  }
  /** Validate event occurred in gesture bounds. */
  Gj(event) {
    if (!this.el)
      return false;
    if (isPointerEvent(event) || isMouseEvent(event) || isTouchEvent(event)) {
      const touch = isTouchEvent(event) ? event.changedTouches[0] ?? event.touches[0] : void 0;
      const clientX = touch?.clientX ?? event.clientX;
      const clientY = touch?.clientY ?? event.clientY;
      const rect = this.el.getBoundingClientRect();
      const inBounds = clientY >= rect.top && clientY <= rect.bottom && clientX >= rect.left && clientX <= rect.right;
      return event.type.includes("leave") ? !inBounds : inBounds;
    }
    return true;
  }
  /** Validate gesture has the highest z-index in this triggered group. */
  Hj() {
    const gestures = this.a.player.el.querySelectorAll(
      "[data-media-gesture][data-triggered]"
    );
    return Array.from(gestures).sort(
      (a, b) => +getComputedStyle(b).zIndex - +getComputedStyle(a).zIndex
    )[0] === this.el;
  }
  Ij(action, trigger) {
    if (!action)
      return;
    const willTriggerEvent = new DOMEvent("will-trigger", {
      detail: action,
      cancelable: true,
      trigger
    });
    this.dispatchEvent(willTriggerEvent);
    if (willTriggerEvent.defaultPrevented)
      return;
    const [method, value] = action.replace(/:([a-z])/, "-$1").split(":");
    if (action.includes(":fullscreen")) {
      this.a.remote.toggleFullscreen("prefer-media", trigger);
    } else if (action.includes("seek:")) {
      this.a.remote.seek(peek(this.a.$state.currentTime) + (+value || 0), trigger);
    } else {
      this.a.remote[kebabToCamelCase(method)](trigger);
    }
    this.dispatch("trigger", {
      detail: action,
      trigger
    });
  }
}

class CaptionsTextRenderer {
  constructor(_renderer) {
    this.S = _renderer;
    this.priority = 10;
    this.z = null;
    this.sa = createDisposalBin();
  }
  attach() {
  }
  canRender() {
    return true;
  }
  detach() {
    this.sa.empty();
    this.S.reset();
    this.z = null;
  }
  changeTrack(track) {
    if (!track || this.z === track)
      return;
    this.sa.empty();
    if (track.readyState < 2) {
      this.S.reset();
      this.sa.add(
        listenEvent(track, "load", () => this.Xf(track), { once: true })
      );
    } else {
      this.Xf(track);
    }
    this.sa.add(
      listenEvent(track, "add-cue", (event) => {
        this.S.addCue(event.detail);
      }),
      listenEvent(track, "remove-cue", (event) => {
        this.S.removeCue(event.detail);
      })
    );
    this.z = track;
  }
  Xf(track) {
    this.S.changeTrack({
      cues: [...track.cues],
      regions: [...track.regions]
    });
  }
}

class Captions extends Component {
  static {
    this.props = {
      textDir: "ltr"
    };
  }
  onSetup() {
    this.a = useMediaContext();
    this.setAttributes({
      "aria-hidden": $ariaBool(this.lb.bind(this))
    });
  }
  onAttach(el) {
    el.style.setProperty("pointer-events", "none");
  }
  onConnect(el) {
    if (this.S) {
      effect(this.Yf.bind(this));
      return;
    }
    import('media-captions').then((lib) => {
      if (!this.connectScope)
        return;
      scoped(() => {
        this.W = lib;
        const { CaptionsRenderer } = this.W;
        this.S = new CaptionsRenderer(el);
        this.Qa = new CaptionsTextRenderer(this.S);
        effect(this.Yf.bind(this));
      }, this.connectScope);
    });
  }
  onDestroy() {
    if (this.Qa) {
      this.Qa.detach();
      this.a.textRenderers.remove(this.Qa);
    }
    this.S?.destroy();
  }
  lb() {
    const { textTrack } = this.a.$state, track = textTrack();
    return this.a.$iosControls() || !track || !isTrackCaptionKind(track);
  }
  Yf() {
    const { viewType } = this.a.$state;
    if (viewType() === "audio") {
      return this.Jj();
    } else {
      return this.Kj();
    }
  }
  Jj() {
    effect(this._d.bind(this));
    return () => {
      this.el.textContent = "";
    };
  }
  _d() {
    if (this.lb())
      return;
    const { textTrack } = this.a.$state;
    this.Zf();
    listenEvent(textTrack(), "cue-change", this.Zf.bind(this));
    effect(this.Lj.bind(this));
  }
  Zf() {
    this.el.textContent = "";
    const { currentTime, textTrack } = this.a.$state, time = peek(currentTime), activeCues = peek(textTrack).activeCues;
    const { renderVTTCueString } = this.W;
    for (const cue of activeCues) {
      const cueEl = document.createElement("div");
      cueEl.setAttribute("data-part", "cue");
      cueEl.innerHTML = renderVTTCueString(cue, time);
      this.el.append(cueEl);
    }
  }
  Lj() {
    const { currentTime } = this.a.$state, { updateTimedVTTCueNodes } = this.W;
    updateTimedVTTCueNodes(this.el, currentTime());
  }
  Kj() {
    effect(this.Mj.bind(this));
    effect(this.Nj.bind(this));
    this.a.textRenderers.add(this.Qa);
    return () => {
      this.el.textContent = "";
      this.Qa.detach();
      this.a.textRenderers.remove(this.Qa);
    };
  }
  Mj() {
    this.S.dir = this.$props.textDir();
  }
  Nj() {
    if (this.lb())
      return;
    const { currentTime } = this.a.$state;
    this.S.currentTime = currentTime();
  }
}

class Poster extends Component {
  static {
    this.props = {
      src: void 0,
      alt: void 0
    };
  }
  static {
    this.state = new State({
      img: null,
      src: null,
      alt: null,
      loading: true,
      error: null,
      hidden: false
    });
  }
  onSetup() {
    this.a = useMediaContext();
    this._f();
    this.$f();
    this.ob();
  }
  onAttach(el) {
    el.style.setProperty("pointer-events", "none");
    effect(this.Ud.bind(this));
    effect(this._f.bind(this));
    effect(this.$f.bind(this));
    effect(this.ob.bind(this));
    const { started } = this.a.$state;
    this.setAttributes({
      "data-visible": () => !started(),
      "data-loading": this.Rb.bind(this),
      "data-error": this.wa.bind(this),
      "data-hidden": this.$state.hidden
    });
  }
  onConnect(el) {
    const { canLoad, poster } = this.a.$state;
    window.requestAnimationFrame(() => {
      if (!canLoad())
        preconnect(poster());
    });
    effect(this.Ea.bind(this));
  }
  wa() {
    const { error } = this.$state;
    return !isNull(error());
  }
  ob() {
    const { src } = this.$props, { $iosControls } = this.a, { poster } = this.a.$state;
    this.el && setAttribute(this.el, "display", $iosControls() ? "none" : null);
    this.$state.hidden.set(this.wa() || !(src() || poster()) || $iosControls());
  }
  Rb() {
    const { loading, hidden } = this.$state;
    return !hidden() && loading();
  }
  Ud() {
    const img = this.$state.img();
    if (!img)
      return;
    listenEvent(img, "load", this.lc.bind(this));
    listenEvent(img, "error", this.U.bind(this));
  }
  _f() {
    const { canLoad, poster: defaultPoster } = this.a.$state;
    const src = this.$props.src(), poster = src || defaultPoster();
    if (src && defaultPoster() !== src) {
      this.a.$state.providedPoster.set(src);
    }
    this.$state.src.set(canLoad() && poster.length ? poster : null);
  }
  $f() {
    const { src, alt } = this.$state;
    alt.set(src() ? this.$props.alt() : null);
  }
  Ea() {
    const { loading, error } = this.$state, { canLoad, poster } = this.a.$state;
    loading.set(canLoad() && !!poster());
    error.set(null);
  }
  lc() {
    const { loading, error } = this.$state;
    loading.set(false);
    error.set(null);
  }
  U(event) {
    const { loading, error } = this.$state;
    loading.set(false);
    error.set(event);
  }
}

class Time extends Component {
  static {
    this.props = {
      type: "current",
      showHours: false,
      padHours: null,
      padMinutes: null,
      remainder: false
    };
  }
  static {
    this.state = new State({
      timeText: ""
    });
  }
  onSetup() {
    this.a = useMediaContext();
    this.ag();
    const { type, remainder } = this.$props;
    this.setAttributes({
      "data-type": type,
      "data-remainder": remainder
    });
  }
  onAttach(el) {
    effect(this.ag.bind(this));
  }
  ag() {
    const { type, remainder, padHours, padMinutes, showHours } = this.$props, seconds = this.Oj(type()), duration = this.a.$state.duration();
    if (!Number.isFinite(seconds + duration)) {
      this.$state.timeText.set("LIVE");
      return;
    }
    const time = remainder() ? Math.max(0, duration - seconds) : seconds, formattedTime = formatTime(time, padHours(), padMinutes(), showHours());
    this.$state.timeText.set(formattedTime);
  }
  Oj(type) {
    const { bufferedEnd, duration, currentTime } = this.a.$state;
    switch (type) {
      case "buffered":
        return bufferedEnd();
      case "duration":
        return duration();
      default:
        return currentTime();
    }
  }
}

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};
class DefaultLayout extends Component {
  constructor() {
    super(...arguments);
    this.menuContainer = null;
  }
  static {
    this.props = {
      when: "",
      smallWhen: "",
      thumbnails: "",
      customIcons: false,
      translations: null,
      menuGroup: "bottom",
      noModal: false
    };
  }
  get isMatch() {
    return this.me.matches;
  }
  get isSmallLayout() {
    return this.Lc.matches;
  }
  onSetup() {
    const { when, smallWhen, thumbnails, translations, menuGroup, noModal } = this.$props;
    this.me = PlayerQueryList.create(when);
    this.Lc = PlayerQueryList.create(smallWhen);
    this.setAttributes({
      "data-match": this.me.$matches,
      "data-size": () => this.Lc.matches ? "sm" : null
    });
    const self = this;
    provideContext(defaultLayoutContext, {
      smQueryList: this.Lc,
      thumbnails,
      translations,
      menuGroup,
      noModal,
      get menuContainer() {
        return self.menuContainer;
      }
    });
  }
}
__decorateClass([
  prop
], DefaultLayout.prototype, "menuContainer", 2);
__decorateClass([
  prop
], DefaultLayout.prototype, "isMatch", 1);
__decorateClass([
  prop
], DefaultLayout.prototype, "isSmallLayout", 1);
class DefaultAudioLayout extends DefaultLayout {
  static {
    this.props = {
      ...super.props,
      when: "(view-type: audio)",
      smallWhen: "(width < 576)"
    };
  }
}
class DefaultVideoLayout extends DefaultLayout {
  static {
    this.props = {
      ...super.props,
      when: "(view-type: video)",
      smallWhen: "(width < 576) or (height < 380)"
    };
  }
}
function getDefaultLayoutLang(translations, word) {
  return translations()?.[word] ?? word;
}
const defaultLayoutContext = createContext();
function useDefaultLayoutContext() {
  return useContext(defaultLayoutContext);
}

export { SliderPreview as $, ARIAKeyShortcuts as A, DefaultLayout as B, defaultLayoutContext as C, DefaultAudioLayout as D, getDefaultLayoutLang as E, FullscreenController as F, Controls as G, HLSProviderLoader as H, Tooltip as I, TooltipContent as J, ToggleButton as K, CaptionButton as L, MediaProvider as M, FullscreenButton as N, MuteButton as O, PlayButton as P, PIPButton as Q, SeekButton as R, Slider as S, Thumbnail as T, LiveButton as U, VideoQualityList as V, sliderState as W, SliderController as X, YouTubeProviderLoader as Y, SliderVideo as Z, SliderValue as _, MediaPlayer as a, updateSliderPreviewPlacement as a0, VolumeSlider as a1, TimeSlider as a2, SliderChapters as a3, Menu as a4, MenuButton as a5, MenuPortal as a6, menuPortalContext as a7, MenuItems as a8, RadioGroup as a9, Radio as aa, ChaptersRadioGroup as ab, AudioRadioGroup as ac, CaptionsRadioGroup as ad, SpeedRadioGroup as ae, QualityRadioGroup as af, Gesture as ag, Captions as ah, Poster as ai, Time as aj, ThumbnailsLoader as ak, FocusVisibleController as al, tooltipContext as am, DefaultVideoLayout as b, formatSpokenTime as c, canFullscreen as d, ScreenOrientationController as e, formatTime as f, MediaRemoteControl as g, MediaControls as h, MEDIA_KEY_SHORTCUTS as i, TextRenderers as j, TextTrackList as k, AudioTrackList as l, AudioProviderLoader as m, VideoProviderLoader as n, VimeoProviderLoader as o, isAudioProvider as p, isVideoProvider as q, isHLSProvider as r, isYouTubeProvider as s, isVimeoProvider as t, useDefaultLayoutContext as u, isHTMLAudioElement as v, isHTMLVideoElement as w, isHTMLMediaElement as x, isHTMLIFrameElement as y, sliderContext as z };
