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
      { text: "组件文档", link: "/guide" },
    ],
    sidebar: [
      {
        text: "快速开始",
        link: "/quick",
      },
      {
        text: "组件文档",
        link: "/guide",
      },
      {
        text: "最佳实践",
        items: [
          { text: "带进度条甘特图", link: "/duration" },
          { text: "可拖拽甘特图", link: "/drag" },
          { text: "自定义色块样式", link: "/taskRender" },
          { text: "自定义tooltip", link: "/tooltipRender" },
          { text: "自定义右键菜单", link: "/menu" },
          { text: "多选操作", link: "/multichoose" },
        ],
      },
    ],
    footer: {
      message: "干就完了！大量节省二次研发时间，让你专注于业务开发！",
    },
  },
};
