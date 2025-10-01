export const LoginUsers = {
  sales: {
    email: process.env.E2E_SALES_EMAIL!,
    password: process.env.E2E_SALES_PASSWORD!,
    otpSecret: process.env.E2E_SALES_OTP_SECRET!,
  },
  admin: {
    email: process.env.E2E_ADMIN_EMAIL!,
    password: process.env.E2E_ADMIN_PASSWORD!,
    otpSecret: process.env.E2E_ADMIN_OTP_SECRET!,
  },
  manager: {
    email: process.env.E2E_MANAGER_EMAIL!,
    password: process.env.E2E_MANAGER_PASSWORD!,
    otpSecret: process.env.E2E_MANAGER_OTP_SECRET!,
  },
};
