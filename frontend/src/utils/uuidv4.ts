/* eslint-disable no-bitwise */

// ----------------------------------------------------------------------

export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function generateOrderNumber() {
  // Get current timestamp
  const timestamp = Date.now();
  
  // Generate a random number between 1000 and 9999
  const randomNumber = Math.floor(1000 + Math.random() * 9000);

  // Combine timestamp and random number to form order number
  return `${timestamp}${randomNumber}`;
}


