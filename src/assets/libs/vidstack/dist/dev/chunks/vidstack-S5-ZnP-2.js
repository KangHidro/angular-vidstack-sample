import { x as isFunction, i as isUndefined, y as waitTimeout } from './vidstack-KTx0QncX.js';

const ADD = Symbol("LIST_ADD" ), REMOVE = Symbol("LIST_REMOVE" ), RESET = Symbol("LIST_RESET" ), SELECT = Symbol("LIST_SELECT" ), READONLY = Symbol("LIST_READONLY" ), SET_READONLY = Symbol("LIST_SET_READONLY" ), ON_RESET = Symbol("LIST_ON_RESET" ), ON_REMOVE = Symbol("LIST_ON_REMOVE" ), ON_USER_SELECT = Symbol("LIST_ON_USER_SELECT" );
const ListSymbol = {
  _add: ADD,
  _remove: REMOVE,
  _reset: RESET,
  _select: SELECT,
  _readonly: READONLY,
  _setReadonly: SET_READONLY,
  _onReset: ON_RESET,
  _onRemove: ON_REMOVE,
  _onUserSelect: ON_USER_SELECT
};

const UA = navigator?.userAgent.toLowerCase() || "";
const IS_IOS = /iphone|ipad|ipod|ios|crios|fxios/i.test(UA);
const IS_IPHONE = /(iphone|ipod)/gi.test(navigator?.platform || "");
const IS_CHROME = !!window.chrome;
const IS_SAFARI = !!window.safari || IS_IOS;
function canOrientScreen() {
  return canRotateScreen() && isFunction(screen.orientation.unlock);
}
function canRotateScreen() {
  return !isUndefined(window.screen.orientation) && !isUndefined(window.screen.orientation.lock);
}
function canPlayHLSNatively(video) {
  if (!video)
    video = document.createElement("video");
  return video.canPlayType("application/vnd.apple.mpegurl").length > 0;
}
function canUsePictureInPicture(video) {
  return !!document.pictureInPictureEnabled && !video.disablePictureInPicture;
}
function canUseVideoPresentation(video) {
  return isFunction(video?.webkitSupportsPresentationMode) && isFunction(video?.webkitSetPresentationMode);
}
async function canChangeVolume() {
  const video = document.createElement("video");
  video.volume = 0.5;
  await waitTimeout(0);
  return video.volume === 0.5;
}
function getMediaSource() {
  return window?.MediaSource ?? window?.WebKitMediaSource;
}
function getSourceBuffer() {
  return window?.SourceBuffer ?? window?.WebKitSourceBuffer;
}
function isHLSSupported() {
  const MediaSource = getMediaSource();
  if (isUndefined(MediaSource))
    return false;
  const isTypeSupported = MediaSource && isFunction(MediaSource.isTypeSupported) && MediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"');
  const SourceBuffer = getSourceBuffer();
  const isSourceBufferValid = isUndefined(SourceBuffer) || !isUndefined(SourceBuffer.prototype) && isFunction(SourceBuffer.prototype.appendBuffer) && isFunction(SourceBuffer.prototype.remove);
  return !!isTypeSupported && !!isSourceBufferValid;
}

export { IS_CHROME as I, ListSymbol as L, canOrientScreen as a, canPlayHLSNatively as b, canChangeVolume as c, canUsePictureInPicture as d, canUseVideoPresentation as e, canRotateScreen as f, IS_SAFARI as g, IS_IPHONE as h, isHLSSupported as i };
