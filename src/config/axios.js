import axios from "axios";

EXPO_PUBLIC_API_URL = 'https://apimobile.saralaccount.com'

const axiosInstance = axios.create({
    baseURL: EXPO_PUBLIC_API_URL,
})

export default axiosInstance