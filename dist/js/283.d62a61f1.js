"use strict";(self["webpackChunkecharts_gantt"]=self["webpackChunkecharts_gantt"]||[]).push([[283],{1801:function(t,a,e){e.r(a),e.d(a,{default:function(){return o}});var s=function(){var t=this,a=t._self._c;return a("div",[a("h1",[t._v("可拖拽甘特图")]),a("div",{staticClass:"gantt-content"},[a("GanttChart",{ref:"GanttChart",attrs:{id:"dragbase",yAxisData:t.yAxisData,seriesData:t.seriesData,chartStarTime:t.chartStarTime,chartEndTime:t.chartEndTime,lockGantt:!1,taskRender:t.taskRender,handleDrag:t.handleDrag}})],1)])},r=[],n=e(6857),c=e(1576),i=e.n(c);const u=[{value:[0,{label:"产线1"}]},{value:[1,{label:"产线2"}]},{value:[2,{label:"产线3"}]},{value:[3,{label:"产线4"}]}],h=[{value:[0,1715653367e3,1715664167e3,0,{name:"G12400002",unitId:"cc7b1707"}]},{value:[1,i()().subtract(1,"hour").valueOf(),i()().add(1,"hour").valueOf(),1,{name:"G12400002",unitId:"cc7b656"}]},{value:[2,i()().valueOf(),i()().add(2,"hour").valueOf(),2,{name:"G12400002",unitId:"cc34656"}]},{value:[3,i()().add(2,"hour").valueOf(),i()().add(4,"hour").valueOf(),3,{name:"G12400002",unitId:"c344656"}]}];var l={components:{GanttChart:n.A},data(){return{yAxisData:u,seriesData:h,chartStarTime:"",chartEndTime:""}},methods:{taskRender(t){return{rectStyle:{stroke:t.selectedType?"#000":"#fff"}}},handleDrag(t,a,e){const s=t[0];this.$confirm("是否确认该次拖动?","提示",{type:"success"}).then((()=>{this.$message.success("更新成功"),this.$notify({title:"变动后时间：",message:`${i()(s.newStartTime).format("YYYY-MM-DD HH:mm:ss")}~${i()(s.newEndTime).format("YYYY-MM-DD HH:mm:ss")}`})})).catch((()=>{e(),this.$message.success("已还原")}))}},mounted(){this.chartStarTime=i()().subtract(1,"days").format("YYYY-MM-DD 00:00:00"),this.chartEndTime=i()().add(1,"days").format("YYYY-MM-DD 00:00:00"),this.$nextTick((()=>{this.$refs["GanttChart"].initEchart()}))}},d=l,m=e(1656),f=(0,m.A)(d,s,r,!1,null,"3b00376c",null),o=f.exports}}]);
//# sourceMappingURL=283.d62a61f1.js.map