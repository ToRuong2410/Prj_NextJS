"use client";
// import { useState } from "react";

const LikePage = () => {
  // const [name, setName] = useState("Nguyen Quang Truong");
  const handleClick = () => {
    alert("Click");
  };
  return <div onClick={handleClick}>like page </div>;
};
export default LikePage;
