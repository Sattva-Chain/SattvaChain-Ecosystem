export const generateProductId = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
  const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4-digit number
  return `P${randomLetter}${randomNumber}`; // e.g., "PA1234"
};
