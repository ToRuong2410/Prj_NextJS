import { useEffect } from "react";
import { IUsers } from "./users.table";
import { Form, Input, InputNumber, Modal, Select, notification } from "antd";
import { Option } from "antd/es/mentions";

// Định nghĩa kiểu dữ liệu cho dữ liệu được truyền từ cha xuống
interface IProps {
  access_token: string;
  getData: any;
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (value: boolean) => void;
  dataUpdate: null | IUsers;
  setDataUpdate: any;
}

const UpdateUserModal = (props: IProps) => {
  const {
    access_token,
    getData,
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    dataUpdate,
    setDataUpdate,
  } = props;

  // Biến này tượng trưng cho form, nó sẽ hỗ trợ tất cả các method trong form của Antd
  const [form] = Form.useForm();

  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue({
        name: dataUpdate.name,
        email: dataUpdate.email,
        age: dataUpdate.age,
        gender: dataUpdate.gender,
        address: dataUpdate.address,
        role: dataUpdate.role,
      });
    }

    // Dữ liệu thay đổi sẽ in ra thông tin dữ liệu --- để check dữ liệu thôi
    // console.log(">>> check dataUpdate: ", dataUpdate);
  }, [dataUpdate]);

  const handleCloseCreateModal = () => {
    // Cách hoạt động: khi close modal(form) -> setData về mặc định ban đầu(rỗng) để tránh dữ liệu
    // đè lên nhau, đồng thời reset form về rỗng
    // 3 TH lỗi xảy ra:
    // TH1 thiếu setData về null -> close modal lần 1 sẽ hiển thị dữ liệu, lần 2 sẽ làm reset form về rỗng nhưng không setData về null và modal nghĩ đó là dữ liệu và hiển thị rỗng lên màn hình
    // TH2: thiếu reset form -> chả s cả nhưng nó bị ghi đè dữ liệu nếu làm nhiều :v
    // TH3: thiếu cả 2 -> sửa dữ liệu mà không update(sửa xong click close), nếu click lại nó sẽ hiển thị không giống dữ liệu ban đầu
    setIsUpdateModalOpen(false);
    setDataUpdate(null);
    form.resetFields();
  };

  // Hàm trả dữ liệu khi submit form được hỗ trợ của Antd
  const onFinish = async (values: any) => {
    // Biến values đang quản lý tất cả dữ liệu nhập vào trong form (trừ password)
    const { name, email, age, gender, role, address } = values;

    // PATCH thông tin user
    if (dataUpdate) {
      const data = {
        _id: dataUpdate?._id, // tránh TH dataUpdate = null gây lỗi, nếu = null thì sẽ trả về undefined
        name,
        email,
        age,
        gender,
        role,
        address,
      };

      // Update thông tin user
      const res = await fetch(" http://localhost:8000/api/v1/users", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const d = await res.json();

      if (d.data) {
        // success
        await getData();
        notification.success({
          message: "Cập nhật user thành công",
        });
        handleCloseCreateModal();
      } else {
        //
        notification.error({
          message: "Có lỗi xảy ra",
          description: JSON.stringify(d.message),
        });
      }
    }
  };

  return (
    <>
      <Modal
        title="Update new user"
        open={isUpdateModalOpen}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => {
          handleCloseCreateModal();
        }}
        maskClosable={false}
      >
        {/* ===== Form =====*/}
        <Form name="basic" onFinish={onFinish} layout="vertical" form={form}>
          <Form.Item
            style={{ marginBottom: 5 }}
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 5 }}
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
            ]}
          >
            <Input type="email" disabled={dataUpdate ? true : false}/>
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 5 }}
            label="Password"
            name="password"
            rules={[
              {
                required: dataUpdate ? false : true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password disabled={dataUpdate ? true : false} />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 5 }}
            label="Age"
            name="age"
            rules={[
              {
                required: true,
                message: "Please input your age!",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 5 }}
            label="Address"
            name="address"
            rules={[
              {
                required: true,
                message: "Please input your address!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 5 }}
            label="Gender"
            name="gender"
            rules={[{ required: true, message: "Please input your gender!" }]}
          >
            <Select
              placeholder="Select a option and change input text above"
              allowClear
            >
              <Option value="male">male</Option>
              <Option value="female">female</Option>
              <Option value="other">other</Option>
            </Select>
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 5 }}
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please input your role!" }]}
          >
            <Select
              placeholder="Select a option and change input text above"
              allowClear
            >
              <Option value="admin">Admin</Option>
              <Option value="user">User</Option>
            </Select>
          </Form.Item>
        </Form>

        {/* <div>
          <label>Name:</label>
          <Input
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
        </div>
        <div>
          <label>Email:</label>
          <Input
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
        </div>
        <div>
          <label>Password:</label>
          <Input
            disabled={true}
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
        </div>
        <div>
          <label>Age:</label>
          <Input
            value={age}
            onChange={(event) => {
              setAge(event.target.value);
            }}
          />
        </div>
        <div>
          <label>Gender:</label>
          <Input
            value={gender}
            onChange={(event) => {
              setGender(event.target.value);
            }}
          />
        </div>
        <div>
          <label>Address:</label>
          <Input
            value={address}
            onChange={(event) => {
              setAddress(event.target.value);
            }}
          />
        </div>
        <div>
          <label>Role:</label>
          <Input
            value={role}
            onChange={(event) => {
              setRole(event.target.value);
            }}
          />
        </div> */}
      </Modal>
    </>
  );
};

export default UpdateUserModal;
