import { D } from './vidstack-aTKyk4ef.js';

class LitElement extends HTMLElement {
  constructor() {
    super(...arguments);
    this.rootPart = null;
  }
  connectedCallback() {
    this.rootPart = D(this.render(), this, {
      renderBefore: this.firstChild
    });
    this.rootPart.setConnected(true);
  }
  disconnectedCallback() {
    this.rootPart?.setConnected(false);
    this.rootPart = null;
  }
}

export { LitElement as L };
