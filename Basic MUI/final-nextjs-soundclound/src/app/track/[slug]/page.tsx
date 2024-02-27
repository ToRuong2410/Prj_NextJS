"use client";

import WaveTrack from "@/components/track/wave.track";
import { Container } from "@mui/material";
import { useSearchParams } from "next/navigation";

const DetailTrackPage = (props: any) => {
  const { params } = props;

  // Lấy thông tin đuôi file url audio
  const searchParams = useSearchParams();
  const search = searchParams.get("audio");

  return (
    <Container>
      My Post: {params.slug}
      <div>
        <WaveTrack />
      </div>
    </Container>
  );
};

export default DetailTrackPage;
