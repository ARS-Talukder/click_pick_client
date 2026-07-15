import axios from "axios";

// https://click-pick-server.onrender.com/
// http://localhost:5000

export const SERVER_URL = "http://localhost:5000";

const API = axios.create({
    baseURL: SERVER_URL,
});

export default API;