import axios from 'axios';

export default axios.create({
    //baseURL: 'https://localhost:5001',
    baseURL: "https://ntnumaster2022api.azurewebsites.net"
    //withCredentials: true
    //baseURL: 'https://localhost:44374'
});