import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";
import { motion } from "framer-motion";
import { TrendingUp, Users, ShoppingBag, DollarSign } from "lucide-react";

const salesData = [
    { name: "Jan", sales: 4000, revenue: 2400 },
    { name: "Feb", sales: 3000, revenue: 1398 },
    { name: "Mar", sales: 2000, revenue: 9800 },
    { name: "Apr", sales: 2780, revenue: 3908 },
    { name: "May", sales: 1890, revenue: 4800 },
    { name: "Jun", sales: 2390, revenue: 3800 },
    { name: "Jul", sales: 3490, revenue: 4300 },
];

const productData = [
    { name: "Electronics", quantity: 4000 },
    { name: "Clothing", quantity: 3000 },
    { name: "Home", quantity: 2000 },
    { name: "Books", quantity: 2780 },
    { name: "Sports", quantity: 1890 },
];

const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    color,
}: {
    title: string;
    value: string;
    icon: any;
    trend: string;
    color: string;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                <h3 className="text-3xl font-bold mt-2 text-gray-900">{value}</h3>
            </div>
            <div className={`p-4 rounded-full ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
            <span className="text-green-500 text-sm font-medium flex items-center gap-1">
                <TrendingUp size={16} /> {trend}
            </span>
            <span className="text-gray-400 text-sm">vs last month</span>
        </div>
    </motion.div>
);

const Dashboard = () => {
    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Sales"
                    value="$124,592"
                    icon={DollarSign}
                    trend="+12.5%"
                    color="bg-black"
                />
                <StatCard
                    title="Total Orders"
                    value="1,294"
                    icon={ShoppingBag}
                    trend="+8.2%"
                    color="bg-gray-800"
                />
                <StatCard
                    title="Total Products"
                    value="456"
                    icon={Users} // Using Users for now as generic icon, maybe change to Package
                    trend="+2.1%"
                    color="bg-gray-700"
                />
                <StatCard
                    title="Active Users"
                    value="8,920"
                    icon={Users}
                    trend="+15.3%"
                    color="bg-gray-900"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                >
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Revenue Analytics</h3>
                        <p className="text-gray-500 text-sm">Monthly revenue vs sales</p>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#000000" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#000000" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6B7280" }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6B7280" }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#000", border: "none", borderRadius: "8px" }}
                                    itemStyle={{ color: "#fff" }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#000000"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                >
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Product Sales</h3>
                        <p className="text-gray-500 text-sm">Top categories performance</p>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={productData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6B7280" }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6B7280" }} />
                                <Tooltip
                                    cursor={{ fill: "transparent" }}
                                    contentStyle={{ backgroundColor: "#000", border: "none", borderRadius: "8px" }}
                                    itemStyle={{ color: "#fff" }}
                                />
                                <Bar dataKey="quantity" fill="#1f2937" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
