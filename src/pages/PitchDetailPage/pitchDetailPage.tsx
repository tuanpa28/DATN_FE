import { Card, CardBody, CardHeader, Tab, TabPanel, Tabs, TabsBody, TabsHeader, Typography, Checkbox } from '@material-tailwind/react';
import { Button, Carousel, DatePicker, Empty, Form, Image, Modal, Rate, Space, Switch } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useAppDispatch, useAppSelector } from '~/Redux/hook';
import './pitchDetailPage.css';

import { getOnePitch } from '~/api/pitch';
import FindOpponent from '~/components/FindOpponent/FindOpponent';
import IPitch from '~/interfaces/pitch';
import { fetchAllPitch } from '~/Redux/Slices/pitchSlice';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import FeedBack from '~/components/Feedback/FeedBack';
import { totalStarByPitch } from '~/api/feedback';
import { getAllChildrentPicthByParent } from '~/api/childrentPitch';
import dayjs from 'dayjs';
import Loading from '~/components/Loading';
import ModalBookMultipleDay from './ModalBookMultipleDay';
import ModalBookOneShiftFullMonth from './ModalBookOneShiftFullMonth';
import ModalBookPitchFullMonth from './ModalBookPitchFullMonth';
import Swal from 'sweetalert2';
// import { socket } from '~/config/socket';
import { checkBookingLimit } from '~/api/user';

const PitchDetailPage = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const currentTime = new Date();
  const currentDate = format(currentTime, 'yyyy-MM-dd');
  const currentHour = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();

  const [dataBookShift, setDataBookShift] = useState<any>({});
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [isLoading, setIsLoading] = useState(false);
  const [modalBookShift, setModalBookShift] = useState(false);
  const [childrenPitchs, setShildrenPitchs] = useState([]);
  const [Pitch, setPitch] = useState<IPitch>({} as IPitch);
  const [selectedServices, setSelectedServices] = useState<any>([]);
  const [findOpponent, setFindOpponent] = useState(false);
  const [TotalStar, setTotalStar] = useState<any>(Number);
  const [isModalBookMultipleDay, setIsModalBookMultipleDay] = useState<boolean>(false);
  const [isModalBookOneShiftMonth, setIsModalBookOneShiftMonth] = useState<boolean>(false);
  const [isModalBookPitchMonth, setIsModalBookPitchMonth] = useState<boolean>(false);
  const [isBookingLimit, setIsBookingLimit] = useState<boolean>(false);

  const user: any = useAppSelector((state) => state.user.currentUser.values);
  const pitchAll = useAppSelector((state) => state.pitch.pitchs);

  const totalPrice = dataBookShift?.price + (selectedServices?.reduce((total: any, service: any) => total + service.price, 0) || 0);

  const onChangeFindOpponent = (checked: boolean) => {
    setFindOpponent(checked);
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const { data } = await getAllChildrentPicthByParent(id!, selectedDate && selectedDate.trim() !== '' ? `?date=${selectedDate}` : '');
      setShildrenPitchs(data.data);
      setIsLoading(false);
    })();
  }, [id, selectedDate]);

  // xử lí detailPitch
  useEffect(() => {
    getOnePitch(String(id)).then(({ data: { data } }) => setPitch(data));
  }, [id]);

  const handleComfirmBookShift = async (value: any) => {
    setDataBookShift(value);

    setModalBookShift(true);

    const { data } = await checkBookingLimit(user?._id, id);

    data.data && data.data.length >= 3 ? setIsBookingLimit(true) : setIsBookingLimit(false);
  };

  const onFinishModalBookShift = async () => {
    if (isBookingLimit) {
      Swal.fire({
        icon: 'warning',
        title: 'Đã Đặt Tối Đa Lượt Trong Ngày!',
        text: 'Bạn đã đặt tối đa lượt trong ngày của sân là 3 lượt. Vui lòng chọn sân khác hoặc hẹn gặp bạn ngày hôm sau!',
        confirmButtonText: 'Xác nhận',
      });
    } else {
      const { value: accept } = await Swal.fire({
        title: 'Xác nhận đặt lịch',
        icon: 'info',
        text: 'Hệ thống của chúng tôi đặt lịch thông qua hình thức thanh toán trực tuyến. Bạn sẽ được hủy trong 30 phút từ khi đặt lịch và sẽ mất toàn bộ tiền cọc!',
        input: 'checkbox',
        inputValue: 0,
        inputPlaceholder: `
       Tôi đồng ý với chính sách
      `,
        confirmButtonText: `
        Tiếp tục &nbsp;<i class="fa fa-arrow-right"></i>
      `,
        inputValidator: (result) => {
          return !result && 'Bạn cần phải đồng ý với chính sách trên!';
        },
      });
      if (accept) {
        sessionStorage.setItem(
          'infoBooking',
          JSON.stringify({
            pitch: {
              _id: dataBookShift.id_pitch,
              name: Pitch.name,
              image: Pitch.avatar,
              address: Pitch.address,
            },
            admin_pitch: {
              _id: Pitch?.admin_pitch_id?._id,
              name: Pitch?.admin_pitch_id?.name,
              phone: Pitch?.admin_pitch_id?.phone_number,
            },
            children_pitch: {
              _id: dataBookShift?.id_chirlden_pitch,
              children_pitch_code: dataBookShift?.code_chirldren_pitch,
            },
            shift: {
              price: dataBookShift?.price,
              totalPrice,
              shift_day: `${dataBookShift?.start_time} - ${dataBookShift?.end_time} | ${selectedDate}`,
              date: [selectedDate],
              numberDate: 1,
              start_time: dataBookShift?.start_time,
              end_time: dataBookShift?.end_time,
              number_shift: dataBookShift?.number_shift,
              find_opponent: findOpponent ? 'Find' : 'NotFind',
            },
            services: selectedServices,
            type: 'singleDay',
          })
        );
        navigate('/checkout');
      }
    }
  };

  const handleServiceSelection = (service: any) => {
    const isMatch = [...selectedServices].some((item) => item._id === service._id);

    if (isMatch) {
      const _selectedServices = [...selectedServices].filter((item) => item._id !== service._id);
      setSelectedServices(_selectedServices);
    } else {
      const _selectedServices = [...selectedServices, service];
      setSelectedServices(_selectedServices);
    }
  };

  // Xử lí đội bóng liên quan
  const districtsId = Pitch.districts_id; // ID của danh mục bạn muốn lọc

  useEffect(() => {
    dispatch(fetchAllPitch(''));
  }, [dispatch]);

  const filteredPitch = pitchAll.filter((pitch: IPitch) => pitch.districts_id === districtsId);

  // end xử lí đội bóng liên quan

  // Xử lý totalStar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await totalStarByPitch(String(id));
        const { data } = response.data;
        setTotalStar(data);
      } catch (error) {
        //console.log(error);
      }
    };

    fetchData();
  }, [id]);

  // useEffect(() => {
  //   socket.on('booking-success', (data) => {
  //     if (!data) return;
  //     const newData: any = childrenPitchs?.map((item: any) => {
  //       if (item._id === data.id_chirlden_pitch) {
  //         const newShifts = item.shifts?.map((shift: any) => (shift.number_shift === data.number_shift ? data : shift));
  //         return { ...item, shifts: newShifts };
  //       } else {
  //         return item;
  //       }
  //     });

  //     setShildrenPitchs(newData);
  //   });
  // }, [childrenPitchs]);

  const data = [
    {
      label: 'THÔNG TIN',
      value: 'html',
      desc: (
        <>
          <div className="flex img-pitch justify-between gap-[28px]">
            <div className="left-img w-[70%]">
              <Image width={'100%'} height={'100%'} src={Pitch.avatar} />
            </div>
            {Pitch?.images && Pitch.images.length > 0 && (
              <div className="right-img w-[30%] xl:grid md:hidden pt-[8px]">
                <div className="w-full h-full rounded-[15px] overflow-hidden">
                  <Image width={'100%'} height={'100%'} src={Pitch?.images[1]} />
                </div>
                <div className="w-full h-full rounded-[15px] overflow-hidden">
                  <Image width={'100%'} height={'100%'} src={Pitch?.images[2]} />
                </div>
              </div>
            )}
          </div>
        </>
      ),
    },
    {
      label: 'SÂN GẦN ĐÂY',
      value: 'react',
      desc: (
        <div className="hot-pitch mx-auto max-w-screen-2xl xl px-[30px]">
          <Swiper spaceBetween={80} slidesPerView={2}>
            {filteredPitch && filteredPitch.length > 0 ? (
              filteredPitch.map((item: IPitch) => (
                <SwiperSlide>
                  <div className="item-pitch ">
                    {/* <Link to={`/pitch/detail/${item._id}`}>
                      
                    </Link> */}
                    <a href={`/pitch/detail/${item._id}`}>
                      <div className="imgae-item-pitch ">
                        <img src={item.avatar} width="100%" className="h-[250px] rounded-[18px]" alt="" />
                      </div>
                      <div className="text-item-pitch">
                        <Rate disabled allowHalf defaultValue={4.5} /> <span>( {item?.feedback_id?.length} Review)</span>
                        <h3>
                          <span>Tên sân: </span>
                          {item.name}
                        </h3>
                        <p>Kiểu sân :7 Người</p>
                        <p className="flex justify-between my-[10px]">
                          Dịch Vụ :
                          {Pitch?.services && Pitch?.services.length > 0
                            ? Pitch?.services?.map((service: any) => (
                                <span key={service?._id}>
                                  <i className="fa-solid fa-check"></i> {service.name}
                                </span>
                              ))
                            : ''}
                        </p>
                        <p className="flex justify-between">
                          Giá trung bình :
                          {/* <span>
                            <del className="italic text-[13px]">500.000-1.200.000</del>
                          </span> */}
                          <span className="text-[22px] text-[#ffb932]">{item.average_price.toLocaleString('vi-VN')}đ</span>
                        </p>
                      </div>
                    </a>
                  </div>
                </SwiperSlide>
              ))
            ) : (
              <div>
                <Empty />
              </div>
            )}
          </Swiper>
        </div>
      ),
    },

    {
      label: 'TÌM ĐỐI',
      desc: <FindOpponent idPitch={id!} />,
    },

    {
      label: 'DỊCH VỤ',
      value: 'angular',
      desc: (
        <>
          <div className="flex gap-[20px] overflow-y-auto pt-[16px]">
            {Pitch?.services && Pitch?.services.length > 0
              ? Pitch?.services?.map((service: any) => (
                  <Card className="mt-6 pt-4 w-[250px] mr-2 h-[200px]" key={service?._id}>
                    <CardHeader color="blue-gray" className="w-[200px] h-28 pl-0 mt-">
                      <img className="w-full" src={service?.image} alt="card-image" />
                    </CardHeader>
                    <CardBody>
                      <Typography color="blue-gray" className="mb-2 text-base font-bold w-max">
                        {service?.name}
                      </Typography>
                    </CardBody>
                  </Card>
                ))
              : 'Không có dịch vụ'}
          </div>
        </>
      ),
    },
    {
      label: 'ĐÁNH GIÁ',
      value: 'svelte',
      desc: <FeedBack />,
    },
  ];

  return (
    <div className="bg-[#f3f3f5]">
      {/* =========banner========= */}
      <div className="detail-pitch">
        <div className="banner-detail">
          <Carousel autoplay>
            <div className="banner1 banner"></div>
            <div className="banner2 banner"></div>
            <div className="banner3 banner"></div>
            <div className="banner4 banner"></div>
          </Carousel>
        </div>
      </div>
      {/* -===========detail pitch============ */}
      {/* ảnh ọt thôi */}
      <div className="mx-auto max-w-screen-2xl  xl:flex gap-10 md:block relative">
        {/* left */}
        <div className="sm:w-full md:w-full xl:w-[72%]">
          <Tabs id="custom-animation" value="html">
            <TabsHeader className="">
              {data.map(({ label, value }) => (
                <Tab key={value} value={value!}>
                  {label}
                </Tab>
              ))}
            </TabsHeader>

            <TabsBody
              animate={{
                initial: { y: 250 },
                mount: { y: 0 },
                unmount: { y: 250 },
              }}
            >
              {data.map(({ value, desc }) => (
                <TabPanel key={value} value={value!}>
                  {desc}
                </TabPanel>
              ))}
            </TabsBody>
          </Tabs>
        </div>
        <div className="right-detail-pitch xl:w-[25%] mt-[-50px]">
          <div className=" bg-white p-[40px] rounded-[10px] shadow-xl">
            <p className="mb-[30px] flex justify-between">
              THÔNG TIN SÂN BÓNG
              <span className="mt-[-4px]">
                <i className="text-[30px] fa-sharp fa-solid fa-star-of-david fa-spin fa-spin-reverse"></i>
              </span>
            </p>
            <p className="flex items-center ">
              <i className="fa-solid fa-tag"></i>
              <span className="text-[14px] ml-2 leading-4 font-semibold">GIÁ CHỈ TỪ: </span>
              <span className=" text-[#ffb932] ml-2 leading-4">
                {Pitch?.average_price &&
                  Pitch?.average_price?.toLocaleString('it-IT', {
                    style: 'currency',
                    currency: 'VND',
                  })}
              </span>
            </p>
            <p className="my-[20px] font-semibold">
              Số điện thoại: <span className="text-[#ffb932]">{Pitch?.admin_pitch_id?.phone_number}</span>
            </p>
            <p className="my-[20px] font-semibold">
              Địa chỉ: <span className="text-[#ffb932]">{Pitch?.address}</span>
            </p>

            <a href={`tel:${Pitch?.admin_pitch_id?.phone_number}`} className="btn-call">
              <button>GỌI TỚI CHỦ SÂN</button>
            </a>
          </div>

          <div className="maps bg-[#fff] mt-[50px] shadow">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.9631506304613!2d105.7677671750488!3d21.034160387593463!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313454b9df6626ef%3A0xbadd9b53272fd8c1!2zMjEgxJAuIEzDqiDEkOG7qWMgVGjhu40sIE3hu7kgxJDDrG5oLCBOYW0gVOG7qyBMacOqbSwgSMOgIE7hu5lpLCBWaWV0bmFt!5e0!3m2!1sen!2s!4v1698378147194!5m2!1sen!2s"
              loading="lazy"
              className="w-[100%]"
            ></iframe>
            <a href="https://maps.app.goo.gl/bMpLZc9tXFTEAEMLA" target="_blank">
              <button className="my-[10px] text-[#3a75da]"> Chỉ Đường</button>
            </a>
          </div>
        </div>
      </div>
      {/* thôn tin sân và đặt lịch ở đây  */}
      <div className="container flex justify-between mx-auto my-[50px] mt-[100px]">
        <div className="info-pitch">
          <h1 className="text-pitch">{Pitch.name}</h1>
          <p className="flex align-center">
            <Rate disabled allowHalf value={TotalStar?.averageRating} />
            <span className="ml-2">( {Pitch?.feedback_id?.length} Reviews )</span>
          </p>
        </div>
      </div>
      <div id="timca" className="container mx-auto booking_detail grid grid-cols-7 gap-10 pb-[80px]">
        {/* khu vực hiển thị ca sân  */}
        <div className="left_booking col-span-5">
          {!isLoading ? (
            childrenPitchs && childrenPitchs.length > 0 ? (
              <div className="grid grid-cols-2 gap-[24px] list_shift">
                {childrenPitchs?.map((item: any, index: number) => (
                  <div className="rounded-[10px] border bg-[#fff] shadow-md overflow-hidden" key={index}>
                    <h3 className="bg-[#1fd392] text-center p-[10px] text-lg font-medium">Sân {item.code_chirldren_pitch}</h3>

                    <p className="mx-[16px] mt-[16px]">
                      <p className="text-base font-semibold">Ca Sân:</p>
                      <div className="flex flex-wrap justify-between mt-[8px] mb-[20px] gap-y-[16px]">
                        {item.shifts?.map((shift: any, index: number) => {
                          const [inputHours, inputMinutes] = shift.start_time.split(':');

                          let overtime = false;

                          const inputDate = new Date(selectedDate);

                          if (
                            currentTime.getFullYear() === inputDate.getFullYear() &&
                            currentTime.getMonth() + 1 === inputDate.getMonth() + 1 &&
                            currentTime.getDate() === inputDate.getDate() &&
                            currentHour >= parseInt(inputHours, 10) &&
                            currentMinutes >= parseInt(inputMinutes, 10)
                          ) {
                            overtime = true;
                          }

                          return (
                            <button
                              key={index}
                              onClick={() => {
                                if (!shift.status_shift && !overtime) {
                                  handleComfirmBookShift({
                                    id_chirlden_pitch: item._id,
                                    code_chirldren_pitch: item.code_chirldren_pitch,
                                    id_pitch: item.idParentPitch,
                                    number_shift: shift.number_shift,
                                    start_time: shift.start_time,
                                    end_time: shift.end_time,
                                    price: shift.price,
                                    date: shift.date,
                                  });
                                }
                              }}
                              className={`border rounded-lg border-[#1fd392] hover:bg-[#1fd392] hover:text-[#fff] py-[8px] px-[4px] w-[31%] text-[16px] text-[#333] ${
                                overtime ? 'overtime' : ''
                              } ${shift.status_shift ? 'disabled' : ''}`}
                            >
                              <p className="font-semibold mb-[2px] ">Ca {shift.number_shift}</p>
                              <p className="mb-[2px] font-semibold ">
                                {shift.start_time}h - {shift.end_time}h
                              </p>
                              <p className="font-semibold">
                                {shift.price?.toLocaleString('it-IT', {
                                  style: 'currency',
                                  currency: 'VND',
                                })}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </p>
                    {/* <div className="border-t">
                      <button className="justify-center mx-auto flex py-3 w-full items-center">
                        <i className="fa-solid fa-check mx-3 text-[#1fd392] text-[20px]"></i>
                        Đặt Sân
                      </button>
                    </div> */}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex align-center mt-[20px] justify-center">
                <Empty />
              </div>
            )
          ) : (
            <div className="flex align-center mt-[80px] justify-center">
              <Loading />
            </div>
          )}
        </div>
        {/* khu vực lọc theo tìm kiếm */}
        <div className="right_booking col-span-2 px-[20px] py-[30px] bg-[#fff] shadow-md rounded-[12px] min-h-[460px] h-[460px]">
          {/* lichj */}
          <div className="calendar">
            <Form>
              <Form.Item>
                <div className="flex items-center justify-between mb-[16px]">
                  <p className="text-[16px] font-[600] mr-[10px]">
                    <i className="fa-regular fa-calendar mr-[10px]"></i>CHỌN NGÀY :
                  </p>
                  <Space direction="vertical">
                    <DatePicker
                      size={'large'}
                      disabledDate={(current) => current.isBefore(currentDate)}
                      onChange={(e: any) => {
                        const datePicker = format(e.$d, 'yyyy-MM-dd');
                        setSelectedDate(datePicker);
                      }}
                      value={dayjs(selectedDate, 'YYYY-MM-DD')}
                    />
                  </Space>
                </div>
                <div className="flex items-center mb-[6px]">
                  <span className="w-[16px] h-[16px] bg-[#ef4444] rounded mr-[10px]"></span>
                  <p className="text-[16px] font-[600]">Đã được đặt</p>
                </div>
                <div className="flex items-center mb-[6px]">
                  <span className="w-[16px] h-[16px] bg-[#1fd392] rounded mr-[10px]"></span>
                  <p className="text-[16px] font-[600]">Còn trống</p>
                </div>
                <div className="flex items-center mb-[20px]">
                  <span className="w-[16px] h-[16px] bg-[#c2c2c2] rounded mr-[10px]"></span>
                  <p className="text-[16px] font-[600]">Đã hết giờ</p>
                </div>
                <p className="text-[18px] font-[700] mb-[14px]">Bạn cũng có thể:</p>
                <div className="flex items-center justify-center mb-[16px]">
                  <button
                    onClick={() => setIsModalBookMultipleDay(true)}
                    className="px-[16px] py-[12px] bg-[#40dea4] hover:bg-[#1fd392] hover:text-[#fff] text-base font-bold text-[#333] rounded-xl w-full duration-75"
                  >
                    Đặt nhiều ngày
                  </button>
                </div>
                <div className="flex items-center justify-center mb-[16px]">
                  <button
                    onClick={() => setIsModalBookOneShiftMonth(true)}
                    className="px-[16px] py-[12px] bg-[#40dea4] hover:bg-[#1fd392] hover:text-[#fff] text-base font-bold text-[#333] rounded-xl w-full duration-75"
                  >
                    Đặt một ca trong một tháng
                  </button>
                </div>
                <div className="flex items-center justify-center mb-[16px]">
                  <button
                    onClick={() => setIsModalBookPitchMonth(true)}
                    className="px-[16px] py-[12px] bg-[#40dea4] hover:bg-[#1fd392] hover:text-[#fff] text-base font-bold text-[#333] rounded-xl w-full duration-75"
                  >
                    Đặt một sân trong một tháng
                  </button>
                </div>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
      <ModalBookMultipleDay
        isOpen={isModalBookMultipleDay}
        setOpen={setIsModalBookMultipleDay}
        namePitch={Pitch?.name}
        address={Pitch?.address}
        phone={Pitch?.admin_pitch_id?.phone_number}
        avatar={Pitch?.avatar}
        pitchId={id!}
        idAdminPitch={Pitch?.admin_pitch_id?._id}
        nameAdminPitch={Pitch?.admin_pitch_id?.name}
      />
      <ModalBookOneShiftFullMonth
        isOpen={isModalBookOneShiftMonth}
        setOpen={setIsModalBookOneShiftMonth}
        namePitch={Pitch?.name}
        address={Pitch?.address}
        phone={Pitch?.admin_pitch_id?.phone_number}
        avatar={Pitch?.avatar}
        pitchId={id!}
        idAdminPitch={Pitch?.admin_pitch_id?._id}
        nameAdminPitch={Pitch?.admin_pitch_id?.name}
      />
      <ModalBookPitchFullMonth
        isOpen={isModalBookPitchMonth}
        setOpen={setIsModalBookPitchMonth}
        namePitch={Pitch?.name}
        address={Pitch?.address}
        phone={Pitch?.admin_pitch_id?.phone_number}
        avatar={Pitch?.avatar}
        pitchId={id!}
        idAdminPitch={Pitch?.admin_pitch_id?._id}
        nameAdminPitch={Pitch?.admin_pitch_id?.name}
        averagePrice={Pitch?.average_price}
      />
      {/* Sửa */}
      <Modal
        open={modalBookShift}
        onOk={() => setModalBookShift(false)}
        onCancel={() => setModalBookShift(false)}
        width="1024px"
        footer={null}
      >
        <div className="flex text-[#003553] min-h-[400px] gap-[28px]">
          <div className="mb-[24px] w-[50%] rounded-xl shadow-md bg-white overflow-hidden">
            <h3 className="text-xl  bg-[linear-gradient(36deg,#1fd392,#00e0ff)] p-2 text-white text-center font-bold">
              Thông tin đặt lịch
            </h3>

            <div className="px-8 py-6">
              <p className="text-[18px] font-semibold mt-[-4px] mb-[10px]">
                <span className="inline-block min-w-[100px]">Sân bóng: </span>
                <span className="font-bold">{Pitch.name}</span>
              </p>
              <p className="text-[18px] font-semibold mt-[-4px] mb-[16px]">
                <span className="inline-block min-w-[100px]">Địa chỉ: </span>
                <span className="font-bold">{Pitch.address}</span>
              </p>
              <p className="text-[18px] font-semibold mt-[-4px] mb-[16px]">
                <span className="inline-block min-w-[100px]">Điện thoại:</span>
                <span className="font-bold">{Pitch?.admin_pitch_id?.phone_number}</span>
              </p>
              <p className="text-[18px] font-semibold mt-[-4px] mb-[16px]">
                <span className="inline-block min-w-[100px]">Ca: </span>
                <span className="font-bold">{dataBookShift?.number_shift}</span>
              </p>
              <p className="text-[18px] font-semibold mt-[-4px] mb-[16px]">
                <span className="inline-block min-w-[100px]">Thời gian: </span>
                <span className="font-bold">
                  ( {dataBookShift?.start_time}h - {dataBookShift?.end_time}h )
                </span>
              </p>

              <p className="text-[18px] font-semibold mt-[-4px] mb-[16px]">
                <span className="inline-block min-w-[100px]">Giá: </span>
                <span className="font-bold">
                  {dataBookShift?.price?.toLocaleString('it-IT', {
                    style: 'currency',
                    currency: 'VND',
                  })}
                </span>
              </p>
              <p className="text-[18px] font-semibold mt-[-4px] mb-[16px]">
                <span className="inline-block min-w-[100px]">Ngày: </span>
                <span className="font-bold">{selectedDate}</span>
              </p>
              {findOpponent ? (
                <p className="text-[18px] font-semibold mt-[-4px] mb-[16px]">
                  <span className="inline-block min-w-[100px]">Tìm Đối: </span>
                  <span className="font-bold">Bật</span>
                </p>
              ) : (
                ''
              )}
              {selectedServices.length > 0 && (
                <p className="text-[18px] font-semibold mt-[-4px] mb-[16px]">
                  <span className="inline-block min-w-[100px]">Dịch vụ: </span>
                  {selectedServices.map((item: any) => (
                    <span className="font-bold">{item.name}, </span>
                  ))}
                </p>
              )}
              <p className={`text-[18px] font-semibold mt-[-4px] mb-[16px]`}>
                <span className="inline-block min-w-[90px] font-bold">Tổng tiền:</span>
                <span className="font-bold">
                  {totalPrice?.toLocaleString('it-IT', {
                    style: 'currency',
                    currency: 'VND',
                  })}
                </span>
              </p>
            </div>
          </div>
          <div className="mb-[24px] w-[50%] rounded-xl shadow-md bg-white overflow-hidden">
            <h3 className="text-xl  bg-[linear-gradient(36deg,#1fd392,#00e0ff)] p-2 text-white text-center font-bold">Dịch vụ</h3>

            <div className="px-8 py-6 overflow-y-auto h-[390px]">
              <div className="flex align-center mb-[8px]">
                <span className="inline-block min-w-[100px] text-[18px] mr-[10px] font-semibold">Bạn muốn tìm đối?</span>
                <Switch className="bg-[#00000073]" checked={findOpponent} onChange={onChangeFindOpponent} />
              </div>
              <span className="inline-block min-w-[100px] text-[18px] mr-[10px] font-semibold">Dịch vụ:</span>

              <div className="flex gap-[20px] align-center justify-center mb-[24px] flex-wrap">
                {Pitch?.services && Pitch?.services.length > 0
                  ? Pitch?.services?.map((service: any) => (
                      <Card className="mt-4 w-[45%]" key={service?._id}>
                        <Checkbox crossOrigin={undefined} onChange={() => handleServiceSelection(service)} />
                        <CardHeader color="blue-gray" className="w-[148px] h-28 pl-0 mt-0">
                          <img className="w-full h-full object-cover" src={service?.image} alt="card-image" />
                        </CardHeader>
                        <CardBody className="px-[16px] py-[8px]">
                          <Typography color="blue-gray" className="mb-2 text-base font-bold w-max">
                            {service?.name}
                          </Typography>
                          <Typography>
                            {service?.price.toLocaleString('it-IT', {
                              style: 'currency',
                              currency: 'VND',
                            })}
                          </Typography>
                        </CardBody>
                      </Card>
                    ))
                  : 'Không có dịch vụ'}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onFinishModalBookShift}>Đặt lịch</Button>
        </div>
      </Modal>
    </div>
  );
};

export default PitchDetailPage;
