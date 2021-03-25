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

let drawable, X, Y;
let canvas;
let ctx;

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
    canvas = canvasRef.current;
    ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 320, 320);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 35;
    canvas.addEventListener("mousedown", Down);
    canvas.addEventListener("mousemove", Move);
    canvas.addEventListener("mouseup", Finish);
    canvas.addEventListener("mouseout", Finish);
    setInterval(CheckImage, 200);
  }, []);
  useEffect(() => {
    ctx.strokeStyle = props.pen ? "black" : "white";
    ctx.lineWidth = props.pen ? 35 : 50;
  }, [props.pen]);
  function Down(event) {
    X = event.offsetX;
    Y = event.offsetY;
    drawable = true;
  }
  function Move(event) {
    if (!drawable) return;
    let curX = event.offsetX;
    let curY = event.offsetY;
    ctx.beginPath();
    ctx.moveTo(X, Y);
    ctx.lineTo(curX, curY);
    ctx.stroke();
    X = curX;
    Y = curY;
  }
  function Finish() {
    drawable = false;
  }
  function CheckImage() {
    console.log("전송");
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
    return axios
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
        setValue("?");
        setProb("?");
      });
  }
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
