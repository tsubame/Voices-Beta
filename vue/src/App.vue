<template>
  <v-app id="inspire">
    <!-- システムバー -->
    <!--
    <v-system-bar>      
      <v-spacer></v-spacer>
    -->
      <!--
      <v-icon>mdi-square</v-icon>
      <v-icon>mdi-circle</v-icon>
      <v-icon>mdi-triangle</v-icon>
      --> 
    <!--
    </v-system-bar>
    -->
     
    <v-navigation-drawer v-model="drawer">

      <AppLeftMenuUserArea />
      <!--
      <v-sheet
        color="grey-lighten-4"
        class="pa-4"
      >
        <v-avatar
          class="mb-4"
          color="grey-darken-1"
          size="64"
        ></v-avatar>

        <div>john@google.com</div>
      </v-sheet>
      -->

      <v-divider></v-divider>

      <!-- 横メニューアイテム -->
      <AppLeftMenuItems />
    </v-navigation-drawer>

    <!-- router view -->    
    <router-view />   

    <!-- モーダルダイアログ -->
    <AppModalLoginDialog :showDialog="showLoginDialog" />
  </v-app>
</template>

<!-- 
//======================================================
//
// Script
//
//======================================================
-->

<script>
import AppModalLoginDialog from './components/App/AppModalLoginDialog.vue';
import AppLeftMenuItems from './components/App/AppLeftMenuItems.vue';
import AppLeftMenuUserArea from './components/App/AppLeftMenuUserArea.vue';
//import AppFooterMenu from './components/App/AppFooterMenu.vue';
//import { CONSTANTS } from './consts/ConstantVals';

//======================================================
//
// App.vue JavaScript
// 
// [索引]
//   □ 0-1. created
//    ・未ログインならログイン用ダイアログを表示
//
//======================================================

export default {   

  // コンポーネント 
  components: {
    AppModalLoginDialog,
    AppLeftMenuItems,
    //AppFooterMenu,
    AppLeftMenuUserArea,
  },

  // data
  data: () => ({
    drawer: null,
    isMobile: false,
    showMenu: false,

    showLoginDialog: false,  
  }),
  
  //======================================================
  //
  // 0-1. created
  //
  //======================================================

  /**
   * created
   *  ・未ログインならログイン用ダイアログを表示
   */
  created() {
    // 未ログインならログイン用ダイアログを表示
    try {
      if (!this.$store.getters.getHasLogined) {
        console.log("未ログインのためログイン用ダイアログを表示")
        this.showLoginDialog = true
      }
    } catch (error) {        
      console.error(error);      
    }
  },

  //======================================================
  //
  // 0-2. mounted
  //
  //======================================================

  /**
   * mounted
   */
  mounted() {

  },

  //======================================================
  //
  // 1. methods
  //
  //======================================================  

  /**
   * methods
   */
  methods: {


  },

}
</script>

<!-- 
//======================================================
//
// CSS
//
//======================================================
-->
<style>
/* body */
body {

}
/* 見出し */
h2 {
  margin: 80px 0 40px;
  font-size: 110%;

  border-left: 2px solid #74B9C3;
  border-bottom: 2px solid #DBEAE5;
  font-family: 'Hiragino Sans', Meiryo, sans-serif;
  font-weight: 200;
  line-height: 1.5;
  padding: 0 0 0px 12px;
}

/* 見出し */
h4 {
  border-left: 0px solid #74B9C3;
  border-bottom: 2px solid #DBEAE5;
  font-family: 'Hiragino Sans', Meiryo, sans-serif;
  font-weight: 200;
  line-height: 1.5;
  padding: 0 0 0px 8px;
}
h6 {
  border-left: 2px solid #74B9C3;
  font-family: 'Hiragino Sans', Meiryo, sans-serif;
  font-weight: 200;
  line-height: 1.5;
  padding: 0 0 0px 8px;
}
</style>