"use client";

import React from "react";
import { MasterHeaderProps } from "./MasterHeader/types";
import VerticalHeader from "./MasterHeader/VerticalHeader";
import HorizontalHeader from "./MasterHeader/HorizontalHeader";

export default function MasterHeader(props: MasterHeaderProps) {
  if (props.headerPosition === "left") {
    return <VerticalHeader {...props} />;
  }

  return <HorizontalHeader {...props} />;
}
