import React from 'react';
import { VoiceCommandButtonProps } from './types';
import { useVoiceCommandHandler } from './useVoiceCommandHandler';
import VerticalVoiceButton from './VerticalVoiceButton';
import HorizontalVoiceButton from './HorizontalVoiceButton';

export default function VoiceCommandButton(props: VoiceCommandButtonProps) {
  const handler = useVoiceCommandHandler();

  if (props.variant === "vertical" && !props.isSidebarCollapsed) {
    return <VerticalVoiceButton {...props} {...handler} />;
  }

  return <HorizontalVoiceButton {...props} {...handler} />;
}
