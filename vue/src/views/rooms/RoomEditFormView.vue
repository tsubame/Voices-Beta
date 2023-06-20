<template>
  <v-main>
    <v-form @submit.prevent="submitForm">
      <v-row justify=center>
        <v-col cols="8" class="mt-20">
          <h2 class="mt-200">配信部屋作成</h2>
          <router-link to="/rooms"><v-btn icon="mdi-close" variant="tonal" id="editFormCloseBox" rounded size="x-small"></v-btn></router-link>  
        </v-col>

        <v-col cols="8">
          <!-- 部屋名 -->
          <v-text-field
            v-model="form.title"
            label="部屋名"
            required>
          </v-text-field>

          <!-- カテゴリ -->
          <v-select
            v-model="form.category"
            :items="categories"
            label="カテゴリ"
          ></v-select>        

          <!-- 通信手段 -->
          <v-select
            v-model="form.webRtcService"
            :items="webRtcServices"
            label="通信手段"
          ></v-select>            
        </v-col>   

        <!-- BGM選択用ボタン -->
        <v-col cols="8" class="text-right">        
          <small>BGM: 『{{selectedBgmTitle}}』</small>&nbsp;
          <v-btn 
            prepend-icon="mdi-music"
            class="selectButton"
            @click="onBGMSelectButtonClick"
          >
          <template v-slot:prepend>
            <v-icon color="success"></v-icon>
            </template>        
            BGM選択
          </v-btn>
        </v-col>

        <!-- 背景画像選択用ボタン  
        <v-col cols="8" class="text-right">        
          <small>背景: 『{{selectedImageTitle}}』</small>&nbsp;
          <v-btn 
            prepend-icon="mdi-picture-in-picture-bottom-right"
            class="selectButton"
            @click="showBGImageDialog=true"         
          >
          <template v-slot:prepend>
            <v-icon color="success"></v-icon>
            </template>        
            背景選択
          </v-btn>
        </v-col>      
      -->

        <!-- 配信開始ボタン -->
        <v-col cols="8" class="text-center">        
          <v-btn large id = "castStartButton"
            prepend-icon="mdi-cast"
            type="submit" 
          >
            <template v-slot:prepend>
              <v-icon color="success"></v-icon>
            </template>        
            配信開始
          </v-btn>
        </v-col>
      </v-row>

      <!-- BGM選択用ダイアログ -->
      <v-dialog
        v-model="showBGMDialog"
        persistent
        width="600"
      >    
        <RoomBGMSelectDialog         
          v-on:clickSubmit="onBGMSelectDialogOKButtonClick"
          :selectedBgmTitle="selectedBgmTitle"
        />      
      </v-dialog>

      <!-- 背景画像選択用ダイアログ -->
      <v-dialog
        v-model="showBGImageDialog"
        persistent
        width="600"
      >    
        <RoomBGImageSelectDialog        
          v-on:clickSubmit="onBGImageSelectDialogOKButtonClick"
          :selectedImageTitle="selectedImageTitle"
        />      
      </v-dialog>    

      <!-- ローディングダイアログ -->
      <v-dialog
        v-model="showLoadingDialog"
        hide-overlay
        persistent
        width="300"
      >
        <v-card
          color="success"
          dark
        >
          <v-card-text>
            Please stand by
            <v-progress-linear
              indeterminate
              color="white"
              class="mb-0"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>      
    </v-form>      
  </v-main>
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
// RoomEditFormView.vue 配信作成フォーム画面
// 
// [索引]
//   □ 0. setup
//
//   □ 1. watch
//
//   □ 2. methods
//
//======================================================

import axios from 'axios'
import { CONSTANTS } from "../../consts/ConstantVals.js"
import RoomBGMSelectDialog from '../../components/Room/RoomBGMSelectDialog.vue';
import RoomBGImageSelectDialog from '@/components/Room/RoomBGImageSelectDialog.vue';

// axios設定
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

/**
 * エクスポート
 */
export default {

  // components
  components: {
    RoomBGMSelectDialog,
    RoomBGImageSelectDialog
  },

  // data
  data() {
    return {
      // カテゴリ
      categories: CONSTANTS.ROOM_CATEGORY_VALS,    
      // 通信サービス
      webRtcServices: CONSTANTS.ROOM_SERVICES_VALS,  
      // フォーム要素
      form: {
        title: '',
        ownerUserId: 0,
        ownerUserName: "",
        thumImage_Url: '',
        bgImageUrl: '',
        bgmUrl: '',
        category: '',
        webRtcService: '',
        description: '',
        startedAt: new Date(),
      },
      // BGM選択ダイアログを表示
      showBGMDialog: false,
      // 背景選択ダイアログを表示
      showBGImageDialog: false,
      // ローディングダイアログを表示
      showLoadingDialog: false,
      // 選択されたBGMタイトル
      selectedBgmTitle: "未選択",
      // 選択されたBGMURL
      selectedBgmUrl: "",      
      // 選択された画像ファイルのタイトル
      selectedImageTitle: "未選択",
      // 選択された画像URL
      selectedImageUrl: "",
    }
  },

  //======================================================
  //
  // 1. mounted
  //
  //======================================================

  mounted() {
    try {      
      let d = this.$store.getters.getTargetUserData
      console.log("[ユーザデータ]")
      console.log(d)
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

    /**
     * フォーム送信
     */
    async submitForm() {    
      // ユーザデータをセット
      this.setPostRoomData()   
      console.log("[送信データプレビュー]")
      console.log(this.form)

      // apiURLをセット
      //let apiURL = getRoomCreateURL();

      // ローディングダイアログを表示
      this.showLoadingDialog = true

      // POST送信
      axios.post(CONSTANTS.API_URL_GO_ROOM_CREATE, this.form)
        .then(response => {
          console.log(response.data)
          // 部屋のIDをセット
          const roomId = response.data.id
          // ローディングダイアログを閉じる
          this.showLoadingDialog = false
          // 部屋一覧に遷移
          this.$router.push('/rooms/' + roomId)          
        })
        .catch(error => {
          console.log(error)
        })      
    },

    /**
     * DB登録用の部屋データをセット
     *   ・ユーザID: storeからセット
     *   ・サムネイル： storeからセット
     *   ・BGM； dataからセット
     *   ・背景画像： dataからセット
     *   ・開始日時： 現在日時
     */
    setPostRoomData() {
      try {      
        // リソースに付与するベースURLをセット
        const baseUrl = window.location.protocol + '//' + window.location.host; 

        // ユーザID
        this.form.ownerUserId = this.$store.getters.getTargetUserId
        // ユーザ名
        this.form.ownerUserName = this.$store.getters.getTargetUserName
        // サムネイル
        this.form.thumImageUrl = baseUrl + this.$store.getters.getTargetUserProfileImagerUrl  
        // BGM
        this.form.bgmUrl = baseUrl + this.selectedBgmUrl
        // 背景
        this.form.bgImageUrl = baseUrl + this.selectedImageUrl
        // 開始日時
        this.form.startedAt = new Date()
      } catch (error) {        
        console.error(error);     
      }
    },

    /**
     * BGM選択ボタンクリック
     */
    onBGMSelectButtonClick() {
      this.showBGMDialog = true    
    },
    /**
     * BGM選択ダイアログのOKボタンクリック
     */
    onBGMSelectDialogOKButtonClick(params) {
      this.showBGMDialog = false   
      this.selectedBgmTitle = params.selectedBgmTitle
      this.selectedBgmUrl = params.selectedBgmUrl
    },

    /**
     * 背景画像選択ダイアログのOKボタンクリック
     */
     onBGImageSelectDialogOKButtonClick(params) {
      try {
        this.showBGImageDialog = false   
        this.selectedImageTitle = params.selectedImageTitle
        this.selectedImageUrl = params.selectedImageUrl

        console.log(this.selectedImageTitle)
      } catch(error) {
        console.error(error);  
      }
    }    
  }
}
</script>

<style scoped>

/* テキスト */
small {
  font-family: 'Hiragino Sans', Meiryo, sans-serif;
  font-weight: 200;
}

/* 画像、音楽選択ボタン  */
.selectButton {
  width: 120px;
}

/* 配信開始ボタン */
#castStartButton {
  margin: 80px 0; 
  padding: 20px;
  width: 200px;
  height: 60px;
}

/* 閉じるボタン */
#editFormCloseBox {
  border: solid 0px #999999;
  position: fixed;
  top: 10px;
  right: 10px;
  border: solid 1px #CCCCCC;
  color: #333333;
}

</style>