import { axiosClientAPI } from "../API/ClientAPI";
export async function getData(url) {
  return await axiosClientAPI.get(url).then((response) => response.data);
}

export async function setData(url, data) {
  return await axiosClientAPI.post(url, data).then((response) => response.data);
}
