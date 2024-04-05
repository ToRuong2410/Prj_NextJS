import { sendRequest } from "@/utils/api";
import Container from "@mui/material/Container";

const TestA = async () => {
  const res = await sendRequest<any>({
    url: `http://localhost:3000/api/test`,
    method: "GET",
    nextOption: {
      //   cache: "no-store",
      //   next: { revalidate: 10 },
      next: { tags: ["soundcloud"] },
    },
  });
  return (
    <Container sx={{ mt: 5 }}>
      <div>test random: {JSON.stringify(res)}</div>
    </Container>
  );
};

export default TestA;
