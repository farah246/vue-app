<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <router-link  :to="{name:'home'}" class="navbar-brand" href="#">Navbar</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="appNavbar">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link :to="{name:'home'}" class="nav-link" aria-current="page" >Home</router-link>
          </li>
        </ul>
        <ul class="navbar-nav mx-2 -auto mb-2 mb-lg-0">
          <li v-if="isAuthenticated" class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              {{ user.username }}
            </a>
            <ul class="dropdown-menu">
              <li><router-link :to="{name:'user'}" class="dropdown-item">profile</router-link></li>
              <li><hr class="dropdown-divider"></li>
              <li><button @click="logout" class="dropdown-item btn btn-danger">Logout</button></li>
            </ul>
          </li>
          <template v-else>
            <li class="nav-item">
              <router-link :to="{name:'login'}" class="nav-link" aria-current="page" >Login</router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{name:'register'}" class="nav-link" aria-current="page" >Register</router-link>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script setup lang="ts">
import{ useAuthStore} from "@/stores/auth";
import {computed, ref} from "vue";
import{ useRouter} from "vue-router";
const router = useRouter()
const authStore = useAuthStore()
const user = computed (()=>{return authStore.user })
const isAuthenticated = computed (()=>{return authStore.isAuthenticated })
const errorMessage = ref<string>('')
async function logout (){
  await authStore.logout().then(res=>{
    if(res){
      router.replace({name: 'home'})
    }
  }).catch(err=>errorMessage.value=err.response.data.message)
}
</script>
