import { useState, useRef } from 'react';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

const BrowseProducts = () => {
  const { products, loading } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedStorage, setSelectedStorage] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'beds', label: 'Beds' },
    { value: 'sofas', label: 'Sofas & Chairs' },
    { value: 'office', label: 'Office Furniture' },
    { value: 'dining', label: 'Dining Sets' },
    { value: 'storage', label: 'Storage' },
    { value: 'chairs', label: 'Chairs' },
  ];

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.room_type.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      
      const matchesMaterial = selectedMaterials.length === 0 || 
                             selectedMaterials.includes(product.primary_material);
      
      const matchesStorage = selectedStorage.length === 0 || 
                            selectedStorage.includes(product.storage);
      
      const matchesBrand = selectedBrands.length === 0 || 
                          selectedBrands.includes(product.brand);
      
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesMaterial && matchesStorage && matchesBrand && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.product_rating - a.product_rating;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('name');
    setSelectedMaterials([]);
    setSelectedStorage([]);
    setSelectedBrands([]);
    setPriceRange([0, 100000]);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedCategory !== 'all') count++;
    if (selectedMaterials.length > 0) count += selectedMaterials.length;
    if (selectedStorage.length > 0) count += selectedStorage.length;
    if (selectedBrands.length > 0) count += selectedBrands.length;
    if (priceRange[0] > 0 || priceRange[1] < 100000) count++;
    return count;
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading products...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-2">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative h-[40vh] flex items-center justify-center overflow-hidden rounded-3xl px-6 sm:px-8 lg:px-10 mb-8"
      >
        <motion.img
          style={{ y, scale: 1.1 }}
          src="/images/products-hero.jpg"
          alt="Products Hero"
          className="absolute w-full h-full object-cover"
        />
        <motion.div 
          style={{ opacity }}
          className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/30" 
        />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-4xl md:text-6xl font-bold mb-4 font-domine"
          >
            Our Products
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl"
          >
            Explore our extensive collection
          </motion.p>
        </motion.div>
      </section>

      <div className="flex">
        {/* Sidebar */}
        <FilterSidebar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          selectedMaterials={selectedMaterials}
          setSelectedMaterials={setSelectedMaterials}
          selectedStorage={selectedStorage}
          setSelectedStorage={setSelectedStorage}
          selectedBrands={selectedBrands}
          setSelectedBrands={setSelectedBrands}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          onClearFilters={clearAllFilters}
        />

        {/* Main Content */}
        <div className="flex-1 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4 bg-gradient-to-r from-[#bb9a65] to-[#bb9a65]/70 bg-clip-text text-transparent">
                Browse Products
              </h1>
              <p className="text-muted-foreground text-lg">
                Discover our complete collection of premium furniture pieces.
              </p>
            </div>

            {/* Results Summary */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">
                  Showing {filteredProducts.length} of {products.length} products
                </span>
                {getActiveFiltersCount() > 0 && (
                  <Badge variant="secondary" className="bg-[#bb9a65]/10 text-[#bb9a65]">
                    {getActiveFiltersCount()} filters applied
                  </Badge>
                )}
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategory !== 'all' || selectedMaterials.length > 0 || selectedStorage.length > 0 || selectedBrands.length > 0) && (
              <div className="mb-6 flex flex-wrap gap-2">
                {selectedCategory !== 'all' && (
                  <Badge variant="outline" className="bg-background">
                    {categories.find(cat => cat.value === selectedCategory)?.label}
                  </Badge>
                )}
                {selectedMaterials.map(material => (
                  <Badge key={material} variant="outline" className="bg-background">
                    {material}
                  </Badge>
                ))}
                {selectedStorage.map(storage => (
                  <Badge key={storage} variant="outline" className="bg-background">
                    {storage}
                  </Badge>
                ))}
                {selectedBrands.map(brand => (
                  <Badge key={brand} variant="outline" className="bg-background">
                    {brand}
                  </Badge>
                ))}
              </div>
            )}

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-card/50 backdrop-blur-sm rounded-xl p-8 border">
                  <p className="text-xl text-muted-foreground mb-4">No products found</p>
                  <p className="text-muted-foreground">
                    Try adjusting your search terms or filters to find what you're looking for.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseProducts;
