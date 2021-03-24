import React from "react";
import "./Result.scss";

const Result = ({ value, prob }) => {
  return (
    <div className="result">
      <div className="answer">{value}</div>
      <div className="prob">{prob}</div>
    </div>
  );
};

export default Result;
