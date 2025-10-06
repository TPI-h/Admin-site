import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";

// Hotel constant - since we're always using Thendral Park Inn
const HOTEL_NAME = "Thendral Park Inn";

interface Attraction {
  id: string;
  hotel_id: string | null;
  name: string;
  description: string | null;
  distance: string | null;
  image_url: string | null;
  category: string | null;
  created_at: string;
}

const AttractionsManager = () => {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [hotelId, setHotelId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAttraction, setEditingAttraction] = useState<Attraction | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    distance: "",
    image_url: "",
    category: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchAttractions();
    fetchHotelId();
  }, []);

  const fetchAttractions = async () => {
    const { data, error } = await supabase
      .from("attractions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch attractions",
        variant: "destructive",
      });
    } else {
      setAttractions(data || []);
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
      distance: formData.distance || null,
      image_url: formData.image_url || null,
      category: formData.category || null,
    };

    if (editingAttraction) {
      const { error } = await supabase
        .from("attractions")
        .update(submitData)
        .eq("id", editingAttraction.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update attraction",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Attraction updated successfully",
        });
        fetchAttractions();
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from("attractions")
        .insert([submitData]);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create attraction",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Attraction created successfully",
        });
        fetchAttractions();
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this attraction?")) return;

    const { error } = await supabase
      .from("attractions")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete attraction",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Attraction deleted successfully",
      });
      fetchAttractions();
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      distance: "",
      image_url: "",
      category: "",
    });
    setEditingAttraction(null);
    setIsDialogOpen(false);
  };

  const openEditDialog = (attraction: Attraction) => {
    setFormData({
      name: attraction.name,
      description: attraction.description || "",
      distance: attraction.distance || "",
      image_url: attraction.image_url || "",
      category: attraction.category || "",
    });
    setEditingAttraction(attraction);
    setIsDialogOpen(true);
  };



  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Attractions Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingAttraction(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Attraction
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingAttraction ? "Edit Attraction" : "Add New Attraction"}
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
              <div>
                <Label htmlFor="distance">Distance</Label>
                <Input
                  id="distance"
                  value={formData.distance}
                  onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                  placeholder="2 km"
                />
              </div>
              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="historical">Historical</SelectItem>
                    <SelectItem value="religious">Religious</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="natural">Natural</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingAttraction ? "Update" : "Create"}
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
        {attractions.map((attraction) => (
          <Card key={attraction.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {attraction.name}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(attraction)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(attraction.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Hotel:</strong> {HOTEL_NAME}</p>
                {attraction.image_url && (
                  <div>
                    <p><strong>Attraction Image:</strong></p>
                    <img
                      src={attraction.image_url}
                      alt={`${attraction.name} image`}
                      className="w-32 h-24 rounded-lg object-cover mt-1"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                {attraction.description && (
                  <p className="text-muted-foreground">{attraction.description}</p>
                )}
                {attraction.distance && (
                  <p><strong>Distance:</strong> {attraction.distance}</p>
                )}
                {attraction.category && (
                  <p><strong>Category:</strong> {attraction.category}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AttractionsManager;