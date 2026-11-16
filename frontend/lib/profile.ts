import { axiosInstance } from "./axios";

export interface ProfileUpdate {
  first_name?: string;
  last_name?: string;
  phone?: string;
}

export interface ProfileUser {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: string;
}

export async function updateProfile(data: ProfileUpdate): Promise<ProfileUser> {
  const res = await axiosInstance.put<ProfileUser>("/auth/profile", data);
  return res.data;
}
