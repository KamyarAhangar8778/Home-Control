"use client";

import { usePinOperations } from "./achaemenidState/usePinOperations";
import { useSegmentManagement } from "./achaemenidState/useSegmentManagement";
import { useSegmentUpdates } from "./achaemenidState/useSegmentUpdates";
import { useCloudflareQuery } from "./achaemenidState/useCloudflareQuery";
import { useCloudflareInit } from "./achaemenidState/useCloudflareInit";
import { useCloudflarePush } from "./achaemenidState/useCloudflarePush";
import { useAchaemenidDnd } from "./achaemenidState/useAchaemenidDnd";
import { useApplyEspConfig } from "./achaemenidState/useApplyEspConfig";
import { useIoTStore } from "./useIoTStore";
import { useConnectionStrategy } from "./achaemenidState/useConnectionStrategy";

export function useAchaemenidState() {
  const setIsModulesMenuOpen = useIoTStore(s => s.setIsModulesMenuOpen);
  
  useConnectionStrategy();

  const { mounted, refetchIot } = useCloudflareQuery();
  const { handleApplyEspConfig } = useApplyEspConfig();

  const {
    isFullyReady,
    setIsFullyReady,
    handleBypassSync,
    workerUrl,
    setWorkerUrl,
    handleRetrySync,
  } = useCloudflareInit({
    mounted,
    handleApplyEspConfig,
  });

  const { triggerCloudflarePush } = useCloudflarePush(isFullyReady);

  const { isLoadingIoT, updatePinOnServer, handleTogglePin, handleSetPinState, handleBatchPinState } = usePinOperations({
    refetchIot,
  });

  const {
    targetPlaceholderId,
    handleAddSegment,
    handleAddPlaceholder,
    handleSetupPlaceholder,
    handleGroupColsChange,
    handleRemoveSegment,
    handleRemoveGroup,
  } = useSegmentManagement({
    setIsModulesMenuOpen,
    updatePinOnServer,
  });

  const {
    handleUpdateSegmentMode,
    handleUpdateSegmentRule,
    handleUpdateSegmentAutoOff,
  } = useSegmentUpdates();

  const dnd = useAchaemenidDnd({
    handleRemoveGroup,
    handleRemoveSegment,
  });

  return {
    isLoadingIoT,
    mounted,
    refetchIot,
    isFullyReady,
    setIsFullyReady,
    ...dnd,
    targetPlaceholderId,
    handleApplyEspConfig,
    handleAddSegment,
    handleAddPlaceholder,
    handleSetupPlaceholder,
    handleGroupColsChange,
    handleRemoveSegment,
    handleUpdateSegmentMode,
    handleUpdateSegmentRule,
    handleUpdateSegmentAutoOff,
    handleRemoveGroup,
    handleTogglePin,
    handleSetPinState,
    handleBatchPinState,
    handleBypassSync,
    workerUrl,
    setWorkerUrl,
    handleRetrySync,
    triggerCloudflarePush,
  };
}
