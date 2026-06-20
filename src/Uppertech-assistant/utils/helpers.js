export const getWIBTime = () => {
  const now = new Date();
  const wib = new Date(now.getTime() + 7*60*60*1000);
  return wib.toISOString().replace('T', ' ').slice(0, 19);
};
export const randomItem = arr => arr[Math.floor(Math.random() * arr.length)];