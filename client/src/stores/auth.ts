import {defineStore} from 'pinia'
export interface User {
    id: number,
    username: string,
    email: string,
    first_name: string,
    last_name: string,
}
export interface State {
    user: User
}
export const useAuthStore = defineStore('auth',{
    state : (): State =>{
        return {
            user: {} as User
        }
    },
    getters : {
        user: (state: State) => state.user,
        isAuthenticated: (state: State) => state.user?.id? true : false
    },
    actions : {
        async login (){

        },
        async register(){

        },
        async getUser(){

        },
        async logout(){

        },
        async refresh(){

        }
    }
})
