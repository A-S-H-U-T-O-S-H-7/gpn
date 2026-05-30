"use client";

import {
  FileText, Users, Scale, AlertTriangle, Ban,
  Copyright, Gavel, RefreshCw, Mail, Globe, CheckCircle,
  ArrowLeft,
} from "lucide-react";
import {motion} from "framer-motion";
import { useRouter } from "next/navigation";

const sections = [
  {
    icon: <FileText className="w-5 h-5" />,
    iconBg: "bg-teal-100 dark:bg-teal-900/40",
    iconColor: "text-teal-600 dark:text-teal-400",
    title: "Acceptance of Terms",
    content: (
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        By accessing or using the Great Post News website, mobile application, or any related services
        ("GPN", "we", "our", "us"), you confirm that you are at least 13 years of age and agree to be
        legally bound by these Terms of Use and our{" "}
        <a href="/privacy-policy" className="text-teal-600 dark:text-teal-400 hover:underline font-medium">Privacy Policy</a>{" "}
        and{" "}
        <a href="/cookie-policy" className="text-teal-600 dark:text-teal-400 hover:underline font-medium">Cookie Policy</a>.
        If you do not agree with any part of these terms, you must discontinue use of our services immediately.
      </p>
    ),
  },
  {
    icon: <Users className="w-5 h-5" />,
    iconBg: "bg-violet-100 dark:bg-violet-900/40",
    iconColor: "text-violet-600 dark:text-violet-400",
    title: "User Accounts",
    content: (
      <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
        <p className="leading-relaxed">When you create an account with GPN, you agree to the following:</p>
        <ul className="space-y-1.5">
          {[
            "Provide accurate, current, and complete registration information",
            "Maintain the confidentiality of your password and account credentials",
            "Notify us immediately of any unauthorised use of your account",
            "Be solely responsible for all activity that occurs under your account",
            "Not share your account with others or create accounts for the purpose of abuse",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-teal-500 flex-shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
        <p className="leading-relaxed">
          We reserve the right to suspend or permanently terminate accounts that violate these Terms,
          engage in abusive behaviour, or are inactive for extended periods, with or without prior notice.
        </p>
      </div>
    ),
  },
  {
    icon: <Copyright className="w-5 h-5" />,
    iconBg: "bg-sky-100 dark:bg-sky-900/40",
    iconColor: "text-sky-600 dark:text-sky-400",
    title: "Intellectual Property & Content Usage",
    content: (
      <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <p>
          All content published on GPN — including but not limited to articles, photographs, videos,
          graphics, logos, and editorial copy — is the exclusive intellectual property of Great Post News
          or its licensed content providers and is protected under applicable Indian and international
          copyright laws.
        </p>
        <div>
          <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2">You may:</p>
          <ul className="space-y-1.5">
            {[
              "Read and access content for personal, non-commercial use",
              "Share links to our articles on social media or personal websites with proper attribution",
              "Quote brief excerpts (up to 50 words) with a clear credit and link back to the original article",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-teal-500 flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2">You may not:</p>
          <ul className="space-y-1.5">
            {[
              "Reproduce, republish, or distribute full articles without prior written consent",
              "Scrape or crawl our website for bulk content collection",
              "Use our content for AI model training, data mining, or commercial purposes without a licence",
              "Remove or alter any copyright, trademark, or proprietary notices",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-violet-500 flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p>
          For licensing or syndication enquiries, please contact{" "}
          <a href="mailto: info@greatpostnews.com" className="text-teal-600 dark:text-teal-400 hover:underline font-medium"> info@greatpostnews.com</a>.
        </p>
      </div>
    ),
  },
  {
    icon: <Ban className="w-5 h-5" />,
    iconBg: "bg-teal-100 dark:bg-teal-900/40",
    iconColor: "text-teal-600 dark:text-teal-400",
    title: "Prohibited Conduct",
    content: (
      <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
        <p className="leading-relaxed">You agree not to use GPN's services to:</p>
        <ul className="space-y-1.5">
          {[
            "Post, upload, or share content that is defamatory, obscene, hateful, or unlawful",
            "Harass, threaten, or intimidate other users or GPN staff",
            "Impersonate any person or entity, or misrepresent your affiliation",
            "Spread misinformation, fake news, or deliberately misleading content",
            "Introduce malware, viruses, or any code designed to disrupt our services",
            "Attempt to gain unauthorised access to our systems, databases, or user accounts",
            "Use automated bots or scripts to access, scrape, or interact with the platform",
            "Engage in any activity that violates applicable Indian or international law",
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
    icon: <FileText className="w-5 h-5" />,
    iconBg: "bg-violet-100 dark:bg-violet-900/40",
    iconColor: "text-violet-600 dark:text-violet-400",
    title: "User-Generated Content",
    content: (
      <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <p>
          If you submit comments, letters, or other user-generated content ("UGC") on GPN, you grant us a
          non-exclusive, royalty-free, worldwide licence to use, reproduce, publish, and display that content
          in connection with our services.
        </p>
        <p>
          You retain ownership of your UGC but are solely responsible for its accuracy and legality.
          GPN reserves the right to moderate, edit, or remove any UGC at its sole discretion without notice,
          particularly content that violates these Terms or our editorial standards.
        </p>
      </div>
    ),
  },
  {
    icon: <AlertTriangle className="w-5 h-5" />,
    iconBg: "bg-sky-100 dark:bg-sky-900/40",
    iconColor: "text-sky-600 dark:text-sky-400",
    title: "Disclaimers & Limitation of Liability",
    content: (
      <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <p>
          GPN's content is provided for informational and journalistic purposes only. While we strive
          for accuracy, we make no warranties — express or implied — regarding the completeness,
          accuracy, reliability, or timeliness of any content.
        </p>
        <p>
          GPN shall not be liable for any direct, indirect, incidental, consequential, or punitive
          damages arising from your use of, or inability to use, our services. This includes damages
          resulting from errors in articles, service interruptions, or reliance on information published
          on our platform. Use of GPN is at your own risk.
        </p>
      </div>
    ),
  },
  {
    icon: <Globe className="w-5 h-5" />,
    iconBg: "bg-teal-100 dark:bg-teal-900/40",
    iconColor: "text-teal-600 dark:text-teal-400",
    title: "Third-Party Links",
    content: (
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        Our articles and pages may contain links to third-party websites for reference or further reading.
        These links are provided for convenience only. GPN does not endorse, control, or take responsibility
        for the content, privacy practices, or accuracy of any third-party websites. Accessing external
        links is entirely at your own risk.
      </p>
    ),
  },
  {
    icon: <Gavel className="w-5 h-5" />,
    iconBg: "bg-violet-100 dark:bg-violet-900/40",
    iconColor: "text-violet-600 dark:text-violet-400",
    title: "Governing Law & Dispute Resolution",
    content: (
      <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        <p>
          These Terms of Use are governed by and construed in accordance with the laws of India,
          without regard to conflict of law principles. Any disputes arising out of or in connection
          with these Terms shall be subject to the exclusive jurisdiction of the courts located in
          C-316 B&C, Sector 10, Noida. Uttar Pradesh 201301, India.
        </p>
        <p>
          We encourage users to resolve disputes informally first by contacting us at{" "}
          <a href="mailto: info@greatpostnews.com" className="text-teal-600 dark:text-teal-400 hover:underline font-medium"> info@greatpostnews.com</a>.
          We will make reasonable efforts to address your concern within 15 business days.
        </p>
      </div>
    ),
  },
  {
    icon: <RefreshCw className="w-5 h-5" />,
    iconBg: "bg-sky-100 dark:bg-sky-900/40",
    iconColor: "text-sky-600 dark:text-sky-400",
    title: "Changes to These Terms",
    content: (
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        We reserve the right to update or modify these Terms of Use at any time. Significant changes will be
        communicated via a notice on our website or by email. Continued use of GPN after changes are posted
        constitutes your acceptance of the revised Terms. We recommend reviewing this page periodically.
      </p>
    ),
  },
  {
    icon: <Mail className="w-5 h-5" />,
    iconBg: "bg-teal-100 dark:bg-teal-900/40",
    iconColor: "text-teal-600 dark:text-teal-400",
    title: "Contact Us",
    content: (
      <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
        <p>For questions about these Terms, please contact our Legal Team:</p>
        <div className="bg-gradient-to-br from-teal-50 to-violet-50 dark:from-teal-900/20 dark:to-violet-900/20 rounded-xl p-4 border border-teal-100 dark:border-teal-800/40 space-y-2">
          <p className="font-semibold text-slate-800 dark:text-slate-200">Great Post News — Legal Team</p>
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

export default function TermsPage() {
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
            <Scale className="w-8 h-8 text-teal-600 dark:text-teal-400" />
          </div>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-white/80 dark:bg-white/10 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 backdrop-blur-sm mb-4 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            Please read carefully
          </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-1 md:mb-3 leading-tight">
            Terms of{" "}
            <span className="bg-gradient-to-r from-teal-500 to-violet-500 bg-clip-text text-transparent">Use</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Last updated: <span className="font-medium text-slate-600 dark:text-slate-300">January 1, 2024</span>
          </p>
          <div className="w-12 h-1 rounded-full bg-gradient-to-r from-teal-400 to-violet-400 mx-auto mt-3 md:mt-5" />
        </div>

        {/* Quick nav chips */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {["Acceptance", "User Accounts", "IP & Content", "Prohibited Conduct", "Liability", "Governing Law"].map((label) => (
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