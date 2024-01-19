import { H as Host, e as effect, k as setAttribute, n as computed } from './vidstack-s5pw8Cb6.js';
import { M as MediaProvider, a as MediaPlayer } from './vidstack-sKeoTFgw.js';
import { u as useMediaContext } from './vidstack-8n__KtFR.js';
import './vidstack-UV9ceSS6.js';

class MediaProviderElement extends Host(HTMLElement, MediaProvider) {
  constructor() {
    super(...arguments);
    this.A = null;
    this.Vj = null;
  }
  static {
    this.tagName = "media-provider";
  }
  onSetup() {
    this.a = useMediaContext();
    this.setAttribute("keep-alive", "");
  }
  onDestroy() {
    this.Vj?.remove();
    this.Vj = null;
    this.A?.remove();
    this.A = null;
  }
  onConnect() {
    effect(() => {
      const loader = this.$state.loader(), isYouTubeEmbed = loader?.canPlay({ src: "", type: "video/youtube" }), isVimeoEmbed = loader?.canPlay({ src: "", type: "video/vimeo" }), isEmbed = isYouTubeEmbed || isVimeoEmbed;
      const target = loader ? isEmbed ? this.ek() : loader.mediaType() === "audio" ? this.fk() : this.Yj() : null;
      if (this.A !== target) {
        const parent = this.A?.parentElement ?? this;
        this.A?.remove();
        this.A = target;
        if (target)
          parent.prepend(target);
        if (isEmbed && target) {
          effect(() => {
            const { $iosControls } = this.a, { controls } = this.a.$state, showControls = controls() || $iosControls();
            if (showControls) {
              this.Vj?.remove();
              this.Vj = null;
            } else {
              this.Vj = this.querySelector(".vds-blocker") ?? document.createElement("div");
              this.Vj.classList.add("vds-blocker");
              target.after(this.Vj);
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
        this.Vj?.remove();
        this.Vj = null;
      }
      this.load(target);
    });
  }
  fk() {
    const audio = this.A instanceof HTMLAudioElement ? this.A : document.createElement("audio");
    setAttribute(audio, "preload", "none");
    setAttribute(audio, "aria-hidden", "true");
    const { controls, crossorigin } = this.a.$state;
    effect(() => {
      setAttribute(audio, "controls", controls());
      setAttribute(audio, "crossorigin", crossorigin());
    });
    return audio;
  }
  Yj() {
    const video = this.A instanceof HTMLVideoElement ? this.A : document.createElement("video");
    const { controls, crossorigin, poster } = this.a.$state, { $iosControls } = this.a, $nativeControls = computed(() => controls() || $iosControls() ? "" : null), $poster = computed(() => poster() && (controls() || $iosControls()) ? poster() : null);
    effect(() => {
      setAttribute(video, "controls", $nativeControls());
      setAttribute(video, "crossorigin", crossorigin());
      setAttribute(video, "poster", $poster());
    });
    return video;
  }
  ek() {
    return this.A instanceof HTMLIFrameElement ? this.A : document.createElement("iframe");
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
