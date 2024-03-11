import WaveTrack from "@/components/track/wave.track";
import { sendRequest } from "@/utils/api";
import { Container } from "@mui/material";
import { useSearchParams } from "next/navigation";

const DetailTrackPage = async (props: any) => {
  const { params } = props;
  // console.log(">>> check params DetailTrackPage:", params);

  // Lấy thông tin chi tiết 1 bài hát thêm slug -> slug là mã id được truyền vào link url truy cập
  const res = await sendRequest<IBackendRes<ITrackTop>>({
    url: `http://localhost:8000/api/v1/tracks/${params.slug}`,
    method: "GET",
  });
  // console.log(res);

  return (
    <Container>
      <div>
        <WaveTrack track={res?.data ?? null} />
      </div>
    </Container>
  );
};

export default DetailTrackPage;
