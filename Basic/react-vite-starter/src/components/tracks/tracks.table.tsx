import { useEffect, useState } from "react";
import { Table, Button, notification, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";

// Định nghĩa kiểu dữ liệu cho dữ liệu hiển thị
export interface ITracks {
  _id: string;
  title: string;
  description: string;
  category: string;
  imgUrl: string;
  trackUrl: string;
  countLike: number;
  countPlay: number;
}

const TracksTable = () => {
  const [listTracks, setListTracks] = useState([]);

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
      `http://localhost:8000/api/v1/tracks?current=${meta.current}&pageSize=${meta.pageSize}`,
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
    setListTracks(d.data.result);
    setMeta({
      current: d.data.meta.current,
      pageSize: d.data.meta.pageSize,
      pages: d.data.meta.pages,
      total: d.data.meta.total,
    });
  };

  // Confirm delete button -> truyền API để xóa dữ liệu người dùng
  const confirm = async (user: ITracks) => {
    // Delete thông tin user
    const res = await fetch(`http://localhost:8000/api/v1/tracks/${user._id}`, {
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
  const columns: ColumnsType<ITracks> = [
    {
      title: "STT",
      dataIndex: "_id",
      // record / value bản chất vẫn giống nhau, value lấy giá trị email còn record phải record.email
      render: (value, record, index) => {
        return <div>{(meta.current - 1) * meta.pageSize + index + 1}</div>;
      },
    },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Track url",
      dataIndex: "trackUrl",
    },
    {
      title: "Uploader",
      dataIndex: ["uploader", "name"], // lấy biến name nằm trong phần uploader
    },

    {
      title: "Actions",
      render: (value, record) => {
        return (
          <div>
            <Popconfirm
              title="Delete the task"
              description={`Are you sure you want to delete name = ${record.title} ?`}
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
      `http://localhost:8000/api/v1/tracks?current=${page}&pageSize=${pageSize}`,
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
    setListTracks(d.data.result);
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
        <h2>Table Tracks</h2>
      </div>
      <Table
        columns={columns}
        dataSource={listTracks}
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
    </div>
  );
};

export default TracksTable;
