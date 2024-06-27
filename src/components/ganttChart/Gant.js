/* eslint-disable no-unused-vars */
import * as echarts from "echarts";
import { formatTime, getDataZoom } from "./utils";
import { merge, isNumber } from "lodash";
// import dayjs from "dayjs";

export class Gant {
  constructor(data) {
    const { el } = data;
    this.chart = echarts.init(el);
    //配置
    this.gantConfig = {};
    // 现在时间(线)
    this.nowTimeLineEl = null;
    // 现在时间(文案)
    this.nowTimeTextEl = null;
    //拖拽时间(线)
    this.dragTimeLineEl = null;
    //拖拽时间(文案)
    this.dragTimeTextEl = null;
    // 自定义tooltip
    this.tooltipRender = null;
    // 自定义taskRender
    this.taskRender = null;
    //自定义x轴
    this.xAxisRender = null;
    // seriesData数据
    this.seriesData = [];
    this.updateChart(data);
  }

  //更新视图
  updateChart(data) {
    const { gantConfig, dataZoom, seriesData, yAxisData, tooltipRender, taskRender, xAxisRender } = data;
    //自定义tooltip
    this.tooltipRender = tooltipRender;
    //自定义taskRender
    this.taskRender = taskRender;
    this.xAxisRender = xAxisRender;
    this.gantConfig = gantConfig;
    this.seriesData = seriesData;
    this.chart.setOption(this.getChartOption(seriesData, yAxisData));
    if (dataZoom) {
      this.positionSet(dataZoom);
    } else {
      this.positionNow();
    }

    this.creatNowTime();
  }

  //更新数据
  updateSeriesData(seriesData) {
    this.seriesData = seriesData;
    this.chart.setOption({
      series: [{ id: this.gantConfig.seriesDataID, data: seriesData }]
    });
  }

  //生成当前时间线
  nowTime(nowTime) {
    if (!this.chart) return;
    const [x] = this.chart.convertToPixel("grid", [nowTime, 0]);
    const canvasHeight = this.chart.getHeight() - this.gantConfig.grid.bottom;
    // 时间线
    this.nowTimeLineEl = new echarts.graphic.Line({
      silent: true,
      shape: {
        x1: x,
        y1: this.gantConfig.grid.top, // 竖线起始位置的 y 坐标
        x2: x,
        y2: canvasHeight // 竖线结束位置的 y 坐标
      },
      style: {
        stroke: "#000",
        lineWidth: 1,
        lineDash: [6, 3]
      },
      z: 9
    });

    // 时间(文字)
    this.nowTimeTextEl = new echarts.graphic.Text({
      style: {
        text: ` ${formatTime(nowTime, "hms")} `, // 文字内容
        x: x, // 文字的 x 坐标
        y: this.gantConfig.grid.top - 14, // 文字的 y 坐标
        fill: "#000", // 文字的颜色
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 14 // 文字的字号大小
      },
      z: 9
    });
    this.chart.getZr().add(this.nowTimeLineEl);
    this.chart.getZr().add(this.nowTimeTextEl);
  }

  //创建/更新实时时间
  creatNowTime() {
    const canvasHeight = this.chart.getHeight() - this.gantConfig.grid.bottom;
    const now = new Date().getTime();

    if (!this.nowTimeLineEl && !this.nowTimeTextEl) {
      this.nowTime(now);
      return;
    }

    const [x] = this.chart.convertToPixel("grid", [now, 0]);
    this.nowTimeLineEl.attr({
      shape: {
        x1: x,
        y1: this.gantConfig.grid.top, // 竖线起始位置的 y 坐标
        x2: x,
        y2: canvasHeight // 竖线结束位置的 y 坐标
      }
    });
    this.nowTimeTextEl.attr({
      style: {
        text: ` ${formatTime(now, "hms")} `, // 文字内容
        x: x, // 文字的 x 坐标
        y: this.gantConfig.grid.top - 14 // 文字的 y 坐标
      }
    });
  }

  //拖拽时间线
  creatDragTimeLine(time, positionY) {
    let [x, y] = this.chart.convertToPixel("grid", [time, positionY]);
    y += this.gantConfig.sizeHeight / 2;
    // 时间线
    if (!this.dragTimeLineEl) {
      this.dragTimeLineEl = new echarts.graphic.Line({
        silent: true,
        shape: {
          x1: x,
          y1: this.gantConfig.grid.top, // 竖线起始位置的 y 坐标
          x2: x,
          y2: y // 竖线结束位置的 y 坐标
        },
        style: {
          stroke: "#000",
          lineWidth: 1,
          lineDash: [6, 3]
        },
        z: 9
      });
      this.chart.getZr().add(this.dragTimeLineEl);
    } else {
      this.dragTimeLineEl.attr({
        silent: true,
        shape: {
          x1: x,
          y1: this.gantConfig.grid.top, // 竖线起始位置的 y 坐标
          x2: x,
          y2: y // 竖线结束位置的 y 坐标
        }
      });
    }
    // 时间文字
    if (!this.dragTimeTextEl) {
      this.dragTimeTextEl = new echarts.graphic.Text({
        style: {
          text: formatTime(new Date(time), "hms"), // 文字内容
          x: x, // 文字的 x 坐标
          y: this.gantConfig.grid.top - 14, // 文字的 y 坐标
          fill: "#000", // 文字的颜色
          fontWeight: "bold",
          textAlign: "center",
          fontSize: 14 // 文字的字号大小
        },
        z: 9
      });
      this.chart.getZr().add(this.dragTimeTextEl);
    } else {
      this.dragTimeTextEl.attr({
        style: {
          text: formatTime(new Date(time), "hms"),
          x: x, // 文字的 x 坐标
          y: this.gantConfig.grid.top - 20 // 文字的 y 坐标
        }
      });
    }
  }

  // 回到当前时间范围
  positionNow() {
    const { ECHART_START_TIME, ECHART_END_TIME, timeMaxinterval } = this.gantConfig;
    const { dataZoomStart, dataZoomEnd } = getDataZoom(ECHART_START_TIME, ECHART_END_TIME, timeMaxinterval);
    // console.log("dataZoomStart：" + dataZoomStart);
    // console.log("dataZoomEnd：" + dataZoomEnd);
    this.chart.dispatchAction({
      type: "dataZoom",
      start: dataZoomStart,
      end: dataZoomEnd
    });
  }

  // 视图指定位置
  positionSet(dataZoom) {
    this.chart.dispatchAction({
      type: "dataZoom",
      start: dataZoom.start,
      end: dataZoom.end
    });
  }

  //清除拖拽辅助线
  clearDragTimeLine() {
    this.chart.getZr().remove(this.dragTimeLineEl);
    this.chart.getZr().remove(this.dragTimeTextEl);
    this.dragTimeLineEl = null;
    this.dragTimeTextEl = null;
  }

  //生产渲染配置
  getChartOption(seriesData, yAxisDataPlant) {
    // console.log("seriesData--->", seriesData, "gantConfig--->", gantConfig);
    // const { dataZoomStart, dataZoomEnd } = getDataZoom();
    return {
      backgroundColor: this.gantConfig.backgroundColor,
      tooltip: {
        backgroundColor: "rgba(34,34,34,0.75)",
        borderWidth: 0,
        extraCssText: "border-radius: 2px; box-shadow: 0px 4px 12px 0px rgba(0,0,0,0.12);",
        textStyle: {
          color: "#ffffff",
          lineHeight: 22
        },
        //TODO:实现自己的tooltip
        formatter: params => {
          const { seriesId, data } = params;
          const { TASK_ITEM_INDEX, seriesDataID } = this.gantConfig;
          if (this.tooltipRender && seriesId === seriesDataID) {
            const value = data.value[TASK_ITEM_INDEX];
            return this.tooltipRender({ seriesId, value });
          }
        }
      },
      //工具栏
      toolbox: {
        left: 25,
        top: -5,
        itemSize: 30,
        feature: {
          myPosition: {
            show: true,
            title: "回到当前时间",
            icon:
              "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAnxJREFUWEftmMFPkmEcx7+PsHEgBQ5qBy0Qs1qBUs2cCqcONZptOKWtgx08t1Wrrb+grZZtnT3koS1wsOVidegE4pQVqFSWiZB6SDvAq3JgA9/e593YjDF5X1R4Djy3932evb/Pvr/v+/s9+xEIa25+qYPs4SkP/prw2EDfVXBtE5BPfB2eXO06v0xEGB6zOq1WV3+iHgpFXQVZgFxuDzu7O0imUkmeoIeEwksenU7r0Go0FQUpDJbiOCSTKS+ZC3/nTreeaqi0MoVAVKnf62vbFIhv0+urqk4++GoigRrQQamoKVTKqEemUCAQFGNZrX2lYh64fyRAPM/D9/6DGMh+8wYIIWVDHQpo888mgjOzWPkVQyaTESFUKhXazxjR19uD5pPNssHKAqKKTAdm4PdPw2S+CJPpApqaGsXgW1t/EY1+Q3TxK2y2fvRbe2UpVhZQwB9EKPQZTucgWlpbiqqwsb4Bl8uD7u4rsNqk+0o2EE3T+PhrjIzcEWFyuRwW5hexElsVwdqNbejsMgsNWgEKNTHxBqOjdyWnTzaQ1/sOSqUSAwN2Ecb1dhKxWPw/lYxGA5y3h0SoqSkfstksHI5bkvwkC4h65/mzlxgedkBv0CP8JQKf72PRQHb7dVy6bEE8nsCk24tHj+9L8pJkIFpnuBSHSGQBDx7eg1qthtvtwc8fy0WBzp7rEMAHkU6nMfbiFSyWTmi0mpJ16viBdgWgsWMAojLkUzYkpMxQ7ZTl88KUqSkUc789hWKqMOa9tL91mIXW0VjN1pH3EzPNtbDwMHP92A/G1AVNUpOSeEhypZb4vUMfqwGVkpBZhdgaNrA3jmFtYEWNxtJI7x9/nRQznXn40gAAAABJRU5ErkJggg==",
            //TODO:回到当前时间回调事件
            onclick: this.positionNow.bind(this)
          }
        },
        emphasis: {
          iconStyle: {
            textFill: "#697DFF"
          }
        }
      },
      //区域选择??
      brush: {
        show: false,
        toolbox: [""],
        xAxisIndex: 0
      },
      grid: this.gantConfig.grid,
      //缩放
      dataZoom: [
        {
          type: "slider",
          zoomLock: false,
          //控制哪个坐标轴
          xAxisIndex: 0,
          filterMode: "weakFilter",
          height: 18,
          bottom: 0,
          left: this.gantConfig.grid.left,
          backgroundColor: "#fdfdfd",
          moveHandleStyle: {},
          fillerColor: "#999",
          handleIcon:
            "path://M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
          handleSize: "60%",
          showDetail: false,
          brushSelect: false,
          throttle: 30
        }
      ],
      xAxis: {
        id: this.gantConfig.xAxisId,
        type: "time",
        min: new Date(this.gantConfig.ECHART_START_TIME).getTime(),
        max: new Date(this.gantConfig.ECHART_END_TIME).getTime(),
        position: "top",
        offset: 10,
        maxInterval: this.gantConfig.timeMaxinterval, // 最大刻度值
        minInterval: this.gantConfig.timeMaxinterval, // 最小刻度值
        boundaryGap: false,
        axisLabel: {
          align: "center",
          show: true,
          hideOverlap: true,
          textStyle: { color: "#222" },
          fontSize: 14,
          formatter: (value, index) => {
            if (this.xAxisRender) {
              return this.xAxisRender({ value, index });
            } else {
              const time = formatTime(new Date(value), "obj");
              return `${time.month}/${time.day}` + "\n" + `${time.hour}:00`;
            }
          }
        },
        axisLine: {
          show: false
        },
        axisTick: {
          lineStyle: {
            color: "#E6E6E6"
          }
        }
      },
      yAxis: {
        axisTick: { show: false },
        splitLine: {
          show: true,
          lineStyle: {
            color: "#E6E6E6"
          }
        },
        axisLine: { show: false },
        axisLabel: {
          show: false
        },
        minInterval: 1,
        maxInterval: 1,
        inverse: true,
        min: 0,
        max: yAxisDataPlant.length
      },
      series: [
        // 任务图例
        {
          id: this.gantConfig.seriesDataID,
          type: "custom",
          renderItem: (params, api) => {
            const categoryIndex = api.value(this.gantConfig.CATEGORY_INDEX);
            const start = api.coord([api.value(this.gantConfig.TIME_START), categoryIndex]);
            const end = api.coord([api.value(this.gantConfig.TIME_END), categoryIndex]);

            // console.log(start, end);
            const id = api.value(this.gantConfig.ID_INDEX);
            //这里不能用参数传进来的seriesData(不会变)，要用Gant实例上的seriesData(会变)
            const taskItem = this.seriesData[id].value[this.gantConfig.TASK_ITEM_INDEX];
            const { name, unitId, duration = 1 } = taskItem;
            //通道高度
            const sizeHeight = api.size([0, 1])[1];
            //赋值通道高度sizeHeight
            this.gantConfig.sizeHeight = sizeHeight;
            //任务高度
            let itemHeight = this.gantConfig.yAxisHeight * sizeHeight;
            const itemY = start[1] + (sizeHeight - itemHeight) * 0.5;
            //task宽度
            const itemWidth = end[0] - start[0];
            //task进度宽度
            const itemDurationWidth = itemWidth * duration;
            const rectShape = {
              x: start[0],
              y: itemY,
              width: itemWidth,
              height: itemHeight,
              r: 0
            };

            //计算样式
            const mergeTaskStyle = this.taskRender ? this.taskRender(taskItem) : {};
            const taskStyle = merge({}, this.gantConfig.taskStyle, mergeTaskStyle);

            return {
              type: "group",
              id: unitId,
              children: [
                {
                  type: "rect",
                  shape: {
                    x: start[0] - 4,
                    y: itemY,
                    width: 4,
                    height: itemHeight,
                    r: 0
                  },
                  silent: false,
                  style: {
                    ...api.style(),
                    fill: "rgba(255,255,255,1)"
                  }
                },
                //底部色块
                {
                  type: "rect",
                  shape: rectShape,
                  silent: false,
                  style: {
                    ...api.style(),
                    fill: "rgba(195,195,198, 0.2)"
                  }
                },
                //面部色块
                {
                  type: "rect",
                  shape: {
                    ...rectShape,
                    width: itemDurationWidth
                  },
                  silent: false,
                  style: {
                    ...api.style(),
                    ...taskStyle.rectStyle,
                    opacity: 0.9
                  },
                  emphasis: {
                    style: {
                      opacity: 1,
                      shadowBlur: 3,
                      shadowColor: "rgba(0, 0, 0, 0.1)"
                    }
                  }
                },
                //文字
                {
                  type: "text",
                  silent: true,
                  style: api.style({
                    // x: start[0] + itemDurationWidth * 0.5,
                    x: start[0] + itemWidth / 2,
                    y: itemY + itemHeight * 0.5,
                    width: itemWidth,
                    overflow: "truncate",
                    text: name,
                    ...taskStyle.textStyle
                  })
                }
              ]
            };
          },
          //使坐标轴的范围自适应数据范围
          encode: {
            x: [1, 2],
            y: 0,
            tooltip: [this.gantConfig.CATEGORY_INDEX, this.gantConfig.TIME_START, this.gantConfig.TIME_END]
          },
          data: seriesData,
          smooth: true,
          animation: true, // 开启动画
          animationEasing: "cubicInOut",
          animationDuration: 200 // 动画过渡时间，单位为毫
        },
        //Y轴图例
        {
          id: this.gantConfig.yAxisDataID,
          type: "custom",
          renderItem: (params, api) => {
            //y轴种类id
            const categoryIndex = api.value(0);
            //y轴item数据
            const yAxisItemData = yAxisDataPlant[categoryIndex].value[1];
            //跨行
            const rowLength = isNumber(yAxisItemData.rowLength) ? yAxisItemData.rowLength : 1;
            //通道最左上的点的坐标
            const start = api.coord([0, categoryIndex]);
            //计算通道高度
            const sizeHeight = api.size([0, 1])[1];
            const rectShape = {
              x: 0,
              y: start[1],
              width: this.gantConfig.grid.left,
              height: sizeHeight * rowLength
            };
            return {
              type: "group",
              children: [
                {
                  type: "rect",
                  shape: rectShape,
                  style: {
                    text: `${rowLength === 0 ? "" : yAxisItemData.label}`,
                    fill: "#fff",
                    textFill: "#222222",
                    textPosition: "inside",
                    fontSize: 14,
                    lineWidth: 1,
                    stroke: rowLength === 0 ? "#fff" : "#E6E6E6"
                  }
                }
              ]
            };
          },
          encode: {
            y: 0,
            x: -1
          },
          data: yAxisDataPlant,
          z: 10
        },
        // 2级Y轴图例
        {
          id: this.gantConfig.ySubAxisDataID,
          type: "custom",
          renderItem: (params, api) => {
            //y轴种类id
            const categoryIndex = api.value(0);
            //y轴item数据
            const yAxisItemData = yAxisDataPlant[categoryIndex].value[1];
            //通道最左上的点的坐标
            const start = api.coord([0, categoryIndex]);
            //计算通道高度
            const sizeHeight = api.size([0, 1])[1];
            const rectShape = {
              x: this.gantConfig.grid.left,
              y: start[1],
              width: this.gantConfig.grid.left / this.gantConfig.grid.left,
              height: sizeHeight
            };
            return yAxisItemData.subLabel
              ? {
                  type: "group",
                  children: [
                    {
                      type: "rect",
                      shape: rectShape,
                      style: {
                        text: `${yAxisItemData.subLabel}`,
                        fill: "#fff",
                        textFill: "#11152B",
                        textPosition: "inside",
                        fontSize: 16,
                        lineWidth: 1,
                        stroke: "#ffffff"
                      }
                    }
                  ]
                }
              : null;
          },
          encode: {
            y: 0,
            x: -1
          },
          data: yAxisDataPlant
        }
      ]
    };
  }

  //判断是否显示文字
  isHideText(itemWidth, itemHeight) {
    return itemWidth < this.gantConfig.minTextWidth || itemHeight < this.gantConfig.minTextHeight;
  }
}
