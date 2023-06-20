<template>
  <!-- 横メニューアイテム -->
  <v-list>
    <v-list-item
      v-for="[icon, text, url] in linkItems"
      :key="icon"
      router v-bind:to="url"
    >
      <template v-slot:prepend>
        <v-icon>{{ icon }}</v-icon>
      </template>
      <v-list-item-title>{{ text }}</v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<!--
//======================================================
// script
//======================================================
-->
<script>
import { CONSTANTS } from '../../consts/ConstantVals';

//======================================================
//
// AppLeftMenu.vue Script App画面の左メニューアイテム
//  ・メニューのリンクを定数から取得して描画
// 
// [索引]
//   □ 0-1. setup
//
//   □ 1.   methods
//
//======================================================

export default {
  // data
  data() {
    return {
      linkItems: CONSTANTS.LINK_VALS,
    }
  },
}
</script>
