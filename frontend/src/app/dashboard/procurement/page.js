"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Download, Plus, Truck } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function ProcurementPage() {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPO, setNewPO] = useState({ supplier_id: "supp_123", expected_date: "", product_id: "", quantity: 1 });

  const { data: pos, isLoading: loadingPOs } = useQuery({
    queryKey: ["pos"],
    queryFn: async () => {
      const res = await api.get("/purchase-orders");
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

  const receiveMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.post(`/purchase-orders/${id}/receive`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pos"]);
      queryClient.invalidateQueries(["dashboardStats"]);
      queryClient.invalidateQueries(["products"]);
    },
    onError: (err) => {
      alert(err.response?.data?.detail || "Failed to receive PO.");
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const product = products.find(p => p.id === data.product_id);
      const payload = {
        supplier_id: data.supplier_id,
        expected_date: data.expected_date ? new Date(data.expected_date).toISOString() : new Date().toISOString(),
        items: [
          {
            product_id: data.product_id,
            quantity: data.quantity,
            cost_price: product.cost_price || 0
          }
        ]
      };
      const res = await api.post("/purchase-orders", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pos"]);
      setShowAddForm(false);
      setNewPO({ supplier_id: "supp_123", expected_date: "", product_id: "", quantity: 1 });
    }
  });

  if (loadingPOs) return <div className="animate-pulse space-y-4"><div className="h-10 bg-slate-200 rounded w-full"></div><div className="h-64 bg-slate-200 rounded w-full"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Purchase Orders</h2>
        <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700 shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> New PO
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
                <Truck className="w-5 h-5 text-blue-600" /> Create Purchase Order
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">Expected Delivery Date</label>
                  <input type="date" className="w-full border p-2 rounded-lg text-sm" value={newPO.expected_date} onChange={e => setNewPO({...newPO, expected_date: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">Product to Restock *</label>
                  <select 
                    className="w-full border p-2 rounded-lg text-sm bg-white" 
                    value={newPO.product_id} 
                    onChange={e => setNewPO({...newPO, product_id: e.target.value})}
                  >
                    <option value="" disabled>Select a product</option>
                    {products?.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (Current stock: {p.current_stock})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">Quantity *</label>
                  <input type="number" min="1" className="w-full border p-2 rounded-lg text-sm" value={newPO.quantity} onChange={e => setNewPO({...newPO, quantity: parseInt(e.target.value) || 1})} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                <Button 
                  onClick={() => createMutation.mutate(newPO)} 
                  disabled={!newPO.product_id || newPO.quantity <= 0 || createMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {createMutation.isPending ? "Creating..." : "Create PO"}
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
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">PO ID</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Expected Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Value</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {pos?.map((po, idx) => (
              <motion.tr 
                key={po.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 font-mono">
                  #{po.id.slice(0, 8)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                  {new Date(po.expected_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">${po.total_amount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold leading-5 ${
                    po.status === 'RECEIVED' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {po.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {po.status !== 'RECEIVED' && (
                    <Button 
                      size="sm" 
                      onClick={() => receiveMutation.mutate(po.id)}
                      disabled={receiveMutation.isPending}
                      variant="outline"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                    >
                      <Download className="mr-2 h-4 w-4" /> Receive Items
                    </Button>
                  )}
                </td>
              </motion.tr>
            ))}
            {pos?.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 mb-3">
                    <Truck className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-slate-500 text-sm">No purchase orders found. Restock your inventory here!</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
