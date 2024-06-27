<template>
  <div>
    <div class="link">
      <router-link :to="{ path: '/base' }">基础甘特图</router-link>
      <router-link :to="{ path: '/duration' }">带进度条甘特图</router-link>
      <router-link :to="{ path: '/drag' }">可拖拽甘特图</router-link>
      <router-link :to="{ path: '/taskRender' }">自定义色块样式</router-link>
      <router-link :to="{ path: '/menu' }">自定义右键菜单</router-link>
      <router-link :to="{ path: '/tooltipRender' }">自定义tooltip</router-link>
      <router-link :to="{ path: '/multichoose' }">多选操作</router-link>
    </div>
    <div></div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.link {
  display: flex;
  flex-direction: column;
}
</style>
