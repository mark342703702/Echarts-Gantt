<template>
  <div>
    <div class="link">
      <router-link :to="{ path: '/base' }">基础甘特图</router-link>
      <router-link :to="{ path: '/duration' }">带进度条甘特图</router-link>
      <router-link :to="{ path: '/drag' }">可拖拽甘特图</router-link>
    </div>
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
