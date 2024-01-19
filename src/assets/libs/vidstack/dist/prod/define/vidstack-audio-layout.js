import { x } from '../chunks/vidstack-aTKyk4ef.js';
import { H as Host, e as effect, o as onDispose, k as setAttribute } from '../chunks/vidstack-s5pw8Cb6.js';
import { D as DefaultAudioLayout } from '../chunks/vidstack-sKeoTFgw.js';
import { u as useMediaContext } from '../chunks/vidstack-8n__KtFR.js';
import { D as DefaultTimeSlider, a as DefaultSeekButton, b as DefaultPlayButton, $ as $computed, c as DefaultMuteButton, d as DefaultVolumeSlider, e as DefaultCaptionButton, f as DefaultChaptersMenu, g as DefaultSettingsMenu, h as DefaultTimeInfo, i as DefaultLiveButton, j as createMenuContainer, S as SlotManager, k as DefaultLayoutIconsLoader } from '../chunks/vidstack-0YIOoTC9.js';
import { L as LitElement } from '../chunks/vidstack-jSFcERHu.js';
import '../chunks/vidstack-UV9ceSS6.js';
import '../chunks/vidstack-PYaZQCX6.js';
import '../chunks/vidstack-XmoYV57V.js';
import '../chunks/vidstack-yqTzryo_.js';
import '../chunks/vidstack-XcK8ubY-.js';

function DefaultAudioLayoutLarge() {
  return x`
    <media-captions class="vds-captions"></media-captions>

    <media-controls class="vds-controls">
      <media-controls-group class="vds-controls-group">${DefaultTimeSlider()}</media-controls-group>

      <media-controls-group class="vds-controls-group">
        ${DefaultSeekButton({ seconds: -10, tooltip: "top start" })}
        ${DefaultPlayButton({ tooltip: "top" })}${DefaultSeekButton({
    tooltip: "top",
    seconds: 10
  })}
        ${$computed(DefaultTimeInfo)}
        <media-chapter-title class="vds-chapter-title"></media-chapter-title>
        ${DefaultMuteButton({ tooltip: "top" })}
        ${DefaultVolumeSlider()}${DefaultCaptionButton({ tooltip: "top" })} ${DefaultAudioMenus()}
      </media-controls-group>
    </media-controls>
  `;
}
function DefaultAudioLayoutSmall() {
  return x`
    <media-captions class="vds-captions"></media-captions>
    <media-controls class="vds-controls">
      <media-controls-group class="vds-controls-group">
        ${$computed(DefaultLivePlayButton)}
        ${DefaultMuteButton({ tooltip: "top start" })}${$computed(DefaultLiveButton)}
        <media-chapter-title class="vds-chapter-title"></media-chapter-title>
        ${DefaultCaptionButton({ tooltip: "top" })}${DefaultAudioMenus()}
      </media-controls-group>

      <media-controls-group class="vds-controls-group">${DefaultTimeSlider()}</media-controls-group>

      ${$computed(DefaultTimeControlsGroup)}${$computed(DefaultBottomControlsGroup)}
    </media-controls>
  `;
}
function DefaultLivePlayButton() {
  const { live, canSeek } = useMediaContext().$state;
  return live() && !canSeek() ? DefaultPlayButton({ tooltip: "top start" }) : null;
}
function DefaultTimeControlsGroup() {
  const { live } = useMediaContext().$state;
  return !live() ? x`
        <media-controls-group class="vds-controls-group">
          <media-time class="vds-time" type="current"></media-time>
          <div class="vds-controls-spacer"></div>
          <media-time class="vds-time" type="duration"></media-time>
        </media-controls-group>
      ` : null;
}
function DefaultBottomControlsGroup() {
  const { canSeek } = useMediaContext().$state;
  return canSeek() ? x`
        <media-controls-group class="vds-controls-group">
          <div class="vds-controls-spacer"></div>
          ${DefaultSeekButton({ seconds: -10, tooltip: "top" })}
          ${DefaultPlayButton({ tooltip: "top" })}
          ${DefaultSeekButton({ tooltip: "top", seconds: 10 })}
          <div class="vds-controls-spacer"></div>
        </media-controls-group>
      ` : null;
}
function DefaultAudioMenus() {
  const placement = "top end";
  return x`
    ${DefaultChaptersMenu({ tooltip: "top", placement, portal: true })}
    ${DefaultSettingsMenu({ tooltip: "top end", placement, portal: true })}
  `;
}

class MediaAudioLayoutElement extends Host(LitElement, DefaultAudioLayout) {
  static {
    this.tagName = "media-audio-layout";
  }
  onSetup() {
    this.forwardKeepAlive = false;
    this.a = useMediaContext();
    this.classList.add("vds-audio-layout");
    this.menuContainer = createMenuContainer("vds-audio-layout");
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
    return this.isMatch && streamType() !== "unknown" ? this.isSmallLayout ? DefaultAudioLayoutSmall() : DefaultAudioLayoutLarge() : null;
  }
  render() {
    return x`${$computed(this._j.bind(this))}`;
  }
}

export { MediaAudioLayoutElement };
