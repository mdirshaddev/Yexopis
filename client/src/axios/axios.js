import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:7001'
})

export default axiosInstance