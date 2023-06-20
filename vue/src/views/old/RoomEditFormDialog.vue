<template>
  <v-dialog
      v-model="isShowingDialog"
      ref="modalLoginDialog"
      persistent
      width="600"
    >
    <v-form @submit.prevent="submitForm">
      <v-text-field
        v-model="form.title"
        label="タイトル"
        required>
      </v-text-field>
      <v-text-field
        v-model="form.category"
        label="カテゴリ"
        required>
      </v-text-field>
      <v-textarea
        v-model="form.description"
        label="説明"
        required>
      </v-textarea>
      <v-btn type="submit">Submit</v-btn>
    </v-form>  
  </v-dialog>     
</template>

<!--
//======================================================
//
// Script
//
//======================================================
-->
<script>

export default {  
  // props
  props: ['showDialog'],
  // data
  data() {
    return {
      // ダイアログを表示するか
      isShowingDialog: this.showDialog,
    }
  },

  //======================================================
  // methods
  //======================================================

  methods: {
    
  }
}
</script>

<!-- CSS-->
<style>

</style>

