import { e as effect, l as listenEvent, b as isKeyboardClick, c as isTouchEvent, g as getScope, s as scoped, o as onDispose, f as setStyle, h as autoUpdate, j as computePosition, k as setAttribute } from './vidstack-KTx0QncX.js';

function setAttributeIfEmpty(target, name, value) {
  if (!target.hasAttribute(name))
    target.setAttribute(name, value);
}
function setARIALabel(target, $label) {
  if (target.hasAttribute("aria-label"))
    return;
  function updateAriaDescription() {
    setAttribute(target, "aria-label", $label());
  }
  effect(updateAriaDescription);
}
function isElementParent(owner, node, test) {
  while (node) {
    if (node === owner) {
      return true;
    } else if (test?.(node)) {
      break;
    } else {
      node = node.parentElement;
    }
  }
  return false;
}
function onPress(target, handler) {
  listenEvent(target, "pointerup", (event) => {
    if (event.button === 0)
      handler(event);
  });
  listenEvent(target, "keydown", (event) => {
    if (isKeyboardClick(event))
      handler(event);
  });
}
function isTouchPinchEvent(event) {
  return isTouchEvent(event) && (event.touches.length > 1 || event.changedTouches.length > 1);
}
function requestScopedAnimationFrame(callback) {
  let scope = getScope(), id = window.requestAnimationFrame(() => {
    scoped(callback, scope);
    id = -1;
  });
  return () => void window.cancelAnimationFrame(id);
}
function cloneTemplate(template, length, onCreate) {
  let current, prev = template, parent = template.parentElement, content = template.content.firstElementChild, elements = [];
  if (!content && template.firstElementChild) {
    template.innerHTML = template.firstElementChild.outerHTML;
    template.firstElementChild.remove();
    content = template.content.firstElementChild;
  }
  if (content?.nodeType !== 1) {
    throw Error("[vidstack] template must contain root element");
  }
  for (let i = 0; i < length; i++) {
    current = document.importNode(content, true);
    onCreate?.(current, i);
    parent.insertBefore(current, prev.nextSibling);
    elements.push(current);
    prev = current;
  }
  onDispose(() => {
    for (let i = 0; i < elements.length; i++)
      elements[i].remove();
  });
  return elements;
}
function createTemplate(content) {
  const template = document.createElement("template");
  template.innerHTML = content;
  return template.content;
}
function cloneTemplateContent(content) {
  const fragment = content.cloneNode(true);
  return fragment.firstElementChild;
}
function autoPlacement(el, trigger, placement, {
  offsetVarName,
  xOffset,
  yOffset,
  ...options
}) {
  if (!el)
    return;
  const floatingPlacement = placement.replace(" ", "-").replace("-center", "");
  setStyle(el, "visibility", !trigger ? "hidden" : null);
  if (!trigger)
    return;
  const negateY = (y) => placement.includes("top") ? `calc(-1 * ${y})` : y;
  return autoUpdate(trigger, el, () => {
    computePosition(trigger, el, { placement: floatingPlacement, ...options }).then(({ x, y }) => {
      Object.assign(el.style, {
        top: `calc(${y + "px"} + ${negateY(
          yOffset ? yOffset + "px" : `var(--${offsetVarName}-y-offset, 0px)`
        )})`,
        left: `calc(${x + "px"} + ${xOffset ? xOffset + "px" : `var(--${offsetVarName}-x-offset, 0px)`})`
      });
    });
  });
}
function hasAnimation(el) {
  const styles = getComputedStyle(el);
  return styles.animationName !== "none";
}

export { createTemplate as a, cloneTemplate as b, cloneTemplateContent as c, autoPlacement as d, setARIALabel as e, isElementParent as f, hasAnimation as h, isTouchPinchEvent as i, onPress as o, requestScopedAnimationFrame as r, setAttributeIfEmpty as s };
