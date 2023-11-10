import React from "react";
import "./Onlineusers.css";
function Avatar() {
  const imageLink = [
    {
      img: "https://i.pinimg.com/564x/b9/aa/d1/b9aad114e8d8fe6650b238f3516fc5a7.jpg",
      name: "NARUTO UZUMAKI",
      score: 999,
      color: "blue",
    },
    {
      img: "https://i.pinimg.com/564x/70/a6/cc/70a6cc1610b0da9aa18cf197d4a14d42.jpg",
      name: "SATURO GOJO",
      score: 997,
      color: "blue",
    },
    {
      img: "https://i.pinimg.com/564x/37/01/43/370143d737f98e0f783f51f1d5da13bf.jpg",
      name: "KAKASHI HATAKE",
      score: 998,
      color: "blue",
    },
    {
      img: "https://i.pinimg.com/564x/1a/4d/dc/1a4ddce91abcc1cdb55072b209697041.jpg",
      name: "ONE PIECE",
      score: 996,
      color: "blue",
    },
    {
      img: "https://i.pinimg.com/564x/b9/aa/d1/b9aad114e8d8fe6650b238f3516fc5a7.jpg",
      name: "NARUTO",
      score: 995,
      color: "blue",
    },
    {
      img: "https://i.pinimg.com/564x/70/a6/cc/70a6cc1610b0da9aa18cf197d4a14d42.jpg",
      name: "GOJO",
      score: 994,
      color: "blue",
    },
    {
      img: "https://i.pinimg.com/564x/37/01/43/370143d737f98e0f783f51f1d5da13bf.jpg",
      name: "KAKASHI",
      score: 993,
      color: "blue",
    },
    {
      img: "https://i.pinimg.com/564x/1a/4d/dc/1a4ddce91abcc1cdb55072b209697041.jpg",
      name: "ONE PEICE",
      score: 992,
      color: "green",
    },
    {
      img: "https://i.pinimg.com/564x/70/a6/cc/70a6cc1610b0da9aa18cf197d4a14d42.jpg",
      name: "SATURO GOJO",
      score: 997,
      color: "green",
    },
    {
      img: "https://i.pinimg.com/564x/37/01/43/370143d737f98e0f783f51f1d5da13bf.jpg",
      name: "KAKASHI HATAKE",
      score: 998,
      color: "green",
    },
    {
      img: "https://i.pinimg.com/564x/1a/4d/dc/1a4ddce91abcc1cdb55072b209697041.jpg",
      name: "ONE PIECE",
      score: 996,
      color: "green",
    },
    {
      img: "https://i.pinimg.com/564x/b9/aa/d1/b9aad114e8d8fe6650b238f3516fc5a7.jpg",
      name: "NARUTO",
      score: 995,
      color: "green",
    },
    {
      img: "https://i.pinimg.com/564x/70/a6/cc/70a6cc1610b0da9aa18cf197d4a14d42.jpg",
      name: "GOJO",
      score: 994,
      color: "green",
    },
    {
      img: "https://i.pinimg.com/564x/37/01/43/370143d737f98e0f783f51f1d5da13bf.jpg",
      name: "KAKASHI",
      score: 993,
      color: "green",
    },
    {
      img: "https://i.pinimg.com/564x/1a/4d/dc/1a4ddce91abcc1cdb55072b209697041.jpg",
      name: "ONE PEICE",
      score: 992,
      color: "green",
    },
  ];

  return (
    <div className="iconboxContainer">
      <div className="iconbox">
        {imageLink.map((data) => (
          <div className="picIcon">
            <img className="avatar" src={data.img} />
            <p style={{ fontSize: "12px", textAlign: "center" }}>{data.name}</p>
            <p style={{ fontSize: "10px" }}>{data.score}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Onlineusers() {
  return (
    <div>
      <Avatar />
    </div>
  );
}

export default Onlineusers;
