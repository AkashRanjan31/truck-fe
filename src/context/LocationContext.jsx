import React, { createContext, useState, useContext, useEffect } from 'react';
import { SOCKET_URL } from '../utils/constants';
import io from 'socket.io-client';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    const socketConnection = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  const startTracking = () => {
    setTracking(true);

    if ('geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude, timestamp: new Date() });
          setError(null);

          // Emit location to server via socket
          if (socket) {
            socket.emit('update_location', {
              latitude,
              longitude,
              timestamp: new Date()
            });
          }
        },
        (err) => {
          setError(err.message);
          console.error('Geolocation error:', err);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000
        }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      setError('Geolocation not supported');
    }
  };

  const stopTracking = () => {
    setTracking(false);
  };

  return (
    <LocationContext.Provider value={{ location, error, tracking, startTracking, stopTracking, socket }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within LocationProvider');
  }
  return context;
};
