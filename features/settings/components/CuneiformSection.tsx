"use client";

import React from "react";
import CuneiformSectionComponent from "./cuneiform-section/CuneiformSection";
import { CuneiformSectionProps } from "./cuneiform-section/types";

export type { CuneiformSectionProps };

export default function CuneiformSection(props: CuneiformSectionProps) {
  return <CuneiformSectionComponent {...props} />;
}
