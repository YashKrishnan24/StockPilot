"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Plus, ShoppingCart } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function OrdersPage() {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newOrder, setNewOrder] = useState({ customer_name: "", product_id: "", quantity: 1 });

  const { data: orders, isLoading: loadingOrders } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await api.get("/orders");
      return res.data;
    }
  });

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/products");
      return res.data;
    }
  });

  const fulfillMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.post(`/orders/${id}/fulfill`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
      queryClient.invalidateQueries(["dashboardStats"]);
      queryClient.invalidateQueries(["products"]);
    },
    onError: (err) => {
      alert(err.response?.data?.detail || "Failed to fulfill order.");
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      // Find the selected product to pass unit_price
      const product = products.find(p => p.id === data.product_id);
      const payload = {
        customer_name: data.customer_name,
        items: [
          {
            product_id: data.product_id,
            quantity: data.quantity,
            unit_price: product.unit_price
          }
        ]
      };
      const res = await api.post("/orders", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
      queryClient.invalidateQueries(["dashboardStats"]);
      setShowAddForm(false);
      setNewOrder({ customer_name: "", product_id: "", quantity: 1 });
    }
  });

  if (loadingOrders) return <div className="animate-pulse space-y-4"><div className="h-10 bg-slate-200 rounded w-full"></div><div className="h-64 bg-slate-200 rounded w-full"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Sales Orders</h2>
        <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700 shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> New Order
        </Button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20, transition: { duration: 0.2 } }}
            className="overflow-hidden"
          >
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 mb-6">
              <h3 className="text-lg font-medium text-slate-900 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-600" /> Create New Order
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">Customer Name</label>
                  <input placeholder="e.g. Acme Corp" className="w-full border p-2 rounded-lg text-sm" value={newOrder.customer_name} onChange={e => setNewOrder({...newOrder, customer_name: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">Select Product *</label>
                  <select 
                    className="w-full border p-2 rounded-lg text-sm bg-white" 
                    value={newOrder.product_id} 
                    onChange={e => setNewOrder({...newOrder, product_id: e.target.value})}
                  >
                    <option value="" disabled>Select a product</option>
                    {products?.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (In stock: {p.current_stock})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">Quantity *</label>
                  <input type="number" min="1" className="w-full border p-2 rounded-lg text-sm" value={newOrder.quantity} onChange={e => setNewOrder({...newOrder, quantity: parseInt(e.target.value) || 1})} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                <Button 
                  onClick={() => createMutation.mutate(newOrder)} 
                  disabled={!newOrder.product_id || newOrder.quantity <= 0 || createMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {createMutation.isPending ? "Creating..." : "Create Order"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {orders?.map((order, idx) => (
              <motion.tr 
                key={order.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 font-mono">
                  #{order.id.slice(0, 8)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">{order.customer_name || 'Walk-in Customer'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">${order.total_amount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold leading-5 ${
                    order.status === 'FULFILLED' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {order.status === 'PENDING' && (
                    <Button 
                      size="sm" 
                      onClick={() => fulfillMutation.mutate(order.id)}
                      disabled={fulfillMutation.isPending}
                      className="bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" /> Fulfill & Ship
                    </Button>
                  )}
                </td>
              </motion.tr>
            ))}
            {orders?.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 mb-3">
                    <ShoppingCart className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-slate-500 text-sm">No sales orders yet. Create one to get started!</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
