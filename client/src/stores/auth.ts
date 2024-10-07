import {defineStore} from 'pinia'
import {useApi} from '../composables/useApi'
export interface User {
    id: number,
    username: string,
    email: string,
    first_name: string,
    last_name: string,
}
export interface State {
    user: User
    accessToken: string
}
export interface LoginData {
    email: string,
    password: string
}
export interface RegisterData {
    username: string,
    email: string,
    password: string,
    password_confirm: string,
    first_name: string,
    last_name: string
}
export const useAuthStore = defineStore('auth',{
    state : (): State =>{
        return {
            user: {} as User,
            accessToken: '' as string,
        }
    },
    getters : {
        userDetail: (state: State) => state.user,
        isAuthenticated: (state: State) => state.user?.id? true : false
    },
    actions : {
        async login (payload: LoginData){
            try{
                const {data} = await useApi().post('/api/auth/login',payload);
                this.$patch({
                    accessToken: data.accessToken as string
                })
                await this.getUser()
                return data
            }catch(error: Error | any){
                throw error.message
            }
        },
        async register(payload:RegisterData){
            try{
                const {data} = await useApi().post('/api/auth/register',payload)
                return data
            }catch(error: Error | any){
                throw error.response.message
            }
        },
        async getUser(){
            try{
                console.log('get user')
                const {data} = await useApi().get('/api/auth/user')
                this.$patch({
                    user: data as User
                })
                return data
            }catch(error: Error | any){
                throw error.message
            }
        },
        async logout(){
            try{
                const {data} = await useApi().post('/api/auth/logout')
                this.$patch({
                    user: { id: 0, username: '', email: '', first_name: '', last_name: '' },
                    accessToken: ''
                })
                return data
            }catch(error: Error | any){
                throw error.message
            }
        },
        async refresh(){
            try{
                const {data} = await useApi().post('/api/auth/refresh')
                this.$patch({
                    accessToken: data.accessToken as string
                })
                return data
            }catch(error: Error | any){
                throw error.response.message
            }
        }
    }
})
