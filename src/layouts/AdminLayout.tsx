import { Link } from "react-router-dom";
import React, { useState } from "react";
import { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu } from "antd";
const { Content, Footer, Sider } = Layout;
import {
  AppstoreOutlined,
  SolutionOutlined,
  PieChartOutlined,
  HomeOutlined,
  UserOutlined,
  FileImageOutlined,
  ProfileOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import FsportLogo from "../assets/img/sport-bg.png";
import { Outlet } from "react-router-dom";
import HeaderAdmin from "../components/Admin/Header/Header";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem(<Link className="text-[#fff]" to={"/admin"}>Thống kê</Link>, "sub1", <PieChartOutlined />),
  getItem("Pitch", "sub2", <AppstoreOutlined />, [
    getItem(<Link className="text-[#fff]" to={"/admin/pitch"}>Pitch List</Link>, "3"),
  ]),

  getItem("Post", "sub3", <SolutionOutlined />, [
    getItem(<Link className="text-[#fff]" to={"/admin/post/add"}>Create Post</Link>, "4"),
    getItem(<Link className="text-[#fff]" to={"/admin/post"}>Post List</Link>, "5"),
  ]),
  getItem("Banner", "sub4", <FileImageOutlined />, [
    getItem(<Link className="text-[#fff]" to={"/admin/banner/add"}>Create Banner</Link>, "6"),
    getItem(<Link className="text-[#fff]" to={"/admin/banner"}>Banner List</Link>, "7"),
  ]),
  getItem(
    <Link className="text-[#fff]" to={"/admin/payment"}>Payment</Link>,
    "sub5",
    <SolutionOutlined />
  ),
  getItem(
    <Link className="text-[#fff]" to={"/admin/booking"}>Booking</Link>,
    "sub6",
    <SolutionOutlined />
  ),
  getItem("Location", "sub7", <EnvironmentOutlined />, [
    getItem(<Link className="text-[#fff]" to={"/admin/location"}>Location List</Link>, "8"),
  ]),
  getItem("Service", "sub8", <ProfileOutlined />, [
    getItem(<Link className="text-[#fff]" to={"/admin/service/add"}>Create Service</Link>, "9"),
    getItem(<Link className="text-[#fff]" to={"/admin/service"}>Service List</Link>, "10"),
  ]),
];
const AdminLayout = () => {
  const [current, setCurrent] = useState("1");
  const [collapsed, setCollapsed] = useState(false);

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div
          style={{
            margin: 16,
            textAlign: "center",
          }}
        >
          <Link to={"/admin"}>
            <img src={FsportLogo} alt="Logo" style={{ width: "100%" }} />
          </Link>
        </div>

        <Menu
          theme={"dark"}
          onClick={onClick}
          defaultOpenKeys={["sub1"]}
          selectedKeys={[current]}
          mode="inline"
          style={{ color: '#fff !important' }}
          items={items}
        />
      </Sider>
      <Layout>
        <HeaderAdmin />
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb
            style={{ margin: "12px 0" }}
            items={[
              {
                href: "/",
                title: <HomeOutlined />,
              },
              {
                href: "/admin",
                title: (
                  <>
                    <UserOutlined />
                    <span>Quản trị</span>
                  </>
                ),
              },
              {
                title: "Thống kê",
              },
            ]}
          />
          <main style={{ marginTop: 25 }}>
            <Outlet />
          </main>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Design ©2023 Created by He
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
