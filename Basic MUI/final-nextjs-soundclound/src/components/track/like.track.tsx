"use client";

import { useEffect, useState } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DownloadIcon from "@mui/icons-material/Download";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Chip } from "@mui/material";
import axios from "axios";

import { sendRequest } from "@/utils/api";

interface IProps {
  track: ITrackTop | null;
}

const LikeTrack = (props: IProps) => {
  const { track } = props;
  const { data: session } = useSession();
  const router = useRouter();

  const [trackLike, setTrackLike] = useState<ITrackLike[] | null>(null);

  const fecthData = async () => {
    if (session?.access_token) {
      const res = await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
        method: "GET",
        queryParams: {
          current: 1,
          pageSize: 100,
          sort: "-createdAt"
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });
      if (res?.data?.result) {
        setTrackLike(res?.data?.result);
      }
    }
  };

  // khi có data tại session thì hiển thị lại dữ liệu (tránh TH session ban đầu chạy không có dữ liệu)
  useEffect(() => {
    fecthData();
  }, [session]);

  const handleLikeTrack = async () => {
    await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${session?.access_token}`
      },
      body: {
        track: track?._id,
        quantity: trackLike?.some((t) => t._id === track?._id) ? -1 : 1
      }
    });
    fecthData();

    // thực hiện lại validate lại dữ liệu API nếu link api được gọi lại -> clear data cache
    await sendRequest<IBackendRes<any>>({
      url: `/api/revalidate`,
      method: "POST",
      queryParams: {
        tag: "track-by-id", // kiểm tra tag có giống tag ở cha không -> xác định dữ liệu cần làm mới
        secret: "justatestenxtjs" // thông tin bảo mật !!!có thể bị lỗi secret thông tin do chạy ở client
      }
    });
    router.refresh();
  };

  const handleDownloadTrack = async () => {
    if (track?.trackUrl) {
      try {
        const response = await axios.get(`/api?audio=${track.trackUrl}`, {
          responseType: "blob"
        });

        // Tạo một URL từ blob để tải file
        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: "audio/mpeg" })
        );
        const link = document.createElement("a");
        link.href = url;

        // Đặt tên file với định dạng .mp3
        link.setAttribute(
          "download",
          `${track?.title} - ${track?.description}`
        );
        document.body.appendChild(link);

        // Bắt đầu quá trình tải
        link.click();

        // Xóa link sau khi tải xong
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url); // Giải phóng bộ nhớ
      } catch (error) {
        console.error("Error downloading the file", error);
      }
    }
  };

  return (
    <div
      style={{
        justifyContent: "space-between",
        display: "flex",
        margin: "20px 10px 0 10px"
      }}
    >
      <Chip
        onClick={() => {
          handleLikeTrack();
        }}
        variant="outlined"
        label="Like"
        size="medium"
        clickable
        color={
          trackLike?.some((t) => t._id === track?._id) ? "error" : "default"
        }
        icon={<FavoriteIcon />}
        sx={{ borderRadius: "5px" }}
      />
      <div style={{ display: "flex", gap: "20px", color: "#999" }}>
        <span style={{ display: "flex", alignItems: "center" }}>
          <PlayArrowIcon />
          {track?.countPlay}
        </span>
        <span style={{ display: "flex", alignItems: "center" }}>
          <FavoriteIcon />
          {track?.countLike}
        </span>
        <span
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#f50")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#999")}
          onClick={handleDownloadTrack}
        >
          <DownloadIcon />
        </span>
      </div>
    </div>
  );
};
export default LikeTrack;
