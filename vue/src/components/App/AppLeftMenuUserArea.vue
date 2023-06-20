<template>
  <!-- 横メニューユーザエリア -->
  <v-sheet
    color="grey-lighten-4"
    class="pa-4 text-center userProfileArea"  
  >
    <v-img :src="targetUserData.profileImageUrl" class = "profileIcon" @click="clearUserData" />   
    <div>{{ targetUserData.name }} (ID: {{ targetUserData.id }})</div>
  </v-sheet>
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
// AppLeftMenu.vue App画面の左メニューアイテムのユーザエリア
//  ・ユーザ情報をstoreから取得して描画
// 
// [索引]
//   □ 0. setup
//    ・ユーザ情報をstoreから取得
//
//   □ 1. watch
//   ・ユーザ情報の変更を監視
//
//   □ 2. methods
//    ・ユーザ情報をクリア（デバッグ用）
//
//======================================================

//import { CONSTANTS } from '../../consts/ConstantVals';

/**
 * export
 */
export default {

  // data
  data() {
    return {
      targetUserData: {
        id: 0,
        idStr: "",
        name: "",
        profileImageUrl: ""
      },
    }
  },
  // computed
  computed: {

  },  

  //======================================================
  //
  // 0. setup
  //
  //======================================================

  /**
   * setup
   *  ・ユーザ情報をstoreから取得
   */
  mounted() {
    try {      
      // ユーザ情報をstoreから取得
      this.targetUserData = this.$store.getters.getTargetUserData
    } catch (error) {        
      console.error(error);      
    }
  },

  //======================================================
  //
  // 1. watch
  //
  //======================================================

  /**
   * watch
   *  ・ユーザ情報の変更を監視
   */
  watch: {
    '$store.getters.getTargetUserData': function (newValue) {
      try {
        //console.log(newValue)
        //console.log(oldValue)
        this.targetUserData = newValue
      } catch (error) {        
        console.error(error);      
      }
    },
  },

  //======================================================
  //
  // 2. methods
  //
  //======================================================  

  /**
   * methods
   */
   methods: {
    /**
     * ユーザ情報をクリア
     */
    clearUserData() {
      try {      
        this.$store.commit("clearUserData")
      } catch (error) {        
        console.error(error);      
      }
    }
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
.profileIcon {
  width: 100px;
  height: 100px;  
  margin: 0px 60px 12px;
  border-radius: 50%;
  border: solid 1px #999999;
  background: rgb(0,0,0, 0.1);  
}

.userProfileArea {
  text-align: center;
}
</style>

