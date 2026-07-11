import AboutPage from '@/components/AboutUs'
import React from 'react'

export const metadata = {
  title: "About Us – Great Post News | Our Story & Mission",
  description: "Discover the story behind GPN News — built to bring India live TV, breaking news, and honest political coverage with a strong focus on India and beyond.",
  alternates: {
    canonical: "https://www.greatpostnews.com/aboutus",
  },
};

function page() {
  return (
    <div>
      <AboutPage/>
    </div>
  )
}

export default page
