"use client";

import { useWavesurfer } from "@/utils/customHook";
import { useSearchParams } from "next/navigation";
import { useRef, useMemo, useCallback, useState, useEffect } from "react";
import { WaveSurferOptions } from "wavesurfer.js";
import "./wave.scss";

// Hiển thị lên màn hình giao diện sóng(wave) bài hát
const WaveTrack = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

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
      gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.15);
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
        canvas.height * 1.15
      )!;
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
      height: 150,
      barWidth: 2,
      waveColor: gradient,
      progressColor: progressGradient,
      url: `/api?audio=${fileName}`, // đường dẫn để tải tệp audio tương ứng với API
    };
  }, []);

  const wavesurfer = useWavesurfer(containerRef, optionsMemo);

  // useEffect(() => {
  //   // console.log(">>> check ref:", containerRef.current);
  //   if (containerRef.current) {
  //     const wavesurfer = WaveSurfer.create({
  //       container: containerRef.current,
  //       waveColor: "rgb(200, 0, 200)",
  //       progressColor: "rgb(100, 0, 100)",
  //       url: `/api?audio=${fileName}`, // đường dẫn để tải tệp audio tương ứng với API
  //     });
  //     return () => {
  //       wavesurfer.destroy();
  //     };
  //   }
  // }, []);

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

  return (
    <div style={{ top: "100px" }}>
      <div ref={containerRef} className="wave-form-container">
        <div className="time" ref={timeRef}>
          0:00
        </div>
        <div className="duration" ref={durationRef}>
          0:00
        </div>
        <div className="hover-wave" ref={hoverRef}></div>
      </div>
      <button onClick={onPlayClick}>
        {isPlaying === true ? "Pause" : "Play"}
      </button>
    </div>
  );
};

export default WaveTrack;
