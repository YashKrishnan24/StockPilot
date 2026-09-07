"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function ProcurementPage() {
  const queryClient = useQueryClient();

  const { data: pos, isLoading } = useQuery({
    queryKey: ["pos"],
    queryFn: async () => {
      const res = await api.get("/purchase-orders");
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
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Purchase Orders</h2>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">PO ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {pos?.map((po) => (
              <tr key={po.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                  {po.id.slice(0, 8)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">${po.total_amount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                    po.status === 'RECEIVED' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
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
                    >
                      <Download className="mr-2 h-4 w-4" /> Receive Items
                    </Button>
                  )}
                </td>
              </tr>
            ))}
            {pos?.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-slate-500 text-sm">No purchase orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
