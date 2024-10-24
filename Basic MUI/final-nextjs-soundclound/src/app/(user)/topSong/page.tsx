import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import TopSong from "@/components/top-songs/top.song";
import { convertSlugUrl, sendRequest } from "@/utils/api";
import { Box, Container, Divider } from "@mui/material";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";

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
      <TopSong title={"Top 10 bài hát lượt nghe cao nhất"} data={allTracks} />
    </Container>
  );
};
export default TopSongPage;
