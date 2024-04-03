import { Container } from "@mui/material";

export async function generateStaticParams() {
  return [{ slug: "1" }, { slug: "12" }, { slug: "123" }];
}

const TestSlug = async ({ params }: any) => {
  const { slug } = params;

  await new Promise((resolve) => setTimeout(resolve, 5000));
  return <Container sx={{ mt: 5 }}>test slug = {slug} </Container>;
};

export default TestSlug;
