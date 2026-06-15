import { useLocationContext } from '../context/LocationContext';

export const useLocationTracker = () => {
  const { location, error, tracking, startTracking, stopTracking, socket } = useLocationContext();

  return { location, error, tracking, startTracking, stopTracking, socket };
};
