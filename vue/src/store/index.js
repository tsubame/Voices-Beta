//======================================================
//
// storeモジュール
//
// [索引]
//  □ 1. State
//  □ 2. Getter
//  □ 3. Mutation
//  □ 4. Action
//
//======================================================

import { CONSTANTS } from '@/consts/ConstantVals'
import { createStore } from 'vuex'
import todo from './modules/todo';
import { useCookies } from "vue3-cookies";

// cookie
const { cookies } = useCookies();

/**
 * export
 */
export default createStore({

  // modules
  modules: {
    todo,
  },

  //======================================================
  //
  // 1. State
  //
  //======================================================

  state: {
    twitterUser: {
      id: "",
      name: "",
      screenName: "",
      profileImageUrl: ""
    },
    // ユーザ情報
    targetUserData: {
      id: 0,
      idStr: "",
      name: "",
      profileImageUrl: ""
    },
    twitterUserId: "",
    // BGM再生中か
    isBgmPlaying: false,
    // ミュート中か 
    isMuting: false,
    // BGMボリューム
    bgmVolume: 0.1,
    bgmFileName: "",    
    isRoomOwner: false,

    // コンボボックス用のBGM選択肢
    bgms: [
      {
        title: '素直じゃないね恋心',
        filePath: require('@/assets/bgm/素直じゃないね恋心.mp3'),
      },
      {
        title: 'さみしいおばけと東京の月',
        filePath: require('@/assets/bgm/さみしいおばけと東京の月.mp3'),
      },
      {
        title: 'Cassette Tape Dream',
        filePath: require('@/assets/bgm/Cassette_Tape_Dream.mp3'),        
      },
      {
        title: '茶屋にて',
        filePath: require('@/assets/bgm/茶屋にて.mp3'),             
      },        
      {
        title: '2:23 AM',
        filePath: require('@/assets/bgm/2_23_AM.mp3'),          
      },    
    ],    
    // 背景画像
    bgImages: [
      {
        title: "喫茶店",
        filePath: require('@/assets/img/bg/cafe.jpg')
      },
      {
        title: "公園",
        filePath: require('@/assets/img/bg/park.jpg')    
      },      
      {
        title: "街中",
        filePath: require('@/assets/img/bg/city.jpg')    
      },      
    ],
    // ゲストユーザ用のアイコン
    guestUserIcons: [
      require('@/assets/img/icon/user_icon_0.png'),      
      require('@/assets/img/icon/user_icon_1.png'),   
      require('@/assets/img/icon/user_icon_2.png'),   
      require('@/assets/img/icon/user_icon_3.png'),   
      require('@/assets/img/icon/user_icon_4.png'),   
      require('@/assets/img/icon/user_icon_5.png'),   
      require('@/assets/img/icon/user_icon_6.png'),             
      require('@/assets/img/icon/user_icon_7.png'),   
      require('@/assets/img/icon/user_icon_8.png'),   
      require('@/assets/img/icon/user_icon_9.png'),   
      require('@/assets/img/icon/user_icon_10.png'),     
    ],
  },

  //======================================================
  //
  // 2. Getter
  //
  //======================================================

  getters: {

    //======================================================
    //
    // 2-1. ログイン中かを返す
    //
    //======================================================

    /**
     * ログイン中かを返す
     * 
     * @param {} state 
     * @returns 
     */
    getHasLogined: state => {
      try {
        // Storeに値があればTrue
        if (state.targetUserData.name != "") {  
          console.log("[Storeに値ありのためログイン中と判別]" + state.userData.name)

          return true
        } 

        // Cookieに値があればTrue
        const cName = getCookie(CONSTANTS.COOKIE_KEY_USER_NAME)
        console.log("[Cookie内のID値]" + cName)

        if (cName !== "") {
          console.log("[Cookieに値ありのためログイン中と判別]" + cName)

          return true
        }

        console.log("[未ログイン]")
      } catch (error) {
        // エラーが発生した場合の処理
        console.error(error);
      }

      return false
    },

    //======================================================
    //
    // 2-2. ユーザデータを返す
    //
    //======================================================

    /**
     * ユーザデータを返す
     * 
     * @param {} state 
     * @returns 
     */
    getTargetUserData: state => {
      try {
        // storeに値がなければ
        if (state.targetUserData.name === "") {
          // storeに値がなく、Cookieに値があればCookieからセット
          const cName = getCookie(CONSTANTS.COOKIE_KEY_USER_NAME)
          if (cName !== "") {
            state.targetUserData.name = cName        
            state.targetUserData.idStr = getCookie(CONSTANTS.COOKIE_KEY_USER_ID_STR)
            state.targetUserData.profileImageUrl = getCookie(CONSTANTS.COOKIE_KEY_PROFILE_IMAGE_URL)
            
            let nStr = getCookie(CONSTANTS.COOKIE_KEY_USER_ID) 
            if (nStr !== "") {
              state.targetUserData.id = parseInt(nStr)
            }
            
            console.log("[Cookieから値をセット]" + state.targetUserData)
          }
        }
      } catch (error) {
        console.error(error);
      }

      return state.targetUserData
    },    

    //======================================================
    //
    // 2-3. ユーザIDを返す
    //
    //======================================================

    /**
     * ユーザIDを返す
     * 
     * @param {} state 
     * @returns 
     */
    getTargetUserId: state => {
      let n = 0

      try {      
        let nStr = state.targetUserData.id
        n = parseInt(nStr)
      } catch (error) {        
          console.error(error);      
      }

      return n
    },   

    //======================================================
    //
    // 2-4. ユーザID（文字列1）を返す
    //
    //======================================================

    /**
     * ユーザID（文字列）を返す
     * 
     * @param {} state 
     * @returns 
     */
    getTargetUserIdStr: state => {
      return state.targetUserData.idStr
    },   
    
    //======================================================
    //
    // 2-5. ユーザ名を返す
    //
    //======================================================

    /**
     * ユーザ名を返す
     * 
     * @param {} state 
     * @returns 
     */
    getTargetUserName: state => {
      return state.targetUserData.name
    },        
    
    //======================================================
    //
    // 2-6. ユーザのプロフィール画像を返す
    //
    //======================================================

    /**
     * ユーザのプロフィール画像を返す
     * 
     * @param {} state 
     * @returns 
     */
    getTargetUserProfileImagerUrl: state => {
      return state.targetUserData.profileImageUrl
    },   

    //======================================================
    //
    // 2-7. BGMの候補を返す
    //
    //======================================================    

    /**
     * BGMの候補を返す
     * 
     * @param {*} state 
     * @returns 
     */
    getBgms: state => {
      return state.bgms
    },

    //======================================================
    //
    // 2-8. 背景画像の候補を返す
    //
    //======================================================    

    /**
     * 背景画像の候補を返す
     * 
     * @param {*} state 
     * @returns 
     */
    getBgImages: state => {
      return state.bgImages
    },

    //======================================================
    //
    // 2-9. ゲストユーザアイコンの候補を返す
    //
    //======================================================    

    /**
     * ゲストユーザアイコンの候補を返す
     * 
     * @param {*} state 
     * @returns 
     */
    getGuestUserIcons: state => {
      return state.guestUserIcons
    },    

    //======================================================
    //
    // 2-10. ミュート中かを返す
    //
    //======================================================

    /**
     * 
     * @param {*} state 
     * @returns 
     */
    getIsMuting: state => {
      return state.isMuting;
    },

    //======================================================
    //
    // 2-11. BGM再生中かを返す
    //
    //======================================================

    /**
     * 
     * @param {*} state 
     * @returns 
     */
    getIsBgmPlaying: state => {
      console.log(state.isBgmPlaying)

      return state.isBgmPlaying;
    },

    //======================================================
    // その他
    //======================================================

    getTwitterUser: state => {
      return state.twitterUser      
    },

    getBgmVolume: state => {    
      return state.bgmVolume     
    },
    getBgmFileName: state => {
      return state.bgmFileName      
    },    
  },

  //======================================================
  //
  // 3. Mutation（Storeの値の変更）
  //
  //======================================================

  mutations: {

    //======================================================
    //
    // 3-1. ユーザデータのセット
    //
    //======================================================

    /**
     * ユーザデータのセット
     *   ・state、cookieにセット
     * 
     * @param {} state 
     * @param {*} d 
     */
    setTargetUserData(state, d) {
      try {
        state.targetUserData = d
        // Cookieに値をセット
        cookies.set(CONSTANTS.COOKIE_KEY_USER_ID, d.id);     
        cookies.set(CONSTANTS.COOKIE_KEY_USER_ID_STR, d.idStr);        
        cookies.set(CONSTANTS.COOKIE_KEY_USER_NAME, d.name)
        cookies.set(CONSTANTS.COOKIE_KEY_PROFILE_IMAGE_URL, d.profileImageUrl)    
        
        console.log(d)
      } catch (error) {
        console.error(error);
      }
    },

    //======================================================
    //
    // 3-2. ユーザデータのクリア
    //
    //======================================================

    /**
     * ユーザデータのクリア
     * @param {} state 
     * @param {*} d 
     */
    clearUserData(state) {
      try {
        state.targetUserData.id = 0        
        state.targetUserData.idStr = ""
        state.targetUserData.name = ""
        state.targetUserData.profileImageUrl = ""

        // Cookieに値をセット
        cookies.set(CONSTANTS.COOKIE_KEY_USER_ID, "");           
        cookies.set(CONSTANTS.COOKIE_KEY_USER_ID_STR, "");        
        cookies.set(CONSTANTS.COOKIE_KEY_USER_NAME, "")
        cookies.set(CONSTANTS.COOKIE_KEY_USER_ID_STR, "")     
        
        console.log("ユーザデータをクリア")
      } catch (error) {
        // エラーが発生した場合の処理
        console.error(error);
      }
    },    

    //======================================================
    //
    // 3-3. ミュート中かをセット
    //
    //======================================================

    /**
     * ミュート中かをセット
     * 
     * @param {} state 
     * @param {*} d 
     */
    setIsMuting(state, payload) {
      state.isMuting = payload
    },

    //======================================================
    //
    // 3-4. BGM再生中かをセット
    //
    //======================================================

    /**
     * BGM再生中かをセット
     * @param {} state 
     * @param {*} d 
     */
    setIsBgmPlaying(state, payload) {
      state.isBgmPlaying = payload

      console.log("[BGM再生状態]" + payload)
    },    

    /**
     * 
     * @param {*} state 
     * @param {*} payload 
     */
    setTwitterUser(state, payload) {
      console.log("setTwitterUser.")
      console.log(payload)

      state.twitterUser = payload
      state.twitterUserId = payload.id
      state.count = 10
    },

    setBgmVolume(state, payload) {
      state.bgmVolume = payload
    },    
    setBgmFileName(state, payload) {
      state.bgmFileName = payload
    },       
  },

  //======================================================
  //
  // 4. Action
  //
  //======================================================

  actions: {
    sendDataToFB() {
      console.log("send.")
    }
  },
})

//======================================================
//
// その他
//
//======================================================

/**
 * Cookieの値を返す
 * 
 * @param  key 
 */
function getCookie(key){
  try {
    const v = cookies.get(key);
    if (v !== undefined && v !== null) {
      return v
    }
  } catch (error) {
    console.error(error);
  }

  return ""
}