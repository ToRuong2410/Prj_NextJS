import ClientSearch from "@/components/search/client.search";
import { Container } from "@mui/material";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search page",
  description: "Thông tin search page",
};

const SearchPage = () => {
  return (
    <Container sx={{ mt: 2 }}>
      <ClientSearch />
    </Container>
  );
};

export default SearchPage;
