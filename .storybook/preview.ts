import { applicationConfig, type Preview } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';

import 'zone.js';

export const CustomAura = definePreset(Aura, {
  semantic: {
    primary: {
      50:  '#f3fcf6',
      100: '#dff6e7',
      200: '#b8eacb',
      300: '#88d8ad',
      400: '#54c08a',
      500: '#25935f', // Brand primary
      600: '#1b8354',
      700: '#166a45',
      800: '#14573a',
      900: '#104631',
      950: '#092a1e',
    },
  },
});

// Angular application configuration
const appConfig = {
  providers: [
    provideAnimations(),
    providePrimeNG({
      theme: {
        preset: CustomAura,
        options: {
          darkModeSelector: false,
        },
      },
    }),
    MessageService,
  ],
};

const preview: Preview = {
  decorators: [
    applicationConfig(appConfig),
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#1e1e1e',
        },
      ],
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
