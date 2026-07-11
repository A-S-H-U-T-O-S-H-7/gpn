import ForgotPasswordPage from '@/components/auth/Forgot-Password'
import React from 'react'

export const metadata = {
  title: "Reset Password – GPN News Account Recovery",
  description: "Reset your GPN News password in just a few steps. Regain access to your account, saved articles, breaking news alerts, and live TV settings.",
  alternates: {
    canonical: "https://www.greatpostnews.com/forgot-password",
  },
  robots: "noindex, follow",
};

function page() {
  return (
    <div>
      <ForgotPasswordPage/>
    </div>
  )
}

export default page
