"use client";

import React from "react";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useSession } from "next-auth/react";
import { Button } from "@mui/material";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Image from "next/image";

import { fetchDefaultImages } from "@/utils/api";

const InforProfile = () => {
  const { data: session } = useSession();

  console.log(session);

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
                Infomation: {session?.user.username == "" ? session?.user.name : session?.user.username}
              </Typography>
              <Typography>
                {session?.user.address && `Address: ${session?.user.address}`}
              </Typography>
              <Typography variant="body2">Id: {session?.user._id}</Typography>
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
        </CardContent>
      </Card>
    </Container>
  );
};

export default InforProfile;
