import { useEffect, useState } from "react";
import { Table, Button, notification, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";

// Định nghĩa kiểu dữ liệu cho dữ liệu hiển thị
export interface IComments {
  _id: string;
  content: string;
  moment: number;
  user: {
    _id: string;
    email: string;
    name: string;
    role: string;
    type: string;
  };
  track: {
    _id: string;
    title: string;
    description: string;
    trackUrl: string;
  };
  isDeleted: false;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

const CommentsTable = () => {
  const [listComments, setListComments] = useState([]);

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
    // Get thông tin comments
    const res = await fetch(
      `http://localhost:8000/api/v1/comments?current=${meta.current}&pageSize=${meta.pageSize}`,
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
    setListComments(d.data.result);
    setMeta({
      current: d.data.meta.current,
      pageSize: d.data.meta.pageSize,
      pages: d.data.meta.pages,
      total: d.data.meta.total,
    });
  };

  // Confirm delete button -> truyền API để xóa dữ liệu người dùng
  const confirm = async (comment: IComments) => {
    // Delete thông tin comment
    const res = await fetch(
      `http://localhost:8000/api/v1/comments/${comment._id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const d = await res.json();
    if (d.data) {
      // success
      notification.success({
        message: "Xóa comment thành công",
      });
      await getData();
    } else {
      notification.error({
        message: JSON.stringify(d.message),
      });
    }
  };

  // Định nghĩa colums để hiển thị tiêu đề và nguồn lấy dữ liệu
  const columns: ColumnsType<IComments> = [
    {
      title: "STT",
      dataIndex: "_id",
      // record / value bản chất vẫn giống nhau
      render: (value, record, index) => {
        return <div>{(meta.current - 1) * meta.pageSize + index + 1}</div>;
      },
    },
    {
      title: "Content",
      dataIndex: "content",
    },
    {
      title: "Track",
      dataIndex: ["track", "title"],
    },
    {
      title: "user",
      dataIndex: ["user", "email"],
    },
    {
      title: "Actions",
      render: (value, record) => {
        return (
          <div>
            <Popconfirm
              title="Delete the task"
              description={`Are you sure you want to delete comment = ${record.content} ?`}
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
      `http://localhost:8000/api/v1/comments?current=${page}&pageSize=${pageSize}`,
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
    setListComments(d.data.result);
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
        <h2>Table Comments</h2>
      </div>
      <Table
        columns={columns}
        dataSource={listComments}
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

export default CommentsTable;
