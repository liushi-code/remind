<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <Remind />
    </div>
  </a-config-provider>
</template>
<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import Remind from './views/Remind'
export default {
  name: 'App',
  data () {
    return {
      locale: zhCN,
    }
  },
  components: {
    Remind
  }
}
</script>
<style scoped>
#app {
  height: 100%;
  background-color: #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
