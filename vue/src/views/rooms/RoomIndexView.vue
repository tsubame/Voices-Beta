<template>
  <v-main>
    <v-container class="py-8 px-6" fluid>     
      <!-- 検索バー -->   
      <SearchBar />
      <!-- 部屋作成ボタン -->
      <v-row class="text-right">   
        <v-col>
          <v-btn @click="$router.push('/rooms_edit_form')"><v-icon>mdi-cast</v-icon>&nbsp;部屋を作る</v-btn>
        </v-col> 
      </v-row>

      <!-- 配信一覧 -->
      <v-row justify="center">   
        <v-col cols="10">      
          <v-card>
            <v-list lines="two">      
              <v-list-subheader inset>声劇（{{ rooms.length }}件）</v-list-subheader>            
              <!-- リスト -->
              <template v-for="(room, i) in rooms" :key="room.title" >
                <v-list-item @click="goToDetail(room.id)">
                  <!-- アイコン -->
                  <template v-slot:prepend>
                    <v-img class="roomIcon" :value="room.title" 
                      :src="room.thumImageUrl" 
                    />                         
                  </template>
                  <v-list-item-title>{{ room.title }}</v-list-item-title>
                  <v-list-item-subtitle>{{ room.category }}</v-list-item-subtitle>
                  <template v-slot:append>
                    <v-badge color="pink" :content="room.webRtcService" v-if="room.webRtcService === 'agora'" inline></v-badge>     
                    <v-badge color="blue" :content="room.webRtcService" v-if="room.webRtcService === 'skyway'" inline></v-badge>                        
                    <v-icon color = "success">mdi-account</v-icon>0
                  </template>          
                </v-list-item>

                <!-- 区切り線 -->
                <v-divider v-if="i !== rooms.length - 1" :key="`divider-`" inset></v-divider>
              </template>
            </v-list>          
          </v-card>
        </v-col>
      </v-row>    

      <!-- フッターメニュー -->
      <AppFooterMenu :showFooterMenu="true" />
    </v-container>      
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
// RoomIndex.vue 配信一覧画面
//  ・配信一覧をDBから取得して描画
// 
// [索引]
//   □ 0. setup
//
//   □ 1. watch
//
//   □ 2. methods
//
//======================================================

// 定数
//import { CONSTANTS } from '../../consts/ConstantVals';
// SearchBar
import SearchBar from '@/components/SearchBar.vue';
// Footerメニュー
import AppFooterMenu from '@/components/App/AppFooterMenu.vue';
// Go API操作用
import { getActiveRoomDatas } from '../../utils/GoAPIManager'

/**
 * 
 */
export default {

  // コンポーネント 
  components: {
    SearchBar,
    AppFooterMenu,
  },

  // data
  data: () => ({
    // 部屋データ
    room: {
      id: 0,
      title: "",
      category: "",
      thumImageUrl: "",
      bgImageUrl: "",
      bgmUrl: "",
      isActive: false,
      startedAt: null
    },
    // 部屋データ（サンプル用）
    rooms: [
    ],
    files: [
      {
        color: 'blue',
        icon: 'mdi-clipboard-text',
        subtitle: 'Jan 20, 2014',
        title: 'Vacation itinerary',
      },
      {
        color: 'amber',
        icon: 'mdi-gesture-tap-button',
        subtitle: 'Jan 10, 2014',
        title: 'Kitchen remodel',
      },
    ],
    folders: [
      {
        subtitle: 'Jan 9, 2014',
        title: 'Photos',
      },
      {
        subtitle: 'Jan 17, 2014',
        title: 'Recipes',
      },
      {
        subtitle: 'Jan 28, 2014',
        title: 'Work',
      },
    ],  
  }),

  //======================================================
  //
  // 0. mounted
  //
  //======================================================

  mounted() {
    try {      
      this.setAllRooms() 
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
    // 2-1. 部屋データの一覧をセット
    // 
    //======================================================

    /**
     * 部屋データの一覧をセット
     */
    async setAllRooms() {
      try {      
        this.rooms = await getActiveRoomDatas()

        console.log(this.rooms.length + "件のデータを取得")        
      } catch (error) {        
        console.error(error);      
      }
    },

    //======================================================
    //
    // 2-2. 部屋アイテムクリック
    // 
    //======================================================

    /**
     * 部屋アイテムクリック
     *  ・個別の部屋に移動
     */
    goToDetail(roomId) {
      try {      
        let url = '/rooms/' + roomId

        console.log(url)
        // 個別の部屋に遷移
        this.$router.push(url)    
      } catch (error) {        
        console.error(error);      
      }
    }
  }      
}
</script>

<style scoped>

.roomIcon {
  width: 50px;
  margin: 0px 20px 0px 8px;
}

</style>