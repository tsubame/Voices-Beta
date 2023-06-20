<template>
  <!-- BGM選択ダイアログ -->
  <v-card>
    <v-card-title>
      <h4>BGMの選択</h4>      
    </v-card-title>
    <v-card-text>
      <v-container>     
        <small>以下からBGMを選択し、OKを押して下さい。</small> 
        <v-list>
          <!--<v-list-item v-for="item in bgmFiles" :key="item.title" @click="handleItemClick(item)">-->
          <v-list-subheader>BGM一覧</v-list-subheader>

          <v-list-item
            v-for="(item, i) in bgmFiles"
            :key="i"
            :value="item.title"
            @click="onListItemClick(item)"                
          >
            <template v-slot:prepend>
              <v-icon>mdi-music</v-icon>
            </template>

            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item>
        </v-list>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn id = "okButton" variant="elevated" color="success" @click="onOKButtonClick">
        OK
      </v-btn>
      <v-spacer></v-spacer>      
    </v-card-actions>

    <!-- BGM再生用 -->
    <audio ref="audioElement" :src="returnData.selectedBgmUrl" @canplay="play"></audio>       
  </v-card>        
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
// RoomBGMSelectDialog.vue BGM選択用ダイアログ
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
    'selectedBgmTitle',
    'selectedBgmUrl',
  ],

  // data
  data() {
    return {
      returnData: {
        selectedBgmTitle: this.selectedBgmTitle,
        selectedBgmUrl: this.selectedBgmUrl,
      },
      // BGM選択肢の候補
      bgmFiles: this.$store.getters.getBgms 
    }
  },

  //======================================================
  //
  // 1. watch
  //
  //======================================================

  /**
   * watch
   */
   watch: {

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
     *   ・音楽再生
     *   ・再生されたファイル名をセット
     */
    onListItemClick(item) {
      try {      
        // ファイルパスをセット
        this.returnData.selectedBgmUrl =  item.filePath
        this.returnData.selectedBgmTitle = item.title
        console.log(this.returnData.selectedBgmUrl)

        // 再生
        this.$nextTick(function() {        
          this.$refs.audioElement.pause();        
          this.$refs.audioElement.play();
          this.$refs.audioElement.volume = CONSTANTS.BGM_DEFAULT_VOLUME;   
          this.$refs.audioElement.loop = true        
        })
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
        this.$emit('clickSubmit', this.returnData)
      } catch (error) {        
        console.error(error);      
      }
    }
  }
}
</script>

<style scoped>

#okButton {
  width: 100px;
  margin: 0 0 40px;
}
</style>