import AdvertisePage from '@/components/Advertise'
import React from 'react'

export const metadata = {
  title: "Advertise on GPN News – Reach India's News Audience",
  description: "Promote your brand on GPN News, India's first online news channel. Reach engaged readers across live TV, breaking news, politics, and India coverage.",
  alternates: {
    canonical: "https://www.greatpostnews.com/advertise",
  },
};

function page() {
  return (
    <div>
      <AdvertisePage/>
    </div>
  )
}

export default page
