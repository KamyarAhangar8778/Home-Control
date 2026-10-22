import React from "react";
import VerticalBrandBox from "./VerticalBrandBox";
import { BrandBoxProps } from "./types";

export default function BrandBox(props: Omit<BrandBoxProps, "variant">) {
  return <VerticalBrandBox {...props} />;
}
