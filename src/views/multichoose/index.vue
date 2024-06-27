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
