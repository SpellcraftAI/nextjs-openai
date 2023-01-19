export const SUBSCRIPTION_LOCK = false;

export const isProduction = () => process.env.NODE_ENV === "production";

/**
 * The URL this site is running on.
 */
export const DOMAIN =
  isProduction()
    ? "upg.ai"
    : "localhost:3000";

export const DOMAIN_URL =
  DOMAIN === "localhost:3000"
    ? `http://${DOMAIN}`
    : `https://${DOMAIN}`;

//