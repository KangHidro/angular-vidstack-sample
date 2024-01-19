import { o as onDispose, l as listenEvent, D as DOMEvent, s as scoped } from '../chunks/vidstack-s5pw8Cb6.js';
import { d as canUsePictureInPicture, e as canUseVideoPresentation, b as canPlayHLSNatively } from '../chunks/vidstack-XmoYV57V.js';
import { HTMLMediaProvider } from './vidstack-html.js';
import { b as TextTrack, T as TextTrackSymbol } from '../chunks/vidstack-UV9ceSS6.js';
import '../chunks/vidstack-XcK8ubY-.js';
import '../chunks/vidstack-4jGm7oeB.js';

class NativeHLSTextTracks {
  constructor(_video, _ctx) {
    this.m = _video;
    this.b = _ctx;
    _video.textTracks.onaddtrack = this.Wc.bind(this);
    onDispose(this.cd.bind(this));
  }
  Wc(event) {
    const nativeTrack = event.track;
    if (!nativeTrack || findTextTrackElement(this.m, nativeTrack))
      return;
    const track = new TextTrack({
      id: nativeTrack.id,
      kind: nativeTrack.kind,
      label: nativeTrack.label,
      language: nativeTrack.language,
      type: "vtt"
    });
    track[TextTrackSymbol.T] = { track: nativeTrack };
    track[TextTrackSymbol.M] = 2;
    track[TextTrackSymbol.te] = true;
    let lastIndex = 0;
    const onCueChange = (event2) => {
      if (!nativeTrack.cues)
        return;
      for (let i = lastIndex; i < nativeTrack.cues.length; i++) {
        track.addCue(nativeTrack.cues[i], event2);
        lastIndex++;
      }
    };
    onCueChange(event);
    nativeTrack.oncuechange = onCueChange;
    this.b.textTracks.add(track, event);
    track.setMode(nativeTrack.mode, event);
  }
  cd() {
    this.m.textTracks.onaddtrack = null;
    for (const track of this.b.textTracks) {
      const nativeTrack = track[TextTrackSymbol.T]?.track;
      if (nativeTrack?.oncuechange)
        nativeTrack.oncuechange = null;
    }
  }
}
function findTextTrackElement(video, track) {
  return Array.from(video.children).find((el) => el.track === track);
}

class VideoPictureInPicture {
  constructor(_video, _media) {
    this.m = _video;
    this.a = _media;
    this.B = (active, event) => {
      this.a.delegate.c("picture-in-picture-change", active, event);
    };
    listenEvent(this.m, "enterpictureinpicture", this.Jg.bind(this));
    listenEvent(this.m, "leavepictureinpicture", this.Kg.bind(this));
  }
  get active() {
    return document.pictureInPictureElement === this.m;
  }
  get supported() {
    return canUsePictureInPicture(this.m);
  }
  async enter() {
    return this.m.requestPictureInPicture();
  }
  exit() {
    return document.exitPictureInPicture();
  }
  Jg(event) {
    this.B(true, event);
  }
  Kg(event) {
    this.B(false, event);
  }
}

class VideoPresentation {
  constructor(_video, _media) {
    this.m = _video;
    this.a = _media;
    this.I = "inline";
    listenEvent(this.m, "webkitpresentationmodechanged", this.Ua.bind(this));
  }
  get Se() {
    return canUseVideoPresentation(this.m);
  }
  async kc(mode) {
    if (this.I === mode)
      return;
    this.m.webkitSetPresentationMode(mode);
  }
  Ua(event) {
    const prevMode = this.I;
    this.I = this.m.webkitPresentationMode;
    this.a.player?.dispatch(
      new DOMEvent("video-presentation-change", {
        detail: this.I,
        trigger: event
      })
    );
    ["fullscreen", "picture-in-picture"].forEach((type) => {
      if (this.I === type || prevMode === type) {
        this.a.delegate.c(`${type}-change`, this.I === type, event);
      }
    });
  }
}
class FullscreenPresentationAdapter {
  constructor(_presentation) {
    this.fa = _presentation;
  }
  get active() {
    return this.fa.I === "fullscreen";
  }
  get supported() {
    return this.fa.Se;
  }
  async enter() {
    this.fa.kc("fullscreen");
  }
  async exit() {
    this.fa.kc("inline");
  }
}
class PIPPresentationAdapter {
  constructor(_presentation) {
    this.fa = _presentation;
  }
  get active() {
    return this.fa.I === "picture-in-picture";
  }
  get supported() {
    return this.fa.Se;
  }
  async enter() {
    this.fa.kc("picture-in-picture");
  }
  async exit() {
    this.fa.kc("inline");
  }
}

class VideoProvider extends HTMLMediaProvider {
  constructor(video, ctx) {
    super(video);
    this.$$PROVIDER_TYPE = "VIDEO";
    scoped(() => {
      if (canUseVideoPresentation(video)) {
        const presentation = new VideoPresentation(video, ctx);
        this.fullscreen = new FullscreenPresentationAdapter(presentation);
        this.pictureInPicture = new PIPPresentationAdapter(presentation);
      } else if (canUsePictureInPicture(video)) {
        this.pictureInPicture = new VideoPictureInPicture(video, ctx);
      }
    }, this.scope);
  }
  get type() {
    return "video";
  }
  setup(ctx) {
    super.setup(ctx);
    if (canPlayHLSNatively(this.video)) {
      new NativeHLSTextTracks(this.video, ctx);
    }
    ctx.textRenderers.Fe(this.video);
    onDispose(() => {
      ctx.textRenderers.Fe(null);
    });
    if (this.type === "video")
      ctx.delegate.c("provider-setup", this);
  }
  /**
   * The native HTML `<video>` element.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement}
   */
  get video() {
    return this.a;
  }
}

export { VideoProvider };
