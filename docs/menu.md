# 自定义右键菜单

## 注意

1.需要设置 menuRender 自定义渲染函数，根据数据的类型自行展示选项

2.需要设置 menuOperateSubmit 操作接收函数，处理真实操作

## 尝试一下

[点击查看效果](https://mark342703702.github.io/Echarts-Gantt//#/menu)

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
        type: "start",
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
        type: "doing",
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
        type: "done",
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
        type: "start",
      },
    ],
  },
];
```

**index.vue**

```vue
<template>
  <div>
    <h1>自定义色块样式</h1>
    <div class="gantt-content">
      <GanttChart
        ref="GanttChart"
        id="chartbase"
        :yAxisData="yAxisData"
        :seriesData="seriesData"
        :chartStarTime="chartStarTime"
        :chartEndTime="chartEndTime"
        :taskRender="taskRender"
        :menuRender="menuRender"
        @menuOperateSubmit="menuOperateSubmit"
        :lockGantt="false"
      />
    </div>
  </div>
</template>

<script>
import GanttChart from "@/components/ganttChart";
import { yAxisData, seriesData } from "./config";
import { cloneDeep } from "lodash";
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
  methods: {
    menuOperateSubmit(item) {
      switch (item.event) {
        case "chart-close":
          this.$notify({
            title: "提示",
            message: "您操作了关闭",
            type: "success",
          });
          break;

        case "chart-info":
          this.$notify({
            title: "提示",
            message: "您操作了查看详情",
            type: "success",
          });
          break;

        case "chart-edit":
          this.$notify({
            title: "提示",
            message: "您操作了编辑",
            type: "success",
          });
          break;

        case "chart-del":
          this.$notify({
            title: "提示",
            message: "您操作了删除",
            type: "success",
          });
          break;
      }
    },
    taskRender(data) {
      const colorDict = {
        start: "#266FFF",
        doing: "#5CCC81",
        done: "#9ACDFF",
      };
      return {
        rectStyle: {
          fill: colorDict[data.type],
        },
        textStyle: {
          fontSize: 20,
          fontWeight: 600,
        },
      };
    },
    menuRender(data) {
      const { data: task } = data;
      if (task.type === "doing") {
        return [
          {
            label: "关闭",
            event: "chart-close",
            disabled: false,
            target: cloneDeep(task),
          },
        ];
      } else {
        return [
          {
            label: "删除",
            event: "chart-del",
            disabled: false,
            target: cloneDeep(task),
          },
          {
            label: "详情",
            event: "chart-info",
            disabled: false,
            target: cloneDeep(task),
          },
          {
            label: "编辑",
            event: "chart-edit",
            disabled: false,
            target: cloneDeep(task),
          },
        ];
      }
    },
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
