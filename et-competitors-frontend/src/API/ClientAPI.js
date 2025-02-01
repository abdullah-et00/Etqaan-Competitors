import axios from "axios";
import { baseURL } from "../Utils/utils";
//const isDevelopment = import.meta.env.MODE === 'development';

export const axiosClientAPI = axios.create({
  //baseURL: baseURL,//!isDevelopment && baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
