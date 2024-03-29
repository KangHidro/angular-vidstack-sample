import { m as signal, e as effect, p as peek, d as defineCustomElement } from '../chunks/vidstack-KTx0QncX.js';
import { lazyPaths } from 'media-icons';
import { c as cloneTemplateContent, a as createTemplate } from '../chunks/vidstack-PDESAD8i.js';

const svgTemplate = /* @__PURE__ */ createTemplate(
  `<svg width="100%" height="100%" viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"></svg>`
);
class MediaIconElement extends HTMLElement {
  constructor() {
    super(...arguments);
    this._svg = this._createSVG();
    this._paths = signal("");
    this._type = signal(null);
    this._disposal = [];
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
    return this._type();
  }
  set type(type) {
    this._type.set(type);
    if (type)
      this.setAttribute("type", type);
    else
      this.removeAttribute("type");
  }
  attributeChangedCallback(name, _, newValue) {
    if (name === "type") {
      this._type.set(newValue ? newValue : null);
    }
  }
  connectedCallback() {
    this.classList.add("vds-icon");
    if (this._svg.parentNode !== this) {
      this.prepend(this._svg);
    }
    this._disposal.push(
      // Load
      effect(this._loadIcon.bind(this)),
      // Render
      effect(() => {
        this._svg.innerHTML = this._paths();
      })
    );
  }
  disconnectedCallback() {
    for (const fn of this._disposal)
      fn();
    this._disposal.length = 0;
  }
  _createSVG() {
    return cloneTemplateContent(svgTemplate);
  }
  _loadIcon() {
    const type = this._type();
    if (type && lazyPaths[type]) {
      lazyPaths[type]().then(({ default: paths }) => {
        if (type === peek(this._type))
          this._paths.set(paths);
      });
    } else {
      this._paths.set("");
    }
  }
}

defineCustomElement(MediaIconElement);
