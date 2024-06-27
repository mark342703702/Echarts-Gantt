# 甘特图组件文档

## Attributes

| 属性名         | 类型                                   | 默认值 | 是否必填 | 示例                | 描述                                                                          |
| -------------- | -------------------------------------- | ------ | -------- | ------------------- | ----------------------------------------------------------------------------- |
| id             | String                                 | -      | 是       | mychart             | 甘特图组件 id，需唯一                                                         |
| yAxisData      | Array                                  | -      | 是       | 参考示例代码        | y 轴配置数据                                                                  |
| seriesData     | Array                                  | -      | 是       | 参考示例代码        | 甘特图数据                                                                    |
| chartStarTime  | String                                 | -      | 是       | 2024-12-12 15:00:00 | 甘特图范围开始时间                                                            |
| chartEndTime   | String                                 | -      | 是       | 2024-12-12 16:00:00 | 甘特图范围结束时间                                                            |
| lockGantt      | Boolean                                | true   | 否       |                     | 是否锁定甘特图，锁定后甘特图无法拖拽、无法右键点唤起菜单                      |
| multiChoose    | Boolean                                | false  | 否       |                     | 是否允许多选                                                                  |
| tooltipRender  | Function({value})/String               |        | 否       | 参考示例代码        | 自定义 tooltip 函数                                                           |
| taskRender     | Function(data)/Object                  |        | 否       | 参考示例代码        | 自定义色块样式                                                                |
| menuRender     | Function({data})/Array                 |        | 否       | 参考示例代码        | 自定义菜单选项                                                                |
| ableChooseFunC | Function(data)/Boolean                 |        | 否       | 参考示例代码        | 自定义色块是否能被选中，选中后可以进行拖拽，右键选中等操作                    |
| handleDrag     | Function(list, seriesData, goBackDrag) |        | 否       | 参考示例代码        | 拖拽后回调函数 list 为变动数据， seriesData 为所有数据, goBackDrag 为回撤函数 |
| xAxisRender    | Function({value, index})/String        |        | 否       | 参考示例代码        | 自定义 X 轴渲染                                                               |

## yAxisData

| 属性名         | 类型   | 描述                                          |
| -------------- | ------ | --------------------------------------------- |
| value[0]       | Number | y 轴的 index,必须唯一，且为连续整数，用于定位 |
| value[1].label | String | y 轴名称                                      |

## seriesData

| 属性名                | 类型      | 描述                                                             |
| --------------------- | --------- | ---------------------------------------------------------------- |
| value[0]              | Number    | 所属 Y 轴的 index                                                |
| value[1]              | Timestamp | 开始时间的时间戳 13 位                                           |
| value[2]              | Timestamp | 结束时间的时间戳 13 位                                           |
| value[3]              | Number    | 色块 id,需唯一                                                   |
| value[4].name         | String    | 色块显示名称                                                     |
| value[4].unitId       | String    | 数据 id,需唯一                                                   |
| value[4].duration     | Number    | 色块进度，不传默认为 1                                           |
| value[4].selectedType | Number    | 标识色块是否选中，用户不需要传，组件自动生成，用户可用于判断状态 |

## events

| 事件名     | 参数 | 描述              |
| ---------- | ---- | ----------------- |
| initEchart | ops  | 甘特图初始化/更新 |

## events ops

| 属性名          | 类型   | 默认值                               | 描述                 |
| --------------- | ------ | ------------------------------------ | -------------------- |
| backgroundColor | String | #ffffff                              | 甘特图背景颜色       |
| yAxisHeight     | Number | 0.7                                  | 色块高度占通道的占比 |
| timeMaxinterval | Number | 3600000                              | x 轴时间间隔         |
| grid            | Object | top:50, left: 90,right: 0,bottom: 30 | 甘特图上下左右间距   |
| yAxisData       | Object | top:50, left: 90,right: 0,bottom: 30 | y 轴配置数据         |
| seriesData      | Object | top:50, left: 90,right: 0,bottom: 30 | 甘特图数据           |
