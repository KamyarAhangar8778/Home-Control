import React from "react";
import { QuickAccessControlsProps } from "./types";
import VerticalControls from "./VerticalControls";
import HorizontalControls from "./HorizontalControls";

export default function QuickAccessControls(props: QuickAccessControlsProps) {
  if (props.variant === "vertical" && !props.isSidebarCollapsed) {
    return <VerticalControls {...props} />;
  }

  return <HorizontalControls {...props} />;
}
