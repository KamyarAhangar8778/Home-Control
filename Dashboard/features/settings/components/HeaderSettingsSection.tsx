"use client";

import React from "react";
import HeaderSettingsSectionComponent from "./header-settings/HeaderSettingsSection";
import { HeaderSettingsSectionProps } from "./header-settings/types";

export type { HeaderSettingsSectionProps };

export default function HeaderSettingsSection(props: HeaderSettingsSectionProps) {
  return <HeaderSettingsSectionComponent {...props} />;
}
