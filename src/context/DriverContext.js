import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { registerDriver, loginDriver, setDriverId, updateLocation } from '../services/api';

const DriverContext = createContext();

export const DriverProvider = ({ children }) => {
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);

  const pushLocation = useCallback((driverId) => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        updateLocation(driverId, coords.latitude, coords.longitude).catch(() => {});
      },
      () => {}, // GPS unavailable — non-fatal, silently skip
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('driver');
      if (saved) {
        const parsed = JSON.parse(saved);
        setDriver(parsed);
        setDriverId(parsed._id);
        pushLocation(parsed._id);
      }
    } catch {
      localStorage.removeItem('driver');
    }
    setLoading(false);
  }, [pushLocation]);

  const register = async (name, phone, truckNumber) => {
    const { data } = await registerDriver({ name, phone, truckNumber });
    setDriver(data);
    setDriverId(data._id);
    localStorage.setItem('driver', JSON.stringify(data));
    pushLocation(data._id); // new registration → capture GPS immediately
    return data;
  };

  const login = async (phone) => {
    const { data } = await loginDriver(phone);
    setDriver(data);
    setDriverId(data._id);
    localStorage.setItem('driver', JSON.stringify(data));
    pushLocation(data._id); // login → refresh GPS immediately
    return data;
  };

  const logout = () => {
    setDriver(null);
    setDriverId(null);
    localStorage.removeItem('driver');
  };

  return (
    <DriverContext.Provider value={{ driver, loading, register, login, logout }}>
      {children}
    </DriverContext.Provider>
  );
};

export const useDriver = () => useContext(DriverContext);
