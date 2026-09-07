"use client";

import { useQuery } from "@tanstack/react-query";
import { Package, AlertCircle, ShoppingCart, Clock, ArrowUpRight, ArrowDownRight, Plus, Activity, TrendingUp } from "lucide-react";
import { api } from "@/lib/api";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const res = await api.get("/analytics/dashboard");
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="flex justify-between items-end">
          <div>
            <div className="h-4 w-24 bg-slate-200 rounded mb-2"></div>
            <div className="h-8 w-48 bg-slate-200 rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl border border-slate-100"></div>
          ))}
        </div>
        <div className="h-64 bg-slate-200 rounded-2xl border border-slate-100"></div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header section with quick actions */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <motion.div variants={itemVariants}>
          <h2 className="text-sm font-medium text-slate-500 mb-1">Overview</h2>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex gap-3">
          <Link href="/dashboard/inventory">
            <Button variant="outline" className="gap-2 bg-white hover:bg-slate-50 text-slate-700 shadow-sm transition-all hover:shadow-md">
              <Plus className="w-4 h-4" /> Add Product
            </Button>
          </Link>
          <Link href="/dashboard/orders">
            <Button className="gap-2 shadow-sm transition-all hover:shadow-md bg-blue-600 hover:bg-blue-700">
              <ShoppingCart className="w-4 h-4" /> New Order
            </Button>
          </Link>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Stat Cards */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 rounded-full bg-blue-50 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Products</p>
              <h3 className="text-3xl font-bold text-slate-900">{stats?.total_products || 0}</h3>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
              <Package className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600 font-medium relative z-10">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>Active catalog</span>
          </div>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 rounded-full bg-red-50 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Low Stock Alerts</p>
              <h3 className="text-3xl font-bold text-slate-900">{stats?.low_stock_alerts || 0}</h3>
            </div>
            <div className="p-3 rounded-xl bg-red-50 text-red-600 shadow-sm group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
              <AlertCircle className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-slate-500 relative z-10">
            <span className={stats?.low_stock_alerts > 0 ? "text-red-600 font-medium" : ""}>
              {stats?.low_stock_alerts > 0 ? "Needs attention" : "All good"}
            </span>
          </div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 rounded-full bg-amber-50 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Pending Orders</p>
              <h3 className="text-3xl font-bold text-slate-900">{stats?.pending_orders || 0}</h3>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600 shadow-sm group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
              <ShoppingCart className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-amber-600 font-medium relative z-10">
            <Activity className="w-4 h-4 mr-1" />
            <span>Awaiting fulfillment</span>
          </div>
        </motion.div>
      </div>

      {/* Main Content Area: Recent Movements */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-slate-400" />
            <h3 className="text-base font-semibold text-slate-900 tracking-tight">Recent Activity</h3>
          </div>
          <Link href="/dashboard/inventory" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
            View all
          </Link>
        </div>
        
        <div className="divide-y divide-slate-100">
          {(!stats?.recent_movements || stats.recent_movements.length === 0) ? (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Activity className="h-8 w-8 text-slate-300" />
              </div>
              <p className="text-sm font-medium text-slate-900 mb-1">No recent activity</p>
              <p className="text-xs text-slate-500">When inventory moves, it will show up here.</p>
            </div>
          ) : (
            stats.recent_movements.map((movement, index) => (
              <motion.div 
                key={movement.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-default"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    movement.type === 'IN' ? 'bg-green-100 text-green-600' :
                    movement.type === 'OUT' ? 'bg-red-100 text-red-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {movement.type === 'IN' ? <ArrowDownRight className="w-5 h-5" /> : 
                     movement.type === 'OUT' ? <ArrowUpRight className="w-5 h-5" /> : 
                     <Activity className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">{movement.product_name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{new Date(movement.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                    movement.type === 'IN' ? 'bg-green-50 text-green-700 border border-green-200' :
                    movement.type === 'OUT' ? 'bg-red-50 text-red-700 border border-red-200' :
                    'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {movement.type === 'IN' ? '+' : movement.type === 'OUT' ? '-' : ''}
                    {Math.abs(movement.quantity)} units
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
