import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";

// Hotel constant - since we're always using Thendral Park Inn
const HOTEL_NAME = "Thendral Park Inn";

interface Amenity {
  id: string;
  hotel_id: string | null;
  name: string;
  icon: string | null;
  description: string | null;
  category: string | null;
  created_at: string;
}



const AmenitiesManager = () => {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [hotelId, setHotelId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchAmenities();
    fetchHotelId();
  }, []);

  const fetchAmenities = async () => {
    const { data, error } = await supabase
      .from("amenities")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch amenities",
        variant: "destructive",
      });
    } else {
      setAmenities(data || []);
    }
  };

  const fetchHotelId = async () => {
    const { data, error } = await supabase
      .from("hotels")
      .select("id")
      .eq("name", HOTEL_NAME)
      .single();

    if (error) {
      toast({
        title: "Error",
        description: `Failed to fetch hotel ID for ${HOTEL_NAME}`,
        variant: "destructive",
      });
    } else {
      setHotelId(data?.id || null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      hotel_id: hotelId,
      name: formData.name,
      description: formData.description || null,
    };

    if (editingAmenity) {
      const { error } = await supabase
        .from("amenities")
        .update(submitData)
        .eq("id", editingAmenity.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update amenity",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Amenity updated successfully",
        });
        fetchAmenities();
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from("amenities")
        .insert([submitData]);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create amenity",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Amenity created successfully",
        });
        fetchAmenities();
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this amenity?")) return;

    const { error } = await supabase
      .from("amenities")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete amenity",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Amenity deleted successfully",
      });
      fetchAmenities();
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
    });
    setEditingAmenity(null);
    setIsDialogOpen(false);
  };

  const openEditDialog = (amenity: Amenity) => {
    setFormData({
      name: amenity.name,
      description: amenity.description || "",
    });
    setEditingAmenity(amenity);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Amenities Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingAmenity(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Amenity
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingAmenity ? "Edit Amenity" : "Add New Amenity"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Hotel</Label>
                <div className="px-3 py-2 bg-muted rounded-md text-sm">
                  {HOTEL_NAME}
                </div>
              </div>
              <div>
                <Label htmlFor="name">Name *</Label>
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
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingAmenity ? "Update" : "Create"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {amenities.map((amenity) => (
          <Card key={amenity.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {amenity.name}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(amenity)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(amenity.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Hotel:</strong> {HOTEL_NAME}</p>
                {amenity.description && (
                  <p className="text-muted-foreground">{amenity.description}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AmenitiesManager;