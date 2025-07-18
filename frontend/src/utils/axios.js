import axios from "axios";

const instance = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}`,
    headers: {
        "Content-Type": "application/json",
    },
});

// Thêm interceptor để tự động thêm token vào header
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;
