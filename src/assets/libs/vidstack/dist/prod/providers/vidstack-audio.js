import { HTMLMediaProvider } from './vidstack-html.js';
import '../chunks/vidstack-XcK8ubY-.js';
import '../chunks/vidstack-s5pw8Cb6.js';
import '../chunks/vidstack-4jGm7oeB.js';
import '../chunks/vidstack-XmoYV57V.js';

class AudioProvider extends HTMLMediaProvider {
  constructor() {
    super(...arguments);
    this.$$PROVIDER_TYPE = "AUDIO";
  }
  get type() {
    return "audio";
  }
  setup(ctx) {
    super.setup(ctx);
    if (this.type === "audio")
      ctx.delegate.c("provider-setup", this);
  }
  /**
   * The native HTML `<audio>` element.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement}
   */
  get audio() {
    return this.a;
  }
}

export { AudioProvider };
