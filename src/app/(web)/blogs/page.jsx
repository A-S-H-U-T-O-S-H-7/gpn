import BlogsPage from '@/components/blogs/Blogs'
import React from 'react'

export const metadata = {
  title: "GPN Blogs – News Analysis, Opinion & In-Depth Stories",
  description: "Explore GPN's blog for in-depth analysis, opinion pieces, and behind-the-headlines stories on Indian politics, India news, sports, and current affairs.",
  keywords: "Blog, Blogs",
  alternates: {
    canonical: "https://www.greatpostnews.com/blogs",
  },
};

function page() {
  return (
    <div>
      <BlogsPage/>
    </div>
  )
}

export default page
