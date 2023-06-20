<template>
  <v-main>    
    <div id = "roomContainer">
      <header class="roomHeader">
        <!--<v-btn v-on:click="sendConReqToFB">リクエスト</v-btn>        -->
        <v-row>
          <v-col cols="9">
          </v-col>   
          <v-col cols="3" class="text-right">  

            <!-- ダイアログ -->
            <v-dialog v-model="dialog" persistent width="auto">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" rounded>
                  <v-icon>mdi-phone</v-icon>通話に参加
                </v-btn> 
              </template>
              <v-card>
                <v-card-title class="text-h5"></v-card-title>
                <v-card-text>通話に参加します。よろしいですか？</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="green-darken-1" variant="text" @click="dialog = false">
                    Cancel
                  </v-btn>
                  <v-btn color="green-darken-1" variant="text" @click="connectToVCRoom">
                    OK
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

          </v-col>                
        </v-row>      
      </header>

      <v-content>
        <v-container>    

          <!-- Firebase から取得したリストを描画（トランジション付き）-->
          <div id = "chatArea">
            <section v-for="chat in chats" :key="chat.text" class="item">
              <v-row>       
                <v-col cols="12">    
                  <ChatItem :chat="chat" />
                </v-col>
              </v-row>
            </section>     
          </div>

          <!-- リモートメディアエリア -->
          <div ref = "remoteMediaArea"></div>
          <!-- BGM -->
          <audio ref="audioElement" :src="musicFile"></audio>            
        </v-container>
      </v-content>

      <footer-menu />
      <v-footer app dark class = "dark">
        <v-row justify="center">
          <v-col cols="8">     
            <v-text-field id = "commentTextBox" placeholder="" v-model="inputtedTxt" label="コメントを入力" @keydown.enter="onEnterKeyPressedAtChatTextBox($event.keyCode)"></v-text-field> 
          </v-col>
          <v-col cols="1">
            <!-- いいねボタン -->
            <v-btn icon="mdi-heart"  v-on:click="onLikeButtonClick" rounded  color="pink"></v-btn>            
          </v-col>      
          <v-col cols="1">
            <MusicPlayerPopover />
          </v-col>
          <v-col cols="1">    
            <v-btn icon="mdi-microphone" v-on:click="muteMyVC" v-show="hasUnMuted" fab></v-btn>              
            <v-btn icon="mdi-microphone-off" v-on:click="unmuteMyVC" v-show="hasMuted" fab rounded color="grey"></v-btn>    
          </v-col>                
        </v-row>             
      </v-footer>  
    </div>      
  </v-main>
</template>

<!-- Javascript -->
<script>
import { CONSTANTS } from "../../consts/ConstantVals.js"
import { getDatabase, ref, push } from "firebase/database";
//import { onValue } from "firebase/database";
import { initAuthAnonymous, initAuthByGoogle, initAuthByTwitter, pushDataToDB, watchTargetKey } from '../../utils/FirebaseManager.js';
import { joinToRoom, mute, unmute } from '../../utils/SkywayManager.js';
import ChatItem from '../../components/ChatItem.vue'
//import FooterMenu from '../../components/FooterMenu.vue'
import MusicPlayerPopover from '../../components/MusicPlayerPopover.vue';
//import LivePopoverMenuVue from './LivePopoverMenu.vue';

/**
 * エクスポート
 */
export default {
  data() {
    return {
      // ユーザ情報
      user: {},  
      // チャットデータ（配列）
      chats: [],  
      // チャットデータ（単体）
      chat: {
        name: "",
        screenName: "",
        image: "",
        text: ""
      },
      // アクティブな部屋のメンバー
      activeRoomMember: {
        userId: 0,
        roomId: 0,
        hasTalkJoined: false,
        userProfileImage: "",
        isOwner: false,
      },
      // 部屋ID
      roomID: 0,      
      // セッションID ランダム生成
      sessionId: 0,
      // DBキー chats
      dbKeyChats: '',
      // DBキー chats
      dbKeyActiveRoomUsers: '',
      // DBキー con_reqs
      dbKeyConReqs: '',      
      // DBキー con_acks
      dbKeyConAcks: '',  
      // 入力したメッセージ
      inputtedTxt: '',
      // 部屋のオーナーか
      isOwner: false,
      // 接続要求を送信済か
      hasSendReq: false,
      // 接続要求承認済か
      hasReqAcked: false,
      // 接続要求があったか
      isExistConReq: false,
      // ミュート済か
      hasMuted: false,
      // ミュート解除中か
      hasUnMuted: true,
      // ダイアログ表示状態
      dialog: false,
      // BGM用ファイル
      musicFile: "", //require("@/assets/bgm_koigokoro.mp3"),        
    }
  },
  components: {
    ChatItem,
    //FooterMenu,
    MusicPlayerPopover,
    //LivePopoverMenuVue
  },
  setup: function() {
    console.log("setup LiveView") 
  },
  mounted: function() {
    // URLパラメータからRoomIDをセット
    this.roomID = this.$route.params.roomID
    // オーナーかをセット
    //this.isOwner = this.$route.params.isOwner
    // DBキーをセット
    this.dbKeyChats = `${CONSTANTS.FB_TABLE_ROOM_CHATS}/${this.roomID}`
    this.dbKeyActiveRoomUsers = `${CONSTANTS.FB_TABLE_ROOM_CHATS}/${this.roomID}`
    // セッションIDを乱数でセット
    this.sessionId = Math.floor(Math.random() * 100000)

    // chatsテーブルの変更を監視
    watchTargetKey(this.dbKeyChats, (snapshot) => {
      var dataArray = [];
      snapshot.forEach(function(childSnapshot) {
        var childData = childSnapshot.val();
        dataArray.push(childData);
      });

      // 配列を逆順にする
      dataArray.reverse();

      this.chats = dataArray;
    })
  },
  computed: {
    isBgmPlaying() {
      return this.$store.getters.getIsBgmPlaying
    },
    bgmVolume() {   
      return this.$store.getters.getBgmVolume
    },
  },  
  methods: {
    /**
     * 認証処理実行
     */
    execAuth() {
      // Google認証
      if (CONSTANTS.USE_GOOGLE_AUTH) {      
        initAuthByGoogle();
      // Twitter認証
      } else if (CONSTANTS.USE_TWITTER_AUTH) {
        initAuthByTwitter();
      // 匿名認証
      } else {
        initAuthAnonymous(); 
      }
    },
    /**
     * 音声をsubscribe
     */
    subscribe() {

    },
    /**
     * DBにチャットデータ書き込み
     */
    onEnterKeyPressedAtChatTextBox(keyCode) {
      const ENTER_KEY_CODE = 13
      // 日本語入力中は終了
      if (keyCode !== ENTER_KEY_CODE) {
        return;
      }

      this.chat = {
        name: this.$store.getters.getTwitterUser.name,
        image: this.$store.getters.getTwitterUser.profileImageUrl,
        text: this.inputtedTxt
      }

      // データを追加
      pushDataToDB(this.dbKeyChats, this.chat);

      this.inputtedTxt = ""
    },
    /**
     * いいねボタン押下
     */
     onLikeButtonClick() {
      const TEXT = "がいいねを送りました！"
      this.chat = {
        name: this.$store.getters.getTwitterUser.name,
        image: this.$store.getters.getTwitterUser.profileImageUrl,
        text: TEXT
      }

      // データを追加
      pushDataToDB(this.dbKeyChats, this.chat);
    },
    /**
     * 接続要求をFireBaseに送る
     */
    sendConReqToFB() {
      if (this.hasSendReq) {
        return
      }

      // データを追加
      push(ref(getDatabase(), this.dbKeyConReqs), {
        sesId: this.sessionId,
      });

      this.hasSendReq = true
    },
    /**
     * 接続要求の承認をFireBaseに送る
     */
     sendConAckToFB(sesId) {
      // データを追加
      push(ref(getDatabase(), this.dbKeyConAcks), {
        sesId: sesId,
      });

      this.hasSendReq = true
    },

    // スクロール位置を一番下に移動
    scrollBottom() {
      this.$nextTick(() => {
        window.scrollTo(0, document.body.clientHeight)
      })
    },    
    // 接続、音声通話参加開始
    connectToVCRoom() {
      joinToRoom(this.roomID, this.$refs.remoteMediaArea)
    },
    // ミュート
    async muteMyVC() {
      this.hasMuted = true;
      this.hasUnMuted = false;
      mute();
    },
    // アンミュート
    async unmuteMyVC() {
      this.hasMuted = false;
      this.hasUnMuted = true;
      unmute();
    }          
  },
  watch: {
    isBgmPlaying(newValue, oldValue) {
      console.log(`isBgmPlaying: ${oldValue} -> ${newValue}`);

      // 再生
      if (newValue) {     
        console.log(this.bgmVolume)        
        this.$refs.audioElement.play();
        this.$refs.audioElement.volume = this.bgmVolume;   
        this.$refs.audioElement.loop = true
      } else {     
        this.$refs.audioElement.pause();        
      }
    },
    bgmVolume(newValue, oldValue) {
      console.log(`volumeChange: ${oldValue} -> ${newValue}`);

      this.$refs.audioElement.volume = this.bgmVolume;        
    }
  },
};

</script>

<!-- CSS-->
<style>

</style>


