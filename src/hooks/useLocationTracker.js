import { useContext } from 'react';
import { LocationContext } from '../context/LocationContext';

const useLocationTracker = () => useContext(LocationContext);
export default useLocationTracker;
