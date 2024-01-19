import { HTMLMediaProvider } from './vidstack-html.js';
import '../chunks/vidstack-ZF6S2MdD.js';
import '../chunks/vidstack-KTx0QncX.js';
import '../chunks/vidstack-IUoxhowK.js';
import '../chunks/vidstack-S5-ZnP-2.js';

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
      ctx.delegate._notify("provider-setup", this);
  }
  /**
   * The native HTML `<audio>` element.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement}
   */
  get audio() {
    return this._media;
  }
}

export { AudioProvider };
