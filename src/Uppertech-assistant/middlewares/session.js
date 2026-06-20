const sessions = new Map();
export const getSession = (userId) => {
  if (!sessions.has(userId)) sessions.set(userId, { step: null, data: {} });
  return sessions.get(userId);
};
export const clearSession = (userId) => sessions.delete(userId);