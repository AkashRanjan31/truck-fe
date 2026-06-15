export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = Math.PI / 180;
  const R = 6371; // Earth's radius in km

  const dLat = (lat2 - lat1) * toRad;
  const dLon = (lon2 - lon1) * toRad;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * toRad) * Math.cos(lat2 * toRad) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

export const isNearby = (lat1, lon1, lat2, lon2, radiusKm = 5) => {
  return calculateDistance(lat1, lon1, lat2, lon2) <= radiusKm;
};

export const getCoordinatesBounds = (points) => {
  if (!points || points.length === 0) return null;

  let minLat = points[0].latitude;
  let maxLat = points[0].latitude;
  let minLon = points[0].longitude;
  let maxLon = points[0].longitude;

  points.forEach(point => {
    minLat = Math.min(minLat, point.latitude);
    maxLat = Math.max(maxLat, point.latitude);
    minLon = Math.min(minLon, point.longitude);
    maxLon = Math.max(maxLon, point.longitude);
  });

  return {
    southwest: [minLat, minLon],
    northeast: [maxLat, maxLon]
  };
};
