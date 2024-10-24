"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Settings } from "react-slick";
import {
  Box,
  Button,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Link from "next/link";
import { convertSlugUrl } from "@/utils/api";
import Image from "next/image";
interface IProps {
  title: string;
  data: ITrackTop[];
}

const TopSong = (props: IProps) => {
  const { title, data } = props;

  // Sắp xếp láy 5 bài hát có lượt nghe cao nhất
  const top10Tracks = data
    .sort((a, b) => b.countPlay - a.countPlay)
    .slice(0, 10);

  return (
    <Box
      sx={{
        margin: "0 50px",
        ".track": {
          padding: "0 10px",
          img: {
            height: 150,
            width: 150
          }
        },
        h3: {
          border: "1px solid #ccc",
          padding: "20px",
          height: "200px"
        }
      }}
    >
      <h2>{title}</h2>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell align="left">Title</TableCell>
              <TableCell align="left">Album</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {top10Tracks.map((track, index) => {
              return (
                <TableRow
                  key={index}
                  sx={{ ":hover": { background: "#CCCC" } }}
                >
                  <TableCell sx={{ fontSize: "14px" }}>{index + 1}</TableCell>
                  <TableCell align="left">
                    <Box>
                      <Link
                        style={{ textDecoration: "none" }}
                        href={`/track/${convertSlugUrl(track.title)}-${
                          track._id
                        }.html?audio=${track.trackUrl}&id=${track._id}`}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            width: "100%",
                            gap: "20px",
                            alignItems: "center",
                            ":hover": {
                              "& *": {
                                color: "#ff5722"
                              }
                            }
                          }}
                        >
                          <Image
                            style={{ borderRadius: "3px" }}
                            alt="avatar track"
                            width={56}
                            height={56}
                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`}
                          />
                          <Box>
                            <Typography style={{ fontSize: "16px" }}>
                              {track.title}
                            </Typography>
                            <p
                              style={{
                                color: "gray",
                                marginTop: "0px",
                                fontSize: "13px"
                              }}
                            >
                              {track.description}
                            </p>
                          </Box>
                        </Box>
                      </Link>
                    </Box>
                  </TableCell>
                  <TableCell align="left">{track.category}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default TopSong;
