import { G as GroupedLog } from './chunks/vidstack-8n__KtFR.js';
export { L as List, P as PlayerQueryList, T as TimeRange, b as getTimeRangesEnd, g as getTimeRangesStart, m as mediaContext, a as mediaState, s as softResetMediaState } from './chunks/vidstack-8n__KtFR.js';
import { D as DOMEvent, r as isString, l as listenEvent, z as useState } from './chunks/vidstack-s5pw8Cb6.js';
export { E as appendTriggerEvent, C as findTriggerEvent, A as hasTriggerEvent, b as isKeyboardClick, G as isKeyboardEvent, F as isPointerEvent, B as walkTriggerEventChain } from './chunks/vidstack-s5pw8Cb6.js';
import { T as Thumbnail, S as Slider } from './chunks/vidstack-sKeoTFgw.js';
export { A as ARIAKeyShortcuts, m as AudioProviderLoader, ac as AudioRadioGroup, l as AudioTrackList, L as CaptionButton, ah as Captions, ad as CaptionsRadioGroup, ab as ChaptersRadioGroup, G as Controls, D as DefaultAudioLayout, B as DefaultLayout, b as DefaultVideoLayout, N as FullscreenButton, F as FullscreenController, ag as Gesture, H as HLSProviderLoader, U as LiveButton, i as MEDIA_KEY_SHORTCUTS, h as MediaControls, a as MediaPlayer, M as MediaProvider, g as MediaRemoteControl, a4 as Menu, a5 as MenuButton, a8 as MenuItems, a6 as MenuPortal, O as MuteButton, Q as PIPButton, P as PlayButton, ai as Poster, af as QualityRadioGroup, aa as Radio, a9 as RadioGroup, e as ScreenOrientationController, R as SeekButton, a3 as SliderChapters, X as SliderController, $ as SliderPreview, _ as SliderValue, Z as SliderVideo, ae as SpeedRadioGroup, j as TextRenderers, k as TextTrackList, ak as ThumbnailsLoader, aj as Time, a2 as TimeSlider, K as ToggleButton, I as Tooltip, J as TooltipContent, n as VideoProviderLoader, V as VideoQualityList, o as VimeoProviderLoader, a1 as VolumeSlider, Y as YouTubeProviderLoader, d as canFullscreen, C as defaultLayoutContext, c as formatSpokenTime, f as formatTime, E as getDefaultLayoutLang, p as isAudioProvider, r as isHLSProvider, v as isHTMLAudioElement, y as isHTMLIFrameElement, x as isHTMLMediaElement, w as isHTMLVideoElement, q as isVideoProvider, t as isVimeoProvider, s as isYouTubeProvider, a7 as menuPortalContext, z as sliderContext, W as sliderState, a0 as updateSliderPreviewPlacement, u as useDefaultLayoutContext } from './chunks/vidstack-sKeoTFgw.js';
import { T as TextTrackSymbol } from './chunks/vidstack-UV9ceSS6.js';
export { b as TextTrack, f as findActiveCue, d as isCueActive, i as isTrackCaptionKind, o as observeActiveTextTrack, c as parseJSONCaptionsFile } from './chunks/vidstack-UV9ceSS6.js';
export { C as ControlsGroup, M as MenuItem, T as TooltipTrigger } from './chunks/vidstack-avCqGz8r.js';
export { c as canChangeVolume, a as canOrientScreen, b as canPlayHLSNatively, f as canRotateScreen, d as canUsePictureInPicture, e as canUseVideoPresentation } from './chunks/vidstack-XmoYV57V.js';
import './chunks/vidstack-PYaZQCX6.js';
import './chunks/vidstack-yqTzryo_.js';
import './chunks/vidstack-XcK8ubY-.js';

class Logger {
  constructor() {
    this.A = null;
  }
  error(...data) {
    return this.dispatch("error", ...data);
  }
  warn(...data) {
    return this.dispatch("warn", ...data);
  }
  info(...data) {
    return this.dispatch("info", ...data);
  }
  debug(...data) {
    return this.dispatch("debug", ...data);
  }
  errorGroup(title) {
    return new GroupedLog(this, "error", title);
  }
  warnGroup(title) {
    return new GroupedLog(this, "warn", title);
  }
  infoGroup(title) {
    return new GroupedLog(this, "info", title);
  }
  debugGroup(title) {
    return new GroupedLog(this, "debug", title);
  }
  setTarget(newTarget) {
    this.A = newTarget;
  }
  dispatch(level, ...data) {
    return this.A?.dispatchEvent(
      new DOMEvent("vds-log", {
        bubbles: true,
        composed: true,
        detail: { level, data }
      })
    ) || false;
  }
}

class LibASSTextRenderer {
  constructor(loader, config) {
    this.loader = loader;
    this.config = config;
    this.priority = 1;
    this.g = null;
    this.z = null;
    this.He = /(ssa|ass)$/;
  }
  canRender(track, video) {
    return !!video && !!track.src && (isString(track.type) && this.He.test(track.type) || this.He.test(track.src));
  }
  attach(video) {
    if (!video)
      return;
    this.loader().then(async (mod) => {
      this.g = new mod.default({
        ...this.config,
        video,
        subUrl: this.z?.src || ""
      });
      listenEvent(this.g, "ready", () => {
        const canvas = this.g?.Pj;
        if (canvas)
          canvas.style.pointerEvents = "none";
      });
      listenEvent(this.g, "error", (event) => {
        if (this.z) {
          this.z[TextTrackSymbol.M] = 3;
          this.z.dispatchEvent(
            new DOMEvent("error", {
              trigger: event,
              detail: event.error
            })
          );
        }
      });
    });
  }
  changeTrack(track) {
    if (!track || track.readyState === 3) {
      this.Ie();
    } else if (this.z !== track) {
      this.g?.setTrackByUrl(track.src);
      this.z = track;
    }
  }
  detach() {
    this.Ie();
  }
  Ie() {
    this.g?.freeTrack();
    this.z = null;
  }
}

class SliderThumbnail extends Thumbnail {
  onAttach(el) {
    this.Q = useState(Slider.state);
  }
  Gf() {
    const { duration } = this.a.$state;
    return this.Q.pointerRate() * duration();
  }
}

export { LibASSTextRenderer, Logger, Slider, SliderThumbnail, Thumbnail };
