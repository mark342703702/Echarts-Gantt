<template>
  <div class="gant-container">
    <div :id="id" :ref="id" class="gant-echart" @click.stop></div>
    <div
      class="gant-operation"
      :style="{ left: menuStyleLeft + 'px', top: menuStyleTop + 'px' }"
      v-show="menuShow"
    >
      <div
        v-for="(menu, index) in menuList"
        :class="menu.disabled ? 'disabled' : 'abled'"
        :key="index"
        @click="optionFun(menu, $event)"
      >
        {{ menu.label }}
      </div>
    </div>
  </div>
</template>

<script>
import { Gant } from "./Gant";
import { gantConfig } from "./ganttConfig";
import { merge, cloneDeep, throttle, debounce } from "lodash";

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
    yAxisData: {
      type: Array,
      default: () => [],
      required: true,
    },
    seriesData: {
      type: Array,
      default: () => [],
      required: true,
    },
    chartStarTime: {
      type: String,
      required: true,
    },
    chartEndTime: {
      type: String,
      required: true,
    },
    tooltipRender: {
      type: Function,
    },
    taskRender: {
      type: Function,
    },
    menuRender: {
      type: Function,
    },
    //可被选中函数
    ableChooseFunC: {
      type: Function,
    },
    //处理拖拽
    handleDrag: {
      type: Function,
    },
    //x轴自定义函数
    xAxisRender: {
      type: Function,
    },
    //是否锁定甘特图，锁定后无法操作
    lockGantt: {
      type: Boolean,
      default: true,
    },
    //是否允许多选
    multiChoose: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      gantConfig: {},
      Gant: null,
      dataZoom: null,
      //调试用
      // dataZoom: {
      //   start: 93.1515559,
      //   end: 94.883
      // },
      timer: null,
      //是否绑定甘特图事件
      bindEvent: false,
      //右键菜单
      menuShow: false,
      menuStyleLeft: 0,
      menuStyleTop: 0,
      //记录鼠标状态
      mouseStatus: { position: "", isMove: "", type: "" },
      //选中的item
      selectRows: [],
      //鼠标右键选项
      menuList: [],
      //单个鼠标选中元素
      draggingEl: null,
    };
  },
  methods: {
    handleDatazoom: debounce(function (data) {
      this.closeBrush();
      this.dataZoom = data;
    }, 500),
    freshElPosition(cursors) {
      const moveStart = this.Gant.chart.convertFromPixel("grid", [
        this.mouseStatus.position.x,
        this.mouseStatus.position.y,
      ]);
      const moveEnd = this.Gant.chart.convertFromPixel("grid", [
        cursors.offsetX,
        cursors.offsetY,
      ]);
      const moveX = moveEnd[0] - moveStart[0];
      //暂不允许跨行
      // const moveY = Math.floor(moveEnd[1]);
      // console.log(moveX);

      //组织 创建时间线的数据
      const firstSelectData =
        this.selectRows[0].value[this.gantConfig.TASK_ITEM_INDEX];
      const dragTimeLineInfo = {
        startPointX: null,
        startPointY: this.selectRows[0].value[this.gantConfig.CATEGORY_INDEX],
      };

      const seriesData = cloneDeep(this.Gant.seriesData);
      seriesData.forEach((item) => {
        const itemData = item.value[this.gantConfig.TASK_ITEM_INDEX];
        if (itemData.selectedType) {
          const lastPostion = itemData.chartPostions[0];
          item.value[1] = lastPostion.startPointX + moveX;
          item.value[2] = lastPostion.endPointX + moveX;
          itemData.newStartTime = item.value[1];
          itemData.newEndTime = item.value[2];

          if (itemData.unitId === firstSelectData.unitId) {
            dragTimeLineInfo.startPointX = item.value[1];
          }
        }
      });

      this.Gant.creatDragTimeLine(
        dragTimeLineInfo.startPointX,
        dragTimeLineInfo.startPointY
      );
      this.Gant.updateSeriesData(seriesData);
    },
    mouseMove: throttle(function (e) {
      // console.log(e);
      const { type } = this.mouseStatus;
      if (!this.draggingEl || !type) {
        return;
      }

      const cursors = {
        offsetX: e.offsetX,
        offsetY: e.offsetY,
      };

      //  过滤微小移动,防止误操作
      if (Math.abs(cursors.offsetX) > 80) {
        this.mouseStatus.isMove = true;
        this.freshElPosition(cursors);
        // console.log(cursors);
      } else {
        this.mouseStatus.isMove = false;
      }
    }, 35),
    // 关闭框选
    closeBrush() {
      this.Gant.chart.dispatchAction({
        type: "takeGlobalCursor",
        key: "",
      });
      this.Gant.chart.dispatchAction({
        type: "brush",
        areas: [],
      });
    },
    //清除选项
    clearMultipleList() {
      if (this.selectRows.length != 0) {
        const seriesData = cloneDeep(this.Gant.seriesData);
        seriesData.forEach((item) => {
          item.value[this.gantConfig.TASK_ITEM_INDEX].selectedType = false;
        });
        this.selectRows = [];
        this.Gant.updateSeriesData(seriesData);
      }
    },
    // 处理框选结果
    brushEnd(params) {
      // 处理选区数据
      if (params.areas.length === 0) {
        return;
      }

      // 获取选区范围
      const [xAxisRange, yAxisRange] = params.areas[0].range;
      const [xstartValue, xendValue] = xAxisRange; //x 轴 startValue
      const [ystartValue, yendValue] = yAxisRange; //y轴 startValue
      const rangStart = this.Gant.chart.convertFromPixel(
        { xAxisIndex: 0, yAxisIndex: 0 },
        [xstartValue, ystartValue]
      );
      const rangEnd = this.Gant.chart.convertFromPixel(
        { xAxisIndex: 0, yAxisIndex: 0 },
        [xendValue, yendValue]
      );

      const seriesData = cloneDeep(this.Gant.seriesData);

      seriesData.forEach((item) => {
        const categoryIndex = item.value[this.gantConfig.CATEGORY_INDEX];
        const startTime = item.value[this.gantConfig.TIME_START];
        const endTime = item.value[this.gantConfig.TIME_END];
        const offset = 0.3;
        const isContain =
          ((rangStart[0] <= startTime && startTime <= rangEnd[0]) ||
            (rangStart[0] <= endTime && endTime <= rangEnd[0]) ||
            (startTime <= rangStart[0] && rangStart[0] <= endTime) ||
            (startTime <= endTime[0] && endTime[0] <= endTime)) &&
          Math.floor(rangStart[1] + offset) <= categoryIndex &&
          categoryIndex <= rangEnd[1] - offset;
        const isCustomContain =
          !this.ableChooseFunC ||
          (this.ableChooseFunC &&
            this.ableChooseFunC(item.value[this.gantConfig.TASK_ITEM_INDEX]));

        if (isContain && isCustomContain) {
          item.value[this.gantConfig.TASK_ITEM_INDEX].selectedType = true;
          item.value[this.gantConfig.TASK_ITEM_INDEX].chartPostions = [
            {
              startPointX: item.value[this.gantConfig.TIME_START],
              endPointX: item.value[this.gantConfig.TIME_END],
              itemWidth:
                item.value[this.gantConfig.TIME_END] -
                item.value[this.gantConfig.TIME_START],
            },
          ];
        } else {
          item.value[this.gantConfig.TASK_ITEM_INDEX].selectedType = false;
        }
      });

      this.selectRows = seriesData
        .filter((i) => i.value[4].selectedType)
        .sort((a, b) => {
          return a.value[1] - b.value[1];
        });

      this.Gant.updateSeriesData(seriesData);
      this.closeBrush();
    },
    getTaskData(task) {
      return task.value[this.gantConfig.TASK_ITEM_INDEX];
    },
    optionFun(item, e) {
      if (e.target.className.includes("disabled")) {
        return;
      }
      this.$emit("menuOperateSubmit", item);
      this.menuShow = false;
    },
    // 阻止默认右键菜单行为
    preventContextMenu(event) {
      event.preventDefault();
    },
    closeOptionButton() {
      this.menuShow = false;
    },
    // 初始化甘特图事件
    gantInitEvent() {
      this.bindEvent = true;

      //图像上的鼠标按下行为
      this.Gant.chart.on("mousedown", (param) => {
        /*********************选中元素*******************/

        if (this.lockGantt) {
          return;
        }

        // 选中元素信息
        let recordParam = null;

        //点击元素
        if (param.seriesId === this.gantConfig.seriesDataID) {
          recordParam = {
            data: this.getTaskData(param),
            seriesId: param.seriesId,
          };
        }

        //点击一级y轴(这里只争对鼠标右键)
        if (param.seriesId === this.gantConfig.yAxisDataID) {
          recordParam = {
            data: param.value[this.gantConfig.Y_Axis_ITEM_INDEX],
            seriesId: param.seriesId,
          };
        }

        //点击二级y轴(这里只争对鼠标右键)
        if (param.seriesId === this.gantConfig.ySubAxisDataID) {
          recordParam = {
            data: param.value[this.gantConfig.Y_Axis_ITEM_INDEX],
            seriesId: param.seriesId,
          };
        }

        // console.log(recordParam);

        if (!recordParam || !recordParam.data) {
          console.error("点击未匹配到元素");
          return;
        }

        /*********************左键*******************/
        /*********************点中元素*******************/
        if (recordParam.seriesId === this.gantConfig.seriesDataID) {
          // console.log(recordParam);
          this.closeOptionButton();
          this.mouseStatus = {
            type: "mousedown",
            position: { x: param.event.offsetX, y: param.event.offsetY },
            isMove: false,
          };
          //如果可以被选中  ableChooseFunC：自定义选中逻辑
          if (
            !this.ableChooseFunC ||
            (this.ableChooseFunC && this.ableChooseFunC(recordParam.data))
          ) {
            this.draggingEl = recordParam;
            const exist = this.selectRows.some(
              (item) =>
                item.value[this.gantConfig.TASK_ITEM_INDEX].unitId ===
                recordParam.data.unitId
            );
            if (!exist) {
              const seriesData = cloneDeep(this.Gant.seriesData);
              seriesData.forEach((i) => {
                const item = this.getTaskData(i);
                // console.log(item);
                if (item.unitId === recordParam.data.unitId) {
                  //是否选中，选中为userSelected, 未选中为空
                  item.selectedType = true;
                  //记录开始拖拽的位置
                  item.chartPostions = [
                    {
                      startPointX: i.value[this.gantConfig.TIME_START],
                      endPointX: i.value[this.gantConfig.TIME_END],
                      itemWidth:
                        i.value[this.gantConfig.TIME_END] -
                        i.value[this.gantConfig.TIME_START],
                    },
                  ];
                } else {
                  item.selectedType = false;
                }
              });
              // console.log(seriesData);
              this.selectRows = seriesData
                .filter((i) => i.value[4].selectedType)
                .sort((a, b) => {
                  return a.value[1] - b.value[1];
                });
              this.Gant.updateSeriesData(seriesData);
            }
          }
        }

        /*********************右键*******************/
        if (param.event.event.buttons == 2) {
          this.closeOptionButton();
          //判断任务
          if (recordParam && this.menuRender) {
            const selectRows = this.selectRows.map(
              (i) => i.value[this.gantConfig.TASK_ITEM_INDEX]
            );
            //有选项才显示
            this.menuList = this.menuRender(recordParam, selectRows);
            this.menuShow = !!(this.menuList && this.menuList.length);
            // 按钮位置更新
            const canvasWidht = this.$refs[this.id].offsetWidth;
            this.menuStyleLeft =
              canvasWidht - param.event.event.zrX < 100
                ? param.event.event.zrX - 110
                : param.event.event.zrX + 10;
            this.menuStyleTop = param.event.event.zrY + 10;
          }
        }
      });

      //chart上的鼠标按下行为
      this.Gant.chart.getZr().on("mousedown", (event) => {
        // console.log("Zrmousedown2", event);

        if (this.lockGantt || !this.multiChoose) {
          return;
        }

        // 没有 target 意味着鼠标/指针不在任何一个图形元素上，它是从“空白处”触发的。
        // 鼠标左键点击
        if (!event.target && event.event.buttons === 1) {
          this.closeOptionButton();
          this.Gant.chart.dispatchAction({
            type: "takeGlobalCursor",
            key: "brush",
            brushOption: {
              brushType: "rect",
              brushMode: "single",
            },
          });
        }
      });

      // -------------------------------------mousemove-------------------------------------
      this.Gant.chart.getZr().on("mousemove", (event) => {
        if (this.lockGantt) {
          return;
        }
        if (this.mouseStatus.type === "mousedown") {
          this.mouseMove(event);
        }
      });

      //画框选中行为
      this.Gant.chart.on("brushEnd", (params) => {
        this.brushEnd(params);
      });

      //改变数据缩放行为
      this.Gant.chart.on("datazoom", (param) => {
        // console.log("datazoom", param);
        // 清空图形
        this.clearMultipleList();
        this.closeOptionButton();
        // this.closeBrush();
        this.handleDatazoom({ start: param.start, end: param.end });
      });

      // -------------------------------------click-------------------------------------
      this.Gant.chart.getZr().on("click", (event) => {
        // console.log("click");
        // 没有 target 意味着鼠标/指针不在任何一个图形元素上，它是从“空白处”触发的。
        if (!event.target) {
          this.clearMultipleList();
          this.closeOptionButton();
          this.closeBrush();
        }
      });

      this.Gant.chart.getZr().on("mouseup", () => {
        if (this.mouseStatus.isMove && this.draggingEl) {
          this.saveDrag();
          this.Gant.clearDragTimeLine();
          this.draggingEl = null;
        }

        this.mouseStatus.type = "";
        this.mouseStatus.isMove = false;
      });
    },
    //初始化&&更新
    initEchart(customConfig = {}) {
      this.gantConfig = merge(
        {},
        {
          ...gantConfig,
          ECHART_START_TIME: this.chartStarTime,
          ECHART_END_TIME: this.chartEndTime,
        },
        customConfig
      );
      const chartsOption = {
        el: this.$refs[this.id],
        gantConfig: this.gantConfig,
        yAxisData: this.yAxisData,
        seriesData: this.seriesData,
        dataZoom: this.dataZoom,
        tooltipRender: this.tooltipRender,
        taskRender: this.taskRender,
        xAxisRender: this.xAxisRender,
      };
      if (!this.Gant) {
        this.Gant = new Gant(chartsOption);
      } else {
        this.Gant.updateChart(chartsOption);
      }

      if (!this.timer) {
        this.timer = setInterval(() => {
          this.Gant.creatNowTime();
        }, 1000);
      }

      if (!this.bindEvent) {
        //初始化甘特图事件
        this.gantInitEvent();
      }
    },
    //拖拽保存
    saveDrag() {
      const seriesData = cloneDeep(this.Gant.seriesData);
      const moveData = seriesData
        .filter((i) => i.value[4].selectedType)
        .map((i) => i.value[this.gantConfig.TASK_ITEM_INDEX]);
      //推拽撤回
      const goBackDrag = () => {
        seriesData.forEach((item) => {
          const itemData = item.value[this.gantConfig.TASK_ITEM_INDEX];
          if (itemData.selectedType) {
            const lastPostion = itemData.chartPostions[0];
            item.value[1] = lastPostion.startPointX;
            item.value[2] = lastPostion.endPointX;
          }
        });
        this.Gant.updateSeriesData(seriesData);
      };
      if (this.handleDrag) {
        this.handleDrag(moveData, seriesData, goBackDrag);
      }
      this.clearMultipleList();
    },
    resizeHanlder() {
      if (this?.Gant?.chart) {
        this.Gant.chart.resize();
      }
    },
  },
  mounted() {
    document.addEventListener("contextmenu", this.preventContextMenu);
    window.addEventListener("resize", debounce(this.resizeHanlder), 300);
  },
  destroyed() {
    document.removeEventListener("contextmenu", this.preventContextMenu);
    window.removeEventListener("resize", this.resizeHanlder);
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this?.Gant?.chart) {
      this.Gant.chart.dispose();
    }
  },
};
</script>

<style scoped>
.gant-container {
  position: relative;
  height: 100%;
  width: 100%;
}

.gant-echart {
  height: 100%;
  width: 100%;
  margin-top: 30px;
  min-height: 400px;
}

.gant-operation {
  box-sizing: border-box;
  padding: 4px 0px;
  background-color: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.12);
  font-size: 14px;
  position: absolute;
  z-index: 99999999;
  transition-duration: 200ms;
  cursor: pointer;
}

.gant-operation .abled {
  box-sizing: border-box;
  padding: 0px 16px;
  height: 32px;
  line-height: 32px;
  color: #222;
  font-size: 14px;
}

.gant-operation .abled:hover {
  background-color: #f0f7ff;
  color: #697dff;
}

.gant-operation .disabled {
  cursor: not-allowed;
  color: #cfd0d3;
  box-sizing: border-box;
  padding: 0px 16px;
  height: 32px;
  line-height: 32px;
}
</style>
