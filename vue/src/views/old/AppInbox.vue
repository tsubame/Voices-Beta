<template>
  <v-app id="inspire">
    <v-system-bar>      
      <v-spacer></v-spacer>
      <!--
      <v-icon>mdi-square</v-icon>
      <v-icon>mdi-circle</v-icon>
      <v-icon>mdi-triangle</v-icon>
      -->
    </v-system-bar>

    <v-navigation-drawer v-model="drawer">
      <v-sheet
        color="grey-lighten-4"
        class="pa-4"
      >
      >
        <v-avatar
          class="mb-4"
          color="grey-darken-1"
          size="64"
        ></v-avatar>

        <div>john@google.com</div>
      </v-sheet>

      <v-divider></v-divider>

      <v-list>
        <v-list-item
          v-for="[icon, text] in links"
          :key="icon"
          link
        >
          <template v-slot:prepend>
            <v-icon>{{ icon }}</v-icon>
          </template>

          <v-list-item-title>{{ text }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- メイン領域 -->
    <v-main>
      <v-container class="py-8 px-6" fluid>        

      </v-container>
    </v-main>

    <!-- フッターメニュー -->
    <v-bottom-navigation v-show="isMobile" app>
      <v-btn v-for="[icon, text] in links" :key="icon">
        <v-icon>{{icon}}</v-icon>
        {{text}}
      </v-btn>      
    </v-bottom-navigation>  
    <v-overlay v-if="showOverlay" @click="showMenu = false"></v-overlay>    
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      cards: ['Today', 'Yesterday'],
      drawer: null,
      links: [
        ['mdi-home', 'ホーム'],
        ['mdi-clock-outline', '配信一覧'],
        ['mdi-book-open-blank-variant', '台本一覧'],
        ['mdi-account', 'プロフィール'],
      ],
      isMobile: false,
      showMenu: false,
      showOverlay: false      
    }),
    mounted() {
      this.checkIsMobile()
      window.addEventListener('resize', this.checkIsMobile)
    },
    destroyed() {
      window.removeEventListener('resize', this.checkIsMobile)
    },
    methods: {
      checkIsMobile() {
        this.isMobile = window.innerWidth < 1200
      }
    }    
  }
</script>