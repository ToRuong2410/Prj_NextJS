import { Container } from "@mui/material";

import TopSong from "@/components/top-songs/top.song";
import { sendRequest } from "@/utils/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top songs",
  description: "Top songs",
}

const TopSongPage = async () => {
  const chills = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: "POST",
    body: {
      category: "CHILL",
      limit: 20
    }
  });

  const workouts = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: "POST",
    body: {
      category: "WORKOUT",
      limit: 20
    }
  });

  const party = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
    method: "POST",
    body: {
      category: "PARTY",
      limit: 20
    }
  });

  const allTracks = [
    ...(chills?.data || []),
    ...(workouts?.data || []),
    ...(party?.data || [])
  ];

  return (
    <Container>
      <TopSong title={"Top 10 bài hát cao nhất theo"} data={allTracks} />
    </Container>
  );
};
export default TopSongPage;
