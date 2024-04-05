import WaveTrack from "@/components/track/wave.track";
import { sendRequest } from "@/utils/api";
import { Container } from "@mui/material";
import slugify from "slugify";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

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
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${id}`,
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

export async function generateStaticParams() {
  return [
    { slug: "khi-con-mo-dan-phai-65cf0099b0ce02410cc952c9.html" },
    { slug: "tinh-co-yeu-em-65cf0099b0ce02410cc952cd.html" },
    { slug: "le-luu-ly-65cf0099b0ce02410cc952ca.html" },
  ];
}

const DetailTrackPage = async (props: any) => {
  const { params } = props;

  // Thực hiện cắt (split) để lấy id từ link Url (params.slug)
  const temp = params?.slug?.split(".html") ?? [];
  const temp1 = temp[0]?.split("-") as string[];
  const id = temp1[temp1.length - 1];
  // console.log("check id URL: ", id);

  // Lấy thông tin chi tiết 1 bài hát thêm slug -> slug là mã id được truyền vào link url truy cập
  const res = await sendRequest<IBackendRes<ITrackTop>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${id}`,
    method: "GET",
    // ???
    nextOption: {
      // cache: "no-store"
      next: { tags: ["track-by-id"] },
    },
  });

  const resCmt = await sendRequest<IBackendRes<IModelPaginate<ITrackComment>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/comments`,
    method: "POST",
    queryParams: {
      current: 1,
      pageSize: 100,
      trackId: id,
      // dùng để sắp lại cmt (hiển thị cmt gần nhất lên đầu)
      sort: "-createdAt",
    },
  });

  // Nếu không có thông tin, dữ liệu bài hát thì render ra trang not-found cùng cấp
  if (!res?.data) {
    notFound();
  }

  return (
    <Container>
      <div>
        <WaveTrack
          track={res?.data ?? null}
          comments={resCmt.data?.result ?? []}
        />
      </div>
    </Container>
  );
};

export default DetailTrackPage;
