"use client";

import React from "react";
import SortableGroupComponent from "./sortable-group";
import { SortableGroupProps } from "./sortable-group/core/types";

export type { SortableGroupProps };

export default function SortableGroup(props: SortableGroupProps) {
  return <SortableGroupComponent {...props} />;
}
