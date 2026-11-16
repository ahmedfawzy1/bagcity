import { axiosInstance } from "./axios";

export interface Address {
  _id: string;
  user: string;
  name: string;
  phone: string;
  flatHouse: string;
  area: string;
  city: string;
  pinCode: string;
  state: string;
  createdAt?: string;
  updatedAt?: string;
}

export type AddressInput = Omit<Address, "_id" | "user" | "createdAt" | "updatedAt">;

export async function getAddresses(): Promise<Address[]> {
  const res = await axiosInstance.get<Address[]>("/address");
  return res.data;
}

export async function addAddress(data: AddressInput): Promise<Address> {
  const res = await axiosInstance.post<Address>("/address", data);
  return res.data;
}

export async function updateAddress(id: string, data: AddressInput): Promise<Address> {
  const res = await axiosInstance.put<Address>(`/address/${id}`, data);
  return res.data;
}

export async function deleteAddress(id: string): Promise<void> {
  await axiosInstance.delete(`/address/${id}`);
}
