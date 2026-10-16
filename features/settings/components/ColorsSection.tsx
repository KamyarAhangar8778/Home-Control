"use client";

import React from "react";
import ColorsSectionComponent from "./colors-section/ColorsSection";
import { ColorsSectionProps } from "./colors-section/types";

export type { ColorsSectionProps };

export default function ColorsSection(props: ColorsSectionProps) {
  return <ColorsSectionComponent {...props} />;
}
