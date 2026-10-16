export interface GlobalRuleSettingsProps {
  variant?: "horizontal" | "vertical";
  isSidebarCollapsed?: boolean;
}

export interface RuleAction {
  reqHold: number;
  targetPin: string;
  actionOn: boolean;
  actionType?: number;
  delay?: number;
}

export interface SegmentRule {
  highActions: RuleAction[];
  lowActions: RuleAction[];
}
