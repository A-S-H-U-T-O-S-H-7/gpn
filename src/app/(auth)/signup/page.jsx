import SignupPage from '@/components/auth/SignUp'
import React from 'react'

export const metadata = {
  title: "Join GPN News – Create Your Free Account Today",
  description: "Sign up free for GPN News to unlock personalized breaking news alerts, save your favorite stories, and stream live TV updates anytime, anywhere.",
  alternates: {
    canonical: "https://www.greatpostnews.com/signup",
  },
  robots: "noindex, follow",
};


function page() {
  return (
    <div>
      <SignupPage/>
    </div>
  )
}

export default page
