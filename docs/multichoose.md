# 多选操作

## 注意

1.需要设置 lockGantt 为 false,允许编辑甘特图

2.需要设置 multiChoose 为 true,允许多选

3.多选操作为鼠标滑动区域，在区域内的色块即被选中，选中后支持批量右键操作或批量拖拽

## 尝试一下

[点击查看效果](https://mark342703702.github.io/Echarts-Gantt//#/multichoose)

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
    <h1>
      多选操作
      <el-link type="primary" @click="show = true">查看演示</el-link>
    </h1>
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
        :multiChoose="true"
        :menuRender="menuRender"
        @menuOperateSubmit="menuOperateSubmit"
      />
    </div>
    <el-dialog title="操作演示" :visible.sync="show" width="80%" top="5vh">
      <el-image :src="pic"></el-image>
    </el-dialog>
  </div>
</template>

<script>
import GanttChart from "@/components/ganttChart";
import { yAxisData, seriesData } from "./config";
import pic from "@/assets/op1.gif";
import dayjs from "dayjs";
import { cloneDeep } from "lodash";
export default {
  components: { GanttChart },
  data() {
    return {
      show: false,
      pic,
      yAxisData,
      seriesData,
      chartStarTime: "",
      chartEndTime: "",
    };
  },
  methods: {
    menuOperateSubmit(item) {
      switch (item.event) {
        case "single-del":
          this.$notify({
            title: "提示",
            message: "您操作了删除",
            type: "success",
          });
          break;

        case "multi-del":
          this.$notify({
            title: "提示",
            message: "您操作了批量删除",
            type: "success",
          });
          break;
      }
    },
    menuRender(data, selectRows) {
      const { data: task } = data;
      if (selectRows.length > 1) {
        return [
          {
            label: "批量删除",
            event: "multi-del",
            disabled: false,
            target: cloneDeep(task),
          },
        ];
      } else {
        return [
          {
            label: "删除",
            event: "single-del",
            disabled: false,
            target: cloneDeep(selectRows),
          },
        ];
      }
    },
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
      const h = this.$createElement;
      const htmlContent = h(
        "div",
        {},
        list.map((i) =>
          h(
            "div",
            {},
            `${dayjs(i.newStartTime).format("YYYY-MM-DD HH:mm:ss")}~${dayjs(
              i.newEndTime
            ).format("YYYY-MM-DD HH:mm:ss")}`
          )
        )
      );
      this.$confirm("是否确认该次拖动?", "提示", { type: "success" })
        .then(() => {
          this.$message.success("更新成功");
          this.$notify({
            title: "变动后时间：",
            message: htmlContent,
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
