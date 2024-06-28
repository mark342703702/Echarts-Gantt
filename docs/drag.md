# 可拖拽甘特图

## 注意

1.需要设置 lockGantt 为 false,允许编辑甘特图

2.设置拖拽回调函数 handleDrag，拖拽支持撤回（goBackDrag）

## 尝试一下

[点击查看效果](https://mark342703702.github.io/Echarts-Gantt//#/drag)

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
        unitId: "cc7b1707",
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
        unitId: "cc7b656",
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
        unitId: "cc34656",
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
        unitId: "c344656",
      },
    ],
  },
];
```

**index.vue**

```vue
<template>
  <div>
    <h1>可拖拽甘特图</h1>
    <div class="gantt-content">
      <GanttChart
        ref="GanttChart"
        id="dragbase"
        :yAxisData="yAxisData"
        :seriesData="seriesData"
        :chartStarTime="chartStarTime"
        :chartEndTime="chartEndTime"
        :lockGantt="false"
        :taskRender="taskRender"
        :handleDrag="handleDrag"
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
  methods: {
    taskRender(data) {
      return {
        rectStyle: {
          //自定义选中样式
          stroke: data.selectedType ? "#000" : "#fff",
        },
      };
    },
    /**
     *
     * @param {Array} list 变动的数据
     * @param {Array} seriesData 所有数据，可以用来校验
     * @param {Function} goBackDrag 回退函数
     */
    handleDrag(list, seriesData, goBackDrag) {
      const target = list[0];
      this.$confirm("是否确认该次拖动?", "提示", { type: "success" })
        .then(() => {
          this.$message.success("更新成功");
          this.$notify({
            title: "变动后时间：",
            message: `${dayjs(target.newStartTime).format(
              "YYYY-MM-DD HH:mm:ss"
            )}~${dayjs(target.newEndTime).format("YYYY-MM-DD HH:mm:ss")}`,
          });
        })
        .catch(() => {
          goBackDrag();
          this.$message.success("已还原");
        });
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
