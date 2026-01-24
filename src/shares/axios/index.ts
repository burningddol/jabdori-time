
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

export async function getAnswer(): Promise<string> {
  const res = await api.get(""); 

  return res.data.answer;
}
