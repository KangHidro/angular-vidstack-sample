import { m as signal, e as effect, p as peek, d as defineCustomElement } from '../chunks/vidstack-s5pw8Cb6.js';
import { lazyPaths } from 'media-icons';
import { c as cloneTemplateContent, a as createTemplate } from '../chunks/vidstack-PYaZQCX6.js';

const svgTemplate = /* @__PURE__ */ createTemplate(
  `<svg width="100%" height="100%" viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"></svg>`
);
class MediaIconElement extends HTMLElement {
  constructor() {
    super(...arguments);
    this.mk = this.ok();
    this.nk = signal("");
    this.vb = signal(null);
    this.sa = [];
  }
  static {
    this.tagName = "media-icon";
  }
  static get observedAttributes() {
    return ["type"];
  }
  /**
   * The type of icon. You can find a complete and searchable list on our website - see our
   * [media icons catalog](https://www.vidstack.io/media-icons?lib=html).
   */
  get type() {
    return this.vb();
  }
  set type(type) {
    this.vb.set(type);
    if (type)
      this.setAttribute("type", type);
    else
      this.removeAttribute("type");
  }
  attributeChangedCallback(name, _, newValue) {
    if (name === "type") {
      this.vb.set(newValue ? newValue : null);
    }
  }
  connectedCallback() {
    this.classList.add("vds-icon");
    if (this.mk.parentNode !== this) {
      this.prepend(this.mk);
    }
    this.sa.push(
      // Load
      effect(this.pk.bind(this)),
      // Render
      effect(() => {
        this.mk.innerHTML = this.nk();
      })
    );
  }
  disconnectedCallback() {
    for (const fn of this.sa)
      fn();
    this.sa.length = 0;
  }
  ok() {
    return cloneTemplateContent(svgTemplate);
  }
  pk() {
    const type = this.vb();
    if (type && lazyPaths[type]) {
      lazyPaths[type]().then(({ default: paths }) => {
        if (type === peek(this.vb))
          this.nk.set(paths);
      });
    } else {
      this.nk.set("");
    }
  }
}

defineCustomElement(MediaIconElement);
