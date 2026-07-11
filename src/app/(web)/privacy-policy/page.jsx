import PrivacyPolicyPage from '@/components/Privacy-policy'
import React from 'react'

export const metadata = {
  title: "GPN News Privacy Policy – Your Data, Explained",
  description: "Learn how Great Post News handles your personal information, cookies, and account data across our website, live TV streaming, and mobile app.",
  alternates: {
    canonical: "https://www.greatpostnews.com/privacy-policy",
  },
  robots: "noindex, follow",
};

function page() {
  return (
    <div>
      <PrivacyPolicyPage/>
    </div>
  )
}

export default page
