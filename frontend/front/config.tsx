const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;

const API_URL = "http://localhost:3000";
const ACCESS_TOKEN_EXPIRES_IN = hour - 10 * minute;

export { API_URL, ACCESS_TOKEN_EXPIRES_IN };
