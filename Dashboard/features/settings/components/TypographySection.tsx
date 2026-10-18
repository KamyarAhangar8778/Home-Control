"use client";

import React from "react";
import TypographySectionComponent from "./typography-section/TypographySection";
import { TypographySectionProps } from "./typography-section/types";

export type { TypographySectionProps };

export default function TypographySection(props: TypographySectionProps) {
  return <TypographySectionComponent {...props} />;
}
