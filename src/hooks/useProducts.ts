
import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { useToast } from '@/hooks/use-toast';
import { inventoryService, CreateProductDTO } from '@/services/inventoryService';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await inventoryService.getAllProducts();
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Map to CreateProductDTO, which may not have all Product fields
      const createData: CreateProductDTO = { ...productData } as CreateProductDTO;
      const data = await inventoryService.createProduct(createData);

      toast({
        title: "Success",
        description: "Product added successfully",
      });

      await fetchProducts();
      return data;
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      // Only send fields that are part of CreateProductDTO
      const updateData = { ...productData } as Partial<CreateProductDTO>;
      await inventoryService.updateProduct(id, updateData);

      toast({
        title: "Success",
        description: "Product updated successfully",
      });

      await fetchProducts();
      return true;
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await inventoryService.deleteProduct(id);

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });

      await fetchProducts();
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    products,
    loading,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct
  };
};
