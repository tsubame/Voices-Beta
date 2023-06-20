<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <!-- モバイル環境以外のメニューボタン -->
      <v-btn prepend-icon="mdi-menu-up" class="d-none d-sm-flex mx-auto" id="largeMenuButton" v-bind="props" rounded>
        <template v-slot:prepend>
          <v-icon color="success"></v-icon>
        </template>
        メニュー</v-btn>     
    </template>

    <v-list>
      <v-list-item
        v-for="(item, i) in menuItems"
        :key="i"
        :value="item"
        active-color="success"
        variant="plain"    
        @click="onListItemClick(item)"          
      >
        <template v-slot:prepend>
          <v-icon :icon="item.icon" color="success"></v-icon>
        </template>        
        <v-list-item-title v-text="item.title"></v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>    
    
  <v-menu>
    <template v-slot:activator="{ props }"> 
      <!-- モバイル環境のメニューボタン -->
      <v-btn icon="mdi-menu-up" style="color: rgb(65, 156, 95);" class="d-flex d-sm-none mx-auto" id="smallMenuButton" v-bind="props" rounded>
      </v-btn> 

    </template>

    <v-list>
      <v-list-item
        v-for="(item, i) in menuItems"
        :key="i"
        :value="item"
        active-color="success"
        variant="plain"        
        @click="onListItemClick(item)"          
      >
        <template v-slot:prepend>
          <v-icon :icon="item.icon" color="success"></v-icon>
        </template>        
        <v-list-item-title v-text="item.title"></v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>    

</template>

<!--
//======================================================
//
// Script
//
//======================================================  
-->
<script>

//======================================================
//
// RoomBGImageSelectDialog.vue 背景画像選択用ダイアログ
// 
// [索引]
//   □ 0. setup
//
//   □ 1. watch
//
//   □ 2. methods
//      ・OKボタンクリック
//
//======================================================

import { CONSTANTS } from "../../consts/ConstantVals.js"

/**
 * エクスポート
 */
export default {
  // props
  props: [

  ],

  // data
  data() {
    return {
      // メニュー用の項目
      menuItems: [CONSTANTS.ROOM_FOOTER_MENU_ITEM_NAMES_BGM_STOP],
      // BGM再生中か
      isBgmPlaying: true,
    }
  },


  //======================================================
  //
  // 1. setup
  //
  //======================================================

  /**
   * setup
   */
  mounted() {
    try {      
      this.imageFiles = this.$store.getters.getBgImages

      // storeにデータをセット
      this.$store.commit("setIsBgmPlaying", this.isBgmPlaying)           
    } catch (error) {        
      console.error(error);      
    }
  },

  //======================================================
  //
  // 2. methods
  //
  //======================================================
  
  methods: {    

    //======================================================
    //
    // 2-1. リストのアイテムクリック
    //
    //======================================================

    /**
     * リストのアイテムクリック
     */
    onListItemClick(item, i) {
      try {      
        console.log(item, i)

        if (item.title === "BGM停止") {
          this.isBgmPlaying = false;
          this.menuItems = [CONSTANTS.ROOM_FOOTER_MENU_ITEM_NAMES_BGM_PLAY]                   
        } else {
          this.isBgmPlaying = true;
          this.menuItems = [CONSTANTS.ROOM_FOOTER_MENU_ITEM_NAMES_BGM_STOP]
        }

        // storeにデータをセット
        this.$store.commit("setIsBgmPlaying", this.isBgmPlaying)        
      } catch (error) {        
        console.error(error);      
      }
    },
    
    //======================================================
    //
    // 2-2. OKボタンクリック
    //
    //======================================================

    /**
     * OKボタンクリック
     *   ・ダイアログを閉じる
     *   ・storeに選択したBGMをセット
     */
    onOKButtonClick() {    
      try {      
        console.log()
      } catch (error) {        
        console.error(error);      
      }
    }
  }
}
</script>

<style scoped>

</style>