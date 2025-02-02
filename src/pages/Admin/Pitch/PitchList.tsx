import { Popconfirm, Space, Table, Button, message, Input, InputRef, Modal, Image, Spin } from 'antd';
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';

import type { ColumnType, ColumnsType } from 'antd/es/table';
import { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../Redux/hook';
import { fetchAllPitch, fetchDeletePitch, search } from '../../../Redux/Slices/pitchSlice';
import IPitch from '../../../interfaces/pitch';
import './index.css';

import type { FilterConfirmProps } from 'antd/es/table/interface';
import IFeedback from '~/interfaces/feedback';
import { PitchPagination, getAllPitch, getOnePitch } from '~/api/pitch';

import Highlighter from 'react-highlight-words';
import { getAllServiceMid } from '~/Redux/Slices/serviceSlice';

interface DataType {
  key: string;
  _id: string;
  address: string;
  name: string;
  admin_pitch_id: any;
  numberPitch: number;
  images: string[];
  services: string[];
  description: string[];
  location_id?: string;
  feedback_id: IFeedback[];
  districts_id?: string;
  average_price: number;
  averageStars?: number;
  avatar: string;
  createdAt?: string;
  updatedAt?: string;
}

type DataIndex = keyof DataType;
const PitchList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [totalItems, setTotalItems] = useState(Number); //phantrang
  const [currentPage, setCurrentPage] = useState(1); //phantrang
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [Pitch, setPitch] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const dispatch = useAppDispatch();
  const pitchs = useAppSelector((state) => state.pitch.pitchs);

  useEffect(() => {
    dispatch(fetchAllPitch(''));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllServiceMid());
  }, [dispatch]);

  //xử lí phân trang
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllPitch(); // Gửi yêu cầu GET đến URL_API
        const allItemsPitch = response?.data?.data?.totalDocs;
        setTotalItems(allItemsPitch);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
  }, []);

  const handlePageChange = async (pageNumber: number) => {
    setCurrentPage(pageNumber);
    const response = await PitchPagination(pageNumber);
    const totalItems = response?.data?.data?.totalDocs;
    if (totalItems) {
      setTotalItems(totalItems);
    }
    dispatch(search(response?.data?.data?.data));
    // window.scrollTo({ top: 500, behavior: 'smooth' });
  };
  // kết thức xử lí phân trang

  const showModal = (idPitch: string) => {
    setSelectedId(idPitch);
    setIsModalOpen(true);
  };

  useEffect(() => {
    try {
      setLoading(true);
      if (selectedId) {
        getOnePitch(selectedId).then(({ data: { data } }) => {
          setLoading(false);
          setPitch(data);
        });
      }
    } catch (error) {
      //console.log(error);
    }
  }, [selectedId]);
  //console.log('pitchModel:', Pitch);

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const confirm = async (idPost: string) => {
    await dispatch(fetchDeletePitch(idPost));
    message.success(`Xóa sân thành công !!!`);
  };

  const cancel = () => {
    message.error('Đã hủy!');
  };

  const data: DataType[] = pitchs.map((item: IPitch, index: number) => ({
    ...item,
    key: item._id,
    index: index + 1,
    name: item.name,
    admin_pitch_id: item?.admin_pitch_id?.name || 'N/A',
    address: item.address,
    numberPitch: item.numberPitch,
  }));

  const handleSearch = (selectedKeys: string[], confirm: (param?: FilterConfirmProps) => void, dataIndex: DataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
            className=" bg-blue-500"
          >
            Tìm Kiếm
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Xoá
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Lọc
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Thoát
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns: ColumnsType<DataType> = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      width: 50,
    },
    {
      title: 'Tên Sân',
      dataIndex: 'name',
      key: 'name',
      width: 300,
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Chủ Sân',
      dataIndex: 'admin_pitch_id',
      key: 'admin_pitch_id',
      width: 220,
      render: (user: any) => <p>{user}</p>,
    },
    {
      title: 'Số Lượng Sân',
      dataIndex: 'numberPitch',
      key: 'numberPitch',
      width: 160,
      ...getColumnSearchProps('numberPitch'),
      sorter: (a, b) => a.numberPitch - b.numberPitch,
    },
    {
      title: 'Địa Chỉ',
      dataIndex: 'address',
      key: 'address',
      width: 380,
      ...getColumnSearchProps('address'),
    },
    {
      title: 'Hành Động',
      key: 'action',
      width: '10%',
      render: (record) => (
        <Space size="middle">
          <Button className=" bg-blue-600" type="primary" onClick={() => showModal(record?.key)}>
            Chi Tiết
          </Button>
          <Popconfirm
            placement="topRight"
            title="Xóa bài viết?"
            description="Bạn có chắc chắn xóa bài viết này không?"
            onConfirm={() => confirm(record.key)}
            onCancel={cancel}
            okText="Đồng ý"
            cancelText="Không"
            className="bg-red-500"
          >
            <Button className="bg-red-500" type="primary" danger>
              <DeleteOutlined style={{ display: 'inline-flex' }} />
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        className=""
        bordered
        pagination={{
          current: currentPage,
          total: totalItems,
          pageSize: 7,
          onChange: handlePageChange,
        }}
      />
      <Modal
        title="Chi Tiết Sân"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1000}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
        ]}
      >
        <div>
          {!loading ? (
            <div className=" mt-[10px]">
              <div className=" ">
                <div className="text-[18px] pt-[10px]">
                  <div className="flex justify-between">
                    <p className="py-[5px]">
                      Tên Sân : <span className="italic text-gray-700">{Pitch?.name}</span>
                    </p>
                    <p className="py-[5px]">
                      Chủ Sở Hữu : <span className="italic text-gray-700">{Pitch?.admin_pitch_id?.name || 'Chủ Sân Bị Xoá'}</span>
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="py-[5px]">
                      Vị trí tìm kiếm : <span className="italic text-gray-700">{Pitch?.address}</span>
                    </p>
                    <p className="py-[5px]">
                      Số lượng sân : <span className="italic text-gray-700">{Pitch?.numberPitch} sân</span>
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="py-[5px] w-[500px]">
                      Dịch vụ :
                      <span>
                        {Pitch && Pitch?.services?.length > 0 ? (
                          Pitch?.services?.map((item: any) => (
                            <Button size={'small'} className="text-blue-500 mr-[5px]">
                              {' '}
                              {item?.name} - {item?.price?.toLocaleString('vi-VN')}
                            </Button>
                          ))
                        ) : (
                          <Button size={'small'} className="text-blue-500">
                            {' '}
                            Chưa Có Dịch Vụ
                          </Button>
                        )}
                      </span>
                    </p>
                    <p className="py-[5px]">
                      Giá tiền giao động :{' '}
                      <span className="text-red-400">
                        {Pitch?.average_price?.toLocaleString('vi-VN') || Pitch?.average_price?.toLocaleString('vi-VN')}₫ - 850.000₫
                      </span>
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="py-[5px]">
                      Ngày tạo sân : <span className="italic text-gray-700">{Pitch?.createdAt}</span>
                    </p>
                    <p className="py-[5px]">
                      Ngày cập nhật sân gần nhất : <span className="italic text-gray-700">{Pitch?.updatedAt}</span>
                    </p>
                  </div>
                  <p className="py-[5px] w-[960px]">
                    Miêu tả sân : <span className="italic w-[900px] text-gray-700 "> {Pitch?.description}.</span>
                  </p>
                </div>
              </div>
              <div className="pr-[20px]">
                <div className="flex justify-center">
                  {Pitch?.images && Pitch.images.length > 0 && (
                    <Image
                      width={950}
                      height={450}
                      src={Pitch?.avatar}
                      preview={{
                        src: `${Pitch?.avatar}`,
                      }}
                    />
                  )}
                </div>
                <div className="flex justify-between mt-[10px]">
                  {Pitch?.images && Pitch.images.length > 0 && (
                    <Image
                      width={300}
                      height={150}
                      src={Pitch?.images[0]}
                      preview={{
                        src: `${Pitch?.images[0]}`,
                      }}
                    />
                  )}
                  {Pitch?.images && Pitch.images.length > 0 && (
                    <Image
                      width={300}
                      height={150}
                      src={Pitch?.images[1]}
                      preview={{
                        src: `${Pitch?.images[1]}`,
                      }}
                    />
                  )}

                  {Pitch?.images && Pitch.images.length > 0 && (
                    <Image
                      width={300}
                      height={150}
                      src={Pitch?.images[2]}
                      preview={{
                        src: `${Pitch?.images[2]}`,
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <Spin tip="Loading" size="large">
                <div className="content" />
              </Spin>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default PitchList;
