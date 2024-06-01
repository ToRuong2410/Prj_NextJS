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
import Image from "next/image";
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

    // Thực hiện điều chỉnh số lượng slide hiển thị tùy theo từng loại thiết bị
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
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
              <div
                style={{
                  position: "relative",
                  height: "150px",
                  width: "150px",
                  marginBottom: "10px",
                }}
              >
                <Link
                  href={`/track/${convertSlugUrl(track.title)}-${
                    track._id
                  }.html?audio=${track.trackUrl}&id=${track._id}`}
                >
                  <Image
                    alt="soundcloud img"
                    fill
                    style={{
                      objectFit: "contain",
                    }}
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`}
                  />
                </Link>
              </div>
              <Link
                style={{ textDecoration: "none" }}
                href={`/track/${convertSlugUrl(track.title)}-${
                  track._id
                }.html?audio=${track.trackUrl}&id=${track._id}`}
              >
                <b style={{ fontSize: "15px" }}>{track.title}</b>
              </Link>
              <p style={{ color: "gray", marginTop: "0px", fontSize: "13px" }}>
                {track.description}
              </p>
            </div>
          );
        })}
      </Slider>
      <Divider />
    </Box>
  );
};

export default MainSlider;
