import ProfileTracks from "@/components/header/proflie.tracks";
import { sendRequest } from "@/utils/api";
import { Container, Grid } from "@mui/material";

// dùng dynamic routes để lấy ra id là đuôi link url
const ProfilePage = async ({ params }: { params: { slug: string } }) => {
  const slug = params.slug;

  const trackupload = await sendRequest<
    IBackendRes<IModelPaginate<ITrackTop[]>>
  >({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/users?current=1&pageSize=10`,
    method: "POST",
    body: {
      id: slug,
    },
  });
  const data = trackupload.data?.result ?? [];

  // console.log('du lieu data hien thi:', data);

  return (
    <Container sx={{ my: 5 }}>
      <Grid container spacing={5}>
        {data.map((item: ITrackTop[], index: number) => {
          return (
            <Grid item xs={12} md={6} key={index}>
              <ProfileTracks data={item} />
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default ProfilePage;
