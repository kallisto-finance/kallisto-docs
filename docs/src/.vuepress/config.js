const { description } = require('../../package')

module.exports = {
  base: "/kallisto-docs/",
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'Kallisto Finance',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: '',
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: false,
    nav: [
      {
        text: 'Guide',
        link: '/guide/abstract',
      },
      {
        text: 'Kallisto',
        link: 'https://kallisto.finance'
      }
    ],
    sidebar: {
      '/guide/': [
        {
          title: 'Kallisto',
          collapsable: false,
          children: [
            `abstract`,
            [`introduction`, `Introduction`],
            [`how-to-use`, `Use Kallisto`],
          ]
        },
        {
          title: 'Design',
          collapsable: false,
          children: [
            'scheduler',
            'fees',
          ]
        },
        {
          title: 'Logic',
          collapsable: false,
          children: [
            ['chaser-vault', 'Smart Contracts'],
            ['scripts', 'Scripts'],
            ['vault-ui', 'Vault UI'],
          ]
        },
      ],
    }
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
    '@renovamen/vuepress-plugin-katex',
  ]
}
