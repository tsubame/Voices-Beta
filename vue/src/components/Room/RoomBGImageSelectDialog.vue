<template>
  <!-- 背景画像選択ダイアログ -->
  <v-card>
    <v-card-title>
      <h4>背景画像の選択</h4>      
    </v-card-title>
    <v-card-text>
      <v-container>     
        <small>以下から背景画像を選択し、OKを押して下さい。</small> 
        <v-row>
          <v-col cols="4" v-for="(item, i) in imageFiles" :key="i">
            <v-img class="bgImageItem" :value="item.title" 
              :src="item.filePath" @click="onListItemClick(item, i)" 
              :class="{ 'active': activeIndex === i }"
            />            
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn id = "okButton" variant="elevated" color="success" @click="onOKButtonClick">
        OK
      </v-btn>
      <v-spacer></v-spacer>      
    </v-card-actions>
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

//import { CONSTANTS } from "../../consts/ConstantVals.js"

/**
 * エクスポート
 */
export default {
  // props
  props: [
    'selectedImageTitle',
  ],

  // data
  data() {
    return {
      returnData: {
        selectedImageTitle: this.selectedImageTitle,
        selectedImageUrl: this.selectedImageUrl,
      },
      // 画像選択肢の候補
      imageFiles: this.$store.getBgImages,
      // アクティブなインデックス
      activeIndex: 0,
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
        // 選択されたファイル名をセット
        this.returnData.selectedImageUrl = item.filePath 
        this.returnData.selectedImageTitle = item.title
        // アクティブなインデックスをセット
        this.activeIndex = i
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
        // 選択されたファイル名をセット
        let item = this.imageFiles[this.activeIndex]
        this.returnData.selectedImageUrl = item.filePath
        this.returnData.selectedImageTitle = item.title

        this.$emit('clickSubmit', this.returnData)
      } catch (error) {        
        console.error(error);      
      }
    }
  }
}
</script>

<style scoped>

.bgImageItem {
  width: 200px;
  padding: 20px;
}
.active {
  background: rgb(0,0,0, 0.3);
}

#okButton {
  width: 100px;
  margin: 0 0 40px;
}
</style>