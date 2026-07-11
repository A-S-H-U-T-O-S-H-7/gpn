import CookiePolicyPage from '@/components/Cookie-policy';
import React from 'react'

export const metadata = {
  title: "Cookie Policy – GPN News | How We Use Cookies",
  description: "Learn how GPN News uses cookies to improve your browsing experience, personalize content, and deliver relevant ads across our website and app.",
  alternates: {
    canonical: "https://www.greatpostnews.com/cookie-policy",
  },
  robots: "noindex, follow",
};

function page() {
  return (
    <div>
      <CookiePolicyPage/>
    </div>
  )
}

export default page
