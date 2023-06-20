<template>
  <v-container class="py-8 px-6" fluid>     
    <!-- 検索バー -->   
    <SearchBar />
    <!-- フッターメニュー -->
    <AppFooterMenu :showFooterMenu="true" />
  </v-container>
</template>

<script>
// フッターメニュー
import AppFooterMenu from '@/components/App/AppFooterMenu.vue';
// SearchBar
import SearchBar from '@/components/SearchBar.vue';

export default {
  components: {
    AppFooterMenu,
    SearchBar
  },
  data() {
    return {
      name: '',
      email: '',
      dialog: false
    }
  },
  methods: {
    onSubmit(params) {
      this.dialog =false
      this.name = params.name
      this.email = params.email
    }
  }
}
</script>

<style>

</style>