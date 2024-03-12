"use client";

import { TrackContext, useTrackContext } from "@/lib/track.wrapper";
import { useHasMounted } from "@/utils/customHook";
import { AppBar, Container } from "@mui/material";
import { useContext, useEffect, useRef } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

const AppFooter = () => {
  // Sử dụng useContext để lấy state currentTrack
  const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;
  const hasMounted = useHasMounted();
  // Dùng để lấy phần tử HTML -> useRef()
  const playerRef = useRef(null);

  // console.log(">>> check track context:", currentTrack);

  useEffect(() => {
    if (currentTrack?.isPlaying) {
      //@ts-ignore
      playerRef?.current?.audio?.current?.play();
    } else {
      //@ts-ignore
      playerRef?.current?.audio?.current?.pause();
    }
  }, [currentTrack]);

  // if (currentTrack?.isPlaying) {
  //   //@ts-ignore
  //   playerRef?.current?.audio?.current?.play();
  // } else {
  //   //@ts-ignore
  //   playerRef?.current?.audio?.current?.pause();
  // }

  if (!hasMounted) return <></>;

  return (
    <div style={{ marginTop: "50px" }}>
      <AppBar
        position="fixed"
        sx={{ top: "auto", bottom: 0, background: "#f2f2f2" }}
      >
        <Container sx={{ display: "flex", ".rhap_main": { gap: "30px" } }}>
          <AudioPlayer
            ref={playerRef}
            layout="horizontal-reverse"
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${currentTrack.trackUrl}`}
            volume={0.5}
            style={{
              boxShadow: "unset",
              background: "#f2f2f2",
            }}
            onPlay={() => {
              setCurrentTrack({ ...currentTrack, isPlaying: true });
            }}
            onPause={() => {
              setCurrentTrack({ ...currentTrack, isPlaying: false });
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "start",
              minWidth: 100,
            }}
          >
            <div style={{ color: "#ccc" }}>{currentTrack.title}</div>
            <div style={{ color: "black" }}>{currentTrack.description}</div>
          </div>
        </Container>
      </AppBar>
    </div>
  );
};

export default AppFooter;
