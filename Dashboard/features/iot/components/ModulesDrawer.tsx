"use client";

import React from "react";
import ModulesDrawerComponent, { ModulesDrawerProps } from "./modules-drawer";

export type { ModulesDrawerProps };

export default function ModulesDrawer(props: ModulesDrawerProps) {
  return <ModulesDrawerComponent {...props} />;
}
