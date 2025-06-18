
import { useState } from "react";
import { Search, Eye, Package, Truck, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  products: { name: string; quantity: number; price: number }[];
  total: number;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  orderDate: string;
  shippingAddress: string;
}

export function OrderManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-001",
      customerName: "John Smith",
      customerEmail: "john.smith@email.com",
      products: [
        { name: "Modern Oak Dining Table", quantity: 1, price: 899 },
        { name: "Dining Chairs Set", quantity: 4, price: 159 }
      ],
      total: 1535,
      status: "Processing",
      orderDate: "2024-01-15",
      shippingAddress: "123 Main St, Springfield, IL 62701"
    },
    {
      id: "ORD-002",
      customerName: "Sarah Johnson",
      customerEmail: "sarah.j@email.com",
      products: [
        { name: "Leather Sectional Sofa", quantity: 1, price: 1299 }
      ],
      total: 1299,
      status: "Shipped",
      orderDate: "2024-01-14",
      shippingAddress: "456 Oak Ave, Chicago, IL 60601"
    },
    {
      id: "ORD-003",
      customerName: "Mike Brown",
      customerEmail: "mike.brown@email.com",
      products: [
        { name: "Glass Coffee Table", quantity: 1, price: 399 },
        { name: "Table Lamp", quantity: 2, price: 89 }
      ],
      total: 577,
      status: "Delivered",
      orderDate: "2024-01-12",
      shippingAddress: "789 Pine St, Austin, TX 73301"
    },
    {
      id: "ORD-004",
      customerName: "Lisa Davis",
      customerEmail: "lisa.davis@email.com",
      products: [
        { name: "King Size Bedroom Set", quantity: 1, price: 2199 }
      ],
      total: 2199,
      status: "Processing",
      orderDate: "2024-01-16",
      shippingAddress: "321 Elm St, Miami, FL 33101"
    }
  ]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Processing":
        return <Package className="w-4 h-4" />;
      case "Shipped":
        return <Truck className="w-4 h-4" />;
      case "Delivered":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-500">Track and manage customer orders</p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search orders by ID, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status}</span>
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-900">{order.customerName}</p>
                      <p className="text-gray-500">{order.customerEmail}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Order Date</p>
                      <p className="text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Total Amount</p>
                      <p className="text-xl font-bold text-gray-900">${order.total}</p>
                    </div>
                  </div>

                  <div className="mt-4 text-sm">
                    <p className="font-medium text-gray-700">Products:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {order.products.map((product, index) => (
                        <span key={index} className="bg-gray-100 px-2 py-1 rounded text-gray-700">
                          {product.name} (×{product.quantity})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
                      </DialogHeader>
                      {selectedOrder && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Customer Information</h4>
                              <p className="text-sm"><strong>Name:</strong> {selectedOrder.customerName}</p>
                              <p className="text-sm"><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                              <p className="text-sm"><strong>Order Date:</strong> {new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Shipping Address</h4>
                              <p className="text-sm">{selectedOrder.shippingAddress}</p>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Order Items</h4>
                            <div className="space-y-2">
                              {selectedOrder.products.map((product, index) => (
                                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                  <div>
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-sm text-gray-500">Quantity: {product.quantity}</p>
                                  </div>
                                  <p className="font-semibold">${product.price * product.quantity}</p>
                                </div>
                              ))}
                              <div className="border-t pt-2 mt-2">
                                <div className="flex justify-between items-center text-lg font-bold">
                                  <span>Total:</span>
                                  <span>${selectedOrder.total}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Select 
                    value={order.status} 
                    onValueChange={(value: Order["status"]) => updateOrderStatus(order.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Processing">Processing</SelectItem>
                      <SelectItem value="Shipped">Shipped</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">Try adjusting your search criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
