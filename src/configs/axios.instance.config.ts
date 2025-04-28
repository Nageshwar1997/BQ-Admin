import axios from "axios";
import { envs } from "../envs";

const api = axios.create({ baseURL: `${envs.BACKEND_URL}/api` });

export default api;
