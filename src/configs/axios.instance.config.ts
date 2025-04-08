import axios from "axios";
import { BACKEND_URL } from "../envs/index.env";

const api = axios.create({ baseURL: `${BACKEND_URL}/api` });

export default api;
