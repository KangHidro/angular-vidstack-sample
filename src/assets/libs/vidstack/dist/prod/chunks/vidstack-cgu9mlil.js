import { v as deferredPromise, m as signal, e as effect, l as listenEvent, p as peek, r as isString } from './vidstack-s5pw8Cb6.js';
import { a as appendParamsToURL } from './vidstack-UV9ceSS6.js';

function timedPromise(callback, ms = 3e3) {
  const promise = deferredPromise();
  setTimeout(() => {
    const rejection = callback();
    if (rejection)
      promise.reject(rejection);
  }, ms);
  return promise;
}

class EmbedProvider {
  constructor(_iframe) {
    this.db = _iframe;
    this.cb = signal("");
    /**
     * Defines which referrer is sent when fetching the resource.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/referrerPolicy}
     */
    this.referrerPolicy = null;
    _iframe.setAttribute("frameBorder", "0");
    _iframe.setAttribute(
      "allow",
      "autoplay; fullscreen; encrypted-media; picture-in-picture; accelerometer; gyroscope"
    );
    if (this.referrerPolicy !== null) {
      _iframe.setAttribute("referrerpolicy", this.referrerPolicy);
    }
  }
  get iframe() {
    return this.db;
  }
  setup(ctx) {
    effect(this.fd.bind(this));
    listenEvent(window, "message", this.Lg.bind(this));
    listenEvent(this.db, "load", this.lc.bind(this));
  }
  fd() {
    const src = this.cb();
    if (!src.length) {
      this.db.setAttribute("src", "");
      return;
    }
    const params = peek(() => this.Te());
    this.db.setAttribute("src", appendParamsToURL(src, params));
  }
  gd(message, target) {
    this.db.contentWindow?.postMessage(JSON.stringify(message), target ?? "*");
  }
  Lg(event) {
    const origin = this.eb(), isOriginMatch = event.source === this.db?.contentWindow && (!isString(origin) || origin === event.origin);
    if (!isOriginMatch)
      return;
    try {
      const message = JSON.parse(event.data);
      if (message)
        this.hd(message, event);
      return;
    } catch (e) {
    }
    if (event.data)
      this.hd(event.data, event);
  }
}

export { EmbedProvider as E, timedPromise as t };
