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
import { MultiImageUpload } from "@/components/ui/multi-image-upload";

// Hotel constant - since we're always using Thendral Park Inn
const HOTEL_NAME = "Thendral Park Inn";

interface GalleryItem {
  id: string;
  hotel_id: string | null;
  image_url: string;
  title: string | null;
  description: string | null;
  category: string | null;
  created_at: string;
}

const GalleryManager = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [hotelId, setHotelId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [formData, setFormData] = useState({
    images: [] as string[],
    title: "",
    description: "",
    category: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchGalleryItems();
    fetchHotelId();
  }, []);

  const fetchGalleryItems = async () => {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch gallery items",
        variant: "destructive",
      });
    } else {
      setGalleryItems(data || []);
    }
  };

  const fetchHotelId = async () => {
    const { data, error } = await supabase
      .from('hotels')
      .select('id')
      .eq('name', HOTEL_NAME)
      .single();

    if (error) {
      console.error('Error fetching hotel:', error);
      toast({
        title: "Error",
        description: "Failed to load hotel information",
        variant: "destructive",
      });
      return;
    }

    if (data) {
      setHotelId(data.id);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.images.length === 0) {
      toast({
        title: "Error",
        description: "Please upload at least one image for the gallery",
        variant: "destructive",
      });
      return;
    }

    // Create multiple gallery items, one for each image
    const galleryItems = formData.images.map(imageUrl => ({
      hotel_id: hotelId,
      image_url: imageUrl,
      title: formData.title || null,
      description: formData.description || null,
      category: formData.category || null,
    }));

    if (editingItem) {
      // For editing, we'll update the existing item with the first image
      // and create new items for any additional images
      const updateData = {
        hotel_id: hotelId,
        image_url: formData.images[0],
        title: formData.title || null,
        description: formData.description || null,
        category: formData.category || null,
      };

      const { error: updateError } = await supabase
        .from("gallery")
        .update(updateData)
        .eq("id", editingItem.id);

      if (updateError) {
        toast({
          title: "Error",
          description: "Failed to update gallery item",
          variant: "destructive",
        });
        return;
      }

      // Insert additional images as new items
      if (formData.images.length > 1) {
        const additionalItems = formData.images.slice(1).map(imageUrl => ({
          hotel_id: hotelId,
          image_url: imageUrl,
          title: formData.title || null,
          description: formData.description || null,
          category: formData.category || null,
        }));

        const { error: insertError } = await supabase
          .from("gallery")
          .insert(additionalItems);

        if (insertError) {
          toast({
            title: "Warning",
            description: "Main item updated but failed to add additional images",
            variant: "destructive",
          });
        }
      }

      toast({
        title: "Success",
        description: "Gallery item updated successfully",
      });
    } else {
      const { error } = await supabase
        .from("gallery")
        .insert(galleryItems);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create gallery items",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: `${galleryItems.length} gallery item(s) created successfully`,
      });
    }

    fetchGalleryItems();
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return;

    const { error } = await supabase
      .from("gallery")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete gallery item",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Gallery item deleted successfully",
      });
      fetchGalleryItems();
    }
  };

  const resetForm = () => {
    setFormData({
      images: [],
      title: "",
      description: "",
      category: "",
    });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const openEditDialog = (item: GalleryItem) => {
    setFormData({
      images: [item.image_url],
      title: item.title || "",
      description: item.description || "",
      category: item.category || "",
    });
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const getHotelName = () => {
    return HOTEL_NAME;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gallery Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingItem(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Gallery Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Gallery Item" : "Add New Gallery Item"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Hotel</Label>
                <div className="p-2 bg-gray-50 rounded border">
                  {HOTEL_NAME}
                </div>
              </div>
              <MultiImageUpload
                images={formData.images}
                onImagesChange={(images) => setFormData({ ...formData, images })}
                bucketName="gallery-images"
                label="Gallery Images"
                maxImages={10}
              />
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exterior">Exterior</SelectItem>
                    <SelectItem value="lobby">Lobby</SelectItem>
                    <SelectItem value="rooms">Rooms</SelectItem>
                    <SelectItem value="amenities">Amenities</SelectItem>
                    <SelectItem value="dining">Dining</SelectItem>
                    <SelectItem value="events">Events</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingItem ? "Update" : "Create"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {galleryItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center text-sm">
                <span>{item.title || "Untitled"}</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="aspect-video w-full bg-muted rounded-md overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title || "Gallery item"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                </div>
                <p><strong>Hotel:</strong> {getHotelName()}</p>
                {item.category && (
                  <p><strong>Category:</strong> {item.category}</p>
                )}
                {item.description && (
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GalleryManager;