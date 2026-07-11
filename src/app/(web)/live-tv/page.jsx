import LiveTVPage from '@/components/LiveTv'
import React from 'react'

export const metadata = {
  title: "Watch GPN News Live TV – 24x7 Breaking News Streaming",
  description: "Stream GPN News live TV free, 24x7. Watch breaking news, political debates, India coverage, sports & more as it happens — India's first online news channel.",
  alternates: {
    canonical: "https://www.greatpostnews.com/live-tv",
  },
};

function page() {
  return (
    <div>
      <LiveTVPage/>
    </div>
  )
}

export default page
