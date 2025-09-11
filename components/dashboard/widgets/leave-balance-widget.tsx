// "use client"

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

// interface LeaveBalance {
//   name: string
//   balance: string
// }

// interface LeaveBalanceWidgetProps {
//   leaveBalances: LeaveBalance[]
// }

// export function LeaveBalanceWidget({ leaveBalances }: LeaveBalanceWidgetProps) {
//   const chartData = leaveBalances.map(lb => ({
//       name: lb.name,
//       days: parseFloat(lb.balance)
//   }));
  
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Leave Balances</CardTitle>
//         <CardDescription>Your available leave days by type.</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ResponsiveContainer width="100%" height={200}>
//             <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
//                 <XAxis type="number" hide />
//                 <YAxis type="category" dataKey="name" width={100} tickLine={false} axisLine={false} />
//                 <Tooltip cursor={{ fill: 'transparent' }}/>
//                 <Bar dataKey="days" fill="#8884d8" radius={[0, 4, 4, 0]} background={{ fill: '#eee', radius: 4 }} />
//             </BarChart>
//         </ResponsiveContainer>
//       </CardContent>
//     </Card>
//   )
// }

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface LeaveBalance {
  name: string
  balance: string
}

interface LeaveBalanceWidgetProps {
  leaveBalances: LeaveBalance[]
}

export function LeaveBalanceWidget({ leaveBalances }: LeaveBalanceWidgetProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave Balances</CardTitle>
        <CardDescription>Your available leave days by type.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leaveBalances.map((lb) => (
            <div 
              key={lb.name} 
              className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
            >
              <span className="font-medium">{lb.name}</span>
              <span className="text-lg font-semibold ">{lb.balance} Days</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
