<template>     
  <v-col cols = "10" class="item"> 
    <img v-bind:src="chat.profileImageUrl" class = "item-image" />          
    <div class="item-name">{{ chat.userName }}</div>    
    <span class="item-message">{{ chat.text }}</span>
  </v-col>
</template>

<script>
export default {
  props: ['chat'],
  data() {
    return {

    }
  },
  setup: function() {
    console.log("chat item setup") 
  },
}
</script>

<style scoped>
/*
.chatItem {
    margin: 4px;
    padding: 4px 8px;
    text-align: left;
    font-size: 90%;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 8px;    
    height: 32px;
  }
  .round-image {
    float: left;
    opacity: 1;
    border-radius: 50%;
  }
  .name {
    padding: 4px;
    color: #e1dfeb;
    font-weight: bold;
    line-height: 26px;
  }  
  .text {
    color: white;
    font-weight: normal;
    padding: 4px 8px;
    line-height: 26px;
  }*/

.item {
  position: relative;
  display: flex;
  align-items: flex-end;
  margin-bottom: 0.4em;
}
.item-image {
  width: 40px;
  height: 40px;
  border-radius: 40px;
  vertical-align: top;
  border: solid 1px #999999;
}
.item-detail {
  margin: 0 0 0 1.4em;
}
.item-name {
  left: 72px;
  top: -4px;
  position: absolute;
  font-size: 70%;
}
.item-message {
  position: relative;
  display: inline-block;
  margin-left: 20px;
  padding: 0.6em;
  background: #deefe8;
  border-radius: 4px;
  line-height: 1.2em;
}
.item-message::before {
  position: absolute;
  content: " ";
  display: block;
  left: -16px;
  bottom: 12px;
  border: 4px solid transparent;
  border-right: 12px solid #deefe8;
}  
</style>