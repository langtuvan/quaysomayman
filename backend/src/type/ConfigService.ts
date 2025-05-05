export interface ConfigServiceModel {
  FRONTEND_URL: string;
  BACKEND_URl: string;
  PORT: number;
  FRONTEND_DISPLAY_NAME: string;
  JWT_SECRET: string;
  SECRET_KEY: string;
  // GOOGLE AUTH
  GOOGLE_AUTH_CLIENT_ID: string;
  GOOGLE_AUTH_CLIENT_SECRET: string;
  GOOGLE_AUTH_CALLBACK_URL: string;
  // FACEBOOK AUTH
  FACEBOOK_AUTH_CLIENT_ID: string;
  FACEBOOK_AUTH_CLIENT_SECRET: string;
  FACEBOOK_AUTH_CALLBACK_URL: string;

  // SSO CONFIG
  REDIRECT_SSO_LOGIN_SUCCESS: string;
  SSO_DEFAULT_PASSWORD: string;
  CONFIG: {
    PLAN: {
      MAX_FORTUNE: number;
    };
  };
}
