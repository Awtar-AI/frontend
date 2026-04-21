"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { name: "Jan", total: 10 },
  { name: "Feb", total: 25 },
  { name: "Mar", total: 45 },
  { name: "Apr", total: 60 },
  { name: "May", total: 85 },
  { name: "Jun", total: 110 },
  { name: "Jul", total: 142 },
];

export function OrgAreaChart() {
  return (
    <div className="h-[300px] w-full rounded-2xl border border-gray-200 bg-white p-6 lg:col-span-2 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900">Platform Growth</h3>
        <p className="text-sm font-medium text-gray-500">Total organizations registered over time</p>
      </div>
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              stroke="#94a3b8" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              dy={10}
              fontWeight="bold"
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value) => String(value)} 
              fontWeight="bold"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "#fff", 
                borderColor: "#e2e8f0",
                borderRadius: "12px",
                color: "#0f172a",
                fontWeight: "bold",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
              }}
              itemStyle={{ color: "#2563eb", fontWeight: "bold" }}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#2563eb"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorTotal)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
