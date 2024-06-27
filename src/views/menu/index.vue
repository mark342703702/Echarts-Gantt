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
