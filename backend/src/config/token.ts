const refreshTokenExpiresAt = 7 * 24 * 60 * 60 * 1000; // 7 days
const accessTokenCookieExpiresAt = 520 * 60 * 1000; // 2hr //TODO change to 15 min, integrate interseptions which will call refresh-token router

export { refreshTokenExpiresAt, accessTokenCookieExpiresAt };
