import VerticalBrandBox from "./VerticalBrandBox";
import type { BrandBoxProps } from "./types";

export default function BrandBox(props: Omit<BrandBoxProps, "variant">) {
  return <VerticalBrandBox {...props} />;
}
