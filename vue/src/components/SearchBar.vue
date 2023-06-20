<template>
  <v-app-bar
    class="px-3"
    color="grey-lighten-4"
    flat
    height="60"
  >
    <v-spacer></v-spacer>
    <v-responsive max-width="156">
      <v-text-field
        id="searchTextBox"
        bg-color="grey-lighten-2"
        class="rounded-pill overflow-hidden"
        density="compact"
        hide-details
        prepend-inner-icon="mdi-magnify"
        variant="solo"
      ></v-text-field>
    </v-responsive>          
  </v-app-bar>     
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
// 検索バー
//
//======================================================

export default {  
  
}
</script>

<style scoped>
#searchTextBox {
  height: 20px;
  border: solid 1px #999999;
}
</style>
