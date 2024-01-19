import { x } from '../chunks/vidstack-aTKyk4ef.js';
import { n as computed, H as Host, e as effect, o as onDispose, k as setAttribute } from '../chunks/vidstack-s5pw8Cb6.js';
import { u as useDefaultLayoutContext, b as DefaultVideoLayout } from '../chunks/vidstack-sKeoTFgw.js';
import { u as useMediaContext } from '../chunks/vidstack-8n__KtFR.js';
import { $ as $computed, D as DefaultTimeSlider, b as DefaultPlayButton, c as DefaultMuteButton, d as DefaultVolumeSlider, e as DefaultCaptionButton, l as DefaultPIPButton, m as DefaultFullscreenButton, f as DefaultChaptersMenu, g as DefaultSettingsMenu, h as DefaultTimeInfo, j as createMenuContainer, S as SlotManager, k as DefaultLayoutIconsLoader } from '../chunks/vidstack-0YIOoTC9.js';
import { L as LitElement } from '../chunks/vidstack-jSFcERHu.js';
import '../chunks/vidstack-UV9ceSS6.js';
import '../chunks/vidstack-PYaZQCX6.js';
import '../chunks/vidstack-XmoYV57V.js';
import '../chunks/vidstack-yqTzryo_.js';
import '../chunks/vidstack-XcK8ubY-.js';

function DefaultVideoLayoutLarge() {
  return x`
    ${DefaultVideoGestures()}${DefaultBufferingIndicator()}
    <media-captions class="vds-captions"></media-captions>

    <div class="vds-scrim"></div>

    <media-controls class="vds-controls">
      ${$computed(DefaultControlsGroupTop)}

      <div class="vds-controls-spacer"></div>

      <media-controls-group class="vds-controls-group">${DefaultTimeSlider()}</media-controls-group>

      <media-controls-group class="vds-controls-group">
        ${DefaultPlayButton({ tooltip: "top start" })}
        ${DefaultMuteButton({ tooltip: "top" })}${DefaultVolumeSlider()}
        ${$computed(DefaultTimeInfo)}
        <media-chapter-title class="vds-chapter-title"></media-chapter-title>
        ${DefaultCaptionButton({ tooltip: "top" })}${$computed(DefaultBottomMenuGroup)}
        ${DefaultPIPButton()} ${DefaultFullscreenButton({ tooltip: "top end" })}
      </media-controls-group>
    </media-controls>
  `;
}
function DefaultBottomMenuGroup() {
  const { menuGroup } = useDefaultLayoutContext();
  return menuGroup() === "bottom" ? DefaultVideoMenus() : null;
}
function DefaultControlsGroupTop() {
  const { menuGroup } = useDefaultLayoutContext(), children = menuGroup() === "top" ? x`
            <div class="vds-controls-spacer"></div>
            ${DefaultVideoMenus()}
          ` : null;
  return x`
    <media-controls-group class="vds-controls-group">${children}</media-controls-group>
  `;
}
function DefaultVideoLayoutSmall() {
  return x`
    ${DefaultVideoGestures()}${DefaultBufferingIndicator()}
    <media-captions class="vds-captions"></media-captions>

    <div class="vds-scrim"></div>

    <media-controls class="vds-controls">
      <media-controls-group class="vds-controls-group">
        <div class="vds-controls-spacer"></div>
        ${DefaultCaptionButton({ tooltip: "bottom" })}
        ${DefaultVideoMenus()}${DefaultMuteButton({ tooltip: "bottom end" })}
      </media-controls-group>

      <div class="vds-controls-group">${DefaultPlayButton({ tooltip: "top" })}</div>

      <media-controls-group class="vds-controls-group">
        ${$computed(DefaultTimeInfo)}
        <media-chapter-title class="vds-chapter-title"></media-chapter-title>
        <div class="vds-controls-spacer"></div>
        ${DefaultFullscreenButton({ tooltip: "top end" })}
      </media-controls-group>

      <media-controls-group class="vds-controls-group">${DefaultTimeSlider()}</media-controls-group>
    </media-controls>

    ${$computed(StartDuration)}
  `;
}
function StartDuration() {
  const { duration } = useMediaContext().$state;
  if (duration() === 0)
    return null;
  return x`
    <div class="vds-start-duration">
      <media-time class="vds-time" type="duration"></media-time>
    </div>
  `;
}
function DefaultBufferingIndicator() {
  return x`
    <div class="vds-buffering-indicator">
      <media-spinner class="vds-buffering-spinner"></media-spinner>
    </div>
  `;
}
function DefaultVideoMenus() {
  const { menuGroup, smQueryList } = useDefaultLayoutContext(), $side = () => menuGroup() === "top" || smQueryList.matches ? "bottom" : "top", $tooltip = computed(() => `${$side()} ${menuGroup() === "top" ? "end" : "center"}`), $placement = computed(() => `${$side()} end`);
  return x`
    ${DefaultChaptersMenu({ tooltip: $tooltip, placement: $placement, portal: true })}
    ${DefaultSettingsMenu({ tooltip: $tooltip, placement: $placement, portal: true })}
  `;
}
function DefaultVideoGestures() {
  return x`
    <div class="vds-gestures">
      <media-gesture class="vds-gesture" event="pointerup" action="toggle:paused"></media-gesture>
      <media-gesture class="vds-gesture" event="pointerup" action="toggle:controls"></media-gesture>
      <media-gesture
        class="vds-gesture"
        event="dblpointerup"
        action="toggle:fullscreen"
      ></media-gesture>
      <media-gesture class="vds-gesture" event="dblpointerup" action="seek:-10"></media-gesture>
      <media-gesture class="vds-gesture" event="dblpointerup" action="seek:10"></media-gesture>
    </div>
  `;
}

class MediaVideoLayoutElement extends Host(LitElement, DefaultVideoLayout) {
  static {
    this.tagName = "media-video-layout";
  }
  onSetup() {
    this.forwardKeepAlive = false;
    this.a = useMediaContext();
    this.classList.add("vds-video-layout");
    this.menuContainer = createMenuContainer("vds-video-layout");
    effect(() => {
      if (!this.menuContainer)
        return;
      setAttribute(this.menuContainer, "data-size", this.isSmallLayout && "sm");
    });
    onDispose(() => this.menuContainer?.remove());
  }
  onConnect() {
    effect(() => {
      if (this.$props.customIcons()) {
        new SlotManager(this).connect();
      } else {
        new DefaultLayoutIconsLoader(this).connect();
      }
    });
  }
  _j() {
    const { streamType } = this.a.$state;
    return this.isMatch ? streamType() === "unknown" ? DefaultBufferingIndicator() : this.isSmallLayout ? DefaultVideoLayoutSmall() : DefaultVideoLayoutLarge() : null;
  }
  render() {
    return x`${$computed(this._j.bind(this))}`;
  }
}

export { MediaVideoLayoutElement };
