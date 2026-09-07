"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Box, ShoppingCart, Truck, CheckCircle2, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-900 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-[10px] leading-none">S</span>
            </div>
            <span className="font-semibold text-lg tracking-tight">StockPilot</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              Log in
            </Link>
            <Link href="/register">
              <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-5 h-9 text-sm font-medium transition-all">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full pt-16">
        
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-white to-white -z-10"></div>
          
          <motion.div 
            className="max-w-4xl mx-auto text-center relative z-10"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUpVariant} className="mb-6 flex justify-center">
              <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-600 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                The new standard for inventory
              </span>
            </motion.div>
            
            <motion.h1 variants={fadeUpVariant} className="text-6xl md:text-8xl font-bold tracking-tighter text-slate-900 leading-[1.05] mb-8">
              Inventory that <br className="hidden md:block" />
              <span className="text-slate-400">actually works.</span>
            </motion.h1>
            
            <motion.p variants={fadeUpVariant} className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              A meticulously designed workspace to track stock, manage orders, and coordinate suppliers without the clutter of traditional software.
            </motion.p>
            
            <motion.div variants={fadeUpVariant} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-8 h-12 text-base font-medium transition-all w-full sm:w-auto group">
                  Start your workspace <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="rounded-full px-8 h-12 text-base font-medium border-slate-200 text-slate-600 hover:bg-slate-50 w-full sm:w-auto">
                  View demo
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating Minimalist Cards (Background Elements) */}
          <motion.div 
            initial={{ opacity: 0, y: 50, rotate: -5 }}
            animate={{ opacity: 1, y: 0, rotate: -2 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="absolute left-[10%] top-[25%] hidden lg:block bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-2xl p-4 w-48"
          >
            <div className="flex gap-3 mb-3">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center"><Box className="w-4 h-4 text-slate-600" /></div>
              <div>
                <p className="text-[10px] font-medium text-slate-400">Wireless Mouse</p>
                <p className="text-xs font-bold text-slate-900">128 In Stock</p>
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1"><div className="bg-green-500 h-1 rounded-full w-[80%]"></div></div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50, rotate: 5 }}
            animate={{ opacity: 1, y: 0, rotate: 3 }}
            transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
            className="absolute right-[10%] top-[45%] hidden lg:block bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-2xl p-4 w-52"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-slate-900">New Order</p>
              <span className="text-[9px] font-medium text-slate-400">Just now</span>
            </div>
            <p className="text-[10px] text-slate-500 mb-3">Order #10482 • $855.00</p>
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-md w-fit">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div> Pending Fulfillment
            </div>
          </motion.div>
        </section>

        {/* Minimalist Feature Section */}
        <section className="py-32 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="text-center mb-24"
            >
              <motion.h2 variants={fadeUpVariant} className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
                Everything you need. Nothing you don't.
              </motion.h2>
              <motion.p variants={fadeUpVariant} className="text-lg text-slate-500 font-light">
                Built for speed, clarity, and precision.
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-12 lg:gap-20">
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeUpVariant}
                className="group"
              >
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-slate-900 transition-colors duration-300">
                  <Box className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Inventory Intelligence</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Real-time stock tracking with intelligent low-stock alerts. Know exactly what you have and what you need, instantly.
                </p>
              </motion.div>

              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeUpVariant}
                transition={{ delay: 0.2 }}
                className="group"
              >
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-slate-900 transition-colors duration-300">
                  <ShoppingCart className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Order Operations</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Process sales orders seamlessly. Fulfilling an order automatically updates your entire inventory ledger without manual entry.
                </p>
              </motion.div>

              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeUpVariant}
                transition={{ delay: 0.4 }}
                className="group"
              >
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-slate-900 transition-colors duration-300">
                  <Truck className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Procurement</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Manage suppliers and generate purchase orders in one click. Receive items to automatically restock your shelves.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Clean Interactive List Section */}
        <section className="py-32 px-6 bg-slate-50 border-y border-slate-100">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUpVariant}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-4">A unified operational view</h2>
              <p className="text-lg text-slate-500 font-light">Eliminate spreadsheets. Prevent stockouts. Move faster.</p>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="space-y-4"
            >
              {[
                { title: "Centralized Ledger", desc: "Every movement is tracked. No more guessing where inventory went." },
                { title: "Multi-tenant Architecture", desc: "Complete data isolation for your organization and your team." },
                { title: "Actionable Insights", desc: "Dashboard metrics that tell you exactly what requires your attention today." },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  variants={fadeUpVariant}
                  className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-slate-300 transition-colors cursor-default shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-slate-900" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6 bg-white text-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariant}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">Ready for clarity?</h2>
            <p className="text-xl text-slate-500 font-light mb-10">Join modern businesses using StockPilot to run their operations.</p>
            
            <Link href="/register">
              <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-8 h-14 text-lg font-medium transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-slate-900/10">
                Create your workspace
              </Button>
            </Link>
          </motion.div>
        </section>

      </main>

      {/* Minimal Footer */}
      <footer className="py-12 border-t border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-slate-900 rounded flex items-center justify-center">
              <span className="text-white font-bold text-[9px] leading-none">S</span>
            </div>
            <span className="font-semibold text-sm tracking-tight">StockPilot</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-slate-500 font-medium">
            <Link href="#" className="hover:text-slate-900 transition-colors">Documentation</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">Privacy</Link>
          </div>
          
          <p className="text-xs text-slate-400">© 2024 StockPilot. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
