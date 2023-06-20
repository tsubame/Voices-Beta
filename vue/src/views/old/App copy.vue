<template>
  <v-app>
    <v-main class="main-container" >
      <nav>
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link> |
        <router-link to="/programs/">配信一覧</router-link> |        
        <router-link to="/programs/editForm">新規作成</router-link>
      </nav>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
  mounted: function() {
    console.log("App mounted.")      
    this.message = 'Hello, Vue.js!'
  },   
}
</script>

<style>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.main-container {
  margin: auto;
  width: 1000px;
  max-width: 800px;
  padding: 0 0px;
  border: solid 1px #999999;
}
</style>

