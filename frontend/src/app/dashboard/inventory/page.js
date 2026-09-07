"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function InventoryPage() {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", sku: "", min_stock_level: 0, current_stock: 0, unit_price: 0 });

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
      setShowAddForm(false);
      setNewProduct({ name: "", sku: "", min_stock_level: 0, current_stock: 0, unit_price: 0 });
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
          />
        </div>
        <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-medium">Add New Product</h3>
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Name" className="border p-2 rounded" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
            <input placeholder="SKU" className="border p-2 rounded" value={newProduct.sku} onChange={e => setNewProduct({...newProduct, sku: e.target.value})} />
            <input type="number" placeholder="Min Stock Level" className="border p-2 rounded" value={newProduct.min_stock_level} onChange={e => setNewProduct({...newProduct, min_stock_level: parseInt(e.target.value)})} />
            <input type="number" placeholder="Unit Price" className="border p-2 rounded" value={newProduct.unit_price} onChange={e => setNewProduct({...newProduct, unit_price: parseFloat(e.target.value)})} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
            <Button onClick={() => createMutation.mutate(newProduct)}>Save</Button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {products?.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">{product.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{product.sku}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{product.current_stock}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.current_stock <= product.min_stock_level ? (
                    <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold leading-5 text-red-800">Low Stock</span>
                  ) : (
                    <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">In Stock</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-right">${product.unit_price.toFixed(2)}</td>
              </tr>
            ))}
            {products?.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-slate-500 text-sm">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
