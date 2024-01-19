import { I as Component, f as setStyle, o as onDispose, J as useContext } from './vidstack-s5pw8Cb6.js';
import { al as FocusVisibleController, am as tooltipContext, a5 as MenuButton } from './vidstack-sKeoTFgw.js';
import { r as requestScopedAnimationFrame } from './vidstack-PYaZQCX6.js';

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
        this.Ja();
        const tooltip = useContext(tooltipContext);
        onDispose(() => {
          const button = this.Cc();
          button && tooltip.Kd(button);
        });
      })
    );
  }
  Ja() {
    const button = this.Cc(), tooltip = useContext(tooltipContext);
    button && tooltip.Jd(button);
  }
  Cc() {
    const candidate = this.el.firstElementChild;
    return candidate?.localName === "button" || candidate?.getAttribute("role") === "button" ? candidate : this.el;
  }
}

class MenuItem extends MenuButton {
}

export { ControlsGroup as C, MenuItem as M, TooltipTrigger as T };
