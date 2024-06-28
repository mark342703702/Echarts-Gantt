# 快速开始

## 使用前准备

1.请先确认您的项目已安装 echarts、dayjs、vue、 lodash

2.请将源码中的 src/components/ganttChart 拷贝至你的项目中

3.在页面中引入组件，设置你的参数后即可呈现一个基础甘特图

## 尝试一下

[点击查看效果](https://mark342703702.github.io/Echarts-Gantt//#/base)

**config.js**

```js
import dayjs from "dayjs";

//y轴配置数据
export const yAxisData = [
  {
    value: [
      0, //categoryIndex y轴种类id,从0开始逐步+1
      // y轴数据
      {
        //y轴名称
        label: "产线1",
        //自定义.....
      },
    ],
  },
  {
    value: [
      1,
      {
        label: "产线2",
      },
    ],
  },
  {
    value: [
      2,
      {
        label: "产线3",
      },
    ],
  },
  {
    value: [
      3,
      {
        label: "产线4",
      },
    ],
  },
];

//甘特图数据
export const seriesData = [
  {
    value: [
      //对应y轴categoryIndex
      0,
      //开始时间
      1715653367000,
      //结束时间
      1715664167000,
      //task 任务id(一般用顺序id,从0开始 依次增加 唯一)
      0,
      //task 任务数据
      {
        //显示名称
        name: "G12400002",
        //数据id (唯一)
        unitId: "cc7b17071",
        //....用户自定义字段
      },
    ],
  },
  {
    value: [
      1,
      dayjs().subtract(1, "hour").valueOf(),
      dayjs().add(1, "hour").valueOf(),
      1,
      {
        name: "G12400002",
        unitId: "cc7b17072",
      },
    ],
  },
  {
    value: [
      2,
      dayjs().valueOf(),
      dayjs().add(2, "hour").valueOf(),
      2,
      {
        name: "G12400002",
        unitId: "cc7b17073",
      },
    ],
  },
  {
    value: [
      3,
      dayjs().add(2, "hour").valueOf(),
      dayjs().add(4, "hour").valueOf(),
      3,
      {
        name: "G12400002",
        unitId: "cc7b17074",
      },
    ],
  },
];
```

**index.vue**

```vue
<template>
  <div>
    <h1>基础使用</h1>
    <div class="gantt-content">
      <GanttChart
        ref="GanttChart"
        id="chartbase"
        :yAxisData="yAxisData"
        :seriesData="seriesData"
        :chartStarTime="chartStarTime"
        :chartEndTime="chartEndTime"
      />
    </div>
  </div>
</template>

<script>
import GanttChart from "@/components/ganttChart";
import { yAxisData, seriesData } from "./config";
import dayjs from "dayjs";
export default {
  components: { GanttChart },
  data() {
    return {
      yAxisData,
      seriesData,
      chartStarTime: "",
      chartEndTime: "",
    };
  },
  mounted() {
    this.chartStarTime = dayjs()
      .subtract(1, "days")
      .format("YYYY-MM-DD 00:00:00");
    this.chartEndTime = dayjs().add(1, "days").format("YYYY-MM-DD 00:00:00");
    this.$nextTick(() => {
      this.$refs["GanttChart"].initEchart();
    });
  },
};
</script>

<style scoped>
.gantt-content {
  width: 100%;
  margin-top: 30px;
  height: calc(100vh - 120px);
  min-height: 450px;
}
</style>
```
