'use client';

import { useEffect, useState } from 'react';
import { io, type Socket } from 'socket.io-client';

const rootUrl = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1').replace(
  '/api/v1',
  '',
);

export function useWebSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) return;

    const instance = io(rootUrl, { auth: { token } });
    setSocket(instance);
    return () => {
      instance.disconnect();
    };
  }, []);

  return socket;
}

export function useOrderStatus(orderId: string, onUpdate: (payload: unknown) => void) {
  const socket = useWebSocket();

  useEffect(() => {
    if (!socket || !orderId) return;
    socket.emit('subscribe:order', orderId);
    socket.on('order:status', onUpdate);
    return () => {
      socket.off('order:status', onUpdate);
    };
  }, [socket, orderId, onUpdate]);
}

export function useUserOrderUpdates(onUpdate: (payload: unknown) => void) {
  const socket = useWebSocket();

  useEffect(() => {
    if (!socket) return;
    socket.on('order:status', onUpdate);
    return () => {
      socket.off('order:status', onUpdate);
    };
  }, [socket, onUpdate]);
}
