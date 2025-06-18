
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DatabaseOrder, OrderItem } from '@/types/product';
import { useToast } from '@/hooks/use-toast';

export const useOrders = () => {
  const [orders, setOrders] = useState<(DatabaseOrder & { items: OrderItem[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Fetch orders with order items and product details
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        toast({
          title: "Error",
          description: "Failed to fetch orders",
          variant: "destructive",
        });
        return;
      }

      // Transform the data to match our expected format
      const transformedOrders = ordersData?.map(order => ({
        ...order,
        status: order.status as 'new' | 'dispatched' | 'completed',
        items: order.order_items?.map(item => ({
          ...item,
          product: item.products
        })) || []
      })) || [];

      setOrders(transformedOrders);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, status: 'new' | 'dispatched' | 'completed') => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating order status:', error);
        toast({
          title: "Error",
          description: "Failed to update order status",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Success",
        description: `Order status updated to ${status}`,
      });

      await fetchOrders();
      return true;
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
      return false;
    }
  };

  const createOrder = async (orderData: {
    customer_name: string;
    email: string;
    phone: string;
    address: string;
    pincode: string;
    total_amount: number;
    items: Array<{
      product_id: string;
      quantity: number;
      price: number;
      selected_set: boolean;
    }>;
  }) => {
    try {
      // Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_name: orderData.customer_name,
          email: orderData.email,
          phone: orderData.phone,
          address: orderData.address,
          pincode: orderData.pincode,
          total_amount: orderData.total_amount,
        }])
        .select()
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        toast({
          title: "Error",
          description: "Failed to create order",
          variant: "destructive",
        });
        return null;
      }

      // Create order items
      const orderItems = orderData.items.map(item => ({
        ...item,
        order_id: order.id,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        toast({
          title: "Error",
          description: "Failed to create order items",
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Success",
        description: "Order created successfully",
      });

      await fetchOrders();
      return order;
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive",
      });
      return null;
    }
  };

  const getOrdersByStatus = (status: 'new' | 'dispatched' | 'completed') => {
    return orders.filter(order => order.status === status);
  };

  return {
    orders,
    loading,
    fetchOrders,
    updateOrderStatus,
    createOrder,
    getOrdersByStatus
  };
};
