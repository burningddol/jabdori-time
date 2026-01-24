import axios from "axios";
import type { ConfessionFormData } from "@/lib/validation";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

export interface ConfessionResponse {
  answer: string;
}

export async function submitConfession(payload: ConfessionFormData): Promise<ConfessionResponse> {
  const res = await api.post("", payload);
  return res.data;
}
