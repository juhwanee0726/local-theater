import axios from "axios";

const apiClient = axios.create();


apiClient.interceptors.response.use(
    res => res.data,
    err => Promise.reject(err)
);

export default apiClient;