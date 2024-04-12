"use client";

import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import {
  Box,
  FormControlLabel,
  FormGroup,
  Switch,
  TextField,
} from "@mui/material";

import { sendRequest } from "@/utils/api";
import { useToast } from "@/utils/toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

const NewPlaylist = () => {
  const toast = useToast();
  const router = useRouter();
  const { data: session } = useSession();

  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(true);

  const handleClose = (event: any, reason: any) => {
    if (reason && reason == "backdropClick") return;
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (!title) {
      toast.error("Tiêu đề không được để trống");
      return;
    }

    const res = await sendRequest<IBackendRes<IModelPaginate<any>>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/empty`,
      method: "POST",
      body: { title, isPublic },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });

    if (res.data) {
      toast.success("Tạo mới playlist thành công");
      setIsPublic(true);
      setTitle("");
      setOpen(false);
      await sendRequest<IBackendRes<any>>({
        url: `/api/revalidate`,
        method: "POST",
        queryParams: {
          tag: "playlist-by-user", // kiểm tra tag có giống tag ở cha không -> xác định dữ liệu cần làm mới
          secret: "justatestenxtjs", // thông tin bảo mật !!!có thể bị lỗi secret thông tin do chạy ở client
        },
      });
      router.refresh();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div>
      <Button
        variant="outlined"
        onClick={() => {
          setOpen(true);
        }}
        startIcon={<AddIcon />}
      >
        PLAYLIST
      </Button>
      <Dialog open={open} maxWidth={"sm"} fullWidth onClose={handleClose}>
        <DialogTitle>Thêm mới playlist:</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              width: "100%",
              gap: "30px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <TextField
              label="Tiêu đề"
              variant="standard"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={isPublic}
                    onChange={(event) => setIsPublic(event.target.checked)}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                label={isPublic === true ? "Public" : "Private"}
              />
            </FormGroup>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClose("", "");
            }}
          >
            CANCLE
          </Button>
          <Button
            onClick={() => {
              handleSubmit();
            }}
          >
            SAVE
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NewPlaylist;
