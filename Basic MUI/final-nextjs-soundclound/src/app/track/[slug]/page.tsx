"use client";

import WaveTrack from "@/components/track/wave.track";
import { useSearchParams } from "next/navigation";

const DetailTrackPage = (props: any) => {
  const { params } = props;

  // Lấy thông tin đuôi file url audio
  const searchParams = useSearchParams();
  const search = searchParams.get("audio");

  return (
    <div>
      My Post: {params.slug}
      <div>
        <WaveTrack />
      </div>
    </div>
  );
};

export default DetailTrackPage;
