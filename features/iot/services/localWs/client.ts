let localWs: WebSocket | null = null;
export const getLocalWs = () => localWs;

export const setLocalWs = (ws: WebSocket | null) => {
  localWs = ws;
};
