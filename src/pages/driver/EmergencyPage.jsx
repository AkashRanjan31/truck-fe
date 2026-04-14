import { useState, useEffect } from 'react';
import SOSButton from '../../components/emergency/SOSButton';
import SafetyTips from '../../components/emergency/SafetyTips';
import EmergencyInfoCard from '../../components/emergency/EmergencyInfoCard';
import { getProfile } from '../../services/userService';

const EmergencyPage = () => {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    getProfile().then(({ data }) => setProfileData(data.data)).catch(() => {});
  }, []);

  return (
    <div className="p-4 max-w-lg mx-auto space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <span>🆘</span> Emergency Help
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Press the button to alert the admin and all drivers within{' '}
          <span className="text-orange-400 font-semibold">5km</span> of your location.
        </p>
      </div>

      {/* SOS Button card */}
      <div className="card flex flex-col items-center py-10">
        <SOSButton
          driverName={profileData?.user?.name}
          truckId={profileData?.truck?.truckId}
          phone={profileData?.user?.phone}
        />
      </div>

      {/* Info card */}
      <EmergencyInfoCard
        user={profileData?.user}
        driver={profileData?.driver}
        truck={profileData?.truck}
      />

      {/* Safety tips */}
      <SafetyTips />
    </div>
  );
};

export default EmergencyPage;
