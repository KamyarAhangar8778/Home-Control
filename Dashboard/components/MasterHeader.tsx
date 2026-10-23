"use client";

import type { MasterHeaderProps } from "./MasterHeader/types";
import VerticalHeader from "./MasterHeader/VerticalHeader";

export default function MasterHeader(props: MasterHeaderProps) {
  return <VerticalHeader {...props} />;
}
