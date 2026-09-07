"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Trash2, Edit2, Check, X, AlertTriangle } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function InventoryPage() {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", sku: "", min_stock_level: 0, current_stock: 0, unit_price: 0, cost_price: 0 });
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState(0);

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/products");
      return res.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/products", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      queryClient.invalidateQueries(["dashboardStats"]);
      setShowAddForm(false);
      setNewProduct({ name: "", sku: "", min_stock_level: 0, current_stock: 0, unit_price: 0, cost_price: 0 });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await api.put(`/products/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      queryClient.invalidateQueries(["dashboardStats"]);
      setEditingId(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/products/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      queryClient.invalidateQueries(["dashboardStats"]);
    },
    onError: (error) => {
      alert(error.response?.data?.detail || "Failed to delete product.");
    }
  });

  if (isLoading) return <div className="animate-pulse space-y-4"><div className="h-10 bg-slate-200 rounded w-full"></div><div className="h-64 bg-slate-200 rounded w-full"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm shadow-sm transition-all"
          />
        </div>
        <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700 shadow-sm transition-all hover:shadow-md">
          <Plus className="mr-2 h-4 w-4" /> Add Product
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
              <h3 className="text-lg font-medium text-slate-900">Add New Product</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">Product Name *</label>
                  <input placeholder="e.g. Wireless Mouse" className="w-full border p-2 rounded-lg text-sm" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">SKU *</label>
                  <input placeholder="e.g. WM-01" className="w-full border p-2 rounded-lg text-sm" value={newProduct.sku} onChange={e => setNewProduct({...newProduct, sku: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">Alert Threshold (Min Stock)</label>
                  <input type="number" className="w-full border p-2 rounded-lg text-sm" value={newProduct.min_stock_level === '' ? '' : newProduct.min_stock_level} onChange={e => setNewProduct({...newProduct, min_stock_level: e.target.value === '' ? '' : Number(e.target.value)})} />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">Selling Price ($)</label>
                  <input type="number" step="0.01" className="w-full border p-2 rounded-lg text-sm" value={newProduct.unit_price === '' ? '' : newProduct.unit_price} onChange={e => setNewProduct({...newProduct, unit_price: e.target.value === '' ? '' : Number(e.target.value)})} />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">Cost Price ($)</label>
                  <input type="number" step="0.01" className="w-full border p-2 rounded-lg text-sm" value={newProduct.cost_price === '' ? '' : newProduct.cost_price} onChange={e => setNewProduct({...newProduct, cost_price: e.target.value === '' ? '' : Number(e.target.value)})} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                <Button 
                  onClick={() => createMutation.mutate(newProduct)} 
                  disabled={!newProduct.name || !newProduct.sku || createMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {createMutation.isPending ? "Saving..." : "Save Product"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Low Alert Threshold</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {products?.map((product, idx) => (
                <motion.tr 
                  key={product.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-slate-900">{product.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">${product.unit_price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">{product.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{product.current_stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === product.id ? (
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          className="w-20 border border-slate-300 rounded p-1 text-sm focus:outline-none focus:border-blue-500" 
                          value={editValue === '' ? '' : editValue} 
                          onChange={(e) => setEditValue(e.target.value === '' ? '' : Number(e.target.value))}
                          autoFocus
                        />
                        <button onClick={() => updateMutation.mutate({ id: product.id, data: { min_stock_level: editValue } })} className="text-green-600 hover:bg-green-50 p-1 rounded">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditingId(null)} className="text-slate-400 hover:bg-slate-100 p-1 rounded">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 group/edit cursor-pointer" onClick={() => { setEditingId(product.id); setEditValue(product.min_stock_level); }}>
                        <span className="text-sm text-slate-600">{product.min_stock_level}</span>
                        <Edit2 className="w-3 h-3 text-slate-300 group-hover/edit:text-blue-500 transition-colors" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.current_stock <= product.min_stock_level ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
                        <AlertTriangle className="w-3 h-3" /> Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-green-50 border border-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">Healthy</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${product.name}?`)) {
                          deleteMutation.mutate(product.id);
                        }
                      }}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
              {products?.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 mb-3">
                      <Search className="w-6 h-6 text-slate-300" />
                    </div>
                    <p className="text-slate-500 text-sm">No products found. Start by adding one!</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
