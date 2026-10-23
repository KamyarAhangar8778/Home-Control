let localWs: WebSocket | null = null;
type StateCallback = (pin: string, state: boolean) => void;
const stateCallbacks = new Set<StateCallback>();

export const getLocalWs = () => localWs;
export const setLocalWs = (ws: WebSocket | null) => { localWs = ws; };

export const onLocalStateUpdate = (callback: StateCallback) => {
  stateCallbacks.add(callback);
  return () => { stateCallbacks.delete(callback); };
};

export const dispatchLocalState = (pin: string, state: boolean) => {
  for (const callback of stateCallbacks) callback(pin, state);
};
