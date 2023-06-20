import { createRouter, createWebHistory } from 'vue-router'

// ルーティング情報
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "index" */ '../views/rooms/RoomIndexView.vue')
  },
  {
    path: '/rooms/',
    name: 'rooms_index',
    component: () => import(/* webpackChunkName: "rooms_index" */ '../views/rooms/RoomIndexView.vue')
  },  
  {
    path: '/rooms_edit_form',
    name: 'rooms_edit_form',
    component: () => import(/* webpackChunkName: "editForm" */ '../views/rooms/RoomEditFormView.vue')
  },  
  {
    path: '/rooms/:roomId',
    name: 'rooms_live',
    component: () => import(/* webpackChunkName: "live" */ '../views/rooms/RoomDetailView.vue')
  },
  {
    path: '/scripts/',
    name: 'scripts_index',
    component: () => import(/* webpackChunkName: "scripts_index" */ '../views/scripts/ScriptIndexView.vue')
  },
  {
    path: '/users/',
    name: 'users_index',
    component: () => import(/* webpackChunkName: "users_index" */ '../views/users/MyPageView.vue')
  },    
  /*
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    component: () => import( '../views/AboutView.vue')
  },*/
  {
    path: '/programs/',
    name: 'programs_index',
    component: () => import(/* webpackChunkName: "index" */ '../views/programs/ProgramIndexView.vue')
  },

  {
    path: '/programs/live/:roomID',
    name: 'programs_live',
    component: () => import(/* webpackChunkName: "live" */ '../views/programs/LiveView.vue')
  }  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
