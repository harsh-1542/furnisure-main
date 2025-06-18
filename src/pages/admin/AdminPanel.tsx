import { useState } from "react";
import { AdminSidebar } from "@/components/adminComponents/AdminSidebar";
import { Dashboard } from "@/components/adminComponents/Dashboard";
import { InventoryManager } from "@/components/adminComponents/InventoryManager";
import { OrderManager } from "@/components/adminComponents/OrderManager";
import { CustomerManager } from "@/components/adminComponents/CustomerManager";
import { SidebarProvider } from "@/components/ui/sidebar";

const AdminPanel = () => {
  const [activeView, setActiveView] = useState("dashboard");

  const renderActiveView = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard />;
      case "inventory":
        return <InventoryManager />;
      case "orders":
        return <OrderManager />;
      case "customers":
        return <CustomerManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AdminSidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminPanel;
