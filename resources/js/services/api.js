import axios from "axios";
import TokenService from "@/services/token.service";
import appConfig from "@/configs/app.config";

const axiosInstance = axios.create({
    baseURL: appConfig.APP_API,
    headers: {
        "Content-Type": "application/json"
    }
});
axiosInstance
    .interceptors
    .request
    .use((config) => {
        const token = TokenService.getLocalAccessToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

// Thêm interceptor sau response để xử lý lỗi xác thực
axiosInstance
    .interceptors
    .response
    .use((response) => {
        return response;
    }, (error) => {
        if (error.response && error.response.status === 401) {
            return Promise.reject(error);
        }
        return Promise.reject(error);
    });
export default axiosInstance;
