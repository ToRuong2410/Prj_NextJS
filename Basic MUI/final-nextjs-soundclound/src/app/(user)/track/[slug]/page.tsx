import WaveTrack from "@/components/track/wave.track";
import { sendRequest } from "@/utils/api";
import { Container } from "@mui/material";
import slugify from "slugify";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// Thực hiện fetch data dùng để thay đổi title bài nhạc
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Thực hiện cắt (split) để lấy id từ link Url (params.slug)
  const temp = params?.slug?.split(".html") ?? [];
  const temp1 = temp[0]?.split("-") as string[];
  const id = temp1[temp1.length - 1];

  // fetch data
  const res = await sendRequest<IBackendRes<ITrackTop>>({
    url: `http://localhost:8000/api/v1/tracks/${id}`,
    method: "GET",
  });

  return {
    title: res.data?.title,
    description: res.data?.description,
    openGraph: {
      title: "Thông tin SoundCloud",
      description: "Beyond Your Coding Skills",
      type: "website",
      images: [
        `https://raw.githubusercontent.com/ToRuong2410/Prj_NextJS/main/Basic%20MUI/final-nextjs-soundclound/public/audio/chill1.png`,
      ],
    },
  };
}

const DetailTrackPage = async (props: any) => {
  const { params } = props;
  console.log(params);

  // Thực hiện cắt (split) để lấy id từ link Url (params.slug)
  const temp = params?.slug?.split(".html") ?? [];
  const temp1 = temp[0]?.split("-") as string[];
  const id = temp1[temp1.length - 1];
  // console.log("check id URL: ", id);

  // Lấy thông tin chi tiết 1 bài hát thêm slug -> slug là mã id được truyền vào link url truy cập
  const res = await sendRequest<IBackendRes<ITrackTop>>({
    url: `http://localhost:8000/api/v1/tracks/${id}`,
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
      trackId: id,
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
