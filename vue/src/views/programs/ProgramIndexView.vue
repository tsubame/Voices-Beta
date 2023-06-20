<template>
    <v-main>
      <v-container class="py-8 px-6" fluid>
        <v-row justify="center">
          <v-dialog
            v-model="dialog"
            persistent
            width="1024"
          >
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" rounded>
                <v-icon>mdi-home-edit</v-icon>&nbsp;部屋を作る
              </v-btn>    
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5"></span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                  <v-select
                    :items="categories"
                    label="配信カテゴリ"
                    required
                  ></v-select>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      label="配信タイトル"
                      required
                    ></v-text-field>
                  </v-col>                  
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                  <v-switch
                    v-model="ex11"
                    label="マルチ募集"
                    color="info"
                    value="info"
                    hide-details
                  ></v-switch>
                  </v-col>                  
                  <v-col
                    cols="12"
                    sm="6"
                  >
                    <v-select
                      :items="['0-17', '18-29', '30-54', '54+']"
                      label="BGM"
                      required
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="dialog = false"
              >
                キャンセル
              </v-btn>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="dialog = false"
              >
              <v-icon>mdi-home-edit</v-icon>          
                配信開始
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        </v-row>        
        <v-row justify=center>
          <!-- カテゴリ -->
          <v-col v-for="category in categories" :key="category" cols="10">
            <v-card>
              <v-list lines="two">
                <v-list-subheader>{{ category }}</v-list-subheader>

                <!-- リスト -->
                <template v-for="program in programs" :key="program.Title" >
                  <v-list-item @click="goToDetail(program.ID)">
                    <!-- アイコン -->
                    <template v-slot:prepend>
                      <v-avatar color="grey-darken-1"></v-avatar>
                    </template>

                    <v-list-item-title>{{ program.Title }}</v-list-item-title>

                    <v-list-item-subtitle>
                      {{ program.Category }}
                    </v-list-item-subtitle>
                  </v-list-item>

                  <!-- 区切り線 -->
                  <v-divider v-if="program.n !== programs.length" :key="`divider-`" inset></v-divider>
                </template>

              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
</template>

<script>
import axios from 'axios'
import { CONSTANTS } from "../../consts/ConstantVals.js"
import { useCookies } from "vue3-cookies";
// API URL 番組一覧取得
const API_FETCH_URL = 'http://localhost:3000/api/programs/';

/**
 * エクスポート
 */
export default {
  data: () => ({
    categories: ['声劇', "雑談"],
    drawer: null,
    links: [
      ['mdi-inbox-arrow-down', 'Inbox'],
      ['mdi-send', 'Send'],
      ['mdi-delete', 'Trash'],
      ['mdi-alert-octagon', 'Spam'],
    ],
    ex11: ['red', 'indigo', 'orange', 'primary', 'secondary', 'success', 'info', 'warning', 'error', 'red-darken-3', 'indigo-darken-3', 'orange-darken-3'],    
    // ユーザID ランダム生成
    randomUserId: 0,    
    // 番組一覧
    programs: [], 
    myTwitterUserInfo: {
      ID: ""
    },
    dialog: false,
  }),
  setup: function() {
    const { cookies } = useCookies();

    return { cookies };
  },
  mounted : function(){
    // ユーザIDをランダムでセット
    this.setRandomSessionId()

    // 番組一覧をGoのAPIからセット
    this.getProgramsFromGoAPI()
    // リダイレクトされたURLパラメータからTwitterユーザIDなどをセット
    //this.setTwitterMyInfosFromURLParam()
    // Twitterユーザ情報のセット
    //this.setMyTwitterUserInfo()
  },
  methods : {
    /**
     * リダイレクトされたURLパラメータからTwitterユーザIDなどをセット
     */
    setTwitterMyInfosFromURLParam() {
      const id = this.$route.query.id
      const name = this.$route.query.name
      const screenName = this.$route.query.screen_name
      const profImageUrl = this.$route.query.profile_image_url
      console.log("URLパラメータ ID:" + id)
      if (typeof id === 'undefined') {
        console.log("id未定義")
      }

      if (typeof id !== 'undefined') {
        this.setCookie(CONSTANTS.COOKIE_KEY_TWITTER_ID, id)
        this.setCookie(CONSTANTS.COOKIE_KEY_TWITTER_NAME, name)
        this.setCookie(CONSTANTS.COOKIE_KEY_TWITTER_SCREEN_NAME, screenName)
        this.setCookie(CONSTANTS.COOKIE_KEY_TWITTER_PROFILE_IMAGE_URL, profImageUrl)     
        
        console.log("TwitterIDをCookieにセット:" + id)
      }
    },
    /**
     * ユーザIDをランダムでセット
     */
    setRandomSessionId() {
      const v = this.getCookie(CONSTANTS.COOKIE_KEY_RANDOM_USER_ID)
      console.log("ランダムユーザID Cookie取得" + v)

      if (v === null) {
        // セッションIDを乱数でセット
        this.randomUserId = Math.floor(Math.random() * 100000)
        console.log("ランダムユーザID生成" + v)

        this.setCookie(CONSTANTS.COOKIE_KEY_RANDOM_USER_ID, this.randomUserId)
      }
    },
    /**
     * Cookieの値を返す
     * 
     * @param  key 
     */
    getCookie(key){
      const v = this.cookies.get(key);
      if (v === undefined) {
        return ""
      }

      return v
    },
    /**
     * Cookieに値をセット
     * 
     * @param {} key 
     * @param {*} val 
     */
    setCookie(key, val){
      this.cookies.set(key, val);
    },
    /**
     * 番組一覧をGoのAPIからセット
     */
    getProgramsFromGoAPI() {
      axios
      .get(API_FETCH_URL)
      .then(response => {
        this.programs = response.data;

        // 番号をセット
        let i = 1
        this.programs.forEach(pg => {
          pg.n = i
          i++
        })

        console.log(this.programs)
        console.log(this.programs.length)
      })
      .catch(error => {
        console.log(error);
      })
    },
    /**
     * 番組ページに移動
     * 
     * @param  id 
     */
    goToDetail(id) {
      this.$router.push(`/programs/live/${id}`);
    },
    /**
     * 自分のTwitterユーザ情報をセット
     */
    setMyTwitterUserInfo() {
      // IDをCookieからセット
      let id = this.getCookie(CONSTANTS.COOKIE_KEY_TWITTER_ID)
      let name = this.getCookie(CONSTANTS.COOKIE_KEY_TWITTER_NAME)
      let screenName = this.getCookie(CONSTANTS.COOKIE_KEY_TWITTER_SCREEN_NAME)
      let profileImageUrl = this.getCookie(CONSTANTS.COOKIE_KEY_TWITTER_PROFILE_IMAGE_URL)

      let d = {
        id: id,
        name: name,
        screenName: screenName,
        profileImageUrl: profileImageUrl
      }

      this.$store.commit("setTwitterUser", d)

      console.log("Cookie内のTwitterID:" + id)
      console.log("Store内のTwitterID:" + this.$store.getters.getTwitterUser.id)
      console.log(this.$store.getters.getCount)

      // 空ならリダイレクト
      if (id == null) {
        console.log("id未セットのためリダイレクト対象")

        // リダイレクト
        const apiURL = CONSTANTS.API_URL_GO_TWITTER_AUTH + window.location.href
        console.log(apiURL)
        window.location.href = apiURL
      } else {
        console.log("Cookie内のTwitterID:" + id)
      }      
    }
  }
}
</script>