import { useState } from "react";
import AdminLayout from "./AdminLayout";
import HotelsManager from "./HotelsManager";
import RoomsManager from "./RoomsManager";
import AmenitiesManager from "./AmenitiesManager";
import AttractionsManager from "./AttractionsManager";
import TestimonialsManager from "./TestimonialsManager";
import GalleryManager from "./GalleryManager";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("hotels");

  const renderContent = () => {
    switch (activeTab) {
      case "hotels":
        return <HotelsManager />;
      case "rooms":
        return <RoomsManager />;
      case "amenities":
        return <AmenitiesManager />;
      case "attractions":
        return <AttractionsManager />;
      case "testimonials":
        return <TestimonialsManager />;
      case "gallery":
        return <GalleryManager />;
      default:
        return <HotelsManager />;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </AdminLayout>
  );
};

export default AdminPanel;