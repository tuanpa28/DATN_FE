import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IService } from '~/interfaces/service';

const serviceApi = createApi({
  reducerPath: 'serviceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://datn-be-zqom.onrender.com',
  }),
  endpoints: (builder) => ({
    getServices: builder.query<{ data: IService[] }, any>({
      query: (params) => ({ url: '/api/services', params }),
    }),
  }),
});

export const { useGetServicesQuery } = serviceApi;
export default serviceApi;
