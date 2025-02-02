import { Button, Radio } from 'antd';
import { memo, useState } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useAppSelector } from '~/Redux/hook';
import { createUrlVnpay } from '~/api/vnpay.api';
import { hideLoader, showLoader } from '~/components/LoaderAllPage';
import { Show } from '~/components/Show';
import useCreateBooking from '~/hooks/useCreateBooking';
import { IInfoBooking } from '~/interfaces/booking.type';

type BookingScreenProps = {
  setCurrent: React.Dispatch<number>;
};
const BookingScreen = ({ setCurrent }: BookingScreenProps) => {
  const [infoBooking] = useState<IInfoBooking>(JSON.parse(sessionStorage.getItem('infoBooking') as string) as IInfoBooking);
  const _totalPriceService =
    (infoBooking?.services?.reduce((total, service) => total + service.price, 0) || 0) * infoBooking?.shift?.numberDate;

  const [modeBanking, setModeBanking] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<number>(infoBooking?.shift.totalPrice);
  const currentUser: any = useAppSelector((state) => state.user.currentUser);

  const handleChangeModeBanking = (e: any) => {
    if (e.target.value === 1) {
      setTotalPrice(infoBooking?.shift.totalPrice);
    } else {
      setTotalPrice(infoBooking?.shift.totalPrice * 0.4);
    }
    setModeBanking(e.target.value);
  };

  const handleBanking = () => {
    Swal.fire({
      position: 'center',
      title: 'Warning',
      text: 'Bạn xác nhận thanh toán chứ!!',
      icon: 'warning',
      confirmButtonText: 'Đồng ý',
      showDenyButton: true,
      returnInputValueOnDeny: false,
      denyButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const _infoBooking = {
          user_bank: currentUser?.values?._id,
          user_receiver: infoBooking?.admin_pitch?._id,
          vnp_OrderInfo: 'Thanh toan',
          price_received: totalPrice,
          total_received: infoBooking?.shift.totalPrice,
        };
        showLoader();
        createUrlVnpay(_infoBooking)
          .then(async (result) => {
            const urlRedirect = result.data.url_redierct;

            window.open(urlRedirect, '_self');
          })
          .catch((error: any) => {
            toast.error('Lỗi ' + error.message);
            //console.log(error);
          })
          .finally(() => {
            hideLoader();
          });
      }
    });
  };

  // handle create booking
  useCreateBooking({ infoBooking, currentUser, setCurrent, price_received: infoBooking?.shift.totalPrice * 0.4 });

  return (
    <div className="border border-solid px-5 py-2 rounded-md border-[#e7e7e7]">
      <div className="note">Vui lòng xác nhận đúng thông tin và thời gian đặt sân để chúng tôi có thể xử lý cho bạn chính xác nhất</div>
      {/*  */}
      <section>
        <h2 className="bg-[#EBF3FF] pl-2 py-1 my-4 text-xl font-semibold">Thông tin đặt sân</h2>
        <div className="md:flex items-center">
          <div className="flex items-center w-full md:w-[300px] md:min-w-[300px]">
            <img src={infoBooking?.pitch?.image} alt="Ảnh sân bóng" className="w-full rounded-md" />
          </div>

          <div className="mt-2 md:mt-0 flex-1 md:ml-10 space-y-2 md:space-y-4 text-base md:text-lg">
            <div className="flex flex-wrap ">
              <div className="mr-3 flex justify-between text-[#422eb1] font-semibold  w-[100px]">
                Tên sân <span>:</span>
              </div>
              <span className="flex-1 text-[#242424]">{infoBooking?.pitch?.name}</span>
            </div>
            <div className="flex flex-wrap ">
              <div className="mr-3 flex justify-between text-[#422eb1] font-semibold  w-[100px]">
                Số sân <span>:</span>
              </div>
              <span className="flex-1 text-[#242424]">{infoBooking?.children_pitch?.code_chirldren_pitch}</span>
            </div>
            <div className="flex flex-wrap">
              <div className="text-[#422eb1] font-semibold mr-3 flex justify-between w-[100px]">
                Địa chỉ <span>:</span>{' '}
              </div>
              <span className="flex-1 text-[#242424]">{infoBooking?.pitch?.address}</span>
            </div>
            <div className="flex flex-wrap">
              <div className="text-[#422eb1] font-semibold mr-3 flex justify-between w-[100px]">
                Giờ thuê <span>:</span>{' '}
              </div>
              <span className="flex-1 text-[#242424]">{infoBooking?.shift?.shift_day}</span>
            </div>
            <div className="flex flex-wrap">
              <div className="text-[#422eb1] font-semibold mr-3 flex justify-between w-[100px]">
                Chi phí <span>:</span>{' '}
              </div>
              <span className="flex-1 text-[#242424]">{infoBooking?.shift?.totalPrice?.toLocaleString()} VNĐ</span>
            </div>
            <div className="flex flex-wrap">
              <div className="text-[#422eb1] font-semibold mr-3 flex justify-between w-[100px]">
                Chủ sân <span>:</span>{' '}
              </div>
              <span className="flex-1 text-[#242424]">{infoBooking?.admin_pitch?.name}</span>
            </div>
            <div className="flex flex-wrap">
              <div className="text-[#422eb1] font-semibold mr-3 flex justify-between w-[100px]">
                Số đt <span>:</span>{' '}
              </div>
              <span className="flex-1 text-[#242424]">{infoBooking?.admin_pitch?.phone}</span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="bg-[#EBF3FF] pl-2 py-1 my-4 text-xl font-semibold">
          Thông tin dịch vụ sử dụng: <span className="text-red-500">{_totalPriceService.toLocaleString()}</span> VNĐ &nbsp;
          <span className="text-red-500 text-sm">({infoBooking?.shift?.numberDate} ngày)</span>
        </h2>

        <div className="space-y-2 max-h-[210px] overflow-y-auto">
          <Show when={!infoBooking?.services || infoBooking?.services?.length === 0}>Bạn chưa dùng dịch vụ nào</Show>
          {infoBooking.services?.map((service) => (
            <div key={service._id} className="max-w-[650px] grid grid-cols-[1fr_2fr_1fr] border border-gray-500  rounded-md px-4 py-2">
              <div className="w-20">
                <img src={service.image} className="aspect-square w-full rounded-sm" />
              </div>

              <div className="text-xl font-medium">{service.name}</div>

              <div className="text-base text-red-600 flex items-center">{service.price?.toLocaleString()} VNĐ</div>
            </div>
          ))}
        </div>
      </section>

      {/*  */}
      <section>
        <h2 className="bg-[#EBF3FF] pl-2 py-1 my-4 text-xl font-semibold">
          Tóm tắt giá sân
          <span className="text-xs md:text-sm font-normal">
            &nbsp;<span className="text-red-500 text-sm">({infoBooking?.shift?.numberDate} ngày)</span>
          </span>
        </h2>

        <div className="flex justify-between items-center">
          <Radio.Group className="flex flex-col space-y-6" defaultValue={1} value={modeBanking} onChange={handleChangeModeBanking}>
            <Radio value={1} className="text-base">
              Trả toàn bộ ({infoBooking?.shift.totalPrice?.toLocaleString()} VNĐ)
            </Radio>
            <Radio value={2} className="text-base">
              Đặt cọc (40%) - ({(infoBooking?.shift.totalPrice * 0.4)?.toLocaleString()} VNĐ)
            </Radio>
          </Radio.Group>

          <div className="w-24 h-24 rounded-md">
            <img
              src="https://static.vivnpay.vn/202211211351/gioi-thieu-vi-vnpay-qua-khung-ca-doi.jpeg"
              alt=""
              className="w-full rounded-md"
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="bg-[#EBF3FF] pl-2 py-1 my-4 text-xl font-semibold">Chi phí hủy là bao nhiêu?</h2>

        <div className="text-base">Chi phí hủy sân là toàn bộ số tiền cọc sân trước đó</div>
      </section>

      <section>
        <h2 className="bg-[#EBF3FF] pl-2 py-1 my-4 text-xl font-semibold">
          Tổng số tiền cần thanh toán: <span className="text-red-500">{totalPrice.toLocaleString()}</span> VNĐ&nbsp;
          <span className="text-red-500 text-sm">({infoBooking?.shift?.numberDate} ngày)</span>
        </h2>
        <div className="mt-4 text-sm max-w-[800px]">
          <span className="text-red-500">Lưu ý *:</span> Chúng tôi chỉ nhận thanh toán bằng hình thức internet banking qua trang web của
          chúng tôi. Mọi thanh toán ngoài luồng đều không được chấp nhận.
        </div>
      </section>

      <hr className="my-6 border-t-[1px] border-solid border-[#404040]" />

      <section className="my-4 flex justify-end">
        <Button type="primary" className="bg-[#36d833] text-white" onClick={() => setCurrent(0)}>
          Quay lại trang trước đó
        </Button>
        <Button type="primary" className="ml-6 bg-[#3255f3] text-white" onClick={handleBanking}>
          Xác nhận thanh toán
        </Button>
      </section>
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export default memo(BookingScreen);
