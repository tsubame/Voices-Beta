<template>
  <v-container id = "roomContainer">      
    <header id="roomHeader">
      <v-app-bar
        id="roomHeaderArea"
        class="px-3"
        color="grey-lighten-4"
        flat    
        app   
      >   

        <v-container>
          <v-row class="justify-space-between">
            <v-col cols="8">    
              <div class="ma-2" id="rightHeaderLeftArea">   
                <v-img :src="targetRoomData.thumImageUrl" id="roomOwnerImage" width="50" />
                <span id="roomTitle">{{ targetRoomData.title }}</span>
                <div id="roomOwnerName">
                  {{ targetRoomData.ownerUserName }}
                  <v-badge id="roomOwnerBadge" class="smallText" color="pink" inline v-show="isRoomOwner">
                    <template #badge>
                      <span class="smallText">配信者画面</span>
                    </template>
                  </v-badge>  
                </div>                
              </div>
            </v-col>
            <v-col cols="4">
              <v-btn icon="mdi-close" variant="tonal" class="closeBox" rounded size="x-small" @click="onCloseBoxClick" >
              </v-btn>         
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col cols="4">
              <div class="chip-container">  
                <v-chip class="ma-2" size="x-small">
                  <v-icon color="success">mdi-account</v-icon>&nbsp;{{ roomListnerDatas.length }}人&nbsp;&nbsp;&nbsp;
                </v-chip>       
                  <v-icon color="grey">mdi-clock</v-icon>&nbsp;{{ getRemainMinutes }}:{{ getRemainSeconds }}
              </div>            
              <!--
              <v-row no-gutters>
                <div class="image-container">
                  <v-img :src="targetRoomData.thumImageUrl" aspect-ratio="1" class="multiCastUserImage"/>
                  <v-img :src="targetRoomData.thumImageUrl" width="25" class="multiCastUserImage" />
                </div>
              </v-row>    
              -->
            </v-col>
            <v-col cols="5">     

            </v-col>
            <v-col cols="3">
              <v-btn elevation="1" @click="onPublishButtonClick" v-show="!isPublishing" class="smallText callButton" rounded>
                <v-icon color="success">mdi-phone</v-icon>&nbsp;通話に参加
              </v-btn>              
              <v-btn elevation="1" @click="onUnpublishButtonClick" v-show="isPublishing" class="smallText callButton" rounded>
                <v-icon color="red">mdi-phone-off</v-icon>&nbsp;通話を切断
              </v-btn>    
            </v-col>
          </v-row>
        </v-container>      
      </v-app-bar>     
    </header>
  
    <v-main id="roomMainArea">   
      <!-- チャット欄-->
      <v-row>
        <v-col cols="12" id="chatArea" ref="chatArea">                      
          <section v-for="chat in chatDatas" :key="chat.text" class="item">  
            <RoomChatItem :chat="chat" />
          </section>               
        </v-col>

        <!-- リモートメディアエリア -->
        <div ref = "remoteMediaArea"></div>
      </v-row>
    </v-main>  

    <RoomFooter :targetRoomId="targetRoomId" :isPublishing="isPublishing" />

    <!-- ダイアログ -->
    <div>
      <v-dialog v-model="showInitDialog" activator="parent" width="auto">
        <v-card>
          <v-card-text> 
            {{ dialogTxt }}
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" block @click="showInitDialog = false"
              >OK</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

  </v-container>
</template>

<!-- 
//======================================================
//
// Script 
//
//======================================================
-->
<script>
// 定数
import { CONSTANTS } from "../../consts/ConstantVals.js"
// Chat
import RoomChatItem from '../../components/Room/RoomChatItem.vue'
// Footer
import RoomFooter from "@/components/Room/RoomFooter.vue";
// FireBase操作用
import { addChatDataToDB, watchTargetRoomChats, watchTargetRoomListnerDatas, addListnerDataToDB, initAuthAnonymous, removeTargetListnerDataFromDB } from '../../utils/FirebaseManager'
// Go API操作用
import { getTargetIdRoomData } from '../../utils/GoAPIManager'
// Skyway
import { joinToRoom, subscribeRoomAudio, publishMyAudio, unpublishMyAudio, leaveFromRoom, mute, unmute } from '@/utils/SkywayManager'
// Agora
import { publishMyAudioByAgora, subscribeRoomAudioByAgora, unpublishMyAudioByAgora, leaveFromRoomByAgora, muteByAgora, unmuteByAgora } from '@/utils/AgoraManager';

//======================================================
//
// RoomDetailVue 配信部屋画面
//
// [索引]
//  □ 0. setup
//  □ 1. computed
//  □ 2. watch
//  □ 3. methods
//
//======================================================

/**
 * export
 */
export default {

  // components
  components: {
    RoomChatItem,
    RoomFooter,
  },

  // data
  data() {
    return {
      // 部屋ID
      targetRoomId: 0,
      // 部屋データ
      targetRoomData: {
        id: 0,
        title: '',
        ownerUserId: 0,
        ownerUserName: "",        
        thumImageUrl: '',
        bgImageUrl: '',
        bgmUrl: '',
        category: '',
        description: '',
        webRtcService: '',        
        startedAt: new Date(),
      },
      // 対象の部屋内の自リスナーデータ 
      roomMyListnerData: {
        roomId: 0,
        userId: 0,
        userName: "",
        profileImageUrl: "",
        roomJoinedAt: new Date(),
        isCallRequesting: false,
        isInCall: false,
      },
      // 残り時間
      remainingTime: 60,
      // 自リスナーデータのキー
      myListnerFbKey: "",
      // 対象の部屋内の全ユーザデータ
      roomListnerDatas: [
      ],
      // ユーザ情報
      targetUserData: {},  
      // 部屋主か
      isRoomOwner: false,
      // チャットデータ（単体）
      targetChatData: {
        roomId: 0,
        userId: 0,
        userName: "",
        profileImageUrl: "",
        text: "",
        createdAt: null,
      },     
      // BGMボリューム
      bgmVolume: 0.03,
      // チャットデータ（配列）
      chatDatas: [],   
      // publish中か
      isPublishing: false,
      // ミュート中か
      isMuting: false,
      // ダイアログ表示
      showInitDialog: false,
      // ダイアログのメッセージ
      dialogTxt: "通話に参加するには、画面右上の「通話に参加」ボタンを押して下さい。",
      // audio要素
      audioElement: null,
    }
  },

  //======================================================
  //
  // 0. mounted
  //
  //======================================================

  mounted: async function() {
    try {      
      // URLパラメータからRoomIDをセット
      this.targetRoomId = this.$route.params.roomId     
      // DBから部屋データをセット
      this.targetRoomData = await getTargetIdRoomData(this.targetRoomId)
      console.log("[部屋データ取得]")
      console.log(this.targetRoomData)

      // 匿名認証実行
      await initAuthAnonymous()
      // FireBaseのchatsテーブル監視
      this.watchFireBaseChats()
      // FireBaseのroom_listenersテーブル監視
      await this.watchFireBaseRoomListnerDatas()
      // ユーザデータをセット
      this.targetUserData = this.$store.getters.getTargetUserData
      console.log("[ユーザデータ取得]")
      console.log(this.targetUserData)

      console.log("[接続手段]")
      console.log(this.targetRoomData.webRtcService)
      
      // Skywayの場合、Skywayの部屋に入る
      if (this.targetRoomData.webRtcService == CONSTANTS.WEB_RTC_SERVICE_SKYWAY) {
        await joinToRoom(this.targetRoomId,this.targetUserData.id)
      // agoraの場合、ダイアログを表示
      } else {
        this.showInitDialog = true;
      }

      // subscribe（skyway）  
      if (this.targetRoomData.webRtcService == CONSTANTS.WEB_RTC_SERVICE_SKYWAY) {      
        await subscribeRoomAudio()
      // subscribe（agora）
      } else {
        console.log("agora")
        await subscribeRoomAudioByAgora(this.audioElement, this.targetRoomId, this.targetUserData.id)
      } 

      // 同一なら部屋主として認定
      if (this.targetRoomData.ownerUserId === this.targetUserData.id) {
        console.log("[配信者として入室]" + this.targetRoomData.ownerUserId + " " + this.targetUserData.id)
        this.isRoomOwner = true        

        // 配信開始（Skyway）
        if (this.targetRoomData.webRtcService == CONSTANTS.WEB_RTC_SERVICE_SKYWAY) {
          await publishMyAudio();
        // 配信開始（Agora）
        } else {
          this.dialogTxt = "Agora.ioを使用して音声配信を開始します。"
          await publishMyAudioByAgora()
        }
            
        this.isPublishing = true
      }

      // リスナーデータを登録
      this.insertRoomMyListnerDataToFireBase()
      // タイマー描画
      this.drawClock()
      // BGM再生
      this.playBGM()
    } catch (error) {        
      console.error(error);      
    }
  },

  //======================================================
  // 
  // 1. computed
  //
  //======================================================

  computed: {
    getRemainMinutes() {
      return Math.floor(this.remainingTime / 60); // 分の計算
    },
    getRemainSeconds() {
      let sec = this.remainingTime % 60; // 秒の計算

      return sec.toString().padStart(2, '0');
    }
  },  

  //======================================================
  // 
  // 2. watch
  //
  //======================================================

  /**
   * watch
   *  
   */
   watch: {
    /**
     * ユーザデータ変更時
     * 
     * @param {} newValue 
     */
    '$store.getters.getTargetUserData': function (newValue) {
      try {
        console.log(newValue)
      } catch (error) {        
        console.error(error);      
      }
    },

    /**
     * ミュート状態変更時
     */
    '$store.getters.getIsMuting': function (newValue) {
      try {        
        console.log("[ミュート状態]" + newValue)

        // ミュート中なら
        if (newValue) {
          if (this.targetRoomData.webRtcService == CONSTANTS.WEB_RTC_SERVICE_SKYWAY) {      
            mute()
          } else {
            muteByAgora()
          }            
        } else {
          if (this.targetRoomData.webRtcService == CONSTANTS.WEB_RTC_SERVICE_SKYWAY) {      
            unmute()
          } else {
            unmuteByAgora()
          }   
        }
      } catch (error) {        
        console.error(error);      
      }
    },

    /**
     * BGM再生状態変更時
     */
     '$store.getters.getIsBgmPlaying': function (newValue) {
      try {        
        console.log("[BGM再生状態]" + newValue)

        console.log(this.audioElement)

        // BGMがなければ終了
        if (this.targetRoomData.bgmUrl === "") {
          console.log("[BGM不使用のため再生スキップ]")

          return;
        }

        // 停止
        if (newValue === true) {
          this.$nextTick(() => {
            this.audioElement.play();          
            console.log("[BGM再生]")
          });
        } else {
          this.$nextTick(() => {
            this.audioElement.pause();    
            console.log("[BGM停止]")      
          });
        }
      } catch (error) {        
        console.error(error);      
      }
    },    

    /**
     * チャットアイテム変更時
     * 
     * @param {*} newValue 
     */
    chatDatas(newValue) {
      try {      
        // 下部にスクロール
        this.scrollToBottomAtChatArea()

        console.log("[チャット更新]" + newValue.length + "件")
      } catch (error) {        
        console.error(error);      
      }
    }
  },

  //======================================================
  //
  // 3. methods
  //
  //======================================================

  methods: {

    //======================================================
    //
    // 3-1. FireBaseのChatデータ監視
    //
    //======================================================

    /**
     * FireBaseのChatデータ監視
     */
    watchFireBaseChats() {
      try {      
        // コールバック定義
        const callback = (vals) => {
          this.chatDatas = vals;

          console.log(this.chatDatas.length + '件のチャット')
        };

        // FireBaseを監視
        watchTargetRoomChats(this.targetRoomId, callback)
      } catch (error) {        
        console.error(error);      
      }
    },

    //======================================================
    //
    // 3-2. FireBaseのRoomListnerデータ監視
    //
    //======================================================

    /**
     * FireBaseのRoomUserデータ監視
     */
     async watchFireBaseRoomListnerDatas() {
      try {      
        // コールバック定義
        const callback = (vals) => {
          this.roomListnerDatas = vals;
          console.log(this.roomListnerDatas.length + '件のListner')
        };

        // FireBaseを監視
        await watchTargetRoomListnerDatas(this.targetRoomId, callback)
      } catch (error) {        
        console.error(error);      
      }
    },

    //======================================================
    //
    // 3-3. FireBaseにRoomListnerデータを登録
    //
    //======================================================

    /**
     * FireBaseにRoomListnerデータを登録
     */
    async insertRoomMyListnerDataToFireBase() {
      try {      
        this.roomMyListnerData = {
          roomId: this.targetRoomId,
          userId: this.targetUserData.id,
          userName: this.targetUserData.name,
          profileImageUrl: this.targetUserData.profileImageUrl,
          roomJoinedAt: new Date().toLocaleString(),
          isCallRequesting: false,
          isInCall: false,
        }

        //console.log(this.roomMyListnerData)

        // 登録
        this.myListnerFbKey = await addListnerDataToDB(this.targetRoomId, this.roomMyListnerData)

        console.log("[Firebase Listnerデータ登録] " + this.myListnerFbKey)
      } catch (error) {        
        console.error(error);      
      }
    },

    //======================================================
    //
    // 3-4. チャット欄下部にスクロール
    //
    //======================================================

    /**
     * チャット欄下部にスクロール
     */
    scrollToBottomAtChatArea() {
      try {      
        this.$nextTick(() => {
          window.scrollTo(0, document.body.clientHeight)
        })
      } catch (error) {        
        console.error(error);      
      }
    },

    //======================================================
    //
    // 3-5. タイマー作成
    //
    //======================================================

    /**
     * タイマー作成
     */
    drawClock() {
      const INTERVAL_MSEC = 1000;

      try {      
        console.log(this.targetRoomData.startedAt)
        const startDate = new Date(this.targetRoomData.startedAt);
        console.log("[開始日時]" + startDate)

        const currentTime = new Date(); // 現在時刻をDateオブジェクトとして取得

        // 過ぎた時間
        const leftSec = Math.floor((currentTime - startDate) / 1000)
        this.remainingTime = CONSTANTS.ROOM_VALID_PERIOD_MIN * 60 - leftSec;
        console.log("[残り秒数]" + this.remainingTime)

        // タイマーの開始
        this.timer = setInterval(() => {
          if (0 < this.remainingTime) {
            this.remainingTime--;
          } else {
            clearInterval(this.timer); // タイマー停止
          }
        }, INTERVAL_MSEC); // 1秒ごとに処理を実行
      } catch (error) {        
        console.error(error);      
      }
    },

    //======================================================
    //
    // 3-6. BGM再生
    //
    //======================================================

    /**
     * BGM再生
     */
    playBGM() {
      try {      
        if (this.targetRoomData.bgmUrl === "") {
          console.log("[BGM不使用のため再生スキップ]")
                    
          return;
        }

        this.$nextTick(() => {
          this.audioElement = new Audio(this.targetRoomData.bgmUrl);
          this.audioElement.volume = this.bgmVolume;             
          this.audioElement.loop = true;
          this.audioElement.play();

          console.log("[BGM再生開始]")
          console.log(this.audioElement);
        });
      } catch (error) {        
        console.error(error);      
      }
    },

    //======================================================
    //
    // 3-7. 通話に参加ボタン押下
    //
    //======================================================

    /**
     * 通話に参加ボタン押下
     */
    async onPublishButtonClick() {
      try {      
        if (confirm('通話に参加します。よろしいですか？')) {
          if (this.isPublishing) {
            return
          }

          // 配信開始（Skyway）
          if (this.targetRoomData.webRtcService == CONSTANTS.WEB_RTC_SERVICE_SKYWAY) {
            await publishMyAudio();
            await subscribeRoomAudio();
            // 配信開始（Agora）
          } else {
            await publishMyAudioByAgora()
            await subscribeRoomAudioByAgora();
          }

          this.isPublishing = true

          // チャット送信
          this.sendChat(this.targetUserData.name + "が通話に参加しました。")
        }
      } catch (error) {        
        console.error(error);      
      }
    },

    //======================================================
    // チャット送信
    //======================================================

    /**
     * チャット送信
     */
    async sendChat(txt) {
      try {
        // データをセット
        let targetChatData = {
          roomId: this.targetRoomId,
          userId: this.targetUserData.id,
          userName: this.targetUserData.name,
          profileImageUrl: this.targetUserData.profileImageUrl,
          text: txt,
          createdAt: new Date(),
        }

        console.log("[チャットデータ登録]")
        console.log(targetChatData)

        // データ登録
        addChatDataToDB(targetChatData.roomId, targetChatData)        
      } catch (error) {
        console.error(error);   
      }
    },

    //======================================================
    //
    // 3-8. 通話を切断ボタン押下
    //
    //======================================================

    /**
     * 通話を切断ボタン押下
     */
     async onUnpublishButtonClick() {
      try {      
        if (confirm('通話から退出します。よろしいですか？')) {
          // 配信停止（Skyway）
          if (this.targetRoomData.webRtcService == CONSTANTS.WEB_RTC_SERVICE_SKYWAY) {            
            await unpublishMyAudio();
          // 配信停止（Agora）
          } else {
            await unpublishMyAudioByAgora();
          }

          this.isPublishing = false

          // チャット送信
          this.sendChat(this.targetUserData.name + "が通話から退出しました。")          
        }
      } catch (error) {        
        console.error(error);      
      }
    },    

    //======================================================
    //
    // 3-10. 退室ボタン押下
    //
    //======================================================

    /**
     * 退室ボタン押下
     * 
     * @param {*} to 
     * @param {*} from 
     * @param {*} next 
     */    
    async onCloseBoxClick(to, from, next) {
      try {      
        if (confirm('本当にページを離れますか？')) {
          // skyway退室
          if (this.targetRoomData.webRtcService == CONSTANTS.WEB_RTC_SERVICE_SKYWAY) {
            await leaveFromRoom(this.targetRoomId);
          // agora退室
          } else {
            await leaveFromRoomByAgora(this.targetRoomId)
          }
          
          this.$router.push('/rooms');
        } else {
          next(false);
        }
      } catch (error) {        
        console.error(error);      
      }
    },

    //======================================================
    //
    // 3-11. 部屋から退室
    //
    //======================================================

    /**
     * 部屋から退室
     * ・skywayのRoomから退室
     * ・FirebaseのLisnerデータを削除
     * 
     * @param {*} to 
     * @param {*} from 
     * @param {*} next 
     */
    async beforeLeave(to, from, next) {
      try {      
          // skyway退室
          if (this.targetRoomData.webRtcService == CONSTANTS.WEB_RTC_SERVICE_SKYWAY) {
            await leaveFromRoom(this.targetRoomId);
          // agora退室
          } else {
            await leaveFromRoomByAgora(this.targetRoomId)
          }

          // firebaseのlistnerキー削除
          await removeTargetListnerDataFromDB(this.targetRoomId, this.myListnerFbKey)

          // BGM停止
          this.stopBGM()

          next();
      } catch (error) {        
        console.error(error);      
      }
    },

    //======================================================
    // BGM停止
    //======================================================

    /**
     * BGM停止
     */
    stopBGM() {
      try {
        // BGM削除
        this.audioElement.pause()
        this.audioElement = null
      } catch (error) {
        console.error(error);      
      }
    },


    //======================================================
    //
    // サンプル
    //
    //======================================================

    sample() {
      //joinToRoom()
      //subscribeRoomAudio
      //publishMyAudioByAgora
      //subscribeRoomAudioByAgora
    }    
  },

  //======================================================
  // サイトから離れる
  //======================================================

  /**
   * サイトから離れる
   * 
   * @param {*} to 
   * @param {*} from 
   * @param {*} next 
   */
  beforeRouteLeave(to, from, next) {
    try {      
      this.beforeLeave(to, from, next);
    } catch (error) {        
      console.error(error);      
    }
  },

};

</script>

<!-- CSS-->
<style>
/* 部屋内のコンテナ */
#roomContainer {
  position: relative;
  padding: 20px;
  height: 100%;
}

#roomMainArea {
  width: 100%;
}

/* 部屋上部のフッター */
#roomHeaderArea {
  height: 120px; 
  padding: 20px;
  font-size: 70%;
  background-color: rgba(0, 0, 0, 0.1); 
}
.nameArea {
  padding: 20px 0;
}
.rightHeaderArea {
  padding: 40px 0 0;
}
.headerTopRightArea {
  padding: 20px 0;
}
#rightHeaderLeftArea {
  position: fixed;
  top: 4px;
  left: 24px;
  height: 50px;
  width: 40%;
  /*background: #CCCCCC;*/
  border-radius: 50px;
}
#roomOwnerImage {
  position: fixed;
  top: 12px;
  left: 32px;
  border: solid 1px #999999;
  border-radius: 25px;
  background: white;  
}
#roomTitle {
  position: fixed;
  top: 16px;
  left: 92px;
  border: solid 0px #999999;
}
#roomOwnerName {
  position: fixed;
  top: 36px;
  left: 92px;
  border: solid 0px #999999;
}

.multiCastUserImage {
  width: 25px;
  margin-right: 4px;
  border: solid 1px #999999;  
  border-radius: 50%;  
}

#chatArea {
  width: 100%;
  height: 60vh; 
  /*margin: 80px;*/
  display: flex;
  flex-direction: column-reverse;
  overflow-y: scroll;
  position: fixed;
	bottom: 60px;
  /*background-color: rgba(0, 0, 0, 0.5); */
  border: solid 0px #999999;
}

#commentTextBox {
  background: white;
  opacity: 1;
  border-radius: 10px;
}

.fixed-bottom {
  position: fixed;
  margin: 40px;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  background-color: #6d6d6d;
  text-align: center;
  line-height: 50px;
}

.dark {
  background: rgb(0,0,0, 0.5);
}

/* 閉じるボタン */
.closeBox {
  border: solid 0px #999999;
  position: fixed;
  top: 10px;
  right: 10px;
  border: solid 1px #CCCCCC;
  color: #333333;
}
/* 通話に参加ボタン */
.callButton {
  border: solid 0px #999999;
  position: fixed;
  top: 60px;
  right: 8px;
  color: gray;
  padding: 12px;
}
.image-container {
  display: flex;
  position: fixed;
  top: 72px;
  justify-content: flex-start; /* 左寄せ */
  align-items: center; /* 垂直方向の中央揃え */
  margin: 0 8px 0;
}
.chip-container {
  display: flex;
  position: fixed;
  top: 66px;
  justify-content: flex-start; /* 左寄せ */
  align-items: center; /* 垂直方向の中央揃え */
  margin: 0 8px 0;
}
.smallText {
  font-size: 80%;
}

</style>


