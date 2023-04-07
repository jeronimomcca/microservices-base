import React from "react";
import "./loading.css";

function NewLoading(props) {
  const { text } = props;

  return (
    <div className="NewLoading-container">
      <div className="NewLoading-text">{text}</div>
      <div className="NewLoading-balls-container">
        <div className="NewLoading-ball NewLoading-ball-1"></div>
        <div className="NewLoading-ball NewLoading-ball-2"></div>
        <div className="NewLoading-ball NewLoading-ball-3"></div>
        <div className="NewLoading-ball NewLoading-ball-4"></div>
        <div className="NewLoading-ball NewLoading-ball-5"></div>
        <div className="NewLoading-ball NewLoading-ball-6"></div>
        <div className="NewLoading-ball NewLoading-ball-7"></div>
        <div className="NewLoading-ball NewLoading-ball-8"></div>
      </div>
    </div>
  );
}

export default NewLoading;
