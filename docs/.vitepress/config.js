// .vitepress/config.js
export default {
  title: "Echarts-Gantt",
  description: "这是一个甘特图组件的使用文档",
  themeConfig: {
    search: {
      provider: "local",
    },
    nav: [
      { text: "首页", link: "/" },
      { text: "使用指南", link: "/guide/" },
    ],
    sidebar: {
      "/guide/": [
        {
          text: "指南",
          items: [
            { text: "介绍", link: "/guide/" },
            { text: "快速开始", link: "/guide/quick-start" },
          ],
        },
      ],
    },
  },
};
