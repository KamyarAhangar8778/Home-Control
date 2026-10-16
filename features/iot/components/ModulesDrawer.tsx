"use client";

import React from "react";
import ModulesDrawerComponent, { Segment, ModulesDrawerProps } from "./modules-drawer";

export type { Segment, ModulesDrawerProps };

export default function ModulesDrawer(props: ModulesDrawerProps) {
  return <ModulesDrawerComponent {...props} />;
}
