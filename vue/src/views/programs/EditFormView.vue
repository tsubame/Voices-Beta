<template>
  <div class="about">
    <h1>配信番組作成</h1>
  </div>
  <v-row justify=center>
    <v-col cols="8">
      <v-form @submit.prevent="submitForm">
        <v-text-field
          v-model="form.title"
          label="Title"
          required>
        </v-text-field>
        <v-text-field
          v-model="form.user_id"
          label="User ID"
          required>
        </v-text-field>
        <v-text-field
          v-model="form.category"
          label="Category"
          required>
        </v-text-field>
        <v-textarea
          v-model="form.description"
          label="Description"
          required>
        </v-textarea>
        <v-btn type="submit">Submit</v-btn>
      </v-form>
    </v-col>
  </v-row>

  <HelloWorld />
</template>

<script>
import axios from 'axios'
import HelloWorld  from '../../components/HelloWorld.vue'

axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

// API URL 番組作成
const API_POST_URL = '/api/programs/create/';

/**
 * エクスポート
 */
export default {
  data() {
    return {
      form: {
        title: '',
        user_id: '',
        category: '',
        description: ''
      }
    }
  },
  components: {
    HelloWorld
  },
  methods: {    
    async submitForm() {    
      // 数値に変換
      this.form.UserID = parseInt(this.form.user_id)      
      // 終了済をfalseに
      this.form.IsEnded = false
      console.log(this.form)

      // POST送信
      axios.post(API_POST_URL, this.form)
        .then(response => {
          console.log(response.data)
        })
        .catch(error => {
          console.log(error)
        })      
    }
  }
}
</script>