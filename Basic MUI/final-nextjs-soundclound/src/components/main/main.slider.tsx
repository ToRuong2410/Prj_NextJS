"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Settings } from "react-slick";
import { Box, Button, Divider } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Link from "next/link";
import { convertSlugUrl } from "@/utils/api";

interface IProps {
  title: string;
  data: ITrackTop[];
}

const MainSlider = (props: IProps) => {
  const { title, data } = props;

  const NextArrow = (props: any) => {
    const { className, style, onClick } = props;
    return (
      <Button
        variant="contained"
        color="inherit"
        sx={{
          position: "absolute",
          right: 25,
          top: "25%",
          zIndex: 2,
          minWidth: 30,
          width: 35,
        }}
        onClick={onClick}
      >
        <ChevronRightIcon />
      </Button>
    );
  };

  const PrevArrow = (props: any) => {
    const { className, style, onClick } = props;
    return (
      <Button
        variant="contained"
        color="inherit"
        sx={{
          position: "absolute",
          top: "25%",
          zIndex: 2,
          minWidth: 30,
          width: 35,
        }}
        onClick={onClick}
      >
        <ChevronLeftIcon />
      </Button>
    );
  };

  // Chỉnh sửa các thông số hiển thị (chỉnh sửa số lượng hiển thị và số bài khi nhấn next ...)
  const settings: Settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };
  return (
    <Box
      sx={{
        margin: "0 50px",
        ".track": {
          padding: "0 10px",
          img: {
            height: 150,
            width: 150,
          },
        },
        h3: {
          border: "1px solid #ccc",
          padding: "20px",
          height: "200px",
        },
      }}
    >
      <h2>{title}</h2>
      <Slider {...settings}>
        {data.map((track, index) => {
          return (
            <div className="track" key={index}>
              <img
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`}
              />
              <Link
                href={`/track/${convertSlugUrl(track.title)}-${
                  track._id
                }.html?audio=${track.trackUrl}&id=${track._id}`}
              >
                <h4>{track.title}</h4>
              </Link>
              <h5>{track.description}</h5>
            </div>
          );
        })}
      </Slider>
      <Divider />
    </Box>
  );
};

export default MainSlider;
