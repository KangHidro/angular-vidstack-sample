import { H as Host, e as effect, k as setAttribute, m as signal, n as computed, I as Component, l as listenEvent, r as isString, z as useState, W as BOOLEAN } from './vidstack-s5pw8Cb6.js';
import { ah as Captions, ag as Gesture, ai as Poster, T as Thumbnail, aj as Time, G as Controls, P as PlayButton, O as MuteButton, L as CaptionButton, N as FullscreenButton, Q as PIPButton, R as SeekButton, K as ToggleButton, U as LiveButton, I as Tooltip, J as TooltipContent, ac as AudioRadioGroup, ad as CaptionsRadioGroup, a4 as Menu, a5 as MenuButton, a6 as MenuPortal, a8 as MenuItems, ab as ChaptersRadioGroup, ae as SpeedRadioGroup, af as QualityRadioGroup, aa as Radio, a9 as RadioGroup, S as Slider, _ as SliderValue, Z as SliderVideo, a2 as TimeSlider, $ as SliderPreview, a1 as VolumeSlider, a3 as SliderChapters } from './vidstack-sKeoTFgw.js';
import { o as observeActiveTextTrack } from './vidstack-UV9ceSS6.js';
import { u as useMediaContext, P as PlayerQueryList } from './vidstack-8n__KtFR.js';
import { C as ControlsGroup, T as TooltipTrigger, M as MenuItem } from './vidstack-avCqGz8r.js';
import { x } from './vidstack-aTKyk4ef.js';
import { c as cloneTemplateContent, a as createTemplate, r as requestScopedAnimationFrame, b as cloneTemplate } from './vidstack-PYaZQCX6.js';
import { L as LitElement } from './vidstack-jSFcERHu.js';

class MediaCaptionsElement extends Host(HTMLElement, Captions) {
  static {
    this.tagName = "media-captions";
  }
}

class MediaGestureElement extends Host(HTMLElement, Gesture) {
  static {
    this.tagName = "media-gesture";
  }
}

class MediaPosterElement extends Host(HTMLElement, Poster) {
  constructor() {
    super(...arguments);
    this.Uj = document.createElement("img");
  }
  static {
    this.tagName = "media-poster";
  }
  onSetup() {
    this.a = useMediaContext();
    this.$state.img.set(this.Uj);
  }
  onConnect() {
    const { src, alt } = this.$state, { crossorigin } = this.a.$state;
    if (this.Uj.parentNode !== this) {
      this.prepend(this.Uj);
    }
    effect(() => {
      setAttribute(this.Uj, "src", src());
      setAttribute(this.Uj, "alt", alt());
      setAttribute(
        this.Uj,
        "crossorigin",
        /ytimg\.com|vimeo/.test(src() || "") ? null : crossorigin()
      );
    });
  }
}

const imgTemplate = /* @__PURE__ */ createTemplate(
  '<img loading="eager" decoding="async" aria-hidden="true">'
);
class MediaThumbnailElement extends Host(HTMLElement, Thumbnail) {
  constructor() {
    super(...arguments);
    this.Uj = this.gk();
  }
  static {
    this.tagName = "media-thumbnail";
  }
  onSetup() {
    this.a = useMediaContext();
    this.$state.img.set(this.Uj);
  }
  onConnect() {
    const { src } = this.$state, { crossorigin } = this.a.$props;
    if (this.Uj.parentNode !== this) {
      this.prepend(this.Uj);
    }
    effect(() => {
      setAttribute(this.Uj, "src", src());
      setAttribute(this.Uj, "crossorigin", crossorigin());
    });
  }
  gk() {
    return cloneTemplateContent(imgTemplate);
  }
}

class MediaTimeElement extends Host(HTMLElement, Time) {
  static {
    this.tagName = "media-time";
  }
  onConnect() {
    effect(() => {
      this.textContent = this.$state.timeText();
    });
  }
}

class MediaControlsElement extends Host(HTMLElement, Controls) {
  static {
    this.tagName = "media-controls";
  }
}

class MediaControlsGroupElement extends Host(HTMLElement, ControlsGroup) {
  static {
    this.tagName = "media-controls-group";
  }
}

class ChapterTitle extends Component {
}
class MediaChapterTitleElement extends Host(HTMLElement, ChapterTitle) {
  static {
    this.tagName = "media-chapter-title";
  }
  onSetup() {
    this.a = useMediaContext();
    this.Xj = signal("");
    this.ak = computed(this.hk.bind(this));
  }
  onConnect() {
    observeActiveTextTrack(this.a.textTracks, "chapters", (track) => {
      if (!track) {
        this.Xj.set("");
        return;
      }
      const onCueChange = () => {
        const activeCue = track?.activeCues[0];
        this.Xj.set(activeCue?.text || "");
      };
      onCueChange();
      listenEvent(track, "cue-change", onCueChange);
    });
    effect(() => {
      this.textContent = this.ak();
    });
  }
  hk() {
    const { title, started } = this.a.$state;
    const mainTitle = title(), chapterTitle = this.Xj();
    return started() ? chapterTitle || mainTitle : mainTitle || chapterTitle;
  }
}

class Spinner extends Component {
  static {
    this.props = {
      size: 96,
      trackWidth: 8,
      fillPercent: 50
    };
  }
  onConnect(el) {
    requestScopedAnimationFrame(() => {
      if (!this.connectScope)
        return;
      const root = el.querySelector("svg"), track = root.firstElementChild, trackFill = track.nextElementSibling;
      effect(this.ea.bind(this, root, track, trackFill));
    });
  }
  ea(root, track, trackFill) {
    const { size, trackWidth, fillPercent } = this.$props;
    setAttribute(root, "width", size());
    setAttribute(root, "height", size());
    setAttribute(track, "stroke-width", trackWidth());
    setAttribute(trackFill, "stroke-width", trackWidth());
    setAttribute(trackFill, "stroke-dashoffset", 100 - fillPercent());
  }
}
class MediaSpinnerElement extends Host(LitElement, Spinner) {
  static {
    this.tagName = "media-spinner";
  }
  render() {
    return x`
      <svg fill="none" viewBox="0 0 120 120" aria-hidden="true" data-part="root">
        <circle cx="60" cy="60" r="54" stroke="currentColor" data-part="track"></circle>
        <circle
          cx="60"
          cy="60"
          r="54"
          stroke="currentColor"
          pathLength="100"
          stroke-dasharray="100"
          data-part="track-fill"
        ></circle>
      </svg>
    `;
  }
}

class MediaLayout extends Component {
  static {
    this.props = {
      when: ""
    };
  }
}
class MediaLayoutElement extends Host(HTMLElement, MediaLayout) {
  static {
    this.tagName = "media-layout";
  }
  onSetup() {
    this.query = PlayerQueryList.create(this.$props.when);
  }
  onConnect() {
    effect(this.jg.bind(this));
  }
  jg() {
    const root = this.firstElementChild, isTemplate = root?.localName === "template", isHTMLElement = root instanceof HTMLElement;
    if (!this.query.matches) {
      if (isTemplate) {
        this.textContent = "";
        this.appendChild(root);
      } else if (isHTMLElement) {
        root.style.display = "none";
      }
      return;
    }
    if (isTemplate) {
      this.append(root.content.cloneNode(true));
    } else if (isHTMLElement) {
      root.style.display = "";
    }
  }
}

class MediaPlayButtonElement extends Host(HTMLElement, PlayButton) {
  static {
    this.tagName = "media-play-button";
  }
}

class MediaMuteButtonElement extends Host(HTMLElement, MuteButton) {
  static {
    this.tagName = "media-mute-button";
  }
}

class MediaCaptionButtonElement extends Host(HTMLElement, CaptionButton) {
  static {
    this.tagName = "media-caption-button";
  }
}

class MediaFullscreenButtonElement extends Host(HTMLElement, FullscreenButton) {
  static {
    this.tagName = "media-fullscreen-button";
  }
}

class MediaPIPButtonElement extends Host(HTMLElement, PIPButton) {
  static {
    this.tagName = "media-pip-button";
  }
}

class MediaSeekButtonElement extends Host(HTMLElement, SeekButton) {
  static {
    this.tagName = "media-seek-button";
  }
}

class MediaToggleButtonElement extends Host(HTMLElement, ToggleButton) {
  static {
    this.tagName = "media-toggle-button";
  }
}

class MediaLiveButtonElement extends Host(HTMLElement, LiveButton) {
  static {
    this.tagName = "media-live-button";
  }
}

class MediaTooltipElement extends Host(HTMLElement, Tooltip) {
  static {
    this.tagName = "media-tooltip";
  }
}

class MediaTooltipTriggerElement extends Host(HTMLElement, TooltipTrigger) {
  static {
    this.tagName = "media-tooltip-trigger";
  }
  onConnect() {
    this.style.display = "contents";
  }
}

class MediaTooltipContentElement extends Host(HTMLElement, TooltipContent) {
  static {
    this.tagName = "media-tooltip-content";
  }
}

function renderMenuItemsTemplate(el, onCreate) {
  requestScopedAnimationFrame(() => {
    if (!el.connectScope)
      return;
    const template = el.querySelector("template");
    if (!template)
      return;
    effect(() => {
      const options = el.getOptions();
      cloneTemplate(template, options.length, (radio, i) => {
        const { label, value } = options[i], labelEl = radio.querySelector(`[data-part="label"]`);
        radio.setAttribute("value", value);
        if (labelEl) {
          if (isString(label)) {
            labelEl.textContent = label;
          } else {
            effect(() => {
              labelEl.textContent = label();
            });
          }
        }
        onCreate?.(radio, options[i], i);
      });
    });
  });
}

class MediaAudioRadioGroupElement extends Host(HTMLElement, AudioRadioGroup) {
  static {
    this.tagName = "media-audio-radio-group";
  }
  onConnect() {
    renderMenuItemsTemplate(this);
  }
}

class MediaCaptionsRadioGroupElement extends Host(HTMLElement, CaptionsRadioGroup) {
  static {
    this.tagName = "media-captions-radio-group";
  }
  onConnect() {
    renderMenuItemsTemplate(this);
  }
}

class MediaMenuElement extends Host(HTMLElement, Menu) {
  static {
    this.tagName = "media-menu";
  }
}

class MediaMenuButtonElement extends Host(HTMLElement, MenuButton) {
  static {
    this.tagName = "media-menu-button";
  }
}

class MediaMenuPortalElement extends Host(HTMLElement, MenuPortal) {
  static {
    this.tagName = "media-menu-portal";
  }
  static {
    this.attrs = {
      disabled: {
        converter(value) {
          if (isString(value))
            return value;
          return value !== null;
        }
      }
    };
  }
}

class MediaMenuItemElement extends Host(HTMLElement, MenuItem) {
  static {
    this.tagName = "media-menu-item";
  }
}

class MediaMenuItemsElement extends Host(HTMLElement, MenuItems) {
  static {
    this.tagName = "media-menu-items";
  }
}

class MediaChaptersRadioGroupElement extends Host(HTMLElement, ChaptersRadioGroup) {
  static {
    this.tagName = "media-chapters-radio-group";
  }
  onConnect() {
    renderMenuItemsTemplate(this, (el, option) => {
      const { cue, startTime, duration } = option, thumbnailEl = el.querySelector(".vds-thumbnail,media-thumbnail"), startEl = el.querySelector('[data-part="start-time"]'), durationEl = el.querySelector('[data-part="duration"]');
      if (startEl)
        startEl.textContent = startTime;
      if (durationEl)
        durationEl.textContent = duration;
      if (thumbnailEl) {
        thumbnailEl.setAttribute("time", cue.startTime + "");
        effect(() => {
          const { thumbnails } = this.$props;
          thumbnailEl.setAttribute("src", thumbnails());
        });
      }
    });
  }
}

class MediaSpeedRadioGroupElement extends Host(HTMLElement, SpeedRadioGroup) {
  static {
    this.tagName = "media-speed-radio-group";
  }
  onConnect() {
    renderMenuItemsTemplate(this);
  }
}

class MediaQualityRadioGroupElement extends Host(HTMLElement, QualityRadioGroup) {
  static {
    this.tagName = "media-quality-radio-group";
  }
  onConnect() {
    renderMenuItemsTemplate(this, (el, option) => {
      const bitrate = option.bitrate, bitrateEl = el.querySelector('[data-part="bitrate"]');
      if (bitrate && bitrateEl) {
        effect(() => {
          bitrateEl.textContent = bitrate() || "";
        });
      }
    });
  }
}

class MediaRadioElement extends Host(HTMLElement, Radio) {
  static {
    this.tagName = "media-radio";
  }
}

class MediaRadioGroupElement extends Host(HTMLElement, RadioGroup) {
  static {
    this.tagName = "media-radio-group";
  }
}

class MediaSliderElement extends Host(HTMLElement, Slider) {
  static {
    this.tagName = "media-slider";
  }
}

class MediaSliderThumbnailElement extends MediaThumbnailElement {
  static {
    this.tagName = "media-slider-thumbnail";
  }
  onSetup() {
    super.onSetup();
    this.Q = useState(Slider.state);
  }
  onConnect() {
    super.onConnect();
    effect(this.ag.bind(this));
  }
  ag() {
    const { duration } = this.a.$state;
    this.time = this.Q.pointerRate() * duration();
  }
}

class MediaSliderValueElement extends Host(HTMLElement, SliderValue) {
  static {
    this.tagName = "media-slider-value";
  }
  static {
    this.attrs = {
      padMinutes: {
        converter: BOOLEAN
      }
    };
  }
  onConnect() {
    effect(() => {
      this.textContent = this.getValueText();
    });
  }
}

const videoTemplate = /* @__PURE__ */ createTemplate(
  `<video muted playsinline preload="none" style="max-width: unset;"></video>`
);
class MediaSliderVideoElement extends Host(HTMLElement, SliderVideo) {
  constructor() {
    super(...arguments);
    this.m = this.Yj();
  }
  static {
    this.tagName = "media-slider-video";
  }
  onSetup() {
    this.a = useMediaContext();
    this.$state.video.set(this.m);
  }
  onConnect() {
    const { crossorigin, canLoad } = this.a.$state, { src } = this.$state;
    if (this.m.parentNode !== this) {
      this.prepend(this.m);
    }
    effect(() => {
      setAttribute(this.m, "src", src());
      setAttribute(this.m, "crossorigin", crossorigin());
      setAttribute(this.m, "preload", canLoad() ? "auto" : "none");
    });
  }
  Yj() {
    return cloneTemplateContent(videoTemplate);
  }
}

class MediaTimeSliderElement extends Host(HTMLElement, TimeSlider) {
  static {
    this.tagName = "media-time-slider";
  }
}

class MediaSliderPreviewElement extends Host(HTMLElement, SliderPreview) {
  static {
    this.tagName = "media-slider-preview";
  }
}

class MediaVolumeSliderElement extends Host(HTMLElement, VolumeSlider) {
  static {
    this.tagName = "media-volume-slider";
  }
}

class MediaSliderChaptersElement extends Host(HTMLElement, SliderChapters) {
  constructor() {
    super(...arguments);
    this.$j = null;
  }
  static {
    this.tagName = "media-slider-chapters";
  }
  onConnect() {
    requestScopedAnimationFrame(() => {
      if (!this.connectScope)
        return;
      const template = this.querySelector("template");
      if (template) {
        this.$j = template;
        effect(this.jk.bind(this));
      }
    });
  }
  jk() {
    if (!this.$j)
      return;
    const elements = cloneTemplate(this.$j, this.cues.length || 1);
    this.setRefs(elements);
  }
}

export { MediaMenuItemsElement as A, MediaChaptersRadioGroupElement as B, MediaSpeedRadioGroupElement as C, MediaQualityRadioGroupElement as D, MediaRadioElement as E, MediaRadioGroupElement as F, MediaSliderElement as G, MediaSliderThumbnailElement as H, MediaSliderValueElement as I, MediaSliderVideoElement as J, MediaTimeSliderElement as K, MediaSliderPreviewElement as L, MediaCaptionsElement as M, MediaVolumeSliderElement as N, MediaSliderChaptersElement as O, MediaGestureElement as a, MediaPosterElement as b, MediaThumbnailElement as c, MediaTimeElement as d, MediaControlsElement as e, MediaControlsGroupElement as f, MediaChapterTitleElement as g, MediaSpinnerElement as h, MediaLayoutElement as i, MediaPlayButtonElement as j, MediaMuteButtonElement as k, MediaCaptionButtonElement as l, MediaFullscreenButtonElement as m, MediaPIPButtonElement as n, MediaSeekButtonElement as o, MediaToggleButtonElement as p, MediaLiveButtonElement as q, MediaTooltipElement as r, MediaTooltipTriggerElement as s, MediaTooltipContentElement as t, MediaAudioRadioGroupElement as u, MediaCaptionsRadioGroupElement as v, MediaMenuElement as w, MediaMenuButtonElement as x, MediaMenuPortalElement as y, MediaMenuItemElement as z };
