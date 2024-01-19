import { T as Thumbnail, S as Slider } from './chunks/vidstack-2JOJlpjE.js';
export { A as ARIAKeyShortcuts, m as AudioProviderLoader, ad as AudioRadioGroup, l as AudioTrackList, N as CaptionButton, ai as Captions, ae as CaptionsRadioGroup, ac as ChaptersRadioGroup, G as Controls, D as DefaultAudioLayout, B as DefaultLayout, b as DefaultVideoLayout, O as FullscreenButton, F as FullscreenController, ah as Gesture, H as HLSProviderLoader, W as LiveButton, L as Logger, i as MEDIA_KEY_SHORTCUTS, h as MediaControls, a as MediaPlayer, M as MediaProvider, g as MediaRemoteControl, a5 as Menu, a6 as MenuButton, a9 as MenuItems, a7 as MenuPortal, Q as MuteButton, R as PIPButton, P as PlayButton, aj as Poster, ag as QualityRadioGroup, ab as Radio, aa as RadioGroup, e as ScreenOrientationController, U as SeekButton, a4 as SliderChapters, Z as SliderController, a0 as SliderPreview, $ as SliderValue, _ as SliderVideo, af as SpeedRadioGroup, j as TextRenderers, k as TextTrackList, al as ThumbnailsLoader, ak as Time, a3 as TimeSlider, K as ToggleButton, I as Tooltip, J as TooltipContent, n as VideoProviderLoader, V as VideoQualityList, o as VimeoProviderLoader, a2 as VolumeSlider, Y as YouTubeProviderLoader, d as canFullscreen, C as defaultLayoutContext, c as formatSpokenTime, f as formatTime, E as getDefaultLayoutLang, p as isAudioProvider, r as isHLSProvider, v as isHTMLAudioElement, y as isHTMLIFrameElement, x as isHTMLMediaElement, w as isHTMLVideoElement, q as isVideoProvider, t as isVimeoProvider, s as isYouTubeProvider, a8 as menuPortalContext, z as sliderContext, X as sliderState, a1 as updateSliderPreviewPlacement, u as useDefaultLayoutContext } from './chunks/vidstack-2JOJlpjE.js';
export { L as List, P as PlayerQueryList, T as TimeRange, b as getTimeRangesEnd, g as getTimeRangesStart, m as mediaContext, a as mediaState, s as softResetMediaState } from './chunks/vidstack-DTSGQ87h.js';
import { T as TextTrackSymbol } from './chunks/vidstack-Yx-0ZQdX.js';
export { b as TextTrack, f as findActiveCue, d as isCueActive, i as isTrackCaptionKind, o as observeActiveTextTrack, c as parseJSONCaptionsFile } from './chunks/vidstack-Yx-0ZQdX.js';
import { r as isString, l as listenEvent, D as DOMEvent, z as useState } from './chunks/vidstack-KTx0QncX.js';
export { E as appendTriggerEvent, C as findTriggerEvent, A as hasTriggerEvent, b as isKeyboardClick, G as isKeyboardEvent, F as isPointerEvent, B as walkTriggerEventChain } from './chunks/vidstack-KTx0QncX.js';
export { C as ControlsGroup, M as MenuItem, T as TooltipTrigger } from './chunks/vidstack-OD2a9fal.js';
export { c as canChangeVolume, a as canOrientScreen, b as canPlayHLSNatively, f as canRotateScreen, d as canUsePictureInPicture, e as canUseVideoPresentation } from './chunks/vidstack-S5-ZnP-2.js';
import './chunks/vidstack-PDESAD8i.js';
import './chunks/vidstack-wDXs-Qf-.js';
import './chunks/vidstack-ZF6S2MdD.js';

class LibASSTextRenderer {
  constructor(loader, config) {
    this.loader = loader;
    this.config = config;
    this.priority = 1;
    this._instance = null;
    this._track = null;
    this._typeRE = /(ssa|ass)$/;
  }
  canRender(track, video) {
    return !!video && !!track.src && (isString(track.type) && this._typeRE.test(track.type) || this._typeRE.test(track.src));
  }
  attach(video) {
    if (!video)
      return;
    this.loader().then(async (mod) => {
      this._instance = new mod.default({
        ...this.config,
        video,
        subUrl: this._track?.src || ""
      });
      listenEvent(this._instance, "ready", () => {
        const canvas = this._instance?._canvas;
        if (canvas)
          canvas.style.pointerEvents = "none";
      });
      listenEvent(this._instance, "error", (event) => {
        if (this._track) {
          this._track[TextTrackSymbol._readyState] = 3;
          this._track.dispatchEvent(
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
      this._freeTrack();
    } else if (this._track !== track) {
      this._instance?.setTrackByUrl(track.src);
      this._track = track;
    }
  }
  detach() {
    this._freeTrack();
  }
  _freeTrack() {
    this._instance?.freeTrack();
    this._track = null;
  }
}

class SliderThumbnail extends Thumbnail {
  onAttach(el) {
    this._slider = useState(Slider.state);
  }
  _getTime() {
    const { duration } = this._media.$state;
    return this._slider.pointerRate() * duration();
  }
}

{
  console.warn("[vidstack]: dev mode!");
}

export { LibASSTextRenderer, Slider, SliderThumbnail, Thumbnail };
