export const userSessions = new Map();

export function getSession(userId) {
  if (!userSessions.has(userId)) {
    userSessions.set(userId, { step: null, data: {} });
  }
  return userSessions.get(userId);
}

export function clearSession(userId) {
  userSessions.delete(userId);
}

export function updateSession(userId, updates) {
  const session = getSession(userId);
  Object.assign(session, updates);
  return session;
}