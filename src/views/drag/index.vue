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
