
import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Dashboard() {
  const stats = [
    {
      title: "Total Inventory",
      value: "1,247",
      change: "+12%",
      icon: Package,
      color: "bg-blue-500",
    },
    {
      title: "Pending Orders",
      value: "89",
      change: "+5%",
      icon: ShoppingCart,
      color: "bg-green-500",
    },
    {
      title: "Total Customers",
      value: "2,456",
      change: "+18%",
      icon: Users,
      color: "bg-purple-500",
    },
    {
      title: "Monthly Revenue",
      value: "$124,590",
      change: "+23%",
      icon: TrendingUp,
      color: "bg-orange-500",
    },
  ];

  const recentOrders = [
    { id: "#ORD-001", customer: "John Smith", product: "Oak Dining Table", status: "Processing", amount: "$899" },
    { id: "#ORD-002", customer: "Sarah Johnson", product: "Leather Sofa Set", status: "Shipped", amount: "$1,299" },
    { id: "#ORD-003", customer: "Mike Brown", product: "Modern Coffee Table", status: "Delivered", amount: "$399" },
    { id: "#ORD-004", customer: "Lisa Davis", product: "Bedroom Set", status: "Processing", amount: "$2,199" },
  ];

  const lowStockItems = [
    { name: "Ergonomic Office Chair", stock: 3, threshold: 10 },
    { name: "Wooden Bookshelf", stock: 5, threshold: 15 },
    { name: "Glass Coffee Table", stock: 2, threshold: 8 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's your business overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600 font-medium">{stat.change} from last month</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                    <p className="text-sm text-gray-500">{order.product}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{order.amount}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      order.status === "Delivered" ? "bg-green-100 text-green-800" :
                      order.status === "Shipped" ? "bg-blue-100 text-blue-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Low Stock Alert</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">Threshold: {item.threshold} units</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">{item.stock}</p>
                    <p className="text-xs text-red-500">units left</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
