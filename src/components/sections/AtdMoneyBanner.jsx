"use client";

import Image from "next/image";
import { Shield, Clock, DollarSign, ArrowRight, CheckCircle } from "lucide-react";

export default function AtdMoneyBanner() {
  return (
    <section className="py-6 bg-ghee dark:bg-slate-900/50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ATD Money Banner - Emerald Theme */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-800 shadow-xl">
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -mr-36 -mt-36"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
          <div className="absolute top-1/2 right-20 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl"></div>
          
          {/* Pattern Dots */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "20px 20px"
          }}></div>

          <div className="relative z-10 p-5 md:p-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
              
              {/* Left Side - Logo & Info */}
              <div className="flex items-center gap-4 md:gap-5">
                {/* Logo */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 shadow-lg">
                  <Image
                    src="/atdlogo.png"
                    alt="ATD Money"
                    width={50}
                    height={50}
                    className="w-12 h-12 md:w-14 md:h-14 object-contain"
                  />
                </div>
                
                {/* Text Content */}
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white">
                    ATD Money
                  </h3>
                  <p className="text-emerald-100 text-sm md:text-base">
                    Instant Payday Loan • Quick Approval • Low Interest
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
                      <span className="text-emerald-100 text-xs">No Hidden Charges</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-emerald-300" />
                      <span className="text-emerald-100 text-xs">100% Secure</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-300" />
                      <span className="text-emerald-100 text-xs">24/7 Support</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Middle - Loan Amount Range */}
              <div className="text-center">
                <div className="flex items-center gap-2 text-white">
                  <DollarSign className="w-5 h-5" />
                  <span className="text-2xl md:text-3xl font-bold">₹3,000</span>
                  <span className="text-xl">-</span>
                  <span className="text-2xl md:text-3xl font-bold">₹50,000</span>
                </div>
                <p className="text-emerald-100 text-xs mt-1">Instant Disbursal</p>
              </div>
              
              {/* Right Side - CTA Button */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-2.5 bg-white text-emerald-700 hover:bg-gray-100 rounded-xl font-bold transition-all duration-300 group shadow-lg"
              >
                <span>Apply Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
            
            {/* Trust Badges Row */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-4 pt-3 border-t border-white/10">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full"></div>
                <span className="text-emerald-100 text-xs">Minimal Documentation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full"></div>
                <span className="text-emerald-100 text-xs">Flexible Repayment</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full"></div>
                <span className="text-emerald-100 text-xs">No Prepayment Fee</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full"></div>
                <span className="text-emerald-100 text-xs">PAN Card Required</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}