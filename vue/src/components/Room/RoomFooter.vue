<template>
  <v-footer
    app
    dark
    class = "dark"
    height="64"
  >
    <v-row>
      <v-col cols="2">
        <RoomPopupMenu />
      </v-col>
      <v-col cols="6">    
        <v-text-field
          bg-color="grey-lighten-1"
          class="rounded-pill overflow-hidden"
          density="compact"
          hide-details
          label="コメントを入力" 
          variant="solo"
          prepend-inner-icon="mdi-comment-processing"
          v-model="inputtedTxt"
          @keydown.enter="onEnterKeyPressedAtChatTextBox($event.keyCode)"
        ></v-text-field>
      </v-col> 

      <v-col cols="4" class="text-right">    
        <div class="d-flex justify-space-between">        
          <v-btn icon="mdi-heart"  
            v-on:click="onLikeButtonClick" rounded style="color: rgb(255, 77, 107);">
          </v-btn>     

          <v-btn icon="mdi-microphone" v-show="isPublishing && !isMuting" @click="onMuteButtonClick"></v-btn>
          <v-btn icon="mdi-microphone-off" v-show="isPublishing && isMuting" color="grey" @click="onMuteButtonClick"></v-btn>
        </div>
      </v-col>   
    </v-row>
  </v-footer>  
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
// RoomFooter.vue 配信画面のフッター
//  ・コメント入力欄
//  ・ミュートボタン
//  ・いいねボタン
// 
// [索引]
//   □ 0. mounted
//
//   □ 1. watch
//
//   □ 2. methods
//
//======================================================

// 定数
//import { CONSTANTS } from "../../consts/ConstantVals.js"
// FireBase
import { addChatDataToDB } from "../../utils/FirebaseManager.js"
import RoomPopupMenu from "./RoomPopupMenu.vue"

/**
 * エクスポート
 */
export default {

  // props
  props: [
    "targetRoomId",
    "isRoomOwner",
    "isPublishing",
  ],

  // components
  components: {
    RoomPopupMenu,
  },

  // data
  data() {
    return {
      // 対象ユーザデータ
      targetUserData: {

      },
      // チャットデータ
      targetChatData: {
        roomId: 0,
        userId: 0,
        userName: "",
        profileImageUrl: "",
        text: "",
        createdAt: null,
      },         
      // 入力されたテキスト
      inputtedTxt: "", 
      // ミュート中か
      isMuting: false,
    }
  },

  //======================================================
  //
  // 0. mounted
  //
  //======================================================

  mounted() {
    try {      
      // ユーザデータをセット
      this.targetUserData = this.$store.getters.getTargetUserData
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
    // 2-1. いいねボタンクリック
    //
    //======================================================

    /**
     * いいねボタンクリック
     */
    onLikeButtonClick() {      
      try {      
        // データをセット
        this.targetChatData = {
          roomId: this.targetRoomId,
          userId: this.targetUserData.id,
          userName: this.targetUserData.name,
          profileImageUrl: this.targetUserData.profileImageUrl,
          text: this.targetUserData.name + "がいいね！ を送りました。",
          createdAt: new Date(),
        }

        console.log("[チャットデータ登録]")
        console.log(this.targetChatData)

        // データ登録
        addChatDataToDB(this.targetChatData.roomId, this.targetChatData)
        // テキストを初期化
        this.inputtedTxt = ""
      } catch (error) {        
        console.error(error);      
      }
    },

    //======================================================
    //
    // 2-2. コメント欄でキー押下
    //
    //======================================================

    /**
     * コメント欄でキー押下
     *  ・エンターキーならDBにデータ追加
     */
    onEnterKeyPressedAtChatTextBox(keyCode) {
      const ENTER_KEY_CODE = 13

      try {      
        // 日本語入力中は終了
        if (keyCode !== ENTER_KEY_CODE) {
          return;
        } else if(this.inputtedTxt == "") {
          return;
        }

        // データをセット
        this.targetChatData = {
          roomId: this.targetRoomId,
          userId: this.targetUserData.id,
          userName: this.targetUserData.name,
          profileImageUrl: this.targetUserData.profileImageUrl,
          text: this.inputtedTxt,
          createdAt: new Date(),
        }

        console.log("[チャットデータ登録]")
        console.log(this.targetChatData)

        // データ登録
        addChatDataToDB(this.targetChatData.roomId, this.targetChatData)
        // テキストを初期化
        this.inputtedTxt = ""
      } catch (error) {        
        console.error(error);      
      }
     },

    //======================================================
    //
    // 2-3. ミュートボタンクリック
    //
    //======================================================

    /**
     * ミュートボタンクリック
     */
    onMuteButtonClick() {
      try {      
        if (this.isMuting) {
          this.isMuting = false
        } else {
          this.isMuting = true
        }
        // storeにデータをセット
        this.$store.commit("setIsMuting", this.isMuting)
      } catch (error) {        
        console.error(error);      
      }
     },
  }
}
</script>

<style scoped>

#smallMenuButton {
  width: 50px;
}
#largeMenuButton {
  width: 100px;
  height: 40px;
}

.fixed-width {
  width: 200px; /* 好きな幅を指定してください */
}
</style>