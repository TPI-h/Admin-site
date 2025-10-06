import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, 
  Bed, 
  Wifi, 
  MapPin, 
  MessageSquare, 
  Images,
  Menu,
  X,
  LogOut
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AdminLayout = ({ children, activeTab, onTabChange }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const menuItems = [
    { id: "hotels", label: "Hotels", icon: Building2 },
    { id: "rooms", label: "Rooms", icon: Bed },
    { id: "amenities", label: "Amenities", icon: Wifi },
    { id: "attractions", label: "Attractions", icon: MapPin },
    { id: "testimonials", label: "Testimonials", icon: MessageSquare },
    { id: "gallery", label: "Gallery", icon: Images },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile menu button */}
      <div className="lg:hidden p-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`
          fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border
          transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
          transition-transform duration-200 ease-in-out
        `}>
          <div className="flex flex-col h-full">
            <div className="p-6">
              <h1 className="text-xl font-bold text-sidebar-foreground">
                Thendral Park Inn
              </h1>
              <p className="text-sm text-sidebar-foreground/70">Admin Panel</p>
              <p className="text-xs text-sidebar-foreground/50 mt-1">{user?.email}</p>
            </div>
            
            <Separator className="bg-sidebar-border" />
            
            <nav className="flex-1 p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => {
                      onTabChange(item.id);
                      setSidebarOpen(false);
                    }}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
            
            <div className="p-4 border-t border-sidebar-border">
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-1 lg:ml-0">
          <div className="p-6">
            <Card className="p-6">
              {children}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;