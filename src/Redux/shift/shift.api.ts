import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import IShift from '~/interfaces/shift';

const shiftApi = createApi({
  reducerPath: 'shiftApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://datn-be-chi.vercel.app',
  }),
  endpoints: (builder) => ({
    getShiftsByChildrenPitch: builder.query<{ data: IShift[] }, { childrenPitchId: string; params: any }>({
      query: ({ childrenPitchId, params }) => ({
        url: '/api/shift/childrent-pitch/' + childrenPitchId,
        method: 'GET',
        params,
      }),
    }),
    getShiftsByChildrenPitchBookingMonth: builder.query<{ data: IShift[] }, { childrenPitchId: string; params: any }>({
      query: ({ childrenPitchId, params }) => ({
        url: '/api/shift/childrent-pitch/booking-month/' + childrenPitchId,
        method: 'GET',
        params,
      }),
    }),
  }),
});

export const { useGetShiftsByChildrenPitchQuery, useGetShiftsByChildrenPitchBookingMonthQuery } = shiftApi;
export default shiftApi;
