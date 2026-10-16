import { EspConfig } from "@/features/iot/services/esp32Config";

export interface RuleAction {
  reqHold: number;
  targetPin: string;
  actionOn: boolean;
  actionType?: number;
  delay?: number;
}

export interface SegmentRule {
  highActions?: RuleAction[];
  lowActions?: RuleAction[];
}

export interface Segment {
  id: string;
  type: string;
  pin: string;
  title: string;
  group: string;
  icon?: string;
  state?: boolean;
  mode?: "switch" | "push";
  auto_off?: number;
  rule?: SegmentRule;
}

export interface AutomationAction {
  targetPin?: string;
  targetMacro?: string;
  actionOn?: boolean;
}

export interface Automation {
  id: string;
  title: string;
  time: string;
  days: number[];
  enabled: boolean;
  repeatCount?: number;
  intervalMinutes?: number;
  conditionType?: 'time' | 'weather';
  city?: string;
  temperatureThreshold?: number;
  temperatureCondition?: 'greater' | 'less';
  actions: AutomationAction[];
}

export interface Macro {
  id: string;
  title: string;
  icon?: string;
  actions: Array<{
    targetPin: string;
    actionOn: boolean;
  }>;
}

export interface VoiceCommand {
  id: string;
  phrase: string;
  actions: AutomationAction[];
}

export interface WifiNetwork {
  id: string;
  ssid: string;
  password?: string;
}

export interface MqttConfig {
  broker_ws_url: string;
  broker_host: string;
  broker_port: number;
  base_topic: string;
  qos: 0 | 1 | 2;
}

export interface SegmentsSlice {
  segments: Segment[];
  pinsState: Record<string, boolean>;
  setSegments: (segments: Segment[] | ((prev: Segment[]) => Segment[])) => void;
  setPinsState: (pins: Record<string, boolean> | ((prev: Record<string, boolean>) => Record<string, boolean>)) => void;
  updateSegmentMode: (id: string, mode: "switch" | "push") => void;
  updateSegmentRule: (id: string, rule: SegmentRule) => void;
}

export interface GroupsSlice {
  groupsOrder: string[];
  groupConfigs: Record<string, { maxCols: number; icon?: string }>;
  groupsCols: number;
  setGroupsOrder: (order: string[] | ((prev: string[]) => string[])) => void;
  setGroupConfigs: (configs: Record<string, { maxCols: number }> | ((prev: Record<string, { maxCols: number }>) => Record<string, { maxCols: number }>)) => void;
  setGroupsCols: (cols: number) => void;
}

export interface SyncSlice {
  isInitialSyncLoading: boolean;
  syncProgress: number;
  syncMessage: string;
  manualSaveMode: boolean;
  unsavedChangesCount: number;
  setSyncStatus: (loading: boolean, progress: number, message: string) => void;
  setManualSaveMode: (enabled: boolean) => void;
  incrementUnsavedChanges: () => void;
  resetUnsavedChanges: () => void;
}

export interface SystemSlice {
  automations: Automation[];
  macros: Macro[];
  voiceCommands: VoiceCommand[];
  wifiNetworks: WifiNetwork[];
  mqttConfig: MqttConfig | null;
  setAutomations: (automations: Automation[] | ((prev: Automation[]) => Automation[])) => void;
  setMacros: (macros: Macro[] | ((prev: Macro[]) => Macro[])) => void;
  setVoiceCommands: (voiceCommands: VoiceCommand[] | ((prev: VoiceCommand[]) => VoiceCommand[])) => void;
  setWifiNetworks: (networks: WifiNetwork[] | ((prev: WifiNetwork[]) => WifiNetwork[])) => void;
  setMqttConfig: (config: MqttConfig | null) => void;
}

export interface UiSlice {
  lowDataMode: boolean;
  toast: { message: string; type: "success" | "error" } | null;
  selectedGroupFilter: string | null;
  isPageVisible: boolean;
  isListening: boolean;
  voiceTranscript: string;
  activeSegmentId: string | null;
  activeGroupId: string | null;
  isLocal: boolean;
  localIp: string | null;
  setLowDataMode: (enabled: boolean) => void;
  showToast: (message: string, type: "success" | "error") => void;
  clearToast: () => void;
  setSelectedGroupFilter: (group: string | null) => void;
  setIsPageVisible: (visible: boolean) => void;
  setIsListening: (b: boolean) => void;
  setVoiceTranscript: (t: string) => void;
  setActiveSegmentId: (id: string | null) => void;
  setActiveGroupId: (id: string | null) => void;
  setIsLocal: (local: boolean) => void;
  setLocalIp: (ip: string | null) => void;
}

export interface MenuSlice {
  isMenuOpen: boolean;
  isModulesMenuOpen: boolean;
  isEspDrawerOpen: boolean;
  isAutomationsMenuOpen: boolean;
  activeSettingsTab: string;
  setIsMenuOpen: (o: boolean) => void;
  setIsModulesMenuOpen: (o: boolean) => void;
  setIsEspDrawerOpen: (o: boolean) => void;
  setIsAutomationsMenuOpen: (o: boolean) => void;
  setActiveSettingsTab: (t: string) => void;
}

export interface AestheticSlice {
  isDark: boolean;
  setIsDark: (d: boolean) => void;
  accent3: string;
  setAccent3: (a: string) => void;
  accent4: string;
  setAccent4: (a: string) => void;
  selectedFont: string;
  setSelectedFont: (f: string) => void;
  animationsEnabled: boolean;
  setAnimationsEnabled: (e: boolean) => void;
  animationsFps: number;
  setAnimationsFps: (f: number) => void;
  headerAnimationType: "fade" | "chase";
  setHeaderAnimationType: (t: "fade" | "chase") => void;
  headerTitle: string;
  setHeaderTitle: (t: string) => void;
  matrixDensity: number;
  setMatrixDensity: (d: number) => void;
  matrixSize: number;
  setMatrixSize: (s: number) => void;
  matrixHoverSize: number;
  setMatrixHoverSize: (s: number) => void;
  matrixOpacity: number;
  setMatrixOpacity: (o: number) => void;
  matrixColor: string;
  setMatrixColor: (c: string) => void;
  matrixMoving: boolean;
  setMatrixMoving: (m: boolean) => void;
  matrixMouseEffect: boolean;
  setMatrixMouseEffect: (m: boolean) => void;
  matrixTwinkleEffect: boolean;
  setMatrixTwinkleEffect: (t: boolean) => void;
  matrixTwinkleSpeed: number;
  setMatrixTwinkleSpeed: (s: number) => void;
  headerPosition: "top" | "left";
  setHeaderPosition: (p: "top" | "left") => void;
  dashboardBgColor: string;
  setDashboardBgColor: (c: string) => void;
  dashboardBgOpacity: number;
  setDashboardBgOpacity: (o: number) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (c: boolean) => void;
  dashboardWidth: 1 | 2 | 3 | 4 | 5;
  setDashboardWidth: (w: 1 | 2 | 3 | 4 | 5) => void;
  isGroupsCompactLayout: boolean;
  setIsGroupsCompactLayout: (c: boolean) => void;
  isSegmentsCompactLayout: boolean;
  setIsSegmentsCompactLayout: (c: boolean) => void;
}

export interface ConfigSlice {
  applyEspConfig: (config: EspConfig) => void;
}

export type IoTStoreState = SegmentsSlice & GroupsSlice & SyncSlice & SystemSlice & UiSlice & MenuSlice & AestheticSlice & ConfigSlice;
