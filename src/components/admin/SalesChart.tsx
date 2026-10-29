"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface SalesChartProps {
  data: Array<{
    name: string
    sales: number
  }>
}

export function SalesChart({ data }: SalesChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E7DED4" />
        <XAxis 
          dataKey="name" 
          stroke="#756E68"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          stroke="#756E68"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `Rs.${value}`}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E7DED4",
            borderRadius: "8px",
            color: "#292522"
          }}
          formatter={(value) => [`Rs.${value}`, "Sales"]}
        />
        <Line 
          type="monotone" 
          dataKey="sales" 
          stroke="#7A4E2D" 
          strokeWidth={2}
          dot={{ fill: "#7A4E2D", r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}