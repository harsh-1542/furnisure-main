import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User, Package, MapPin, Phone, Mail, Calendar } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { getProfile, getProfileOrders } from '@/services/profileService';

const Profile = () => {
  const { getToken } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [profileData, ordersData] = await Promise.all([
          getProfile(getToken),
          getProfileOrders(getToken)
        ]);
        setUser(profileData);
        setOrders(ordersData);
      } catch (err: any) {
        setError('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getToken]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'default';
      case 'shipped':
        return 'secondary';
      case 'processing':
        return 'outline';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg font-semibold">Loading profile...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg font-semibold text-red-500">{error}</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg font-semibold text-gray-500">No user data found.</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 mt-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account and view order history</p>
        </div>

        {/* Profile Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-6">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-lg font-semibold">
                  {user.fullName ? user.fullName.split(' ').map((n: string) => n[0]).join('') : ''}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">{user.fullName}</h2>
                  <p className="text-gray-600">Customer since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="h-4 w-4" />
                    <span>{user.phoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="h-4 w-4" />
                    <span>Member since {user.createdAt ? new Date(user.createdAt).getFullYear() : ''}</span>
                  </div>
                </div>
                <Button variant="outline" className="mt-4">
                  Edit Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid grid-cols-4 w-full max-w-md">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="delivered">Delivered</TabsTrigger>
                <TabsTrigger value="shipped">Shipped</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-6">
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                      <Package className="w-12 h-12 mb-4 opacity-40" />
                      <span className="text-lg font-semibold">No orders available</span>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <Card key={order.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-6">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-4 mb-2">
                                <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                                <Badge variant={getStatusBadgeVariant(order.status)}>
                                  {order.status}
                                </Badge>
                              </div>
                              <p className="text-gray-600 mb-3">
                                Placed on {order.date ? new Date(order.date).toLocaleDateString() : ''}
                              </p>
                              <div className="space-y-2">
                                <h4 className="font-medium text-gray-900">Items:</h4>
                                {order.items && order.items.map((item: any, index: number) => (
                                  <div key={index} className="flex justify-between text-sm text-gray-700">
                                    <span>{item.name} (x{item.quantity})</span>
                                    <span>${item.price.toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-gray-900 mb-2">
                                ${order.total ? order.total.toFixed(2) : '0.00'}
                              </div>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
              <TabsContent value="delivered">
                <div className="space-y-4">
                {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                      <Package className="w-12 h-12 mb-4 opacity-40" />
                      <span className="text-lg font-semibold">No orders available</span>
                    </div>
                  ) : (
                  orders.filter(order => order.status === 'Delivered').map((order) => (
                    <Card key={order.id} className="border-l-4 border-l-green-500">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                              <Badge variant="default">{order.status}</Badge>
                            </div>
                            <p className="text-gray-600">
                              Delivered on {order.date ? new Date(order.date).toLocaleDateString() : ''}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900 mb-2">
                              ${order.total ? order.total.toFixed(2) : '0.00'}
                            </div>
                            <Button variant="outline" size="sm">
                              Reorder
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )))}
                </div>
              </TabsContent>
              <TabsContent value="shipped">
                <div className="space-y-4">
                  
                     {orders.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                        <Package className="w-12 h-12 mb-4 opacity-40" />
                        <span className="text-lg font-semibold">No orders available</span>
                      </div>
                    ) : (
                  
                  
                  orders.filter(order => order.status === 'Shipped').map((order) => (
                    <Card key={order.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                              <Badge variant="secondary">{order.status}</Badge>
                            </div>
                            <p className="text-gray-600">
                              Shipped on {order.date ? new Date(order.date).toLocaleDateString() : ''}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900 mb-2">
                              ${order.total ? order.total.toFixed(2) : '0.00'}
                            </div>
                            <Button variant="outline" size="sm">
                              Track Order
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )))}
                </div>
              </TabsContent>
              <TabsContent value="processing">
                <div className="space-y-4">
                  { orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                      <Package className="w-12 h-12 mb-4 opacity-40" />
                      <span className="text-lg font-semibold">No orders available</span>
                    </div>
                  ) : (
                  orders.filter(order => order.status === 'Processing').map((order) => (
                    <Card key={order.id} className="border-l-4 border-l-yellow-500">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                              <Badge variant="outline">{order.status}</Badge>
                            </div>
                            <p className="text-gray-600">
                              Order placed on {order.date ? new Date(order.date).toLocaleDateString() : ''}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900 mb-2">
                              ${order.total ? order.total.toFixed(2) : '0.00'}
                            </div>
                            <Button variant="outline" size="sm">
                              Cancel Order
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
