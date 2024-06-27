# 甘特图组件文档

欢迎使用甘特图组件文档。

## 使用指南

### 快速开始

```vue
<template>
  <div>
    <GanttChart :tasks="tasks" :start-date="startDate" :end-date="endDate" />
  </div>
</template>

<script>
import GanttChart from "your-gantt-chart-component";

export default {
  components: {
    GanttChart,
  },
  data() {
    return {
      tasks: [
        { id: 1, name: "Task 1", start: "2024-06-01", end: "2024-06-05" },
        { id: 2, name: "Task 2", start: "2024-06-03", end: "2024-06-10" },
      ],
      startDate: "2024-06-01",
      endDate: "2024-06-30",
    };
  },
};
</script>
```
