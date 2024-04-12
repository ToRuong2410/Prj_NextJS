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
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Theme,
  useTheme,
} from "@mui/material";
import { useToast } from "@/utils/toast";
import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface IProps {
  playlists: IPlaylist[];
  tracks: ITrackTop[];
}

const AddPlaylistTrack = (props: IProps) => {
  const toast = useToast();
  const router = useRouter();
  const { data: session } = useSession();

  const { playlists, tracks } = props;

  const [open, setOpen] = useState<boolean>(false);
  const [tracksId, setTracksId] = useState<string[]>([]);
  const [playlistId, setPlaylistId] = useState("");

  const theme = useTheme();

  const getStyles = (
    name: string,
    tracksId: readonly string[],
    theme: Theme
  ) => {
    return {
      fontWeight:
        tracksId.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  };

  const handleClose = (event: any, reason: any) => {
    if (reason && reason == "backdropClick") return;
    setOpen(false);
    setPlaylistId("");
    setTracksId([]);
  };

  const handleSubmit = async () => {
    if (!playlistId) {
      toast.error("Vui lòng chọn playlist!");
      return;
    }
    if (!tracksId.length) {
      toast.error("Vui lòng chọn tracks!");
      return;
    }

    const chosenPlaylist = playlists.find((i) => i._id === playlistId);
    const choseTracks = tracksId?.map((item) => item?.split("###")?.[1]);

    const res = await sendRequest<IBackendRes<IModelPaginate<any>>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists`,
      method: "PATCH",
      body: {
        id: chosenPlaylist?._id,
        title: chosenPlaylist?.title,
        isPublic: chosenPlaylist?.isPublic,
        tracks: choseTracks,
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });

    if (res.data) {
      toast.success("Thêm track vào playlist thành công !!!");
      await sendRequest<IBackendRes<any>>({
        url: `/api/revalidate`,
        method: "POST",
        queryParams: {
          tag: "playlist-by-user", // kiểm tra tag có giống tag ở cha không -> xác định dữ liệu cần làm mới
          secret: "justatestenxtjs", // thông tin bảo mật !!!có thể bị lỗi secret thông tin do chạy ở client
        },
      });
      handleClose("", "");
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
        TRACKS
      </Button>
      <Dialog open={open} maxWidth={"sm"} fullWidth onClose={handleClose}>
        <DialogTitle>Thêm track to playlist:</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              width: "100%",
              gap: "30px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <FormControl
              fullWidth
              variant="standard"
              sx={{ m: 1, minWidth: 120 }}
            >
              <InputLabel id="demo-simple-select-standard-label">
                Chọn playlist
              </InputLabel>
              <Select
                label="Playlist"
                value={playlistId}
                onChange={(e) => setPlaylistId(e.target.value)}
              >
                {playlists.map((item) => {
                  return (
                    <MenuItem key={item._id} value={item._id}>
                      {item.title}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
          <Box>
            <FormControl sx={{ mt: 5, width: "100%" }}>
              <InputLabel>Track</InputLabel>
              <Select
                multiple
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                value={tracksId}
                onChange={(e) => {
                  setTracksId(e.target.value as any);
                }}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value?.split("###")?.[0]} />
                    ))}
                  </Box>
                )}
              >
                {tracks.map((track) => {
                  return (
                    <MenuItem
                      key={track._id}
                      value={`${track.title}###${track._id}`}
                      style={getStyles(
                        `${track.title}###${track._id}`,
                        tracksId,
                        theme
                      )}
                    >
                      {track.title}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
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

export default AddPlaylistTrack;
