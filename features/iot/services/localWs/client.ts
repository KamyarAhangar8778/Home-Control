let localWs: WebSocket | null = null;
type StateCallback = (pin: string, state: boolean) => void;
const stateCallbacks = new Set<StateCallback>();

export const getLocalWs = () => localWs;

export const setLocalWs = (ws: WebSocket | null) => {
  localWs = ws;
};

export const onLocalStateUpdate = (cb: StateCallback) => {
  stateCallbacks.add(cb);
  return () => {
    stateCallbacks.delete(cb);
  };
};

export const dispatchLocalState = (pin: string, state: boolean) => {
  stateCallbacks.forEach((cb) => cb(pin, state));
};
