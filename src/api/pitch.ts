/* eslint-disable @typescript-eslint/no-explicit-any */
import instance from "./config";


export const getAllPitch = (query?: string,) => {
  return instance.get(`/pitch${query ?? ""}`,);
};
export const searchPitch = (params: any) => {
  return instance.get(`/pitch?searchText=${params.searchText}${params.paramPrice ? `&minPrice=${params.paramPrice.minPrice}&maxPrice=${params.paramPrice.maxPrice}` : ''}`);
};
export const Pitch = (searchText?: string) => {
  return instance.get(`/pitch?searchText=${searchText}`);
};
export const PitchPagination = (page?: number, limit?: number,) => {
  return instance.get(`/pitch?page=${page}&limit=${limit}`);
};
export const getOnePitch = (idPitch: string) => {
  return instance.get(`/pitch/${idPitch}`);
};
export const getCreatPitch = (pitch: any) => {
  return instance.post(`/pitch`, pitch);
};
export const getUpdatePitch = (_id: any, pitch: any) => {
  return instance.put(`/pitch/${_id}`, pitch);
};
export const getDeletePitch = (idPitch: any) => {
  return instance.delete(`/pitch/${idPitch}`);
};
