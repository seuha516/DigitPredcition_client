import React, { useState, useCallback, useRef } from "react";
import { BiEraser } from "react-icons/bi";
import { BsPencil } from "react-icons/bs";
import { AiOutlineClear } from "react-icons/ai";
import Canvas from "./Canvas";
import "./Paint.scss";

const Paint = () => {
  const [status, setStatus] = useState(true);
  const childRef = useRef(null);
  const onToggle = useCallback(() => {
    setStatus(!status);
  }, [status]);
  return (
    <>
      <Canvas pen={status} ref={childRef} />
      <button onClick={onToggle}>
        {status ? <BiEraser size="35px" /> : <BsPencil size="35px" />}
      </button>
      <button
        onClick={() => {
          childRef.current.Erase();
          setStatus(true);
        }}
      >
        <AiOutlineClear size="35px" />
      </button>
    </>
  );
};

export default Paint;
