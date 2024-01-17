import process from 'node:process';
import path from 'node:path';
import { defineConfig } from 'vitepress';
import { qqSvg } from './icon.js';

export default defineConfig({
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      dir: 'src/en',
      title: 'Soybean Admin',
      description: 'a fresh and elegant admin template'
    },
    zh: {
      label: '简体中文',
      lang: 'zh',
      dir: 'src/zh',
      title: 'Soybean Admin',
      description: '一个清新优雅的后台管理模板',
      themeConfig: {
        footer: {
          message: '根据 MIT 许可证发布',
          copyright: 'Copyright © 2021 Soybean'
        },
        nav: [
          { text: '指引', link: '/zh/guide/introduction', activeMatch: '/zh/guide/' },
          { text: '常见问题', link: '/zh/faq/', activeMatch: '/zh/faq/' },
          { text: '规范', link: '/zh/standard/', activeMatch: '/zh/standard/' },
          { text: '教程', link: '/zh/tutorial/', activeMatch: '/zh/tutorial/' },
          {
            text: '捐赠',
            link: '/zh/other/donate'
          },
          {
            text: '链接',
            items: [
              {
                text: 'Preview',
                link: 'https://soybeanjs.cn'
              },
              {
                text: 'Repository',
                link: 'https://github.com/honghuangdc/soybean-admin'
              }
            ]
          }
        ],
        sidebar: {
          '/zh/guide/': [
            {
              text: '介绍',
              link: '/guide/introduction'
            }
          ],
          '/zh/faq/': [],
          '/zh/standard/': []
        }
      }
    }
  },
  head: [
    ['meta', { name: 'author', content: 'Soybean' }],
    [
      'meta',
      {
        name: 'keywords',
        content: 'soybean, soybean-admin, soybean-admin docs'
      }
    ],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    [
      'meta',
      {
        name: 'viewport',
        content: 'width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no'
      }
    ],
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  assetsDir: path.join(process.cwd(), 'public'),
  srcDir: path.join(process.cwd(), 'src'),
  themeConfig: {
    logo: '/logo.svg',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/soybeanjs' },
      { icon: 'discord', link: 'https://discord.gg/n44HfksX' },
      {
        icon: {
          svg: qqSvg
        },
        link: 'https://qm.qq.com/cgi-bin/qm/qr?k=XTjkqjV1KynFoEAdrqxMd6i71-TtCVGV&jump_from=webapi'
      }
    ],
    algolia: {
      appId: '98WN1RY04S',
      apiKey: '13e9f5767b774422a5880723d9c23265',
      indexName: 'soybean'
    },
    footer: {
      message: 'Publish under the MIT license',
      copyright: 'Copyright © 2021 Soybean'
    },
    nav: [
      { text: 'Guide', link: '/guide/introduction', activeMatch: '/guide/' },
      { text: 'FAQ', link: '/faq/', activeMatch: '/faq/' },
      { text: 'Standard', link: '/standard/', activeMatch: '/standard/' },
      { text: 'Tutorial', link: '/tutorial/', activeMatch: '/tutorial/' },
      {
        text: 'Donate',
        link: '/other/donate'
      },
      {
        text: 'Links',
        items: [
          {
            text: 'Preview',
            link: 'https://soybeanjs.cn'
          },
          {
            text: 'Repository',
            link: 'https://github.com/honghuangdc/soybean-admin'
          }
        ]
      }
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          link: '/guide/introduction'
        }
      ],
      '/faq/': [],
      '/standard/': []
    }
  }
});
