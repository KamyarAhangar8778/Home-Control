import React from "react";
import VerticalBrandBox from "./VerticalBrandBox";
import { BrandBoxProps } from "./types";

export default function BrandBox(props: BrandBoxProps) {
  return <VerticalBrandBox {...props} />;
}
