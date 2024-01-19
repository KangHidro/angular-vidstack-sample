import { I as Component, f as setStyle, o as onDispose, J as useContext } from './vidstack-KTx0QncX.js';
import { am as FocusVisibleController, an as tooltipContext, a6 as MenuButton } from './vidstack-2JOJlpjE.js';
import { r as requestScopedAnimationFrame } from './vidstack-PDESAD8i.js';

class ControlsGroup extends Component {
  onAttach(el) {
    setStyle(el, "pointer-events", "auto");
  }
}

class TooltipTrigger extends Component {
  constructor() {
    super();
    new FocusVisibleController();
  }
  onConnect(el) {
    onDispose(
      requestScopedAnimationFrame(() => {
        if (!this.connectScope)
          return;
        this._attach();
        const tooltip = useContext(tooltipContext);
        onDispose(() => {
          const button = this._getButton();
          button && tooltip._detachTrigger(button);
        });
      })
    );
  }
  _attach() {
    const button = this._getButton(), tooltip = useContext(tooltipContext);
    button && tooltip._attachTrigger(button);
  }
  _getButton() {
    const candidate = this.el.firstElementChild;
    return candidate?.localName === "button" || candidate?.getAttribute("role") === "button" ? candidate : this.el;
  }
}

class MenuItem extends MenuButton {
}

export { ControlsGroup as C, MenuItem as M, TooltipTrigger as T };
