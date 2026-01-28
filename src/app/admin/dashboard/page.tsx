'use client';
import { useMemo } from 'react';
import Link from 'next/link';
import { collection, query, orderBy } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirestore } from '@/firebase/provider';
import type { Order } from '@/lib/types';
import { format, subDays } from 'date-fns';

import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Users,
} from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';


function OverviewChart({ data }: { data: { name: string; total: number }[] }) {
    return (
        <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
            <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            />
            <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `PKR ${value / 1000}k`}
            />
            <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
        </ResponsiveContainer>
    );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold font-headline">Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card><CardHeader><Skeleton className="h-5 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-32" /><Skeleton className="h-4 w-40 mt-2" /></CardContent></Card>
                <Card><CardHeader><Skeleton className="h-5 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-32" /><Skeleton className="h-4 w-40 mt-2" /></CardContent></Card>
                <Card><CardHeader><Skeleton className="h-5 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-32" /><Skeleton className="h-4 w-40 mt-2" /></CardContent></Card>
                <Card><CardHeader><Skeleton className="h-5 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-32" /><Skeleton className="h-4 w-40 mt-2" /></CardContent></Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader><CardTitle><Skeleton className="h-8 w-32" /></CardTitle></CardHeader>
                    <CardContent><Skeleton className="h-[350px] w-full" /></CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader><CardTitle><Skeleton className="h-8 w-48" /></CardTitle><CardDescription><Skeleton className="h-4 w-40" /></CardDescription></CardHeader>
                    <CardContent> <Skeleton className="h-48 w-full" /></CardContent>
                </Card>
            </div>
        </div>
    )
}


export default function DashboardPage() {
  const firestore = useFirestore();

  const ordersQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'orders'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: orders, loading } = useCollection<Order>(ordersQuery);

  const { totalRevenue, totalSales, salesLastMonth, chartData, recentOrders } = useMemo(() => {
    if (!orders) {
      return { totalRevenue: 0, totalSales: 0, salesLastMonth: 0, chartData: [], recentOrders: [] };
    }

    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
    const totalSales = orders.length;

    const now = new Date();
    const oneMonthAgo = subDays(now, 30);
    const salesLastMonth = orders
        .filter(order => order.createdAt && order.createdAt.toDate() > oneMonthAgo)
        .length;

    const salesByDay: { [key: string]: number } = {};
    const daysToShow = 7;
    for (let i = 0; i < daysToShow; i++) {
        const day = format(subDays(now, i), 'E');
        salesByDay[day] = 0;
    }

    orders.forEach(order => {
        if (order.createdAt) {
            const orderDate = order.createdAt.toDate();
            if (orderDate > subDays(now, daysToShow)) {
                const day = format(orderDate, 'E');
                salesByDay[day] = (salesByDay[day] || 0) + order.totalAmount;
            }
        }
    });

    const chartData = Object.keys(salesByDay).map(day => ({
        name: day,
        total: salesByDay[day],
    })).reverse();


    const recentOrders = orders.slice(0, 5);

    return { totalRevenue, totalSales, salesLastMonth, chartData, recentOrders };
  }, [orders]);


  if (loading) {
      return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-headline">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                    Total Revenue
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">PKR {totalRevenue.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                    All-time revenue from all sales.
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                    Total Sales
                    </CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+{totalSales}</div>
                    <p className="text-xs text-muted-foreground">
                    All-time total number of orders.
                    </p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sales This Month</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+{salesLastMonth}</div>
                    <p className="text-xs text-muted-foreground">
                    Number of sales in the last 30 days.
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+573</div>
                    <p className="text-xs text-muted-foreground">
                    +201 since last hour (mock data)
                    </p>
                </CardContent>
            </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview (Last 7 Days)</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <OverviewChart data={chartData} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  You made {recentOrders.length} sales recently.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                    {recentOrders.map(order => (
                        <div className="flex items-center" key={order.id}>
                            <Avatar className="h-9 w-9">
                                <AvatarFallback>{order.deliveryInfo.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">{order.deliveryInfo.name}</p>
                                <p className="text-sm text-muted-foreground">{order.deliveryInfo.email}</p>
                            </div>
                            <div className="ml-auto font-medium">+{order.totalAmount.toFixed(2)} PKR</div>
                        </div>
                    ))}
                </div>
              </CardContent>
            </Card>
        </div>
    </div>
  );
}
