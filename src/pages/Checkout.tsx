import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useOrders } from '@/hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, MapPin, CreditCard, Banknote } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

const Checkout = () => {
  const { items, clearCart } = useCart();
  const { createOrder } = useOrders();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isSignedIn } = useUser();
  const [errors, setErrors] = useState({ pincode: '' });
  const [ipAddress, setIpAddress] = useState('');

  // Extract user details from Clerk
  const customerName = user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim();
  const email = user?.primaryEmailAddress?.emailAddress || '';
  const phone = user?.primaryPhoneNumber?.phoneNumber || '';
  const userId = user?.id || '';

  const [formData, setFormData] = useState({
    address: '',
    pincode: '',
    delivery_instructions: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setIpAddress(data.ip))
      .catch(() => setIpAddress(''));
  }, []);

  const handlePaymentGateway = async () => {
    // Placeholder for payment gateway integration
    // This is where you would integrate with Stripe, Razorpay, or other payment providers
    toast({
      title: "Payment Gateway",
      description: "Payment gateway integration will be implemented here",
    });
    
    // For now, we'll simulate a successful payment
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^[1-9][0-9]{5}$/.test(formData.pincode)) {
      setErrors({ ...errors, pincode: 'Invalid Indian pincode' });
      setIsSubmitting(false);
      return;
    }
    

    if (items.length === 0) {
      toast({
        title: "Error",
        description: "Your cart is empty",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Handle payment gateway flow
      if (paymentMethod === 'gateway') {
        const paymentSuccess = await handlePaymentGateway();
        if (!paymentSuccess) {
          setIsSubmitting(false);
          return;
        }
      }

      const orderItems = items.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
        selected_set: item.selectedSet || false,
      }));

      const order = await createOrder({
        customer_name: customerName,
        email,
        phone,
        ...formData,
        total_amount: totalAmount,
        payment_method: paymentMethod as 'cod' | 'gateway',
        payment_status: paymentMethod === 'cod' ? 'pending' : 'paid',
        payment_reference_id: paymentMethod === 'cod' ? null : 'demo-gateway-ref', // Placeholder for now
        user_id: userId || undefined,
        items: orderItems,
        ip_address: ipAddress,
      });

      if (order) {
        clearCart();
        const paymentMessage = paymentMethod === 'cod' 
          ? "Your order has been placed successfully! Pay on delivery."
          : "Your order has been placed and paid successfully!";
        
        toast({
          title: "Order placed successfully!",
          description: paymentMessage,
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Please sign in to checkout</h2>
          <p className="text-muted-foreground mb-4">You must be logged in to place an order.</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-8 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8 text-center">
              <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-4">Add some products to your cart to checkout.</p>
              <Button onClick={() => navigate('/browse')}>
                Browse Products
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Checkout</h1>
          <p className="text-muted-foreground">Please fill in your details to complete your order.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Form */}
          <div className="space-y-6">
            {/* Delivery Information */}
            <Card className="shadow-lg border-[#bb9a65]/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="customer_name">Full Name</Label>
                    <Input
                      id="customer_name"
                      type="text"
                      value={customerName}
                      readOnly
                      className="bg-background/50 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      readOnly
                      className="bg-background/50 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      readOnly
                      className="bg-background/50 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      type="text" // Use "text" to control exactly what can be typed
                      inputMode="numeric" // Brings up number keyboard on mobile
                      pattern="[1-9][0-9]{5}"
                      maxLength={6}
                      value={formData.pincode}
                      onChange={(e) => {
                        const value = e.target.value;

                        // Only allow numeric input
                        if (!/^\d*$/.test(value)) return;

                        // Limit to 6 digits
                        if (value.length > 6) return;

                        setFormData({ ...formData, pincode: value });

                        const isValid = /^[1-9][0-9]{5}$/.test(value);
                        setErrors({ ...errors, pincode: isValid || value === '' ? '' : 'Invalid pincode' });
                      }}
                      required
                      placeholder="Enter your pincode for delivery"
                      className="bg-background/50"
                    />
                    {errors.pincode && (
                      <p className="text-sm text-red-500 mt-1">{errors.pincode}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="address">Delivery Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                      rows={3}
                      placeholder="Enter your complete delivery address"
                      className="bg-background/50"
                    />
                  </div>

                  {/* Delivery Instructions */}
                  <div>
                    <Label htmlFor="delivery_instructions">Delivery Instructions (optional)</Label>
                    <Textarea
                      id="delivery_instructions"
                      value={formData.delivery_instructions}
                      onChange={(e) => setFormData({ ...formData, delivery_instructions: e.target.value })}
                      rows={2}
                      placeholder="E.g. Leave at the door, call on arrival, etc."
                      className="bg-background/50"
                    />
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="shadow-lg border-[#bb9a65]/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex items-center cursor-pointer flex-1">
                      <Banknote className="h-5 w-5 mr-3 text-green-600" />
                      <div>
                        <div className="font-medium">Cash on Delivery</div>
                        <div className="text-sm text-muted-foreground">Pay when your order arrives</div>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                    <RadioGroupItem value="gateway" id="gateway" />
                    <Label htmlFor="gateway" className="flex items-center cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5 mr-3 text-blue-600" />
                      <div>
                        <div className="font-medium">Online Payment</div>
                        <div className="text-sm text-muted-foreground">Pay securely with card/UPI/wallet</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Place Order Button */}
            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={isSubmitting}
              size="lg"
            >
              {isSubmitting ? 'Processing...' : 
                paymentMethod === 'cod' 
                  ? `Place Order - ₹${totalAmount.toLocaleString()} (COD)`
                  : `Pay Now - ₹${totalAmount.toLocaleString()}`
              }
            </Button>
          </div>

          {/* Order Summary */}
          <Card className="shadow-lg h-fit">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.id}-${item.selectedSet}`} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      {item.selectedSet && (
                        <span className="text-xs text-[#bb9a65] font-medium">(Complete Set)</span>
                      )}
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-[#bb9a65]">₹{totalAmount.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Including all taxes and free delivery
                  </p>
                  
                  {/* Payment Method Summary */}
                  <div className="mt-3 p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center text-sm">
                      {paymentMethod === 'cod' ? (
                        <>
                          <Banknote className="h-4 w-4 mr-2 text-green-600" />
                          <span className="text-green-600 font-medium">Cash on Delivery</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2 text-blue-600" />
                          <span className="text-blue-600 font-medium">Online Payment</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
