import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SuggestedProductsProps {
  currentProductId: string;
  category: string;
  roomType: string;
}

const SuggestedProducts = ({ currentProductId, category, roomType }: SuggestedProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestedProducts = async () => {
      try {
        setLoading(true);
        
        // First try to get products from the same category
        let { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('category', category)
          .neq('id', currentProductId)
          .limit(4);

        // If not enough products from the same category, get from the same room type
        if (data && data.length < 4) {
          const { data: roomProducts, error: roomError } = await supabase
            .from('products')
            .select('*')
            .eq('room_type', roomType)
            .neq('id', currentProductId)
            .not('id', 'in', `(${data.map(p => p.id).join(',')})`)
            .limit(4 - data.length);

          if (roomError) {
            console.error('Error fetching room products:', roomError);
          } else if (roomProducts) {
            data = [...data, ...roomProducts];
          }
        }

        // If still not enough, get random products
        if (data && data.length < 4) {
          const { data: randomProducts, error: randomError } = await supabase
            .from('products')
            .select('*')
            .neq('id', currentProductId)
            .not('id', 'in', `(${data.map(p => p.id).join(',')})`)
            .limit(4 - data.length);

          if (randomError) {
            console.error('Error fetching random products:', randomError);
          } else if (randomProducts) {
            data = [...data, ...randomProducts];
          }
        }

        if (error) {
          console.error('Error fetching suggested products:', error);
        } else {
          setProducts(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestedProducts();
  }, [currentProductId, category, roomType]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">You might also like</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-4">
                <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">You might also like</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => {
          const displayImage = product.images && product.images.length > 0 ? product.images[0] : product.image;
          
          return (
            <Link key={product.id} to={`/product/${product.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="aspect-square rounded-lg overflow-hidden mb-3">
                    <img
                      src={displayImage}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <Badge variant="secondary" className="mb-2 text-xs">
                    {product.brand}
                  </Badge>
                  <h4 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h4>
                  <div className="flex items-center mb-2">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-xs text-muted-foreground">{product.product_rating}</span>
                  </div>
                  <p className="font-semibold text-[#bb9a65]">₹{product.price.toLocaleString()}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SuggestedProducts;
