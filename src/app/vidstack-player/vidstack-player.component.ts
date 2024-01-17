import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';

@Component({
  selector: 'app-vidstack-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vidstack-player.component.html',
  styleUrls: ['./vidstack-player.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class VidstackPlayerComponent {

  constructor() {
    this.loadStyles();
    this.loadScript();
  }

  loadStyles(reload?: boolean) {
    const oldElement = document.getElementById('load-vidstack-css') as HTMLLinkElement | null;
    if (!reload && oldElement) {
      // console.log('Already loaded!');
      return;
    }

    [
      'https://cdn.jsdelivr.net/npm/vidstack@^1.0.0/player/styles/default/theme.min.css',
      'https://cdn.jsdelivr.net/npm/vidstack@^1.0.0/player/styles/default/layouts/video.min.css',
      // 'assets/libs/vidstack/player/styles/base.css',
      // 'assets/libs/vidstack/player/styles/default/buffering.css',
      // 'assets/libs/vidstack/player/styles/default/buttons.css',
      // 'assets/libs/vidstack/player/styles/default/captions.css',
      // 'assets/libs/vidstack/player/styles/default/chapter-title.css',
      // 'assets/libs/vidstack/player/styles/default/controls.css',
      // 'assets/libs/vidstack/player/styles/default/gestures.css',
      // 'assets/libs/vidstack/player/styles/default/icons.css',
      // 'assets/libs/vidstack/player/styles/default/menus.css',
      // 'assets/libs/vidstack/player/styles/default/poster.css',
      // 'assets/libs/vidstack/player/styles/default/sliders.css',
      // 'assets/libs/vidstack/player/styles/default/theme.css',
      // 'assets/libs/vidstack/player/styles/default/thumbnail.css',
      // 'assets/libs/vidstack/player/styles/default/time.css',
      // 'assets/libs/vidstack/player/styles/default/tooltips.css',
    ].forEach(css => {
      const linkcss = document.createElement('link');
      linkcss.setAttribute('id', 'load-vidstack-css');
      linkcss.rel = 'stylesheet';
      linkcss.href = css;

      if (oldElement) {
        oldElement.replaceWith(linkcss);
      } else {
        document.head.appendChild(linkcss);
      }
    });
  }

  loadStyles2(reload?: boolean) {
    const oldElement = document.getElementById('load-vidstack-css') as HTMLLinkElement | null;
    if (!reload && oldElement) {
      // console.log('Already loaded!');
      return;
    }

    const linkcss = document.createElement('link');
    linkcss.setAttribute('id', 'load-vidstack-css');
    linkcss.rel = 'stylesheet';
    linkcss.href = 'assets/libs/vidstack/player/styles/default/theme.css';

    if (oldElement) {
      oldElement.replaceWith(linkcss);
    } else {
      document.head.appendChild(linkcss);
    }
  }

  loadScript(reload?: boolean) {
    const oldElement = document.getElementById('load-vidstack-js') as HTMLScriptElement | null;
    if (!reload && oldElement) {
      // console.log('Already loaded!');
      return;
    }

    const script = document.createElement('script');
    script.setAttribute('id', 'load-vidstack-js');
    script.type = 'module';
    script.src = 'https://cdn.jsdelivr.net/npm/vidstack@^1.0.0/cdn/with-layouts/vidstack.js';
    // script.src = 'assets/libs/vidstack/cdn/vidstack.js';

    if (oldElement) {
      oldElement.replaceWith(script);
    } else {
      document.head.appendChild(script);
    }
  }
}
