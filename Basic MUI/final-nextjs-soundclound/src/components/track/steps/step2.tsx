"use client";

import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { Button, Grid, MenuItem, TextField } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import { useSession } from "next-auth/react";
import { sendRequest } from "@/utils/api";
import { useToast } from "@/utils/toast";
import Image from "next/image";

// % load
function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

function LinearWithValueLabel(props: IProps) {
  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgressWithLabel value={props.trackUpload.percent} />
    </Box>
  );
}

// button upload file
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
function InputFileUpload(props: any) {
  const { setInfo, info } = props;
  const { data: session } = useSession();

  const toast = useToast();

  const handleUpload = async (image: any) => {
    const formData = new FormData();
    formData.append("fileUpload", image);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/files/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
            target_type: "images",
          },
        }
      );
      setInfo({
        ...info,
        imgUrl: res.data.data.fileName,
      });
    } catch (error) {
      // @ts-ignore
      toast.error(error?.response?.data.message);
    }
  };

  return (
    <Button
      onChange={(e) => {
        const event = e.target as HTMLInputElement;
        if (event.files) {
          handleUpload(event.files[0]);
          console.log("event.target.files:", event.files[0]);
        }
      }}
      component="label"
      variant="contained"
      startIcon={<CloudUploadIcon />}
    >
      Upload file
      <VisuallyHiddenInput type="file" />
    </Button>
  );
}

interface IProps {
  trackUpload: {
    fileName: string;
    percent: number;
    uploadTrackName: string;
  };
  setValue: (value: number) => void;
}

interface INewTrack {
  title: string;
  description: string;
  trackUrl: string;
  imgUrl: string;
  category: string;
}

const Step2 = (props: IProps) => {
  const { trackUpload, setValue } = props;
  const { data: session } = useSession();

  const toast = useToast();

  const [info, setInfo] = useState<INewTrack>({
    title: "",
    description: "",
    trackUrl: "",
    imgUrl: "",
    category: "",
  });

  useEffect(() => {
    if (trackUpload && trackUpload.uploadTrackName) {
      setInfo({
        ...info,
        trackUrl: trackUpload.uploadTrackName,
      });
    }
  }, [trackUpload]);

  const category = [
    {
      value: "PARTY",
      label: "PARTY",
    },
    {
      value: "WORKOUT",
      label: "WORKOUT",
    },
    {
      value: "CHILL",
      label: "CHILL",
    },
  ];

  const handleSubmitForm = async () => {
    const res = await sendRequest<IBackendRes<ITrackTop[]>>({
      url: "http://localhost:8000/api/v1/tracks",
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: {
        title: info.title,
        description: info.description,
        trackUrl: info.trackUrl,
        imgUrl: info.imgUrl,
        category: info.category,
      },
    });
    if (res.data) {
      setValue(0);
      toast.success("Create a new track success !!!");
    } else {
      toast.error(res.message);
    }
    console.log(res);
  };

  return (
    <div>
      <div>
        <div>{trackUpload.fileName}</div>
        <LinearWithValueLabel trackUpload={trackUpload} setValue={setValue} />
      </div>

      <Grid container spacing={2} mt={5}>
        <Grid
          item
          xs={6}
          md={4}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div style={{ height: 250, width: 250, background: "#ccc" }}>
            <div>
              {/* kiểm tra điều kiện xe có imgUrl chưa */}
              {info.imgUrl && (
                <Image
                  alt="step2 image"
                  height={250}
                  width={250}
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${info.imgUrl}`}
                />
              )}
            </div>
          </div>
          <div>
            <InputFileUpload setInfo={setInfo} info={info} />
          </div>
        </Grid>
        <Grid item xs={6} md={8}>
          <TextField
            value={info?.title}
            onChange={(e) => {
              setInfo({ ...info, title: e.target.value });
            }}
            label="Title"
            variant="standard"
            fullWidth
            margin="dense"
          />
          <TextField
            value={info?.description}
            onChange={(e) => {
              setInfo({ ...info, description: e.target.value });
            }}
            label="Description"
            variant="standard"
            fullWidth
            margin="dense"
          />
          <TextField
            value={info?.category}
            onChange={(e) => {
              setInfo({ ...info, category: e.target.value });
            }}
            sx={{
              mt: 3,
            }}
            id="outlined-select-currency"
            select
            fullWidth
            label="Category"
            variant="standard"
          >
            {category.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant="outlined"
            sx={{ mt: 5 }}
            onClick={() => handleSubmitForm()}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default Step2;
