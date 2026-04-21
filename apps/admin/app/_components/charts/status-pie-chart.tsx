"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface StatusPieChartProps {
    active: number;
    pending: number;
    suspended: number;
}

export function StatusPieChart({ active, pending, suspended }: StatusPieChartProps) {
  const data = [
    { name: "Active", value: active, color: "#10b981" },
    { name: "Pending", value: pending, color: "#f59e0b" },
    { name: "Suspended", value: suspended, color: "#ef4444" },
  ];

  return (
    <div className="h-[300px] w-full rounded-2xl border border-gray-200 bg-white p-6 lg:col-span-1 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900">Status Breakdown</h3>
      </div>
      <div className="relative h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={"cell-" + index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "#fff", 
                borderColor: "#e2e8f0",
                borderRadius: "12px",
                color: "#0f172a",
                fontWeight: "bold",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-black text-gray-900">{active + pending + suspended}</span>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">Total Orgs</span>
        </div>
      </div>
    </div>
  );
}
