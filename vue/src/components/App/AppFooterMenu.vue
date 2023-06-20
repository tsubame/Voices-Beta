<template>
  <!-- フッターメニュー -->
  <v-bottom-navigation v-show="isMobile" app>
    <v-btn v-for="[icon, text, url] in linkItems" :key="icon" router v-bind:to="url">
      <v-icon>{{icon}}</v-icon>
      {{text}}
    </v-btn>      
  </v-bottom-navigation>  
  <v-overlay v-if="showOverlay" @click="showMenu = false"></v-overlay>   
</template>

<!--
//======================================================
// script
//======================================================
-->
<script>
import { CONSTANTS } from '../../consts/ConstantVals';

//======================================================
//
// AppLeftMenu.vue Script App画面のフッターメニューアイテム
//  ・メニューのリンクを定数から取得して描画
// 
// [索引]
//   □ 0-1. mounted
//    ・モバイル環境ならフッターメニューを表示
//
//======================================================

// 定数 このサイズ未満でメニュー表示
const SHOW_FOOTER_MENU_MAX_WIDTH = 1000

/**
 * export
 */
export default {

  // props
  props: ['showFooterMenu'],

  // data
  data() {
    return {
      linkItems: CONSTANTS.LINK_VALS,
      isMobile: false,
      showOverlay: false,      
    }
  },

  //======================================================
  //
  // 0-1. mounted
  //
  //======================================================  

  /**
   * mounted
   *  ・モバイル環境ならフッターメニューを表示
   */
  mounted() {
    // モバイル環境ならフッターメニューを表示
    try {
      //console.log(this.showFooterMenu)
      this.showFooterMenuIfMobile()
    } catch (error) {        
      console.error(error);      
    }
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

    //======================================================
    // モバイル環境の場合、フッターメニューを表示
    //======================================================

    /**
     * モバイル環境の場合、フッターメニューを表示
     */
    showFooterMenuIfMobile() {
      try {      
        this.checkIsMobile()
        window.addEventListener('resize', this.checkIsMobile)        
      } catch (error) {        
        console.error(error);      
      }
    },

    /**
     * モバイル環境かをチェック
     */
    checkIsMobile() {
      this.isMobile = window.innerWidth < SHOW_FOOTER_MENU_MAX_WIDTH
    },
  },  

  //======================================================
  //
  // 10. unmounted
  //
  //======================================================

  /**
   * unmounted
   *  ・リサイズ時のイベントリスナーを解除
   */
   unmounted() {
    window.removeEventListener('resize', this.checkIsMobile)
  },    
}
</script>
