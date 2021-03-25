import React, {
  forwardRef,
  useState,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import axios from "axios";
import "./Canvas.scss";
import Result from "./Result";

let status = {
  drawable: false,
  X: -1,
  Y: -1,
};
let canvas, ctx;
let loading = false;

const Canvas = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    Erase() {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, 320, 320);
      ctx.strokeStyle = "black";
      ctx.lineWidth = 35;
    },
  }));
  const canvasRef = useRef(null);
  const [value, setValue] = useState("?");
  const [prob, setProb] = useState("?");
  useEffect(() => {
    //처음 시작할때 실행됨
    canvas = canvasRef.current;
    ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 320, 320);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 25;

    canvas.addEventListener("mousedown", Down, false);
    canvas.addEventListener("mousemove", Move, false);
    canvas.addEventListener("mouseup", Finish, false);
    canvas.addEventListener("mouseout", Finish, false);
    canvas.addEventListener("touchstart", TouchStart, false);
    canvas.addEventListener("touchmove", TouchMove, false);
    canvas.addEventListener("touchend", Finish, false);

    setInterval(() => {
      if (!loading) {
        CheckImage();
      }
    }, 100);
  }, []);
  useEffect(() => {
    //펜 <--> 지우개
    ctx.strokeStyle = props.pen ? "black" : "white";
    ctx.lineWidth = props.pen ? 25 : 40;
  }, [props.pen]);
  function Down(e) {
    e.preventDefault();
    status.X = e.offsetX;
    status.Y = e.offsetY;
    status.drawable = true;
  }
  function TouchStart(e) {
    e.preventDefault();
    status.X = e.touches[0].clientX - canvas.getBoundingClientRect().left;
    status.Y = e.touches[0].clientY - canvas.getBoundingClientRect().top;
    status.drawable = true;
  }
  function Move(e) {
    e.preventDefault();
    if (!status.drawable) return;
    let curX = e.offsetX,
      curY = e.offsetY;
    ctx.beginPath();
    ctx.moveTo(status.X, status.Y);
    ctx.lineTo(curX, curY);
    ctx.stroke();
    status.X = curX;
    status.Y = curY;
  }
  function TouchMove(e) {
    e.preventDefault();
    if (!status.drawable) return;
    let curX = e.touches[0].clientX - canvas.getBoundingClientRect().left,
      curY = e.touches[0].clientY - canvas.getBoundingClientRect().top;
    ctx.beginPath();
    ctx.moveTo(status.X, status.Y);
    ctx.lineTo(curX, curY);
    ctx.stroke();
    status.X = curX;
    status.Y = curY;
  }
  function Finish() {
    status.drawable = false;
  }

  const CheckImage = async () => {
    let Time = new Date();
    loading = true;
    const imgBase64 = canvas.toDataURL("image/png", "image/octet-stream");
    const decodImg = atob(imgBase64.split(",")[1]);
    let array = [];
    for (let i = 0; i < decodImg.length; i++) {
      array.push(decodImg.charCodeAt(i));
    }
    const file = new Blob([new Uint8Array(array)], { type: "image/png" });
    const fileName = "canvas_img_" + new Date().getMilliseconds() + ".png";
    let formData = new FormData();
    formData.append("file", file, fileName);
    await axios
      .post("https://digitprediction-server.herokuapp.com/number", formData, {
        headers: {
          mode: "no-cors",
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((res) => {
        console.log(res.data);
        let V = res.data.split(",")[0];
        let P = res.data.split(",")[1];
        setValue(V);
        setProb(P);
      })
      .catch((err) => {
        console.log("ERROR!");
        setValue("?");
        setProb("?");
      });
    Time = new Date() - Time;
    console.log("소요 시간 " + String(Time) + "ms");
    loading = false;
  };

  return (
    <>
      <canvas ref={canvasRef} width="320px" height="320px" />
      <div className="Res">
        <Result value={value} prob={prob + "%"} />
      </div>
    </>
  );
});

export default Canvas;
