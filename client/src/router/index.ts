import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegisterView from "@/views/auth/RegisterView.vue";
import UserView from "@/views/auth/UserView.vue";
import {useAuthStore} from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/register',
      name: 'register',
      component : RegisterView,
      meta: {requiresGuest:true}
    },
    {
      path :'/user',
      name: 'user',
      component: UserView,
      meta: {requiresAuth:true}
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
      meta: {requiresGuest:true}
    }
  ]
})
//navigation guard
router.beforeEach((to,from)=>{
    const store = useAuthStore();
    if(to.meta.requiresAuth && !store.isAuthenticated){
       return {name:'login',query:{redirect:to.fullPath}}
    }
    else if(to.meta.requiresGuest && store.isAuthenticated){
        return {name:'home'}
    }
    return true
})

export default router
