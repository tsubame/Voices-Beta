<template>     
  <div class="chatItem">
    <img v-bind:src="chat.image" class = "round-image" width = "24" />        
    <span class="name">{{ chat.name }}  </span>   
    <span class="text">{{ chat.text }}</span>
  </div>
</template>

<script>
export default {
  name: 'ChatItem',
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
  .chatItem {
    margin: 4px;
    padding: 4px 8px;
    text-align: left;
    font-size: 90%;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 4px;    
    height: 32px;
  }
  .round-image {
    float: left;
    opacity: 1;
    border-radius: 50%;
  }
  .name {
    padding: 4px;
    color: #c8c4db;
    font-weight: bold;
    line-height: 26px;
  }  
  .text {
    color: white;
    font-weight: normal;
    padding: 4px;
    line-height: 26px;
  }
</style>