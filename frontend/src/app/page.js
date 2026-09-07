import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="px-6 lg:px-8 h-16 flex items-center justify-between border-b border-slate-200 bg-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="font-semibold text-lg tracking-tight">StockPilot</span>
        </div>
        <nav className="flex gap-4 sm:gap-6">
          <Link href="/login">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link href="/register">
            <Button>Get Started</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 px-4 md:px-6 flex flex-col items-center text-center">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-slate-900">
              Your inventory should work for you.
            </h1>
            <p className="mx-auto max-w-[700px] text-slate-500 md:text-xl leading-relaxed">
              Track stock, manage orders, coordinate suppliers, and understand your business from one intelligent workspace.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link href="/register">
              <Button size="lg" className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-700">
                Start managing inventory
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                Explore dashboard
              </Button>
            </Link>
          </div>
        </section>

        {/* Dashboard Preview Placeholder */}
        <section className="w-full max-w-6xl mx-auto px-4 md:px-6 mb-24">
          <div className="rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col h-[500px]">
            <div className="h-12 border-b border-slate-100 flex items-center px-4 gap-2 bg-slate-50">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="flex-1 p-8 flex flex-col gap-6 bg-slate-50/50">
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 rounded-lg bg-white border border-slate-200 shadow-sm"></div>
                ))}
              </div>
              <div className="flex-1 flex gap-6">
                <div className="flex-[2] rounded-lg bg-white border border-slate-200 shadow-sm"></div>
                <div className="flex-1 rounded-lg bg-white border border-slate-200 shadow-sm"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-16 md:py-24 bg-white border-t border-slate-200">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Everything you need to run operations</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              <div className="space-y-3 p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <div className="w-6 h-6 bg-blue-600 rounded-sm"></div>
                </div>
                <h3 className="text-xl font-bold">Inventory Intelligence</h3>
                <p className="text-slate-500">Know exactly what is in stock, what is moving, and what needs attention.</p>
              </div>
              <div className="space-y-3 p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center mb-4">
                  <div className="w-6 h-6 bg-emerald-600 rounded-sm"></div>
                </div>
                <h3 className="text-xl font-bold">Order Operations</h3>
                <p className="text-slate-500">Manage orders from creation through fulfillment seamlessly.</p>
              </div>
              <div className="space-y-3 p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center mb-4">
                  <div className="w-6 h-6 bg-amber-600 rounded-sm"></div>
                </div>
                <h3 className="text-xl font-bold">Procurement</h3>
                <p className="text-slate-500">Track suppliers and purchase orders in one unified workflow.</p>
              </div>
              <div className="space-y-3 p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                  <div className="w-6 h-6 bg-purple-600 rounded-sm"></div>
                </div>
                <h3 className="text-xl font-bold">Business Analytics</h3>
                <p className="text-slate-500">Understand revenue, sales, inventory value and product performance.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="w-full py-16 md:py-24 bg-slate-900 text-white">
          <div className="max-w-5xl mx-auto px-4 md:px-6 text-center space-y-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Transform how you work</h2>
            <div className="grid sm:grid-cols-3 gap-8">
              <div className="flex flex-col items-center space-y-4">
                <h3 className="text-2xl font-bold text-blue-400">Fewer stock surprises</h3>
                <p className="text-slate-400">Stop guessing what's in your warehouse.</p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <h3 className="text-2xl font-bold text-emerald-400">Less spreadsheet work</h3>
                <p className="text-slate-400">Automate your inventory tracking completely.</p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <h3 className="text-2xl font-bold text-amber-400">Faster operational decisions</h3>
                <p className="text-slate-400">Get the data you need to act instantly.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-6 flex items-center justify-center border-t border-slate-200 bg-white">
        <p className="text-sm text-slate-500">© {new Date().getFullYear()} StockPilot Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
