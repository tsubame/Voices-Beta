<template>
  <div class="text-center">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      location="end"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          icon="mdi-music"          
        >
        </v-btn>
      </template>

      <v-card min-width="300">
        <v-list>
          <v-list-item            
            title="Music"
            subtitle=""
          >
            <template v-slot:append>
            </template>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list>          
          <v-list-item class = "playButtonArea">
            <v-row justify="center" id = "playButtonArea">
              <v-btn v-if="!isPlaying" @click="playAudio" icon="mdi-play"></v-btn>
              <v-btn v-else @click="pauseAudio" icon="mdi-stop"></v-btn>
            </v-row>
          </v-list-item>

          <v-list-item>
            <v-row justify="center" id = "volumeArea">
              <v-icon>mdi-volume-high</v-icon> <audio ref="audioElement" :src="musicFile"></audio>
              <input type="range" min="0" max="1" step="0.05" v-model="volume" @change="changeVolume">
            </v-row>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
  export default {
    name: 'MusicPlayerDialog',
    data() {
      return {
        fav: true,
          menu: false,
          message: false,
          hints: true,      
        isPlaying: false,
        musicFile: "", //require("@/assets/bgm_koigokoro.mp3"),  
        volume: 0.1
      };
    },
    mounted() {
      this.$nextTick(() => {      

      })
    },
    methods: {
      playAudio() {
        console.log(this.volume)      
        this.isPlaying = true;
        //this.$refs.audioElement.play();

        this.$store.commit("setIsBgmPlaying", true)        
      },
      pauseAudio() {
        this.isPlaying = false;
        //this.$refs.audioElement.pause();

        this.$store.commit("setIsBgmPlaying", false)               
      },
      changeVolume() {
        //var v = Math.floor((left / Math.floor(this.volume * 10) / 10) * 100);        
        //this.$refs.audioElement.volume = v;

        this.$store.commit("setBgmVolume", this.volume)          
      },
      // ...
    }
  }
</script>

<style scoped>
  #playButtonArea {
    padding: 20px;
  }

  #volumeArea {
    padding: 20px;
  }
</style>