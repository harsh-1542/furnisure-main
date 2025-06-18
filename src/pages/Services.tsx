import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ChevronDown, Home, Package, Settings, Truck, Wrench, Layout, Lightbulb, ArrowRight, Star, Award, Users, Shield } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Services = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    roomType: '',
    budget: '',
    requirements: '',
    dimensions: ''
  });
  const { toast } = useToast();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Custom Order Request Submitted",
      description: "We'll contact you within 24 hours to discuss your requirements.",
    });
    setFormData({
      name: '',
      email: '',
      phone: '',
      roomType: '',
      budget: '',
      requirements: '',
      dimensions: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen p-2">
      {/* Enhanced Hero Section */}
      <section 
        ref={heroRef}
        className="relative h-[60vh] rounded-3xl flex items-center justify-center overflow-hidden"
      >
        <motion.img
          style={{ y, scale: 1.1 }}
          src="/images/services-hero.jpg"
          alt="Our Services"
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
          className="relative z-10 text-center text-white max-w-4xl mx-auto px-4"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight font-domine"
          >
            Our Exceptional Services
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed"
          >
            Beyond our ready-made furniture collection, we offer comprehensive services to meet all your furniture needs.
          </motion.p>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* Services Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16 relative"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 0.1, scale: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8rem] font-bold text-[#bb9a65]/5 select-none pointer-events-none"
            >
              Services
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 40, skewY: 10 }}
              whileInView={{ opacity: 1, y: 0, skewY: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-4xl font-bold mb-4 font-domine relative"
            >
              Our Services
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto relative"
            >
              Comprehensive solutions for all your furniture needs
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Wrench,
                title: "Custom Furniture Design",
                description: "Design and create furniture pieces tailored to your specific requirements, style preferences, and space constraints."
              },
              {
                icon: Home,
                title: "Interior Consultation",
                description: "Our interior design experts provide consultation to help you choose the perfect furniture for your space."
              },
              {
                icon: Truck,
                title: "Delivery & Assembly",
                description: "Professional delivery and assembly services ensure your furniture is set up perfectly in your home."
              },
              {
                icon: Settings,
                title: "Repair & Maintenance",
                description: "Keep your furniture in perfect condition with our repair and maintenance services."
              },
              {
                icon: Layout,
                title: "Space Planning",
                description: "Optimize your space with our professional space planning and layout design services."
              },
              {
                icon: Lightbulb,
                title: "Design Consultation",
                description: "Get expert advice on furniture selection, color schemes, and design aesthetics for your space."
              }
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Card className="h-full transform transition-all duration-500 hover:shadow-2xl border-0 bg-white">
                  <CardHeader className="flex items-center space-x-4">
                    <div className="p-4 bg-gradient-to-br from-[#bb9a65]/10 to-[#bb9a65]/5 rounded-2xl text-[#bb9a65] group-hover:from-[#bb9a65]/20 group-hover:to-[#bb9a65]/10 transition-all duration-500">
                      <service.icon size={32} />
                    </div>
                    <CardTitle className="text-xl font-semibold font-domine">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-lg">
                      {service.description}
                    </p>
                    <motion.div
                      className="mt-6 h-0.5 bg-gradient-to-r from-[#bb9a65]/0 via-[#bb9a65] to-[#bb9a65]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Process Timeline */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <Card className="overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(8,_112,_184,_0.4)] transition-all duration-300 rounded-3xl border-0 bg-gradient-to-br from-gray-50 to-white">
            <CardContent className="p-12">
              <motion.h2 
                initial={{ opacity: 0, y: 20, rotateX: -30 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
                className="text-4xl font-bold mb-12 text-center font-domine"
              >
                Our Process
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    number: "01",
                    title: "Consultation",
                    description: "We discuss your needs, style preferences, and budget to tailor the perfect furniture solution.",
                    icon: Users
                  },
                  {
                    number: "02",
                    title: "Design & Approval",
                    description: "Our designers create detailed plans and get your approval before production.",
                    icon: Layout
                  },
                  {
                    number: "03",
                    title: "Production",
                    description: "Skilled craftsmen build your furniture with attention to detail and quality.",
                    icon: Settings
                  },
                  {
                    number: "04",
                    title: "Delivery & Setup",
                    description: "We deliver and assemble your furniture, ensuring everything is perfect.",
                    icon: Truck
                  }
                ].map((step, index) => (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="relative group"
                  >
                    <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-[#bb9a65] to-[#bb9a65]/80 rounded-full flex items-center justify-center text-white font-bold text-xl z-10 shadow-lg">
                      {step.number}
                    </div>
                    <Card className="h-full pt-12 px-6 pb-6 border-0 bg-white/50 backdrop-blur-sm hover:bg-white transition-all duration-300 group-hover:shadow-xl">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#bb9a65]/10 to-[#bb9a65]/5 flex items-center justify-center mb-6 group-hover:from-[#bb9a65]/20 group-hover:to-[#bb9a65]/10 transition-all duration-500">
                          <step.icon size={32} className="text-[#bb9a65]" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3 font-domine">{step.title}</h3>
                        <p className="text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </Card>
                    {index < 3 && (
                      <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-[#bb9a65]/50 to-transparent" />
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Services;
