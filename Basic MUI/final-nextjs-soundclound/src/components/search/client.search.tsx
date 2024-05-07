"use client";

import { convertSlugUrl, sendRequest } from "@/utils/api";
import { Box, Divider, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const ClientSearch = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("result");
  const [tracksSearch, setTracksSearch] = useState<ITrackTop[]>([]);

  const fetchData = async () => {
    const res = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/search`,
      method: "POST",
      body: {
        current: 1,
        pageSize: 10,
        title: query,
      },
    });
    if (res.data?.result) {
      setTracksSearch(res.data?.result);
    }
  };
  console.log(tracksSearch);

  useEffect(() => {
    if (query) {
      fetchData();
    }
  }, [query]);

  return (
    <div>
      {!query || !tracksSearch.length ? (
        <div>Không tồn tại kết quả tìm kiếm</div>
      ) : (
        <Box>
          <div>
            Kết quản tìm kiếm từ khóa: <b>{query}</b>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {tracksSearch.map((track) => {
                return (
                  <div key={track._id}>
                    <Box sx={{ display: "flex", width: "100%", gap: "20px" }}>
                      <Image
                        style={{ borderRadius: "3px" }}
                        alt="avatar track"
                        width={50}
                        height={50}
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`}
                      />
                      <Typography sx={{ py: 2 }}>
                        <Link
                          style={{
                            textDecoration: "none",
                            color: "unset",
                          }}
                          href={`/track/${convertSlugUrl(track.title)}-${
                            track._id
                          }.html?audio=${track.trackUrl}&id=${track._id}`}
                        >
                          {track.title}
                        </Link>
                      </Typography>
                    </Box>
                  </div>
                );
              })}
            </Box>
          </div>
        </Box>
      )}
    </div>
  );
};

export default ClientSearch;
