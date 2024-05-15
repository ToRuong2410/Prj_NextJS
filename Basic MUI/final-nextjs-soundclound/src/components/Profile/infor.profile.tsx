"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React from "react";
import { fetchDefaultImages } from "@/utils/api";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Button } from "@mui/material";

interface Playlist {
  name: string;
  songCount: number;
}

interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  playlists: Playlist[];
}

const userProfile: UserProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatarUrl: "https://via.placeholder.com/150",
  playlists: [
    { name: "Rock Classics", songCount: 20 },
    { name: "Jazz Vibes", songCount: 15 },
    { name: "Pop Hits", songCount: 25 },
  ],
};

const InforProfile = () => {
  const { data: session } = useSession();

  return (
    <Container maxWidth="md" sx={{ marginBottom: 2 }}>
      <Card>
        <CardContent>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            <Grid
              item
              xs={12}
              sm={4}
              md={3}
              display="flex"
              justifyContent="center"
            >
              <Image
                src={fetchDefaultImages(session?.user.type!)}
                alt="avatar"
                width={100}
                height={100}
              />
            </Grid>
            <Grid item xs={12} sm={8} md={9}>
              <Typography variant="h5">
                Name: {session?.user.username}
              </Typography>
              <Typography variant="body1">
                Email: {session?.user.email}
              </Typography>
              <Typography variant="body1">
                Role: {session?.user.role}
              </Typography>
              {session?.user.role.toLocaleLowerCase() === "admin" && (
                <Button
                  variant="contained"
                  color="primary"
                  href="http://localhost:5173/"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ marginTop: 2 }}
                >
                  Go to Admin Page
                </Button>
              )}
            </Grid>
          </Grid>
          <Box mt={2}>
            {/* <Typography variant="h6">Playlists</Typography>
            <Grid container spacing={1}>
              {userProfile.playlists.map((playlist, index) => (
                <Grid item xs={12} key={index}>
                  <Typography variant="body1">
                    {playlist.name} - {playlist.songCount} songs
                  </Typography>
                </Grid>
              ))}
            </Grid> */}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default InforProfile;
