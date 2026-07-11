"use client";

import {
  Cookie, Info, Settings, Shield, Globe,
  BarChart, Eye, Bell, Mail, CheckCircle, RefreshCw,
  ArrowLeft,
} from "lucide-react";
import {motion} from "framer-motion";
import { useRouter } from "next/navigation";

export const metadata = {
  title: "Cookie Policy – GPN News | How We Use Cookies",
  description: "Learn how GPN News uses cookies to improve your browsing experience, personalize content, and deliver relevant ads across our website and app.",
  alternates: {
    canonical: "https://www.greatpostnews.com/cookie-policy",
  },
  robots: "noindex, follow",
};

const cookieTypes = [
  {
    name: "Strictly Necessary",
    color: "bg-teal-100 dark:bg-teal-900/40 border-teal-200 dark:border-teal-800/40",
    badge: "bg-teal-500",
    canDisable: false,
    desc: "These cookies are essential for the website to function and cannot be switched off. They are usually set in response to actions you take such as logging in, setting preferences, or filling in forms.",
    examples: ["Session management", "Login authentication", "Security tokens", "CSRF protection"],
  },
  {
    name: "Analytics & Performance",
    color: "bg-violet-100 dark:bg-violet-900/40 border-violet-200 dark:border-violet-800/40",
    badge: "bg-violet-500",
    canDisable: true,
    desc: "These cookies allow us to count visits and traffic sources so we can measure and improve our site performance. They help us understand which articles are most popular and how readers navigate the site.",
    examples: ["Google Analytics", "Page view tracking", "Session duration", "Bounce rate analysis"],
  },
  {
    name: "Personalisation",
    color: "bg-sky-100 dark:bg-sky-900/40 border-sky-200 dark:border-sky-800/40",
    badge: "bg-sky-500",
    canDisable: true,
    desc: "These cookies remember your preferences and reading history to deliver a more personalised experience. They may be used to recommend articles, remember your dark/light mode setting, or show content relevant to your region.",
    examples: ["Reading history", "Theme preference", "Region/language setting", "Bookmarked articles"],
  },
  {
    name: "Advertising & Targeting",
    color: "bg-teal-100 dark:bg-teal-900/40 border-teal-200 dark:border-teal-800/40",
    badge: "bg-teal-600",
    canDisable: true,
    desc: "These cookies are set by our advertising partners to build a profile of your interests and show you relevant ads across websites. GPN is a free news service supported by advertising revenue.",
    examples: ["Google AdSense", "Interest-based ads", "Ad frequency capping", "Conversion tracking"],
  },
];

const sections = [
  {
    icon: <Info className="w-5 h-5" />,
    iconBg: "bg-teal-100 dark:bg-teal-900/40",
    iconColor: "text-teal-600 dark:text-teal-400",
    title: "What Are Cookies?",
    content: (
      <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <p>
          Cookies are small text files that are placed on your device (computer, smartphone, or tablet)
          when you visit a website. They are widely used to make websites work efficiently, remember your
          preferences, and provide information to website owners about how their site is being used.
        </p>
        <p>
          Cookies are not harmful programs. They cannot access other files on your device or carry viruses.
          GPN uses cookies and similar technologies (such as web beacons, pixels, and local storage) to
          deliver a better, faster, and more personalised news experience.
        </p>
      </div>
    ),
  },
  {
    icon: <Cookie className="w-5 h-5" />,
    iconBg: "bg-violet-100 dark:bg-violet-900/40",
    iconColor: "text-violet-600 dark:text-violet-400",
    title: "Types of Cookies We Use",
    content: (
      <div className="space-y-4">
        {cookieTypes.map((type) => (
          <div key={type.name} className={`rounded-xl p-4 border ${type.color}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${type.badge}`} />
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{type.name}</p>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${type.canDisable ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"}`}>
                {type.canDisable ? "Optional" : "Required"}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">{type.desc}</p>
            <div className="flex flex-wrap gap-1.5">
              {type.examples.map((ex) => (
                <span key={ex} className="text-xs px-2 py-0.5 rounded-full bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                  {ex}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: <Bell className="w-5 h-5" />,
    iconBg: "bg-sky-100 dark:bg-sky-900/40",
    iconColor: "text-sky-600 dark:text-sky-400",
    title: "Cookie Duration",
    content: (
      <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
        <p className="leading-relaxed">Cookies can be categorised by how long they remain on your device:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50">
            <p className="font-semibold text-slate-800 dark:text-slate-200 text-xs mb-1.5">Session Cookies</p>
            <p className="text-xs leading-relaxed">
              Temporary cookies that exist only while your browser is open. They are automatically deleted
              when you close your browser tab or window. Used for login sessions and form data.
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50">
            <p className="font-semibold text-slate-800 dark:text-slate-200 text-xs mb-1.5">Persistent Cookies</p>
            <p className="text-xs leading-relaxed">
              Remain on your device for a set period (days to years) or until manually deleted.
              Used for remembering preferences, analytics, and personalisation across visits.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: <Globe className="w-5 h-5" />,
    iconBg: "bg-teal-100 dark:bg-teal-900/40",
    iconColor: "text-teal-600 dark:text-teal-400",
    title: "Third-Party Cookies",
    content: (
      <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <p>
          In addition to our own cookies, GPN works with trusted third-party services that may also set
          cookies on your device when you visit our site. These include:
        </p>
        <ul className="space-y-1.5">
          {[
            "Google Analytics — for audience measurement and behaviour analysis",
            "Google AdSense — for serving personalised and contextual advertisements",
            "Social media plugins (Facebook, Twitter/X, WhatsApp) — for share buttons and embeds",
            "YouTube — for embedded video players within articles",
            "Cloudflare — for security, performance, and bot protection",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-teal-500 flex-shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
        <p>
          These third parties have their own privacy and cookie policies. We recommend reviewing them directly.
          GPN does not control the cookies placed by third-party services.
        </p>
      </div>
    ),
  },
  {
    icon: <Settings className="w-5 h-5" />,
    iconBg: "bg-violet-100 dark:bg-violet-900/40",
    iconColor: "text-violet-600 dark:text-violet-400",
    title: "Managing & Controlling Cookies",
    content: (
      <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <p>
          You have several options to control how cookies are used. Please note that restricting certain
          cookies may affect the functionality and personalisation of our website:
        </p>
        <div>
          <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Browser Settings</p>
          <p className="mb-2">Most browsers allow you to view, delete, and block cookies through their settings. Here are direct links for popular browsers:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { name: "Chrome", url: "https://support.google.com/chrome/answer/95647" },
              { name: "Firefox", url: "https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" },
              { name: "Safari", url: "https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" },
              { name: "Edge", url: "https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge" },
            ].map((b) => (
              <a key={b.name} href={b.url} target="_blank" rel="noopener noreferrer"
                className="text-center text-xs font-medium px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors">
                {b.name}
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Opt Out of Advertising Cookies</p>
          <p>
            You can opt out of interest-based advertising through the{" "}
            <a href="https://www.networkadvertising.org/choices/" target="_blank" rel="noopener noreferrer" className="text-teal-600 dark:text-teal-400 hover:underline font-medium">NAI opt-out tool</a>
            {" "}or the{" "}
            <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-teal-600 dark:text-teal-400 hover:underline font-medium">DAA opt-out tool</a>.
            For Google specifically, you can manage ad personalisation at{" "}
            <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-teal-600 dark:text-teal-400 hover:underline font-medium">adssettings.google.com</a>.
          </p>
        </div>
      </div>
    ),
  },
  {
    icon: <Shield className="w-5 h-5" />,
    iconBg: "bg-sky-100 dark:bg-sky-900/40",
    iconColor: "text-sky-600 dark:text-sky-400",
    title: "Your Consent",
    content: (
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        When you first visit GPN, you will be presented with a cookie consent banner that allows you to
        accept or decline optional cookie categories. Strictly necessary cookies are always active as
        they are required for the site to function. You can withdraw or change your cookie consent at
        any time by clearing your browser cookies and revisiting our site to set new preferences.
      </p>
    ),
  },
  {
    icon: <RefreshCw className="w-5 h-5" />,
    iconBg: "bg-teal-100 dark:bg-teal-900/40",
    iconColor: "text-teal-600 dark:text-teal-400",
    title: "Updates to This Policy",
    content: (
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        We may update this Cookie Policy from time to time to reflect changes in technology, regulation,
        or our business practices. Any changes will be posted on this page with an updated "Last Updated"
        date. Significant changes may also be communicated through a notice on our website.
      </p>
    ),
  },
  {
    icon: <Mail className="w-5 h-5" />,
    iconBg: "bg-violet-100 dark:bg-violet-900/40",
    iconColor: "text-violet-600 dark:text-violet-400",
    title: "Contact Us",
    content: (
      <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
        <p>For questions about our use of cookies, please contact our Privacy Team:</p>
        <div className="bg-gradient-to-br from-teal-50 to-violet-50 dark:from-teal-900/20 dark:to-violet-900/20 rounded-xl p-4 border border-teal-100 dark:border-teal-800/40 space-y-2">
          <p className="font-semibold text-slate-800 dark:text-slate-200">Great Post News — Privacy Team</p>
          <p className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-teal-500" />
            <a href="mailto: info@greatpostnews.com" className="text-teal-600 dark:text-teal-400 hover:underline font-medium"> info@greatpostnews.com</a>
          </p>
          <p className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-teal-500" />
            C-316 B&C, Sector 10, Noida. Uttar Pradesh 201301, India
          </p>
        </div>
      </div>
    ),
  },
];

export default function CookiePolicyPage() {

    const router = useRouter();
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-violet-50 to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-4 pb-14 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="fixed top-0 right-0 w-96 h-96 bg-teal-300/20 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-80 h-80 bg-violet-300/20 dark:bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}

         {/* ── Back Button ── */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6 cursor-pointer"
                >
                  <button
                    onClick={() => router.back()}
                    className="group cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    <span className="text-sm font-medium">Back</span>
                  </button>
                </motion.div>

        <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 ">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-100 to-violet-100 dark:from-teal-900/50 dark:to-violet-900/50 mb-5 shadow-lg border border-white/80 dark:border-slate-700/50">
            <Cookie className="w-8 h-8 text-teal-600 dark:text-teal-400" />
          </div>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-white/80 dark:bg-white/10 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 backdrop-blur-sm mb-4 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            Transparency first
          </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-3 leading-tight">
            Cookie{" "}
            <span className="bg-gradient-to-r from-teal-500 to-violet-500 bg-clip-text text-transparent">Policy</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Last updated: <span className="font-medium text-slate-600 dark:text-slate-300">January 1, 2024</span>
          </p>
          <div className="w-12 h-1 rounded-full bg-gradient-to-r from-teal-400 to-violet-400 mx-auto mt-3 md:mt-5" />
        </div>

        {/* Quick nav chips */}
        <div className="flex flex-wrap gap-2 justify-center mb-6 md:mb-10">
          {["What Are Cookies", "Cookie Types", "Third-Party", "Manage Cookies", "Your Consent", "Contact"].map((label) => (
            <span key={label} className="px-3 py-1 text-xs font-medium rounded-full bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 backdrop-blur-sm">
              {label}
            </span>
          ))}
        </div>

        {/* Sections */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white dark:border-slate-700/60 rounded-2xl shadow-xl shadow-teal-100/30 dark:shadow-none overflow-hidden">
          {sections.map((section, index) => (
            <div key={section.title} className={`p-4 md:p-8 ${index !== sections.length - 1 ? "border-b border-slate-100 dark:border-slate-700/60" : ""}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${section.iconBg} ${section.iconColor}`}>
                  {section.icon}
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">{section.title}</h2>
              </div>
              {section.content}
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-8">
          © {new Date().getFullYear()} Great Post News. All rights reserved. Governed by the laws of India.
        </p>
      </div>
    </div>
  );
}