"use client";

import { fetchDefaultImages, sendRequest } from "@/utils/api";
import { Box, TextField } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import WaveSurfer from "wavesurfer.js";
import { useTrackContext } from "@/lib/track.wrapper";
import { useHasMounted } from "@/utils/customHook";
import Image from "next/image";

interface IProps {
  track: ITrackTop | null;
  comments: ITrackComment[];
  wavesurfer: WaveSurfer | null;
}
const CommentTrack = (props: IProps) => {
  const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;

  // Kiểm tra xem component đã về với client chưa?
  const hasMounted = useHasMounted();

  const router = useRouter();

  const { track, comments, wavesurfer } = props;
  const { data: session } = useSession();
  const [yourComment, setYourComment] = useState("");

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.round(seconds) % 60;
    const paddedSeconds = `0${secondsRemainder}`.slice(-2);
    return `${minutes}:${paddedSeconds}`;
  };

  const handleSubmit = async () => {
    const res = await sendRequest<IBackendRes<ITrackComment>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments`,
      method: "POST",
      body: {
        content: yourComment,
        moment: Math.round(wavesurfer?.getCurrentTime() ?? 0),
        track: track?._id,
      },

      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });

    if (res.data) {
      setYourComment("");
      // thực hiện lại validate lại dữ liệu API nếu link api được gọi lại -> clear data cache
      await sendRequest<IBackendRes<any>>({
        url: `/api/revalidate`,
        method: "POST",
        queryParams: {
          tag: "track-by-id", // kiểm tra tag có giống tag ở cha không -> xác định dữ liệu cần làm mới
          secret: "justatestenxtjs", // thông tin bảo mật !!!có thể bị lỗi secret thông tin do chạy ở client
        },
      });
      router.refresh();
    }
  };

  const handleJumpTrack = (moment: number) => {
    if (wavesurfer) {
      const duration = wavesurfer.getDuration();
      wavesurfer.seekTo(moment / duration);
      wavesurfer.play(); // lỗi khi khi wavetrack chạy thì footer không dừng?
      setCurrentTrack({ ...currentTrack, isPlaying: false }); // === FIXME: tự fix
    }
  };
  return (
    <div>
      <div style={{ marginTop: "50px", marginBottom: "25px" }}>
        <TextField
          value={yourComment}
          variant="standard"
          fullWidth
          label="Comments"
          onChange={(e) => setYourComment(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
        />
      </div>

      {/* Hình ảnh */}
      <div style={{ display: "flex", gap: "10px" }}>
        <div className="left" style={{ width: "190px" }}>
          <Image
            height={150}
            width={150}
            alt="avatar comment"
            src={fetchDefaultImages(track?.uploader?.type!)}
          />
          <div>{track?.uploader.email}</div>
        </div>

        {/* Thông tin comments */}
        <div className="right" style={{ width: "calc(100% - 200px)" }}>
          {comments.map((comment) => {
            return (
              <Box
                key={comment._id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: "10px",
                    marginBottom: "25px",
                    alignItems: "center",
                  }}
                >
                  <Image
                    height={40}
                    width={40}
                    alt="comment"
                    src={fetchDefaultImages(comment.user.type)}
                  />
                  <div>
                    <div
                      style={{
                        fontSize: "13px",
                        opacity: "0.7",
                      }}
                    >
                      {comment?.user?.name ?? comment?.user?.email} at
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          handleJumpTrack(comment.moment);
                        }}
                      >
                        &nbsp; {formatTime(comment.moment)}
                      </span>
                    </div>
                    <div>{comment.content}</div>
                  </div>
                </Box>
                <div style={{ fontSize: "13px", opacity: "0.6" }}>
                  {hasMounted && dayjs(comment.createdAt).fromNow()}
                </div>
              </Box>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CommentTrack;
