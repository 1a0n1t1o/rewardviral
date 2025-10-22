declare namespace NodeJS {
  interface ProcessEnv {
    WHOP_API_KEY: string;
    WHOP_APP_ID: string;

    NEXT_PUBLIC_WHOP_APP_ID: string;
    NEXT_PUBLIC_WHOP_AGENT_USER_ID: string;
    NEXT_PUBLIC_WHOP_COMPANY_ID: string;

    NEXT_PUBLIC_PREMIUM_ACCESS_PASS_ID: string;
    NEXT_PUBLIC_PREMIUM_PLAN_ID: string;
  }
}
