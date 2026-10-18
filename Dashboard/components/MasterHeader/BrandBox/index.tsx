import React from "react";
import VerticalBrandBox from "./VerticalBrandBox";
import HorizontalBrandBox from "./HorizontalBrandBox";
import { BrandBoxProps } from "./types";

export default function BrandBox(props: BrandBoxProps) {
  if (props.variant === "vertical") {
    return <VerticalBrandBox {...props} />;
  }

  return <HorizontalBrandBox {...props} />;
}
