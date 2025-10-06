import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Edit, Hotel } from "lucide-react";
import { MultiImageUpload } from "@/components/ui/multi-image-upload";

interface HotelData {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  images: string[] | null;
  created_at: string;
}

const HotelsManager = () => {
  const [hotel, setHotel] = useState<HotelData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    images: [] as string[],
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchHotel();
  }, []);

  const fetchHotel = async () => {
    const { data, error } = await supabase
      .from("hotels")
      .select("*")
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      toast({
        title: "Error",
        description: "Failed to fetch hotel data",
        variant: "destructive",
      });
    } else {
      setHotel(data || null);
      if (data) {
        setFormData({
          name: data.name || "",
          description: data.description || "",
          address: data.address || "",
          phone: data.phone || "",
          email: data.email || "",
          website: data.website || "",
          images: data.images || [],
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      name: formData.name,
      description: formData.description || null,
      address: formData.address || null,
      phone: formData.phone || null,
      email: formData.email || null,
      website: formData.website || null,
      images: formData.images.length > 0 ? formData.images : null,
    };

    if (hotel) {
      // Update existing hotel
      const { error } = await supabase
        .from("hotels")
        .update(submitData)
        .eq("id", hotel.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update hotel",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Hotel updated successfully",
        });
        fetchHotel();
        setIsDialogOpen(false);
      }
    } else {
      // Create new hotel
      const { error } = await supabase
        .from("hotels")
        .insert([submitData]);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create hotel",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Hotel created successfully",
        });
        fetchHotel();
        setIsDialogOpen(false);
      }
    }
  };

  const openEditDialog = () => {
    if (hotel) {
      setFormData({
        name: hotel.name || "",
        description: hotel.description || "",
        address: hotel.address || "",
        phone: hotel.phone || "",
        email: hotel.email || "",
        website: hotel.website || "",
        images: hotel.images || [],
      });
    }
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Hotel Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openEditDialog}>
              {hotel ? (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Hotel
                </>
              ) : (
                <>
                  <Hotel className="mr-2 h-4 w-4" />
                  Create Hotel
                </>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {hotel ? "Edit Hotel Information" : "Create Hotel"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Hotel Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>

              <MultiImageUpload
                images={formData.images}
                onImagesChange={(images) => setFormData({ ...formData, images })}
                bucketName="hotel-images"
                label="Hotel Images"
                maxImages={15}
              />
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {hotel ? "Update Hotel" : "Create Hotel"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {hotel ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              {hotel.name}
              <Button
                variant="outline"
                size="sm"
                onClick={openEditDialog}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {hotel.images && hotel.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {hotel.images.map((imageUrl, index) => (
                    <div key={index} className="aspect-square w-full bg-muted rounded-md overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={`${hotel.name} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
              
              {hotel.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{hotel.description}</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hotel.address && (
                  <div>
                    <h3 className="font-semibold">Address</h3>
                    <p className="text-muted-foreground">{hotel.address}</p>
                  </div>
                )}
                {hotel.phone && (
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-muted-foreground">{hotel.phone}</p>
                  </div>
                )}
                {hotel.email && (
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-muted-foreground">{hotel.email}</p>
                  </div>
                )}
                {hotel.website && (
                  <div>
                    <h3 className="font-semibold">Website</h3>
                    <p className="text-muted-foreground">{hotel.website}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Hotel className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Hotel Configured</h3>
            <p className="text-muted-foreground mb-4 text-center">
              Create your hotel profile to get started with managing rooms, gallery, and more.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Hotel className="mr-2 h-4 w-4" />
              Create Hotel
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HotelsManager;