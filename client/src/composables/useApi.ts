import {axiosInstance,axiosInstancePrivate} from "@/utils/axios";
import {useAuthStore} from "@/stores/auth.js";
import {watchEffect} from "vue";

 export const useApiPrivate = () => {
    const authStore = useAuthStore();
    watchEffect(() =>{
        axiosInstancePrivate.interceptors.request.use(
            (config) => {
                if(!config.headers['authorization']){
                    config.headers['authorization'] = `Bearer ${authStore.accessToken}`;
                }
                return  config
            },
            (error) => {
                return Promise.reject(error);
            }
        );
        axiosInstancePrivate.interceptors.response.use(
            (response) => {
                return response;
            },
            async(error) => {
                const originalRequest = error?.config;
                if((error?.response?.status === 403 || error?.response?.status === 401) && ( !originalRequest.sent)){
                    originalRequest.sent = true;
                    try{
                        await authStore.refresh();
                        originalRequest.headers['authorization'] = authStore.accessToken;
                        return axiosInstancePrivate(originalRequest);
                    }catch (error) {
                        return Promise.reject(error);
                    }
                }
                return Promise.reject(error);
            }
        );
    })


    return axiosInstancePrivate;
}
export function useApi(){
    return axiosInstance
}
