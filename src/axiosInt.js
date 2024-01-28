import axios from 'axios';
const axiosInt=axios.create({
    // baseURL:''
    baseURL:'http://localhost:4000'
})
axiosInt.interceptors.request.use((config)=>{
    const verified=sessionStorage.getItem("verificationStatus");
    if(verified){
        if(config) config.headers.token=verified;}    
    return config;
},
    (error)=>{
        return Promise.reject(error);        
    }
)
export default axiosInt