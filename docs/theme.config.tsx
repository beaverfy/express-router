import type { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  docsRepositoryBase: 'https://github.com/beaverfy/react-native-wear', // base URL for the docs repository
  darkMode: true,
  primaryHue: {
    dark: 262.86,
    light: 262.86
  },
  primarySaturation: {
    dark: 71,
    light: 71
  },
  chat: {
    link: "https://discord.gg/3u2bWnzg3x"
  },
  project: {
    link: "https://github.com/beaverfy/react-native-wear"
  },
  footer: {
    text: 'By Beaverfy & Community',
  },
  editLink: {
    text: 'Edit this page on GitHub →',
  },
  logo: (
    <>
      <img
        src="/react-native-wear.png"
        width="20"
        alt="React Native Wear"
        style={{ marginRight: '10px' }}
      />
      <span>React Native Wear</span>
    </>
  ),
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta
        name="description"
        content="Module for interacting with Wear OS via React Native"
      />
      <meta name="og:title" content="ActionSheet for React Native" />
    </>
  ),
  toc: {
    backToTop: true,
  },
};

export default config;
