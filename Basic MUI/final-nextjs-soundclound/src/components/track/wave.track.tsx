"use client";

import { useWavesurfer } from "@/utils/customHook";
import { useSearchParams } from "next/navigation";
import { useRef, useMemo } from "react";

// Hiển thị lên màn hình giao diện sóng(wave) bài hát
const WaveTrack = () => {
  // lấy tên keyword 'audio' trên link url -> dùng để gửi sang api(route.ts)
  // -> lấy thông tin bài hát từ BE
  const searchParams = useSearchParams();
  const fileName = searchParams.get("audio");

  // tham chiếu đến 1 phần tử trong HTML -> sử dụng để chứa phần tử sóng(wave)
  const containerRef = useRef<HTMLDivElement>(null);

  const optionsMemo = useMemo(() => {
    return {
      waveColor: "rgb(200, 0, 200)",
      progressColor: "rgb(100, 0, 100)",
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

  return <div ref={containerRef}>wave track</div>;
};

export default WaveTrack;
