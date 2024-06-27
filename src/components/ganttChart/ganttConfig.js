export const gantConfig = {
  //背景颜色
  backgroundColor: "#ffffff",

  //组件id
  seriesDataID: "seriesDataID",
  yAxisDataID: "yAxisID",
  ySubAxisDataID: "ySubAxisID",
  xAxisId: "xAxisId",

  //echart时间范围(开始),用于x轴渲染
  ECHART_START_TIME: "",
  //echart时间范围(结束),用于x轴渲染
  ECHART_END_TIME: "",

  //y轴种类id index
  CATEGORY_INDEX: 0,
  //开始时间 index
  TIME_START: 1,
  //结束时间 index
  TIME_END: 2,
  //task 任务id index
  ID_INDEX: 3,
  //task 任务数据 index
  TASK_ITEM_INDEX: 4,

  //y轴数据id
  Y_Axis_ITEM_INDEX: 1,

  // 任务的高度,小数(通道高度*yAxisHeight=任务高度)
  yAxisHeight: 0.7,
  //通道高度，会运行时赋值，不需要用户传入
  sizeHeight: 0,

  //时间轴时间间隔
  timeMaxinterval: 1 * 60 * 60 * 1000,

  //甘特图上下左右距离
  grid: {
    top: 50,
    left: 90,
    right: 0,
    bottom: 30
  },

  //任务默认样式，可以传参合并
  taskStyle: {
    rectStyle: {
      fill: "rgba(74, 204, 255,1)"
    },
    textStyle: {
      color: "#ffffff",
      textVerticalAlign: "middle",
      textAlign: "center",
      textFill: "#ffffff",
      fontSize: 11,
      overflow: "truncate",
      ellipsis: ".."
    }
  },

  //色块宽度小于多少像素就隐藏文字
  minTextWidth: 160,
  //色块高度小于多少像素就隐藏文字
  minTextHeight: 55,

  /***下面还没看出来在哪用到 */

  xAxisSpan: 10, // 时间精度 1min 5min 10min 60min
  fontSize: 14, // 字体大小  14-20
  dragMode: "single", // 选择模式 single  group
  isLinkline: true, // 连线
  disabled: false, // 禁用
  MOVE_THROTTLE: 30,
  MULTIPLE_CHOICE: true, // 是否多选
  isMove: false
};
