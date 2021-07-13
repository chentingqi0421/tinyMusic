<template>
  <ul>
      <GeneralList v-for="v in searchMusicList" :list="searchMusicList" :key="v.id" :item="v"></GeneralList>
  </ul>
</template>
<script>
import GeneralList from './GeneralList'
export default {
    name:"searchsult",
  props:[
    'searchMusicList'
  ],
  components:{
    GeneralList
  }
}
</script>
<style lang="less" scoped>

</style>