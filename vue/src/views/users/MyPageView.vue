<template>
  <v-container class="py-8 px-6 text-center" fluid >
    <v-row justify="center" id="userArea">
      <v-cols col="12">
        <AppLeftMenuUserArea />   
      </v-cols>
    </v-row> 
    <!-- フッターメニュー -->
    <AppFooterMenu :showFooterMenu="true" />
  </v-container>      
</template>

<script>
// フッターメニュー
import AppFooterMenu from '@/components/App/AppFooterMenu.vue';
import AppLeftMenuUserArea from '@/components/App/AppLeftMenuUserArea.vue';

export default {
  components: {
    AppFooterMenu,
    AppLeftMenuUserArea,
  },

  data: () => ({
      AppFooterMenu
  }),
  mounted() {

  },
  methods: {

  }    
}
</script>

<style scoped>
#userArea {
  margin: 80px;
}
</style>