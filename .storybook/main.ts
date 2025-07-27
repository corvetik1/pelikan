import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  // Pick up all *.stories.ts or *.stories.tsx files under src
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  docs: {
    autodocs: 'tag',
  },
};

export default config;
