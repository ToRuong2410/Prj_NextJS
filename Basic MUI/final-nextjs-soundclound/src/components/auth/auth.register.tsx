import { useState } from "react";
import {
  Modal,
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
} from "@mui/material";
// import { notification } from "antd"; // MUI không có notification nên bạn có thể giữ lại hoặc chuyển sang Snackbar của MUI
import Snackbar from "@mui/material/Snackbar";


interface IProps {
  access_token: string;
  getData: any;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (value: boolean) => void;
}

const CreateUserModal = (props: IProps) => {
  const { access_token, getData, isCreateModalOpen, setIsCreateModalOpen } =
    props;

  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    address: "",
    gender: "",
    role: "",
  });

  const handleCloseCreateModal = () => {
    setFormValues({
      name: "",
      email: "",
      password: "",
      age: "",
      address: "",
      gender: "",
      role: "",
    });
    setIsCreateModalOpen(false);
  };

  const onFinish = async () => {
    const { name, email, password, age, gender, role, address } = formValues;
    const data = { name, email, password, age, gender, role, address };

    const res = await fetch("http://localhost:8000/api/v1/users", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const d = await res.json();

    if (d.data) {
      await getData();
      notification.success({
        message: "Tạo mới user thành công",
      });
      handleCloseCreateModal();
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description: JSON.stringify(d.message),
      });
    }
  };

  return (
    <Modal
      open={isCreateModalOpen}
      onClose={handleCloseCreateModal}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="modal-title" variant="h6" component="h2">
          Add new user
        </Typography>

        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Name"
            value={formValues.name}
            onChange={(e) =>
              setFormValues({ ...formValues, name: e.target.value })
            }
            required
          />

          <TextField
            label="Email"
            type="email"
            value={formValues.email}
            onChange={(e) =>
              setFormValues({ ...formValues, email: e.target.value })
            }
            required
          />

          <TextField
            label="Password"
            type="password"
            value={formValues.password}
            onChange={(e) =>
              setFormValues({ ...formValues, password: e.target.value })
            }
            required
          />

          <TextField
            label="Age"
            type="number"
            value={formValues.age}
            onChange={(e) =>
              setFormValues({ ...formValues, age: e.target.value })
            }
            required
          />

          <TextField
            label="Address"
            value={formValues.address}
            onChange={(e) =>
              setFormValues({ ...formValues, address: e.target.value })
            }
            required
          />

          <FormControl required>
            <InputLabel>Gender</InputLabel>
            <Select
              value={formValues.gender}
              onChange={(e) =>
                setFormValues({ ...formValues, gender: e.target.value })
              }
              label="Gender"
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>

          <FormControl required>
            <InputLabel>Role</InputLabel>
            <Select
              value={formValues.role}
              onChange={(e) =>
                setFormValues({ ...formValues, role: e.target.value })
              }
              label="Role"
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button variant="contained" onClick={onFinish}>
              Submit
            </Button>
            <Button variant="outlined" onClick={handleCloseCreateModal}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateUserModal;
