"use client";

import { FileWithPath, useDropzone } from "react-dropzone";
import "./theme.css";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import React, { useCallback, useState } from "react";
import { sendRequestFile } from "@/utils/api";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";

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

function InputFileUpload() {
  return (
    <Button
      onClick={(e) => {
        e.preventDefault();
      }}
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
    >
      Upload file
      <VisuallyHiddenInput type="file" />
    </Button>
  );
}

interface IProps {
  setValue: (value: number) => void;
  setTrackUpload: any;
  trackUpload: any;
}

const Step1 = (props: IProps) => {
  const { setValue, setTrackUpload, trackUpload } = props;

  const { data: session } = useSession();

  const onDrop = React.useCallback(
    async (acceptedFiles: FileWithPath[]) => {
      setValue(1); // chuyển từ phần "Tracks" sang phần "Basic Information"
      if (acceptedFiles && acceptedFiles[0]) {
        // nếu upload nhiều file thì acceptedFiles[0] lấy ra file đầu tiên
        const audio = acceptedFiles[0];
        console.log(audio);

        const formData = new FormData();
        formData.append("fileUpload", audio);

        try {
          const res = await axios.post(
            "http://localhost:8000/api/v1/files/upload",
            formData,
            {
              headers: {
                Authorization: `Bearer ${session?.access_token}`,
                target_type: "tracks",
                delay: 2000,
              },

              // load % tải bài hát
              onUploadProgress: (progressEvent) => {
                let percentCompleted = Math.floor(
                  (progressEvent.loaded * 100) / progressEvent.total!
                );
                setTrackUpload({
                  ...trackUpload,
                  fileName: acceptedFiles[0].name,
                  percent: percentCompleted,
                });
              },
            }
          );
          // xảy ra bug % upload bị tụt về 0 -> sử dụng prevState(copy lại trạng thái state trước đó)
          setTrackUpload((prevState: any) => ({
            ...prevState,
            uploadTrackName: res.data.data.fileName,
          }));
          // console.log(">>> check file url: ", res.data.data.fileName);
        } catch (error) {
          // @ts-ignore
          alert(error?.response?.data.message);
        }
      }
    },
    [session]
  );

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "audio/mpeg": [".mp3"],
      "audio/wav": [".wav"],
      "audio/webm": [".webm"],
      "audio/flac": [".flac"],
      "audio/x-m4a": [".m4a"],
      // audio: [".mp3", ".m4a", ".wav", "audio/mpeg"],
    },
  });

  const files = acceptedFiles.map((file: FileWithPath) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  // console.log(">>> check upload track truyền đi:", trackUpload);

  return (
    <section className="container">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <InputFileUpload />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </section>
  );
};

export default Step1;
