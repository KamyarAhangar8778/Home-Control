"use client";

import React from "react";
import StabilitySectionComponent from "./stability-section/StabilitySection";
import { StabilitySectionProps } from "./stability-section/types";

export type { StabilitySectionProps };

export default function StabilitySection(props: StabilitySectionProps) {
  return <StabilitySectionComponent {...props} />;
}
