import { i as isUndefined, a as isNumber } from './vidstack-s5pw8Cb6.js';

class RAFLoop {
  constructor(_callback) {
    this.Ca = _callback;
  }
  Bb() {
    if (!isUndefined(this.ca))
      return;
    this.Oe();
  }
  ra() {
    if (isNumber(this.ca))
      window.cancelAnimationFrame(this.ca);
    this.ca = void 0;
  }
  Oe() {
    this.ca = window.requestAnimationFrame(() => {
      if (isUndefined(this.ca))
        return;
      this.Ca();
      this.Oe();
    });
  }
}

export { RAFLoop as R };
