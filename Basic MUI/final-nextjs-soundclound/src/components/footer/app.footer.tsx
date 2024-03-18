"use client";

import { useTrackContext } from "@/lib/track.wrapper";
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

  useEffect(() => {
    if (currentTrack?.isPlaying === false) {
      //@ts-ignore
      playerRef?.current?.audio?.current?.pause();
    }
    if (currentTrack?.isPlaying === true) {
      //@ts-ignore
      playerRef?.current?.audio?.current?.play();
    }
  }, [currentTrack]);

  if (!hasMounted) return <></>;

  return (
    <>
      {currentTrack._id && (
        <div style={{ marginTop: "50px" }}>
          <AppBar
            position="fixed"
            sx={{ top: "auto", bottom: 0, background: "#f2f2f2" }}
          >
            <Container
              disableGutters
              sx={{ display: "flex", ".rhap_main": { gap: "30px" } }}
            >
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
                  minWidth: "220px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    color: "black",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  {currentTrack.title}
                </div>
                <div style={{ color: "#ccc", textOverflow: "ellipsis" }}>
                  {currentTrack.description}
                </div>
              </div>
            </Container>
          </AppBar>
        </div>
      )}
    </>
  );
};

export default AppFooter;
