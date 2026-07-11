import LoginPage from '@/components/auth/Login'
import React from 'react'

export const metadata = {
  title: "GPN News Login – Access Your Account",
  description: "Sign in to GPN News to manage your saved stories, alerts, and live TV preferences. Quick, secure login to India's first online news channel.",
  alternates: {
    canonical: "https://www.greatpostnews.com/login",
  },
  robots: "noindex, follow",
};

function page() {
  return (
    <div>
      <LoginPage/>
    </div>
  )
}

export default page
