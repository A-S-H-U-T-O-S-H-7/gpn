"use client";

import {
  Shield, Database, Eye, Share2, Lock,
  UserX, RefreshCw, Mail, Globe, CheckCircle,
  ArrowLeft,
} from "lucide-react";
import {motion} from "framer-motion";
import { useRouter } from "next/navigation";

const sections = [
  {
    icon: <Shield className="w-5 h-5" />,
    iconBg: "bg-teal-100 dark:bg-teal-900/40",
    iconColor: "text-teal-600 dark:text-teal-400",
    title: "Introduction",
    content: (
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        At Great Post News ("GPN", "we", "our", or "us"), we are committed to protecting your privacy and
        ensuring transparency in how we handle your personal data. This Privacy Policy explains how we
        collect, use, disclose, and safeguard your information when you visit{" "}
        <span className="font-medium text-teal-600 dark:text-teal-400">gpn.com</span>, subscribe to our
        newsletters, or otherwise interact with our digital news services. By using our services, you
        agree to the practices described in this policy.
      </p>
    ),
  },
  {
    icon: <Database className="w-5 h-5" />,
    iconBg: "bg-violet-100 dark:bg-violet-900/40",
    iconColor: "text-violet-600 dark:text-violet-400",
    title: "Information We Collect",
    content: (
      <div className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Information you provide directly:</p>
          <ul className="space-y-1.5">
            {[
              "Name, email address, and phone number when registering or contacting us",
              "Subscription preferences and newsletter choices",
              "Comments, feedback, or messages you submit on our platform",
              "Payment details for premium subscriptions (processed securely via third-party providers)",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                <CheckCircle className="w-3.5 h-3.5 text-teal-500 flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Information collected automatically:</p>
          <ul className="space-y-1.5">
            {[
              "IP address, browser type, operating system, and device identifiers",
              "Pages visited, articles read, time spent, and referral sources",
              "Clickstream data and in-platform search queries",
              "Approximate geolocation (country/city) for content personalisation",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                <CheckCircle className="w-3.5 h-3.5 text-teal-500 flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    ),
  },
  {
    icon: <Eye className="w-5 h-5" />,
    iconBg: "bg-sky-100 dark:bg-sky-900/40",
    iconColor: "text-sky-600 dark:text-sky-400",
    title: "How We Use Your Information",
    content: (
      <ul className="space-y-1.5">
        {[
          "Deliver, personalise, and improve our news content and services",
          "Process subscriptions and manage your account",
          "Send newsletters, breaking news alerts, and editorial updates (with your consent)",
          "Respond to your comments, inquiries, and support requests",
          "Analyse audience behaviour to improve editorial decisions and site performance",
          "Display contextually relevant advertising to support our free news service",
          "Comply with applicable legal obligations and enforce our Terms of Use",
          "Detect, investigate, and prevent fraudulent or abusive activity",
        ].map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
            <CheckCircle className="w-3.5 h-3.5 text-teal-500 flex-shrink-0 mt-0.5" />
            {item}
          </li>
        ))}
      </ul>
    ),
  },
  {
    icon: <Share2 className="w-5 h-5" />,
    iconBg: "bg-teal-100 dark:bg-teal-900/40",
    iconColor: "text-teal-600 dark:text-teal-400",
    title: "Sharing Your Information",
    content: (
      <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <p>
          We do <span className="font-semibold text-slate-700 dark:text-slate-300">not sell</span> your
          personal information to third parties. We may share your data only in the following limited circumstances:
        </p>
        <ul className="space-y-1.5">
          {[
            "Service providers who assist in operating our website, analytics, email delivery, and payment processing — under strict confidentiality agreements",
            "Advertising partners for targeted ad delivery — only in aggregated or pseudonymised form",
            "Legal authorities when required by law, court order, or to protect the rights and safety of our users",
            "Business transfers in the event of a merger, acquisition, or sale of assets (you will be notified in advance)",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-teal-500 flex-shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    icon: <Lock className="w-5 h-5" />,
    iconBg: "bg-violet-100 dark:bg-violet-900/40",
    iconColor: "text-violet-600 dark:text-violet-400",
    title: "Data Security & Retention",
    content: (
      <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <p>
          We implement industry-standard security measures including SSL/TLS encryption, access controls,
          and regular security audits to protect your personal data from unauthorised access, disclosure,
          or destruction. However, no internet transmission is completely secure.
        </p>
        <p>
          We retain personal data only as long as necessary to fulfil the purposes described in this policy,
          comply with legal obligations, resolve disputes, and enforce agreements. Account data is deleted
          within 30 days of a deletion request unless retention is required by law.
        </p>
      </div>
    ),
  },
  {
    icon: <UserX className="w-5 h-5" />,
    iconBg: "bg-sky-100 dark:bg-sky-900/40",
    iconColor: "text-sky-600 dark:text-sky-400",
    title: "Your Rights & Choices",
    content: (
      <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
        <p className="leading-relaxed">Depending on your location, you may have the following rights regarding your personal data:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {[
            { right: "Access", desc: "Request a copy of personal data we hold about you." },
            { right: "Correction", desc: "Request correction of inaccurate or incomplete data." },
            { right: "Deletion", desc: "Request deletion of your personal data (right to be forgotten)." },
            { right: "Portability", desc: "Receive your data in a machine-readable format." },
            { right: "Objection", desc: "Object to processing based on legitimate interests." },
            { right: "Withdraw Consent", desc: "Unsubscribe from newsletters or marketing at any time." },
          ].map((r) => (
            <div key={r.right} className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 border border-slate-100 dark:border-slate-700/50">
              <p className="font-semibold text-slate-800 dark:text-slate-200 text-xs mb-1">{r.right}</p>
              <p className="text-xs leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
        <p>To exercise any of these rights, email us at{" "}
          <a href="mailto: info@greatpostnews.com" className="text-teal-600 dark:text-teal-400 hover:underline font-medium"> info@greatpostnews.com</a>.
          We respond within 30 days.
        </p>
      </div>
    ),
  },
  {
    icon: <Shield className="w-5 h-5" />,
    iconBg: "bg-teal-100 dark:bg-teal-900/40",
    iconColor: "text-teal-600 dark:text-teal-400",
    title: "Children's Privacy",
    content: (
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        Our services are not directed at children under 13. We do not knowingly collect personal information
        from children. If you believe we have inadvertently collected such data, please contact us immediately
        at{" "}
        <a href="mailto: info@greatpostnews.com" className="text-teal-600 dark:text-teal-400 hover:underline font-medium"> info@greatpostnews.com</a>{" "}
        and we will promptly delete it.
      </p>
    ),
  },
  {
    icon: <RefreshCw className="w-5 h-5" />,
    iconBg: "bg-violet-100 dark:bg-violet-900/40",
    iconColor: "text-violet-600 dark:text-violet-400",
    title: "Changes to This Policy",
    content: (
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        We may update this Privacy Policy periodically. When we make material changes, we will notify you
        via a prominent notice on our website or by email. The "Last Updated" date at the top always reflects
        the most recent version.
      </p>
    ),
  },
  {
    icon: <Mail className="w-5 h-5" />,
    iconBg: "bg-sky-100 dark:bg-sky-900/40",
    iconColor: "text-sky-600 dark:text-sky-400",
    title: "Contact Us",
    content: (
      <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
        <p>For any questions or requests regarding this Privacy Policy, contact our Privacy Team:</p>
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

export default function PrivacyPolicyPage() {
        const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-violet-50 to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-4 pb-14 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="fixed top-0 right-0 w-96 h-96 bg-teal-300/20 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-80 h-80 bg-violet-300/20 dark:bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
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

        {/* Header */}
        <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 ">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-100 to-violet-100 dark:from-teal-900/50 dark:to-violet-900/50 mb-5 shadow-lg border border-white/80 dark:border-slate-700/50">
            <Shield className="w-8 h-8 text-teal-600 dark:text-teal-400" />
          </div>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-white/80 dark:bg-white/10 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 backdrop-blur-sm mb-4 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            Your data, protected
          </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-3 leading-tight">
            Privacy{" "}
            <span className="bg-gradient-to-r from-teal-500 to-violet-500 bg-clip-text text-transparent">Policy</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Last updated: <span className="font-medium text-slate-600 dark:text-slate-300">January 1, 2024</span>
          </p>
          <div className="w-12 h-1 rounded-full bg-gradient-to-r from-teal-400 to-violet-400 mx-auto mt-5" />
        </div>

        {/* Quick nav chips */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {["Data Collection", "How We Use It", "Your Rights", "Security", "Children", "Contact"].map((label) => (
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