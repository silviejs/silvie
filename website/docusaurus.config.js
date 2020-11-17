module.exports = {
  title: 'Silvie JS',
  tagline: 'Typescript based NodeJS Framework',
  url: 'https://silviejs.org',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'img/logo.svg',
  organizationName: 'silviejs', // Usually your GitHub org/user name.
  projectName: 'silviejs.github.io', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Silvie JS',
      logo: {
        alt: 'Silvie JS Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Documentation',
          position: 'left',
        },
        {
          href: 'https://github.com/silviejs/silvie',
          position: 'right',
          className: 'git-hub-link'
        },
      ],
    },
    footer: {
      style: 'light',
      copyright: `Copyright © ${new Date().getFullYear()} Hossein Maktoobian.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/silviejs/silviejs.github.io/tree/main/website',
        },
        blog: {
          showReadingTime: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.scss'),
        },
      },
    ],
  ],
  plugins: ['docusaurus-plugin-sass'],
};
