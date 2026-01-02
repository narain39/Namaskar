import { useEffect, useCallback, useState } from 'react';

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  const requestPermission = useCallback(async () => {
    if (typeof Notification === 'undefined') {
      console.warn('Notifications not supported');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, []);

  const sendNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (typeof Notification === 'undefined' || permission !== 'granted') {
        return null;
      }

      // Don't show notification if window is focused
      if (document.hasFocus()) {
        return null;
      }

      try {
        const notification = new Notification(title, {
          icon: '/pwa-192x192.png',
          badge: '/pwa-192x192.png',
          ...options,
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        return notification;
      } catch (error) {
        console.error('Error sending notification:', error);
        return null;
      }
    },
    [permission]
  );

  // Request permission on mount if not determined
  useEffect(() => {
    if (permission === 'default') {
      requestPermission();
    }
  }, [permission, requestPermission]);

  return {
    permission,
    requestPermission,
    sendNotification,
    isSupported: typeof Notification !== 'undefined',
    isGranted: permission === 'granted',
  };
}
