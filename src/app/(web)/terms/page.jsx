import TermsPage from '@/components/Terms'
import React from 'react'

export const metadata = {
  title: "Terms of Service – GPN News | Usage Terms & Rules",
  description: "Read GPN News's terms of service to understand the rules, rights, and responsibilities that apply when you use our website, app, and live TV streaming.",
  alternates: {
    canonical: "https://www.greatpostnews.com/terms",
  },
  robots: "noindex, follow",
};

function page() {
  return (
    <div>
      <TermsPage/>
    </div>
  )
}

export default page
