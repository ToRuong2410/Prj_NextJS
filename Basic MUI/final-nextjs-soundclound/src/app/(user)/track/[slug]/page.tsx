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
    // ???
    nextOption: { cache: "no-store" },
  });
  // console.log(res);

  const resCmt = await sendRequest<IBackendRes<IModelPaginate<ITrackComment>>>({
    url: `http://localhost:8000/api/v1/tracks/comments`,
    method: "POST",
    queryParams: {
      current: 1,
      pageSize: 100,
      trackId: params.slug,
      // dùng để sắp lại cmt (hiển thị cmt gần nhất lên đầu)
      sort: "-createdAt",
    },
  });

  const dataCmt = resCmt.data?.result ?? [];
  // console.log("comment:", resCmt.data?.result);

  return (
    <Container>
      <div>
        <WaveTrack track={res?.data ?? null} comments={dataCmt} />
      </div>
    </Container>
  );
};

export default DetailTrackPage;
