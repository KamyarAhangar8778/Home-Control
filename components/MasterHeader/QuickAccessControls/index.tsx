import React from "react";
import { QuickAccessControlsProps } from "./types";
import VerticalControls from "./VerticalControls";

export default function QuickAccessControls(props: QuickAccessControlsProps) {
  return <VerticalControls {...props} />;
}
