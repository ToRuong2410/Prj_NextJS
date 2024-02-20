import { useEffect, useState } from "react";
import { Table, Button, notification, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined } from "@ant-design/icons";
import CreateUserModal from "./create.user.modal";
import UpdateUserModal from "./update.user.modal";

// Định nghĩa kiểu dữ liệu cho dữ liệu hiển thị
export interface IUsers {
  _id: string;
  email: string;
  name: string;
  role: string;
  password: string;
  gender: string;
  address: string;
  age: string;
}

const UsersTable = () => {
  const [listUsers, setListUsers] = useState([]);

  // State modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const [dataUpdate, setDataUpdate] = useState<null | IUsers>(null);

  // Dùng vào mục đích phân trang
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
  });

  // Ép kiểu dữ liễu vì access_token yêu cầu là string
  const access_token = localStorage.getItem("access_token") as string;

  useEffect(() => {
    // Update
    getData();
  }, []);

  // --> Lấy dữ liệu từ API về, getData() dạng promise
  const getData = async () => {
    // Get thông tin user
    const res = await fetch(
      `http://localhost:8000/api/v1/users/?current=${meta.current}&pageSize=${meta.pageSize}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const d = await res.json();
    if (!d.data) {
      notification.error({
        message: JSON.stringify(d.message),
      });
    }
    setListUsers(d.data.result);
    setMeta({
      current: d.data.meta.current,
      pageSize: d.data.meta.pageSize,
      pages: d.data.meta.pages,
      total: d.data.meta.total,
    });
  };

  // Confirm delete button -> truyền API để xóa dữ liệu người dùng
  const confirm = async (user: IUsers) => {
    // Delete thông tin user
    const res = await fetch(`http://localhost:8000/api/v1/users/${user._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    });
    const d = await res.json();
    if (d.data) {
      // success
      notification.success({
        message: "Xóa user thành công",
      });
      await getData();
    } else {
      notification.error({
        message: JSON.stringify(d.message),
      });
    }
  };

  // Định nghĩa colums để hiển thị tiêu đề và nguồn lấy dữ liệu
  const columns: ColumnsType<IUsers> = [
    {
      title: "Email",
      dataIndex: "email",
      // record / value bản chất vẫn giống nhau, value lấy giá trị email còn record phải record.email
      render: (value, record) => {
        return <div>{value}</div>;
      },
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Role",
      dataIndex: "role",
    },
    {
      title: "Actions",
      render: (value, record) => {
        return (
          <div>
            <Button
              onClick={() => {
                setDataUpdate(record);
                setIsUpdateModalOpen(true);
                console.log(record);
              }}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete the task"
              description={`Are you sure you want to delete name = ${record.name} ?`}
              onConfirm={() => {
                confirm(record);
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button danger>Delete</Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  // dùng để lấy dữ liệu: số trang, dữ liệu người dùng khi phân trang
  const handleOnChange = async (page: number, pageSize: number) => {
    const res = await fetch(
      `http://localhost:8000/api/v1/users/?current=${page}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const d = await res.json();
    if (!d.data) {
      notification.error({
        message: JSON.stringify(d.message),
      });
    }
    setListUsers(d.data.result);
    setMeta({
      current: d.data.meta.current,
      pageSize: d.data.meta.pageSize,
      pages: d.data.meta.pages,
      total: d.data.meta.total,
    });
  };
  //
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Table Users</h2>
        <div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setIsCreateModalOpen(true);
            }}
          >
            Add new
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={listUsers}
        rowKey={"_id"}
        pagination={{
          current: meta.current,
          pageSize: meta.pageSize,
          total: meta.total,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
          onChange: (page: number, pageSize: number) => {
            handleOnChange(page, pageSize);
          },
          showSizeChanger: true,
        }}
      />

      <CreateUserModal
        access_token={access_token}
        getData={getData}
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
      />
      <UpdateUserModal
        access_token={access_token}
        getData={getData}
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />
    </div>
  );
};

export default UsersTable;
