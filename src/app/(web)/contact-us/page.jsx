import ContactPage from '@/components/ContactUs'
import React from 'react'

export const metadata = {
  title: "Contact Us GPN News – Get in Touch With Our Team",
  description: "Contact GPN News for tips, feedback, advertising inquiries, or general questions. Get in touch with India's first online news channel today.",
  alternates: {
    canonical: "https://www.greatpostnews.com/contact-us",
  },
};

function page() {
  return (
    <div>
      <ContactPage/>
    </div>
  )
}

export default page
