export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/; // Indian phone format
  return phoneRegex.test(phone?.replace(/\D/g, ''));
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateCoordinates = (lat, lng) => {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
};

export const validateFormData = (formData, rules) => {
  const errors = {};

  Object.keys(rules).forEach(field => {
    const rules_array = rules[field] || [];
    const value = formData[field];

    rules_array.forEach(rule => {
      if (rule === 'required' && (!value || value.toString().trim() === '')) {
        errors[field] = `${field} is required`;
      }
      if (rule === 'email' && value && !validateEmail(value)) {
        errors[field] = 'Invalid email format';
      }
      if (rule === 'phone' && value && !validatePhone(value)) {
        errors[field] = 'Invalid phone number';
      }
      if (rule === 'min:6' && value && value.length < 6) {
        errors[field] = 'Must be at least 6 characters';
      }
    });
  });

  return errors;
};
