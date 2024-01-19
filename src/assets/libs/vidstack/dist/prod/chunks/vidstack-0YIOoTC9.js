import { n as computed, e as effect, V as animationFrameThrottle, o as onDispose, x as isFunction, T as unwrap, r as isString, l as listenEvent } from './vidstack-s5pw8Cb6.js';
import { e, c, t, l, D, x, o } from './vidstack-aTKyk4ef.js';
import { u as useDefaultLayoutContext, E as getDefaultLayoutLang } from './vidstack-sKeoTFgw.js';
import { u as useMediaContext } from './vidstack-8n__KtFR.js';
import { i as isTrackCaptionKind } from './vidstack-UV9ceSS6.js';

class SignalDirective extends c {
  constructor(part) {
    super(part);
    this.h = null;
    this.ra = null;
    this.w = false;
    this.w = part.type === t.ATTRIBUTE;
  }
  render(signal) {
    if (this.h !== signal) {
      this.h = signal;
      this.disconnected();
      if (this.isConnected)
        this.Si();
    }
    const value = this.h();
    return this.w ? l(value) : value;
  }
  reconnected() {
    this.Si();
  }
  disconnected() {
    if (!this.w)
      this.setValue(null);
    this.ra?.();
    this.ra = null;
  }
  Si() {
    if (!this.h)
      return;
    this.ra = effect(this.o.bind(this));
  }
  o() {
    {
      this.setValue(this.h?.());
    }
  }
}
const $signal = e(SignalDirective);
function $computed(compute) {
  return $signal(computed(compute));
}

class SlotObserver {
  constructor(_root, _callback) {
    this.Wj = _root;
    this.Ca = _callback;
    this.elements = /* @__PURE__ */ new Set();
    this.vf = animationFrameThrottle(this.ea.bind(this));
  }
  connect() {
    this.ea();
    const observer = new MutationObserver(this.vf);
    observer.observe(this.Wj, { childList: true });
    onDispose(() => observer.disconnect());
    onDispose(this.disconnect.bind(this));
  }
  disconnect() {
    this.elements.clear();
  }
  assign(template, slot) {
    if (template instanceof Node) {
      slot.textContent = "";
      slot.append(template);
    } else {
      D(template, slot);
    }
    if (!slot.style.display) {
      slot.style.display = "contents";
    }
    const el = slot.firstElementChild;
    if (!el)
      return;
    const classList = slot.getAttribute("data-class");
    if (classList)
      el.classList.add(...classList.split(" "));
  }
  ea() {
    for (const slot of this.Wj.querySelectorAll("slot")) {
      if (slot.hasAttribute("name"))
        this.elements.add(slot);
    }
    this.Ca(this.elements);
  }
}

let id = 0, slotIdAttr = "data-slot-id";
class SlotManager {
  constructor(_root) {
    this.Wj = _root;
    this.vf = animationFrameThrottle(this.ea.bind(this));
    this.slots = new SlotObserver(_root, this.ea.bind(this));
  }
  connect() {
    this.slots.connect();
    this.ea();
    const mutations = new MutationObserver(this.vf);
    mutations.observe(this.Wj, { childList: true });
    onDispose(() => mutations.disconnect());
  }
  ea() {
    for (const node of this.Wj.children) {
      if (node.nodeType !== 1)
        continue;
      const name = node.getAttribute("slot");
      if (!name)
        continue;
      node.style.display = "none";
      let slotId = node.getAttribute(slotIdAttr);
      if (!slotId) {
        node.setAttribute(slotIdAttr, slotId = ++id + "");
      }
      for (const slot of this.slots.elements) {
        if (slot.getAttribute("name") !== name || slot.getAttribute(slotIdAttr) === slotId) {
          continue;
        }
        const clone = document.importNode(node, true);
        if (name.includes("-icon"))
          clone.classList.add("vds-icon");
        clone.style.display = "";
        clone.removeAttribute("slot");
        this.slots.assign(clone, slot);
        slot.setAttribute(slotIdAttr, slotId);
      }
    }
  }
}

function renderMenuButton({ label, icon }) {
  return x`
    <media-menu-button class="vds-menu-button">
      <slot name="menu-arrow-left-icon" data-class="vds-menu-button-close-icon"></slot>
      <slot name="${icon}-icon" data-class="vds-menu-button-icon"></slot>
      <span class="vds-menu-button-label">${$signal(label)}</span>
      <span class="vds-menu-button-hint" data-part="hint"></span>
      <slot name="menu-arrow-right-icon" data-class="vds-menu-button-open-icon"></slot>
    </media-menu-button>
  `;
}

function $i18n(translations, key) {
  return $computed(() => getDefaultLayoutLang(translations, key));
}
function DefaultPlayButton({ tooltip }) {
  const { translations } = useDefaultLayoutContext(), { paused } = useMediaContext().$state, $label = $computed(() => getDefaultLayoutLang(translations, paused() ? "Play" : "Pause"));
  return x`
    <media-tooltip class="vds-play-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-play-button class="vds-play-button vds-button" aria-label=${$label}>
          <slot name="play-icon" data-class="vds-play-icon"></slot>
          <slot name="pause-icon" data-class="vds-pause-icon"></slot>
          <slot name="replay-icon" data-class="vds-replay-icon"></slot>
        </media-play-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${tooltip}>
        <span class="vds-play-tooltip-text">${$i18n(translations, "Play")}</span>
        <span class="vds-pause-tooltip-text">${$i18n(translations, "Pause")}</span>
      </media-tooltip-content>
    </media-tooltip>
  `;
}
function DefaultMuteButton({ tooltip }) {
  const { translations } = useDefaultLayoutContext(), { muted } = useMediaContext().$state, $label = $computed(() => getDefaultLayoutLang(translations, muted() ? "Unmute" : "Unmute"));
  return x`
    <media-tooltip class="vds-mute-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-mute-button class="vds-mute-button vds-button" aria-label=${$label}>
          <slot name="mute-icon" data-class="vds-mute-icon"></slot>
          <slot name="volume-low-icon" data-class="vds-volume-low-icon"></slot>
          <slot name="volume-high-icon" data-class="vds-volume-high-icon"></slot>
        </media-mute-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${tooltip}>
        <span class="vds-mute-tooltip-text">${$i18n(translations, "Unmute")}</span>
        <span class="vds-unmute-tooltip-text">${$i18n(translations, "Mute")}</span>
      </media-tooltip-content>
    </media-tooltip>
  `;
}
function DefaultCaptionButton({ tooltip }) {
  const { translations } = useDefaultLayoutContext(), { textTrack } = useMediaContext().$state, $label = $computed(
    () => getDefaultLayoutLang(
      translations,
      textTrack() ? "Closed-Captions Off" : "Closed-Captions On"
    )
  );
  return x`
    <media-tooltip class="vds-caption-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-caption-button class="vds-caption-button vds-button" aria-label=${$label}>
          <slot name="cc-on-icon" data-class="vds-cc-on-icon"></slot>
          <slot name="cc-off-icon" data-class="vds-cc-off-icon"></slot>
        </media-caption-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${tooltip}>
        <span class="vds-cc-on-tooltip-text">${$i18n(translations, "Closed-Captions Off")}</span>
        <span class="vds-cc-off-tooltip-text">${$i18n(translations, "Closed-Captions On")}</span>
      </media-tooltip-content>
    </media-tooltip>
  `;
}
function DefaultPIPButton() {
  const { translations } = useDefaultLayoutContext(), { pictureInPicture } = useMediaContext().$state, $label = $computed(
    () => getDefaultLayoutLang(translations, pictureInPicture() ? "Exit PiP" : "Enter PiP")
  );
  return x`
    <media-tooltip class="vds-pip-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-pip-button class="vds-pip-button vds-button" aria-label=${$label}>
          <slot name="pip-enter-icon" data-class="vds-pip-enter-icon"></slot>
          <slot name="pip-exit-icon" data-class="vds-pip-exit-icon"></slot>
        </media-pip-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content">
        <span class="vds-pip-enter-tooltip-text">${$i18n(translations, "Enter PiP")}</span>
        <span class="vds-pip-exit-tooltip-text">${$i18n(translations, "Exit PiP")}</span>
      </media-tooltip-content>
    </media-tooltip>
  `;
}
function DefaultFullscreenButton({ tooltip }) {
  const { translations } = useDefaultLayoutContext(), { fullscreen } = useMediaContext().$state, $label = $computed(
    () => getDefaultLayoutLang(translations, fullscreen() ? "Exit Fullscreen" : "Enter Fullscreen")
  );
  return x`
    <media-tooltip class="vds-fullscreen-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-fullscreen-button class="vds-fullscreen-button vds-button" aria-label=${$label}>
          <slot name="fs-enter-icon" data-class="vds-fs-enter-icon"></slot>
          <slot name="fs-exit-icon" data-class="vds-fs-exit-icon"></slot>
        </media-fullscreen-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${tooltip}>
        <span class="vds-fs-enter-tooltip-text">${$i18n(translations, "Enter Fullscreen")}</span>
        <span class="vds-fs-exit-tooltip-text">${$i18n(translations, "Exit Fullscreen")}</span>
      </media-tooltip-content>
    </media-tooltip>
  `;
}
function DefaultSeekButton({
  seconds,
  tooltip
}) {
  const { translations } = useDefaultLayoutContext(), seekText = seconds >= 0 ? "Seek Forward" : "Seek Backward", $label = $i18n(translations, seekText);
  return x`
    <media-tooltip class="vds-seek-tooltip vds-tooltip">
      <media-tooltip-trigger>
        <media-seek-button
          class="vds-seek-button vds-button"
          seconds=${seconds}
          aria-label=${$label}
        >
          ${seconds >= 0 ? x`<slot name="seek-forward-icon"></slot>` : x`<slot name="seek-backward-icon"></slot>`}
        </media-seek-button>
      </media-tooltip-trigger>
      <media-tooltip-content class="vds-tooltip-content" placement=${tooltip}>
        ${$i18n(translations, seekText)}
      </media-tooltip-content>
    </media-tooltip>
  `;
}
function DefaultVolumeSlider() {
  const { translations } = useDefaultLayoutContext(), $label = $i18n(translations, "Volume");
  return x`
    <media-volume-slider class="vds-volume-slider vds-slider" aria-label=${$label}>
      <div class="vds-slider-track"></div>
      <div class="vds-slider-track-fill vds-slider-track"></div>
      <media-slider-preview class="vds-slider-preview" no-clamp>
        <media-slider-value class="vds-slider-value"></media-slider-value>
      </media-slider-preview>
      <div class="vds-slider-thumb"></div>
    </media-volume-slider>
  `;
}
function DefaultTimeSlider() {
  const { width } = useMediaContext().$state, { thumbnails, translations } = useDefaultLayoutContext(), $label = $i18n(translations, "Seek");
  return x`
    <media-time-slider class="vds-time-slider vds-slider" aria-label=${$label}>
      <media-slider-chapters class="vds-slider-chapters" ?disabled=${$signal(() => width() < 768)}>
        <template>
          <div class="vds-slider-chapter">
            <div class="vds-slider-track"></div>
            <div class="vds-slider-track-fill vds-slider-track"></div>
            <div class="vds-slider-progress vds-slider-track"></div>
          </div>
        </template>
      </media-slider-chapters>
      <div class="vds-slider-thumb"></div>
      <media-slider-preview class="vds-slider-preview">
        <media-slider-thumbnail
          class="vds-slider-thumbnail vds-thumbnail"
          src=${$signal(thumbnails)}
        ></media-slider-thumbnail>
        <div class="vds-slider-chapter-title" data-part="chapter-title"></div>
        <media-slider-value class="vds-slider-value"></media-slider-value>
      </media-slider-preview>
    </media-time-slider>
  `;
}
function DefaultLiveButton() {
  const { translations } = useDefaultLayoutContext(), { live } = useMediaContext().$state, $label = $i18n(translations, "Skip To Live"), $liveText = $i18n(translations, "LIVE");
  return live() ? x`
    <media-live-button class="vds-live-button" aria-label=${$label}>
      <span class="vds-live-button-text">${$liveText}</span>
    </media-live-button
  ` : null;
}
function DefaultTimeGroup() {
  return x`
    <div class="vds-time-group">
      <media-time class="vds-time" type="current"></media-time>
      <div class="vds-time-divider">/</div>
      <media-time class="vds-time" type="duration"></media-time>
    </div>
  `;
}
function DefaultTimeInfo() {
  const { live } = useMediaContext().$state;
  return live() ? DefaultLiveButton() : DefaultTimeGroup();
}
function MenuPortal(container, template) {
  return x`
    <media-menu-portal .container=${container} disabled="fullscreen">
      ${template}
    </media-menu-portal>
  `;
}
function DefaultChaptersMenu({
  placement,
  tooltip,
  portal
}) {
  const { viewType } = useMediaContext().$state, { translations, smQueryList, thumbnails, menuContainer, noModal, menuGroup } = useDefaultLayoutContext(), $placement = computed(
    () => noModal() ? unwrap(placement) : !smQueryList.matches ? unwrap(placement) : null
  ), $offset = computed(
    () => !smQueryList.matches && menuGroup() === "bottom" && viewType() === "video" ? 26 : 0
  );
  const items = x`
    <media-menu-items
      class="vds-chapters-menu-items vds-menu-items"
      placement=${$signal($placement)}
      offset=${$signal($offset)}
    >
      <media-chapters-radio-group
        class="vds-chapters-radio-group vds-radio-group"
        thumbnails=${$signal(thumbnails)}
      >
        <template>
          <media-radio class="vds-chapter-radio vds-radio">
            <media-thumbnail class="vds-thumbnail"></media-thumbnail>
            <div class="vds-chapter-radio-content">
              <span class="vds-chapter-radio-label" data-part="label"></span>
              <span class="vds-chapter-radio-start-time" data-part="start-time"></span>
              <span class="vds-chapter-radio-duration" data-part="duration"></span>
            </div>
          </media-radio>
        </template>
      </media-chapters-radio-group>
    </media-menu-items>
  `;
  return x`
    <!-- Chapters Menu -->
    <media-menu class="vds-chapters-menu vds-menu">
      <media-tooltip class="vds-tooltip">
        <media-tooltip-trigger>
          <media-menu-button
            class="vds-menu-button vds-button"
            aria-label=${$i18n(translations, "Chapters")}
          >
            <slot name="menu-chapters-icon"></slot>
          </media-menu-button>
        </media-tooltip-trigger>
        <media-tooltip-content
          class="vds-tooltip-content"
          placement=${isFunction(tooltip) ? $signal(tooltip) : tooltip}
        >
          ${$i18n(translations, "Chapters")}
        </media-tooltip-content>
      </media-tooltip>
      ${portal ? MenuPortal(menuContainer, items) : items}
    </media-menu>
  `;
}
function DefaultSettingsMenu({
  placement,
  portal,
  tooltip
}) {
  const { viewType, canSetPlaybackRate, canSetQuality, qualities, audioTracks, textTracks } = useMediaContext().$state, { translations, smQueryList, menuContainer, noModal, menuGroup } = useDefaultLayoutContext(), $placement = computed(
    () => noModal() ? unwrap(placement) : !smQueryList.matches ? unwrap(placement) : null
  ), $offset = computed(
    () => !smQueryList.matches && menuGroup() === "bottom" && viewType() === "video" ? 26 : 0
  ), $hasMenuItems = computed(
    () => canSetPlaybackRate() || canSetQuality() && qualities().length || audioTracks().length || textTracks().filter(isTrackCaptionKind).length
  );
  const items = x`
    <media-menu-items
      class="vds-settings-menu-items vds-menu-items"
      placement=${$signal($placement)}
      offset=${$signal($offset)}
    >
      ${DefaultAudioSubmenu()}${DefaultSpeedSubmenu()}${DefaultQualitySubmenu()}${DefaultCaptionsSubmenu()}
    </media-menu-items>
  `;
  const menu = x`
    <media-menu class="vds-settings-menu vds-menu">
      <media-tooltip class="vds-tooltip">
        <media-tooltip-trigger>
          <media-menu-button
            class="vds-menu-button vds-button"
            aria-label=${$i18n(translations, "Settings")}
          >
            <slot name="menu-settings-icon" data-class="vds-rotate-icon"></slot>
          </media-menu-button>
        </media-tooltip-trigger>
        <media-tooltip-content
          class="vds-tooltip-content"
          placement=${isFunction(tooltip) ? $signal(tooltip) : tooltip}
        >
          ${$i18n(translations, "Settings")}
        </media-tooltip-content>
      </media-tooltip>
      ${portal ? MenuPortal(menuContainer, items) : items}
    </media-menu>
  `;
  return $computed(() => $hasMenuItems() ? menu : null);
}
function DefaultAudioSubmenu() {
  const { translations } = useDefaultLayoutContext();
  return x`
    <!-- Audio Menu -->
    <media-menu class="vds-audio-menu vds-menu">
      ${renderMenuButton({
    label: () => getDefaultLayoutLang(translations, "Audio"),
    icon: "menu-audio"
  })}
      <media-menu-items class="vds-menu-items">
        <media-audio-radio-group
          class="vds-audio-radio-group vds-radio-group"
          empty-label=${$i18n(translations, "Default")}
        >
          <template>
            <media-radio class="vds-audio-radio vds-radio">
              <div class="vds-radio-check"></div>
              <span class="vds-radio-label" data-part="label"></span>
            </media-radio>
          </template>
        </media-audio-radio-group>
      </media-menu-items>
    </media-menu>
  `;
}
function DefaultSpeedSubmenu() {
  const { translations } = useDefaultLayoutContext();
  return x`
    <!-- Speed Menu -->
    <media-menu class="vds-speed-menu vds-menu">
      ${renderMenuButton({
    label: () => getDefaultLayoutLang(translations, "Speed"),
    icon: "menu-speed"
  })}
      <media-menu-items class="vds-menu-items">
        <media-speed-radio-group
          class="vds-speed-radio-group vds-radio-group"
          normal-label=${$i18n(translations, "Normal")}
        >
          <template>
            <media-radio class="vds-speed-radio vds-radio">
              <div class="vds-radio-check"></div>
              <span class="vds-radio-label" data-part="label"></span>
            </media-radio>
          </template>
        </media-speed-radio-group>
      </media-menu-items>
    </media-menu>
  `;
}
function DefaultQualitySubmenu() {
  const { translations } = useDefaultLayoutContext();
  return x`
    <!-- Quality Menu -->
    <media-menu class="vds-quality-menu vds-menu">
      ${renderMenuButton({
    label: () => getDefaultLayoutLang(translations, "Quality"),
    icon: "menu-quality"
  })}
      <media-menu-items class="vds-menu-items">
        <media-quality-radio-group
          class="vds-quality-radio-group vds-radio-group"
          auto-label=${$i18n(translations, "Auto")}
        >
          <template>
            <media-radio class="vds-quality-radio vds-radio">
              <div class="vds-radio-check"></div>
              <span class="vds-radio-label" data-part="label"></span>
              <span class="vds-radio-hint" data-part="bitrate"></span>
            </media-radio>
          </template>
        </media-quality-radio-group>
      </media-menu-items>
    </media-menu>
  `;
}
function DefaultCaptionsSubmenu() {
  const { translations } = useDefaultLayoutContext();
  return x`
    <!-- Captions Menu -->
    <media-menu class="vds-captions-menu vds-menu">
      ${renderMenuButton({
    label: () => getDefaultLayoutLang(translations, "Captions"),
    icon: "menu-captions"
  })}
      <media-menu-items class="vds-menu-items">
        <media-captions-radio-group
          class="vds-captions-radio-group vds-radio-group"
          off-label=${$i18n(translations, "Off")}
        >
          <template>
            <media-radio class="vds-caption-radio vds-radio">
              <div class="vds-radio-check"></div>
              <span class="vds-radio-label" data-part="label"></span>
            </media-radio>
          </template>
        </media-captions-radio-group>
      </media-menu-items>
    </media-menu>
  `;
}
function createMenuContainer(className) {
  let container = document.querySelector(`body > .${className}`);
  if (!container) {
    container = document.createElement("div");
    container.style.display = "contents";
    container.classList.add(className);
    document.body.append(container);
  }
  return container;
}

function Icon({ name, class: _class, state, paths }) {
  return x`<svg
    class="${"vds-icon" + (_class ? ` ${_class}` : "")}"
    viewBox="0 0 32 32"
    fill="none"
    aria-hidden="true"
    focusable="false"
    xmlns="http://www.w3.org/2000/svg"
    data-icon=${l(name ?? state)}
  >
    ${!isString(paths) ? $signal(paths) : o(paths)}
  </svg>`;
}

class IconsLoader {
  constructor(_root) {
    this.Wj = _root;
    this.Zj = {};
    this.bk = false;
    this.slots = new SlotObserver(_root, this.ck.bind(this));
  }
  connect() {
    this.slots.connect();
    onDispose(this.disconnect.bind(this));
  }
  load() {
    this.xe().then((icons) => {
      this.Zj = icons;
      this.bk = true;
      this.ck();
    });
  }
  disconnect() {
    for (const { slot } of this.dk()) {
      slot.textContent = "";
    }
  }
  *dk() {
    for (const iconName of Object.keys(this.Zj)) {
      const slotName = `${iconName}-icon`;
      for (const slot of this.slots.elements) {
        if (slot.name !== slotName)
          continue;
        yield { icon: this.Zj[iconName], slot };
      }
    }
  }
  ck() {
    if (!this.bk)
      return;
    for (const { icon, slot } of this.dk()) {
      this.slots.assign(icon, slot);
    }
  }
}

class LayoutIconsLoader extends IconsLoader {
  connect() {
    const player = this.ik();
    if (!player)
      return;
    super.connect();
    if (player.$state.canLoad()) {
      this.load();
    } else {
      listenEvent(player, "can-load", () => this.load(), { once: true });
    }
  }
  ik() {
    let node = this.Wj.parentElement;
    while (node && node.localName !== "media-player") {
      node = node.parentElement;
    }
    return node;
  }
}

class DefaultLayoutIconsLoader extends LayoutIconsLoader {
  async xe() {
    const paths = (await import('./vidstack-7cTzfr-b.js')).icons, icons = {};
    for (const iconName of Object.keys(paths)) {
      icons[iconName] = Icon({ name: iconName, paths: paths[iconName] });
    }
    return icons;
  }
}

export { $computed as $, DefaultTimeSlider as D, SlotManager as S, DefaultSeekButton as a, DefaultPlayButton as b, DefaultMuteButton as c, DefaultVolumeSlider as d, DefaultCaptionButton as e, DefaultChaptersMenu as f, DefaultSettingsMenu as g, DefaultTimeInfo as h, DefaultLiveButton as i, createMenuContainer as j, DefaultLayoutIconsLoader as k, DefaultPIPButton as l, DefaultFullscreenButton as m };
