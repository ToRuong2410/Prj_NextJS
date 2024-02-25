import { useState, useEffect } from "react";

// hook này trả ra giá trị là true nếu component đã render, ngược lại sẽ trả ra false
export const useHasMounted = () => {
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
};

import WaveSurfer, { WaveSurferOptions } from "wavesurfer.js";
// WaveSurfer hook
export const useWavesurfer = (
  containerRef: React.RefObject<HTMLDivElement>,
  options: Omit<WaveSurferOptions, "container">
) => {
  const [wavesurfer, setWavesurfer] = useState<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      ...options,
      container: containerRef.current,
    });

    setWavesurfer(ws);

    return () => {
      ws.destroy();
    };
  }, [options, containerRef]);
  return wavesurfer;
};
