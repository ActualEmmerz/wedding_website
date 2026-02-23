import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || '';
let socket = null;

const getSocket = () => {
  if (!socket) socket = io(SOCKET_URL, { autoConnect: false, transports: ['websocket'] });
  return socket;
};

/**
 * Subscribe to live media_created events for an event room.
 * @param {string|null} eventId
 * @param {(item: object) => void} onItem
 */
export const useEventSocket = (eventId, onItem) => {
  const cbRef = useRef(onItem);
  cbRef.current = onItem;

  useEffect(() => {
    if (!eventId) return;
    const s = getSocket();
    s.connect();
    s.emit('join', eventId);

    const handler = (item) => cbRef.current?.(item);
    s.on('media_created', handler);

    return () => {
      s.off('media_created', handler);
      s.emit('leave', eventId);
      s.disconnect();
    };
  }, [eventId]);
};
