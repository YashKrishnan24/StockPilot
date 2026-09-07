"use client";

import { useQuery } from "@tanstack/react-query";
import { Package, AlertCircle, ShoppingCart, Clock } from "lucide-react";
import { api } from "@/lib/api";

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const res = await api.get("/analytics/dashboard");
      return res.data;
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Stat Cards */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-md bg-blue-50 text-blue-600">
              <Package className="h-6 w-6" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-slate-500">Total Products</p>
              <p className="text-2xl font-semibold text-slate-900">{stats?.total_products}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-md bg-red-50 text-red-600">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-slate-500">Low Stock Alerts</p>
              <p className="text-2xl font-semibold text-slate-900">{stats?.low_stock_alerts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-md bg-amber-50 text-amber-600">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-slate-500">Pending Orders</p>
              <p className="text-2xl font-semibold text-slate-900">{stats?.pending_orders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Movements */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-base font-semibold leading-6 text-slate-900">Recent Movements</h3>
          <Clock className="h-5 w-5 text-slate-400" />
        </div>
        <div className="divide-y divide-slate-100">
          {stats?.recent_movements?.length === 0 && (
            <div className="p-6 text-center text-sm text-slate-500">No recent movements.</div>
          )}
          {stats?.recent_movements?.map((movement) => (
            <div key={movement.id} className="p-6 flex items-center justify-between hover:bg-slate-50">
              <div>
                <p className="text-sm font-medium text-slate-900">{movement.product_name}</p>
                <p className="text-xs text-slate-500">{new Date(movement.date).toLocaleString()}</p>
              </div>
              <div>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  movement.type === 'IN' ? 'bg-green-100 text-green-800' :
                  movement.type === 'OUT' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {movement.type} {movement.quantity > 0 ? `+${movement.quantity}` : movement.quantity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
