import { H as Host, e as effect, k as setAttribute, n as computed } from './vidstack-KTx0QncX.js';
import { M as MediaProvider, a as MediaPlayer } from './vidstack-2JOJlpjE.js';
import { u as useMediaContext } from './vidstack-DTSGQ87h.js';
import './vidstack-Yx-0ZQdX.js';

class MediaProviderElement extends Host(HTMLElement, MediaProvider) {
  constructor() {
    super(...arguments);
    this._target = null;
    this._blocker = null;
  }
  static {
    this.tagName = "media-provider";
  }
  onSetup() {
    this._media = useMediaContext();
    this.setAttribute("keep-alive", "");
  }
  onDestroy() {
    this._blocker?.remove();
    this._blocker = null;
    this._target?.remove();
    this._target = null;
  }
  onConnect() {
    effect(() => {
      const loader = this.$state.loader(), isYouTubeEmbed = loader?.canPlay({ src: "", type: "video/youtube" }), isVimeoEmbed = loader?.canPlay({ src: "", type: "video/vimeo" }), isEmbed = isYouTubeEmbed || isVimeoEmbed;
      const target = loader ? isEmbed ? this._createIFrame() : loader.mediaType() === "audio" ? this._createAudio() : this._createVideo() : null;
      if (this._target !== target) {
        const parent = this._target?.parentElement ?? this;
        this._target?.remove();
        this._target = target;
        if (target)
          parent.prepend(target);
        if (isEmbed && target) {
          effect(() => {
            const { $iosControls } = this._media, { controls } = this._media.$state, showControls = controls() || $iosControls();
            if (showControls) {
              this._blocker?.remove();
              this._blocker = null;
            } else {
              this._blocker = this.querySelector(".vds-blocker") ?? document.createElement("div");
              this._blocker.classList.add("vds-blocker");
              target.after(this._blocker);
            }
            setAttribute(target, "data-no-controls", !showControls);
          });
        }
      }
      if (isYouTubeEmbed)
        target?.classList.add("vds-youtube");
      else if (isVimeoEmbed)
        target?.classList.add("vds-vimeo");
      if (!isEmbed) {
        this._blocker?.remove();
        this._blocker = null;
      }
      this.load(target);
    });
  }
  _createAudio() {
    const audio = this._target instanceof HTMLAudioElement ? this._target : document.createElement("audio");
    setAttribute(audio, "preload", "none");
    setAttribute(audio, "aria-hidden", "true");
    const { controls, crossorigin } = this._media.$state;
    effect(() => {
      setAttribute(audio, "controls", controls());
      setAttribute(audio, "crossorigin", crossorigin());
    });
    return audio;
  }
  _createVideo() {
    const video = this._target instanceof HTMLVideoElement ? this._target : document.createElement("video");
    const { controls, crossorigin, poster } = this._media.$state, { $iosControls } = this._media, $nativeControls = computed(() => controls() || $iosControls() ? "" : null), $poster = computed(() => poster() && (controls() || $iosControls()) ? poster() : null);
    effect(() => {
      setAttribute(video, "controls", $nativeControls());
      setAttribute(video, "crossorigin", crossorigin());
      setAttribute(video, "poster", $poster());
    });
    return video;
  }
  _createIFrame() {
    return this._target instanceof HTMLIFrameElement ? this._target : document.createElement("iframe");
  }
}

class MediaPlayerElement extends Host(HTMLElement, MediaPlayer) {
  static {
    this.tagName = "media-player";
  }
  static {
    this.attrs = {
      preferNativeHLS: "prefer-native-hls"
    };
  }
}

export { MediaProviderElement as M, MediaPlayerElement as a };
