<!--
//======================================================
//
// AppModalLoginDialog.vue ゲストユーザログインダイアログ用コンポーネント
//
//======================================================
-->

<template>
  <v-dialog
      v-model="isShowingDialog"
      ref="modalLoginDialog"
      persistent
      width="600"
    >
    <v-form>    
      <v-card>
        <v-card-title>
          <span class="text-h6">ユーザ情報の設定</span>
        </v-card-title>
        <v-card-text>
          <v-container>      
            <v-row>
              <small>ユーザ名：</small>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" md="4"> 
                <v-text-field
                  label="ユーザ名"
                  v-model="name"                  
                  :rules="nameRules"                
                  required
                ></v-text-field>             
              </v-col>
            </v-row>
            <v-row>
              <small>アイコンを選択：</small>
            </v-row>
            <v-row>
              <div class = "icon_area" v-for="(src, index) in images" :key="index">  
                <v-img :src="src" class = "icon" :class="{ 'active': activeIndex === index }" @click="selectIcon(index)"/>   
              </div>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue-darken-1"
            variant="elevated"
            @click="onOKButtonClick"
          >
            OK
          </v-btn>
          <v-spacer></v-spacer>        
        </v-card-actions>
      </v-card>
    </v-form>         
  </v-dialog>     
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
// AppModalLoginDialog.vue ゲストユーザ用ログインダイアログ
//
// [索引]
//  □ 0. setup
//  □ 1. watch
//  □ 2. method
//    ・2-1. アイコン画像クリック
//    ・2-2. OKボタンクリック
//
//======================================================

//import { CONSTANTS } from '../../consts/ConstantVals'

// アイコンの選択肢の数
const SHOW_ICON_COUNT = 7

/**
 * export
 */
export default {  

  // props
  props: ['showDialog'],

  // data
  data() {
    return {
      // 画像
      images: this.$store.getters.getGuestUserIcons,
      // アクティブな画像のインデックス
      activeIndex: this.getRandomInt(SHOW_ICON_COUNT),
      // バリデーション
      nameRules: [
          v => !!v || 'uesr name is required'
      ],
      name: "",
      userIdStr: "",
      profileImageUrl: "",      
      isShowingDialog: this.showDialog,
    }
  },

  //======================================================
  //
  // 0. setup
  //
  //======================================================

  // setup
  setup() {
    try {      
      //this.$store.dispatch("todo/addTodoAsync", { title: "New Todo" });
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
    // 2-1. アイコン画像クリック
    //
    //======================================================

    /**
     * アイコン画像クリック
     *   ・アクティブなインデックスをセット
     */
    selectIcon(index) {
      this.activeIndex = index
    },

    //======================================================
    //
    // 2-2. OKボタンクリック
    //
    //======================================================

    /**
     * OKボタンクリック
     *   ・ユーザデータをstoreにセット
     */
    onOKButtonClick() {
      try {
        // ユーザ名が空なら終了
        if (this.name === "") {
          return
        }
        // ランダムなユーザIDをセット
        let n = this.getRandomInt(1000000)
        this.userIdStr = String(n)

        // ユーザデータをセット
        const ud = {
          id: n,
          idStr: this.userIdStr,
          name: this.name,
          profileImageUrl: this.images[this.activeIndex],
        }

        // storeにデータをセット
        this.$store.commit("setTargetUserData", ud)
      } catch (error) {
        console.error(error);
      }

      // ダイアログを閉じる
      this.isShowingDialog = false
    },

    /**
     * ランダムな値を返す
     * @param {*} max 
     */
    getRandomInt(max) {
      return Math.floor(Math.random() * max) 
    },

    /**
     * 画像ファイルを受け取ってrequireしたファイルパスを返す
     */
    getRequireImgPath(fName) {
      let rfPath = fName

      try {
        rfPath = require('@/assets/img/' + fName)
      } catch (error) {
        console.error(error);
      }

      return rfPath;
    }
  }
}
</script>

<!-- 
//======================================================
//
//  CSS
//
//======================================================
-->
<style>
.icon {
  width: 50px;
  height: 50px;  
  border-radius: 50%;
}
.active {
  background: rgb(0,0,0, 0.1);
}
</style>

