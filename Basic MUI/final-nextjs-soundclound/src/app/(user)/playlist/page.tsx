import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendRequest } from "@/utils/api";
import { Box, Container, Divider } from "@mui/material";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Fragment } from "react";
import NewPlaylist from "@/components/playlist/new.playlist";
import AddPlaylistTrack from "@/components/playlist/add.playlist.track";
import CurrentTrack from "@/components/track/current.track.playlist";

export const metadata: Metadata = {
  title: "Playlist page",
  description: "Thông tin playlist page",
};

const PlaylistPage = async () => {
  const session = await getServerSession(authOptions);

  const res = await sendRequest<IBackendRes<IModelPaginate<IPlaylist>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/by-user`,
    method: "POST",
    queryParams: { current: 1, pageSize: 100 },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    nextOption: {
      next: { tags: ["playlist-by-user"] },
    },
  });

  const res1 = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks`,
    method: "GET",
    queryParams: { current: 1, pageSize: 100 },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
  });

  const playlists = res.data?.result ?? [];
  const tracks = res1.data?.result ?? [];

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h3>Danh sách phát</h3>
        <Box sx={{ display: "flex", gap: "20px" }}>
          <NewPlaylist />
          <AddPlaylistTrack playlists={playlists} tracks={tracks} />
        </Box>
      </Box>
      <Divider variant="middle" />
      <Box sx={{ mt: 3 }}>
        {playlists?.map((playlist) => {
          return (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontSize: "20px", color: "#ccc" }}>
                  {playlist.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {playlist.tracks.map((track, index: number) => {
                  return (
                    <Fragment key={track._id}>
                      {index === 0 && <Divider />}
                      <CurrentTrack track={track} />
                      <Divider />
                    </Fragment>
                  );
                })}
                {playlist?.tracks?.length === 0 && <span>No data.</span>}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    </Container>
  );
};

export default PlaylistPage;
