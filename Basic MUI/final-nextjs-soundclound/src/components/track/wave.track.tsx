"use client";

import { useWavesurfer } from "@/utils/customHook";
import { useSearchParams } from "next/navigation";
import { useRef, useMemo, useCallback, useState, useEffect } from "react";
import { WaveSurferOptions } from "wavesurfer.js";
import "./wave.scss";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { Tooltip } from "@mui/material";
import { fetchDefaultImages, sendRequest } from "@/utils/api";
import { useTrackContext } from "@/lib/track.wrapper";
import CommentTrack from "./comment.track";
import LikeTrack from "./like.track";

interface IProps {
  track: ITrackTop | null;
  comments: ITrackComment[];
}

// Hiển thị lên màn hình giao diện sóng(wave) bài hát
const WaveTrack = (props: IProps) => {
  const { track, comments } = props;
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;

  // lấy tên keyword 'audio' trên link url -> dùng để gửi sang api(route.ts) -> lấy thông tin bài hát từ BE
  const searchParams = useSearchParams();
  const fileName = searchParams.get("audio");

  // tham chiếu đến 1 phần tử trong HTML
  const containerRef = useRef<HTMLDivElement>(null); //sử dụng để chứa phần tử sóng(wave)
  const timeRef = useRef<HTMLDivElement>(null);
  const durationRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef<HTMLDivElement>(null);

  const optionsMemo = useMemo((): Omit<WaveSurferOptions, "container"> => {
    let gradient, progressGradient;

    // Chắc chắn đoạn code sau chỉ chạy trong môi trường có document(DOM)
    if (typeof window !== "undefined") {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!; // thêm dấu ! ở cuối để báo rằng biến này chắc chắn không bằng null hoặc undefined

      // Define the waveform gradient
      gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
      gradient.addColorStop(0, "#656666"); // Top color
      gradient.addColorStop((canvas.height * 0.7) / canvas.height, "#656666"); // Top color
      gradient.addColorStop(
        (canvas.height * 0.7 + 1) / canvas.height,
        "#ffffff"
      ); // White line
      gradient.addColorStop(
        (canvas.height * 0.7 + 2) / canvas.height,
        "#ffffff"
      ); // White line
      gradient.addColorStop(
        (canvas.height * 0.7 + 3) / canvas.height,
        "#B1B1B1"
      ); // Bottom color
      gradient.addColorStop(1, "#B1B1B1"); // Bottom color

      // Define the progress gradient
      progressGradient = ctx.createLinearGradient(
        0,
        0,
        0,
        canvas.height * 1.35
      );
      progressGradient.addColorStop(0, "#EE772F"); // Top color
      progressGradient.addColorStop(
        (canvas.height * 0.7) / canvas.height,
        "#EB4926"
      ); // Top color
      progressGradient.addColorStop(
        (canvas.height * 0.7 + 1) / canvas.height,
        "#ffffff"
      ); // White line
      progressGradient.addColorStop(
        (canvas.height * 0.7 + 2) / canvas.height,
        "#ffffff"
      ); // White line
      progressGradient.addColorStop(
        (canvas.height * 0.7 + 3) / canvas.height,
        "#F6B094"
      ); // Bottom color
      progressGradient.addColorStop(1, "#F6B094"); // Bottom color
    }
    return {
      height: 100,
      barWidth: 3,
      waveColor: gradient,
      progressColor: progressGradient,
      url: `/api?audio=${fileName}`, // đường dẫn để tải tệp audio tương ứng với API
    };
  }, []);

  const wavesurfer = useWavesurfer(containerRef, optionsMemo);

  useEffect(() => {
    // Dùng để lấy thời gian
    const timeEl = timeRef.current!;
    const durationEl = durationRef.current!;
    // Dùng khi hover bài hát
    const hover = hoverRef.current!;
    const waveform = containerRef.current!;
    //@ts-ignore
    waveform.addEventListener(
      "pointermove",
      //@ts-ignore
      (e) => (hover.style.width = `${e.offsetX}px`)
    );

    if (!wavesurfer) return;
    setIsPlaying(false);
    // Mỗi một lần chạy tự động gọi vào func này -> set lại State
    const subscription = [
      wavesurfer.on("play", () => {
        setIsPlaying(true);
      }),
      wavesurfer.on("pause", () => {
        setIsPlaying(false);
      }),

      // Chạy thời gian khi bài nhạc
      wavesurfer.on(
        "decode",
        (duration) => (durationEl.textContent = formatTime(duration))
      ),
      wavesurfer.on(
        "timeupdate",
        (currentTime) => (timeEl.textContent = formatTime(currentTime))
      ),
      wavesurfer.once("interaction", () => {
        wavesurfer.play();
      }),
    ];
    return () => {
      subscription.forEach((unsub) => unsub());
    };
  }, [wavesurfer]);

  const onPlayClick = useCallback(() => {
    if (wavesurfer) {
      // Xảy ra bất đồng bộ ở pause và play nên phải dùng useEffect ở trên
      wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play();
    }
  }, [wavesurfer]);

  // Tính thời gian 1 bài hát -> dùng để hiện thị thời gian
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.round(seconds) % 60;
    const paddedSeconds = `0${secondsRemainder}`.slice(-2);
    return `${minutes}:${paddedSeconds}`;
  };

  // Tính toán % để hiện thị hình ảnh cmt
  const calLeft = (moment: number) => {
    const hardCodeDuration = wavesurfer?.getDuration() ?? 0;
    const percent = (moment / hardCodeDuration) * 100;
    return `${percent}%`;
  };

  // theo dõi sự thay đổi để cập nhật lại thông tin play/pause ở wavetrack
  // useEffect(() => {
  //   if (track?._id === currentTrack._id && wavesurfer) {
  //     if (currentTrack.isPlaying) {
  //       wavesurfer.pause();
  //     }
  //   }
  // }, [currentTrack]);

  // Theo dõi sự thay đổi để cập nhật lại thông tin play/pause ở wavetrack
  useEffect(() => {
    if (wavesurfer && currentTrack.isPlaying) {
      wavesurfer.pause();
      // console.log("dừng wave track");
    }
  }, [currentTrack]);

  // Nếu phần footer chưa có thông tin thì cập nhật thông tin khi ấn vào wavetrack
  useEffect(() => {
    if (track?._id && !currentTrack?._id) {
      setCurrentTrack({ ...track, isPlaying: false });
      // console.log("thay đổi dữ liệu bài nhạc");
    }
  }, []);

  return (
    <div style={{ marginTop: 20 }}>
      <div
        style={{
          display: "flex",
          gap: 15,
          padding: 20,
          height: 400,
          background:
            "linear-gradient(135deg, rgb(106,112,67) 0%, rgb(11,15,20) 100%)",
        }}
      >
        {/* Hiển thị thông tin bài hát */}
        <div
          className="left"
          style={{
            width: "75%",
            height: "calc(100% - 10px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div className="info" style={{ display: "flex" }}>
            {/* nút Play/Pause */}
            <div>
              <div
                onClick={() => {
                  onPlayClick();
                  if (track && wavesurfer) {
                    // Cứ ấn vào nút Play/Pause trên wavetrack thì nút play/pause dưới footer sẽ dừng
                    setCurrentTrack({
                      ...currentTrack,
                      isPlaying: false,
                    });
                  }
                }}
                style={{
                  borderRadius: "50%",
                  background: "#f50",
                  height: "50px",
                  width: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                {isPlaying === true ? (
                  <PauseIcon sx={{ fontSize: 30, color: "white" }} />
                ) : (
                  <PlayArrowIcon sx={{ fontSize: 30, color: "white" }} />
                )}
              </div>
            </div>
            {/* Thông tin bài hát và tác giả */}
            <div style={{ marginLeft: 20 }}>
              <div
                style={{
                  padding: "0 5px",
                  background: "#333",
                  fontSize: 30,
                  width: "fit-content",
                  color: "white",
                }}
              >
                {track?.title}
              </div>
              <div
                style={{
                  padding: "0 5px",
                  marginTop: 10,
                  background: "#333",
                  fontSize: 20,
                  width: "fit-content",
                  color: "white",
                }}
              >
                {track?.description}
              </div>
            </div>
          </div>
          <div ref={containerRef} className="wave-form-container">
            <div className="time" ref={timeRef}>
              0:00
            </div>
            <div className="duration" ref={durationRef}>
              0:00
            </div>
            <div className="hover-wave" ref={hoverRef}></div>
            <div
              className="overlay"
              style={{
                position: "absolute",
                height: "30px",
                width: "100%",
                bottom: "0",
                background: "#ccc",
              }}
            ></div>
            {/* Hiển thị hình ảnh vị trí comments */}
            <div className="comments" style={{ position: "relative" }}>
              {comments.map((item) => {
                return (
                  <Tooltip title={item.content} arrow key={item._id}>
                    <img
                      onPointerMove={(e) => {
                        const hover = hoverRef.current!;
                        hover.style.width = calLeft(item.moment + 3);
                      }}
                      key={item._id}
                      style={{
                        height: 20,
                        width: 20,
                        position: "absolute",
                        top: 70,
                        zIndex: 20,
                        left: calLeft(item.moment),
                      }}
                      src={fetchDefaultImages(item.user.type)}
                    />
                  </Tooltip>
                );
              })}
            </div>
          </div>
        </div>

        {/* Hiển thị ảnh */}
        <div
          className="right"
          style={{
            width: "25%",
            padding: 15,
            display: "flex",
            alignItems: "center",
          }}
        >
          {track?.imgUrl ? (
            <div>
              <img
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track?.imgUrl}`}
                width={250}
                height={250}
              />
            </div>
          ) : (
            <div
              style={{
                background: "#ccc",
                width: 250,
                height: 250,
              }}
            ></div>
          )}
        </div>
      </div>
      <div>
        <LikeTrack track={track} />
      </div>
      <div>
        <CommentTrack
          comments={comments}
          track={track}
          wavesurfer={wavesurfer}
        />
      </div>
    </div>
  );
};

export default WaveTrack;
