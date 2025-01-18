"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import Link from "next/link";
import { convertSlugUrl } from "@/utils/api";
import Image from "next/image";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useState } from "react";

interface IProps {
  title: string;
  data: ITrackTop[];
}

const TopSong = (props: IProps) => {
  const { title, data } = props;
  const [filter, setFilter] = useState<"countPlay" | "countLike">("countPlay");

  // Hàm lọc top 10 bài hát
  const getTopTracks = (tracks: ITrackTop[], sortBy: "countPlay" | "countLike", limit: number = 10) => {
    if (!Array.isArray(tracks)) {
      throw new Error("Invalid tracks data. Expected an array.");
    }

    return tracks
      .sort((a, b) => b[sortBy] - a[sortBy])
      .slice(0, limit);
  };

  // Lấy danh sách bài hát theo filter
  const filteredTracks: ITrackTop[] = getTopTracks(data, filter, 10);

  const handleFilterChange = ( event: SelectChangeEvent) => {
    setFilter(event.target.value as "countPlay" | "countLike");
  };

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
      <h2>{title} {filter == 'countPlay' ? 'lượt nghe' : 'lượt like'}</h2>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <FormControl variant="standard" sx={{ width: '25%' }}>
          <InputLabel id="demo-simple-select-label">Dựa theo</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Age"
            onChange={handleFilterChange}
            value={filter}
          >
            <MenuItem value={'countPlay'}>Lượt nghe</MenuItem>
            <MenuItem value={'countLike'}>Lượt like</MenuItem>
          </Select>
        </FormControl>

        {/* filter theo thể loại -> chưa update */}
        {/* <FormControl variant="standard" sx={{ width: '25%' }}>
          <InputLabel id="demo-simple-select-label">Album</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Age"
          >
            <MenuItem value={10}>Tất cả</MenuItem>
            <MenuItem value={20}>CHILL</MenuItem>
            <MenuItem value={20}>WORKOUT</MenuItem>
            <MenuItem value={20}>PARTY</MenuItem>
          </Select>
        </FormControl> */}

      </Box>
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
            {filteredTracks.map((track, index) => {
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
                        href={`/track/${convertSlugUrl(track.title)}-${track._id
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
