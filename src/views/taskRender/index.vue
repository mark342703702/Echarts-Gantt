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
