"use client";

import { sendRequest } from "@/utils/api";
import { Chip } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

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
          sort: "-createdAt",
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
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
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: {
        track: track?._id,
        quantity: trackLike?.some((t) => t._id === track?._id) ? -1 : 1,
      },
    });
    fecthData();
    router.refresh();
  };

  return (
    <div
      style={{
        justifyContent: "space-between",
        display: "flex",
        margin: "20px 10px 0 10px",
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
      <div
        style={{ display: "flex", width: "150px", gap: "20px", color: "#999" }}
      >
        <span style={{ display: "flex", alignItems: "center" }}>
          <PlayArrowIcon />
          {track?.countPlay}
        </span>
        <span style={{ display: "flex", alignItems: "center" }}>
          <FavoriteIcon />
          {track?.countLike}
        </span>
      </div>
    </div>
  );
};
export default LikeTrack;
