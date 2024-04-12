import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { convertSlugUrl, sendRequest } from "@/utils/api";
import { Box, Container, Divider, Typography } from "@mui/material";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Like Page",
  description: "Thông tin like track",
};

const LikePage = async () => {
  const session = await getServerSession(authOptions);

  const res = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
    method: "GET",
    queryParams: { current: 1, pageSize: 100 },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    nextOption: {
      next: { tags: ["liked-by-user"] },
    },
  });

  const likeTracks = res.data?.result ?? [];
  return (
    <Container>
      <Box>
        <div>
          <h3>Thông tin bài nhạc đã like</h3>
        </div>
      </Box>
      <Divider />
      <Box sx={{ mt: 3, display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {likeTracks.map((track) => {
          return (
            <Box>
              <Image
                style={{ borderRadius: "3px" }}
                height={200}
                width={200}
                alt="avatar track"
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track?.imgUrl}`}
              />
              <Link
                style={{
                  textDecoration: "none",
                  color: "unset",
                  textAlign: "center",
                  display: "block",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  width: "200px",
                }}
                href={`/track/${convertSlugUrl(track.title)}-${
                  track._id
                }.html?audio=${track.trackUrl}`}
              >
                {/* <span
                  style={{
                    width: "200px",
                    display: "block",
                    color: "black",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                > */}
                {track.title}
                {/* </span> */}
              </Link>
            </Box>
          );
        })}
      </Box>
    </Container>
  );
};
export default LikePage;
