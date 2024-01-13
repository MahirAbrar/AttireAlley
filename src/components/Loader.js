"use client";
import React from "react";

function Loader(props) {
  const { loading, id } = props;

  if (loading) {
    return (
      <>
        <span className="loading loading-bars loading-xs"></span>
      </>
    );
  }

  return null;
}

export default Loader;
