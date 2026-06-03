"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaLinkedinIn } from "react-icons/fa";
import { getFooterData } from "@/lib/services/footerService";

export default function Footer() {
  const [footerData, setFooterData] = useState({
    general: null,
    contact: null,
    social: null,
    legal: null,
    footer: null,
    categories: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getFooterData();
      if (result.success) {
        setFooterData(result.data);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <footer className="w-full">
        <div className="bg-gradient-to-b from-slate-900 to-blue-950">
          <div className="container mx-auto px-4 py-12 text-center">
            <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        </div>
      </footer>
    );
  }

  const { general, contact, social, legal, categories } = footerData;

  return (
    <footer className="w-full">
      {/* Main Footer Section */}
      <div className="bg-gradient-to-b border-t border-slate-600 dark:border-gray-700  from-slate-900 to-blue-950 text-gray-300">
        <div className="container mx-auto px-4 py-12 md:py-16">
          
          {/* Desktop: 5 columns */}
          <div className="hidden lg:grid lg:grid-cols-5 gap-8">
            {/* Column 1 - Logo, Description & Social */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Link href="/">
                  <Image
                    src={general?.siteLogo || '/logo.webp'}
                    alt="Great Post News Logo"
                    width={50}
                    height={50}
                    className="object-contain w-12"
                    priority
                  />
                </Link>
                <h2 className="text-white font-semibold text-2xl">Great Post News</h2>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Your trusted source for breaking news, in-depth analysis, and engaging stories from around the world.
              </p>
              <div className="flex gap-3">
                {social?.facebook && <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900 border border-gray-200  flex items-center justify-center hover:bg-red-500"><FaFacebookF className="w-3.5 h-3.5 text-gray-400 hover:text-white" /></a>}
                {social?.twitter && <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900 border border-gray-200  flex items-center justify-center hover:bg-red-500"><FaTwitter className="w-3.5 h-3.5 text-gray-400 hover:text-white" /></a>}
                {social?.instagram && <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900 border border-gray-200  flex items-center justify-center hover:bg-red-500"><FaInstagram className="w-3.5 h-3.5 text-gray-400 hover:text-white" /></a>}
                {social?.youtube && <a href={social.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900 border border-gray-200  flex items-center justify-center hover:bg-red-500"><FaYoutube className="w-3.5 h-3.5 text-gray-400 hover:text-white" /></a>}
                {social?.linkedin && <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900 border border-gray-200  flex items-center justify-center hover:bg-red-500"><FaLinkedinIn className="w-3.5 h-3.5 text-gray-400 hover:text-white" /></a>}
              </div>
            </div>

            {/* Column 2 - Quick Links */}
            <div>
              <h4 className="text-white font-semibold text-base mb-4 pb-1 border-b border-red-500 inline-block">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-red-500 text-base">Home</Link></li>
                <li><Link href="/live-tv" className="text-gray-400 hover:text-red-500 text-base">Live TV</Link></li>
                <li><Link href="/blogs" className="text-gray-400 hover:text-red-500 text-base">Blogs</Link></li>
                <li><Link href="/aboutus" className="text-gray-400 hover:text-red-500 text-base">About Us</Link></li>
              </ul>
            </div>

            {/* Column 3 - Categories */}
            <div>
              <h4 className="text-white font-semibold text-base mb-4 pb-1 border-b border-red-500 inline-block">Categories</h4>
              <ul className="space-y-2">
                {categories.slice(0, 6).map((category) => (
                  <li key={category.id}>
                    <Link href={`/category/${category.slug}`} className="text-gray-400 hover:text-red-500 text-base">
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 - Support */}
            <div>
              <h4 className="text-white font-semibold text-base mb-4 pb-1 border-b border-red-500 inline-block">Support</h4>
              <ul className="space-y-2">
                <li><Link href="/contact-us" className="text-gray-400 hover:text-red-500 text-base">Contact Us</Link></li>
                <li><Link href='/privacy-policy'className="text-gray-400 hover:text-red-500 text-base">Privacy Policy</Link></li>
                <li><Link href='/terms' className="text-gray-400 hover:text-red-500 text-base">Terms of Use</Link></li>
                <li><Link href= '/cookie-policy'className="text-gray-400 hover:text-red-500 text-base">Cookie Policy</Link></li>
                <li><Link href="/advertise" className="text-gray-400 hover:text-red-500 text-base">Advertise With Us</Link></li>
              </ul>
            </div>

            {/* Column 5 - Quick Contact */}
            <div className="min-w-0">
              <h4 className="text-white font-semibold text-base mb-4 pb-1 border-b border-red-500 inline-block">Quick Contact</h4>
              <div className="space-y-2">
                {contact?.contactEmail && (
                  <a href={`mailto:${contact.contactEmail}`} className="flex items-start gap-2 text-gray-400 hover:text-red-500 text-base min-w-0">
                    <Mail className="w-4 h-4 text-red-500 flex-shrink-0 mt-1" />
                    <span className="min-w-0 break-all">{contact.contactEmail}</span>
                  </a>
                )}
                {contact?.phone1 && (
                  <a href={`tel:${contact.phone1.replace(/\s/g, '')}`} className="flex items-center gap-2 text-gray-400 hover:text-red-500 text-base">
                    <Phone className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span className="min-w-0 break-words">{contact.phone1}</span>
                  </a>
                )}
                {contact?.phone2 && (
                  <a href={`tel:${contact.phone2.replace(/\s/g, '')}`} className="flex items-center gap-2 text-gray-400 hover:text-red-500 text-base">
                    <Phone className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span className="min-w-0 break-words">{contact.phone2}</span>
                  </a>
                )}

                {contact?.address && (
                  <div className="flex items-start gap-3 text-gray-400 text-sm min-w-0">
                    <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="min-w-0 leading-relaxed break-words">{contact.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile/Tablet: 2 columns layout */}
          <div className="lg:hidden">
            {/* Row 1 - Column 1 */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Link href="/">
                  <Image
                    src={general?.siteLogo || '/logo.webp'}
                    alt="Great Post News Logo"
                    width={45}
                    height={45}
                    className="object-contain w-11"
                    priority
                  />
                </Link>
                <h2 className="text-white font-semibold text-2xl">Great Post News</h2>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Your trusted source for breaking news, in-depth analysis, and engaging stories from around the world.
              </p>
              <div className="flex gap-3">
                {social?.facebook && <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-500"><FaFacebookF className="w-3.5 h-3.5 text-gray-400 hover:text-white" /></a>}
                {social?.twitter && <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-500"><FaTwitter className="w-3.5 h-3.5 text-gray-400 hover:text-white" /></a>}
                {social?.instagram && <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-500"><FaInstagram className="w-3.5 h-3.5 text-gray-400 hover:text-white" /></a>}
                {social?.youtube && <a href={social.youtube} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-500"><FaYoutube className="w-3.5 h-3.5 text-gray-400 hover:text-white" /></a>}
                {social?.linkedin && <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-500"><FaLinkedinIn className="w-3.5 h-3.5 text-gray-400 hover:text-white" /></a>}
              </div>
            </div>

            {/* Row 2 - Column 2 and Column 3 in one row (2 columns) */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <h4 className="text-white font-semibold text-base mb-4 pb-1 border-b border-red-500 inline-block">Quick Links</h4>
                <ul className="space-y-2">
                  <li><Link href="/" className="text-gray-400 hover:text-red-500 text-base">Home</Link></li>
                  <li><Link href="/live-tv" className="text-gray-400 hover:text-red-500 text-base">Live TV</Link></li>
                  <li><Link href="/blogs" className="text-gray-400 hover:text-red-500 text-base">Blogs</Link></li>
                  <li><Link href="/aboutus" className="text-gray-400 hover:text-red-500 text-base">About Us</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold text-base mb-4 pb-1 border-b border-red-500 inline-block">Categories</h4>
                <ul className="space-y-2">
                  {categories.slice(0, 6).map((category) => (
                    <li key={category.id}>
                      <Link href={`/category/${category.slug}`} className="text-gray-400 hover:text-red-500 text-base">
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Row 3 - Column 4 and Column 5 in one row (2 columns) */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-semibold text-base mb-4 pb-1 border-b border-red-500 inline-block">Support</h4>
                <ul className="space-y-2">
                  <li><Link href="/contact-us" className="text-gray-400 hover:text-red-500 text-base">Contact Us</Link></li>
                  <li><Link href= '/privacy-policy' className="text-gray-400 hover:text-red-500 text-base">Privacy Policy</Link></li>
                  <li><Link href= '/terms' className="text-gray-400 hover:text-red-500 text-base">Terms of Use</Link></li>
                  <li><Link href= '/cookie-policy' className="text-gray-400 hover:text-red-500 text-base">Cookie Policy</Link></li>
                  <li><Link href="/advertise" className="text-gray-400 hover:text-red-500 text-base">Advertise With Us</Link></li>
                </ul>
              </div>
              <div className="min-w-0">
                <h4 className="text-white font-semibold text-base mb-4 pb-1 border-b border-red-500 inline-block">Quick Contact</h4>
                <div className="space-y-2">
                  {contact?.contactEmail && (
                    <a href={`mailto:${contact.contactEmail}`} className="flex items-start gap-2 text-gray-400 hover:text-red-500 text-base min-w-0">
                      <Mail className="w-4 h-4 text-red-500 flex-shrink-0 mt-1" />
                      <span className="min-w-0 break-all">{contact.contactEmail}</span>
                    </a>
                  )}
                  {contact?.phone1 && (
                    <a href={`tel:${contact.phone1.replace(/\s/g, '')}`} className="flex items-center gap-2 text-gray-400 hover:text-red-500 text-base">
                      <Phone className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="min-w-0 break-words">{contact.phone1}</span>
                    </a>
                  )}
                  {contact?.phone2 && (
                    <a href={`tel:${contact.phone2.replace(/\s/g, '')}`} className="flex items-center gap-2 text-gray-400 hover:text-red-500 text-base">
                      <Phone className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="min-w-0 break-words">{contact.phone2}</span>
                    </a>
                  )}
                  {contact?.address && (
                    <div className="flex items-start gap-3 text-gray-400 text-sm min-w-0">
                      <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <span className="min-w-0 leading-relaxed break-words">{contact.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="bg-slate-950 text-gray-400">
        <div className="container mx-auto px-4 py-5">
          <div className="text-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Great Post News. All rights reserved
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Designed by{' '}
              <a
                href="https://alltimedata.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-500 hover:text-red-400"
              >
                ALL TIME DATA
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
