export const getCurrentPosition = () =>
  new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true })
  );

export const watchPosition = (callback) =>
  navigator.geolocation.watchPosition(callback, console.error, { enableHighAccuracy: true });

export const clearWatch = (id) => navigator.geolocation.clearWatch(id);

export const toLeafletCoords = ([lng, lat]) => [lat, lng];
