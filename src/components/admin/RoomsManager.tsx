import { useState, useEffect, useRef } from "react";
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

interface Room {
  id: string;
  hotel_id: string | null;
  name: string;
  description: string | null;
  price: number | null;
  currency: string | null;
  images: string[] | null;
  amenities: string[] | null;
  max_occupancy: number | null;
  room_size: string | null;
  created_at: string;
}

const RoomsManager = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [hotelId, setHotelId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    currency: "INR",
    images: [] as string[],
    amenities: "",
    max_occupancy: "",
    room_size: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchRooms();
    fetchHotelId();
  }, []);

  const fetchRooms = async () => {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch rooms",
        variant: "destructive",
      });
    } else {
      setRooms(data || []);
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
      price: formData.price ? parseFloat(formData.price) : null,
      currency: formData.currency,
      images: formData.images.length > 0 ? formData.images : null,
      amenities: formData.amenities ? formData.amenities.split(",").map(a => a.trim()) : null,
      max_occupancy: formData.max_occupancy ? parseInt(formData.max_occupancy) : null,
      room_size: formData.room_size || null,
    };

    if (editingRoom) {
      const { error } = await supabase
        .from("rooms")
        .update(submitData)
        .eq("id", editingRoom.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update room",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Room updated successfully",
        });
        fetchRooms();
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from("rooms")
        .insert([submitData]);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create room",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Room created successfully",
        });
        fetchRooms();
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this room?")) return;

    const { error } = await supabase
      .from("rooms")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete room",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Room deleted successfully",
      });
      fetchRooms();
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      currency: "INR",
      images: [],
      amenities: "",
      max_occupancy: "",
      room_size: "",
    });
    setEditingRoom(null);
    setIsDialogOpen(false);
  };

  const openEditDialog = (room: Room) => {
    setFormData({
      name: room.name,
      description: room.description || "",
      price: room.price?.toString() || "",
      currency: room.currency || "INR",
      images: room.images || [],
      amenities: room.amenities?.join(", ") || "",
      max_occupancy: room.max_occupancy?.toString() || "",
      room_size: room.room_size || "",
    });
    setEditingRoom(room);
    setIsDialogOpen(true);
  };



  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Rooms Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingRoom(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingRoom ? "Edit Room" : "Add New Room"}
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
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <MultiImageUpload
                images={formData.images}
                onImagesChange={(images) => setFormData({ ...formData, images })}
                bucketName="room-images"
                label="Room Images"
                maxImages={8}
              />
              <div>
                <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                <Input
                  id="amenities"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  placeholder="WiFi, AC, TV, Mini Bar"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="max_occupancy">Max Occupancy</Label>
                  <Input
                    id="max_occupancy"
                    type="number"
                    value={formData.max_occupancy}
                    onChange={(e) => setFormData({ ...formData, max_occupancy: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="room_size">Room Size</Label>
                  <Input
                    id="room_size"
                    value={formData.room_size}
                    onChange={(e) => setFormData({ ...formData, room_size: e.target.value })}
                    placeholder="350 sq ft"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingRoom ? "Update" : "Create"}
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
        {rooms.map((room) => (
          <Card key={room.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {room.name}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(room)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(room.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Hotel:</strong> {HOTEL_NAME}</p>
                {room.description && (
                  <p className="text-muted-foreground">{room.description}</p>
                )}
                {room.price && (
                  <p><strong>Price:</strong> {room.currency} {room.price}</p>
                )}
                {room.max_occupancy && (
                  <p><strong>Max Occupancy:</strong> {room.max_occupancy} guests</p>
                )}
                {room.room_size && (
                  <p><strong>Size:</strong> {room.room_size}</p>
                )}
                {room.images && room.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    {room.images.slice(0, 4).map((imageUrl, index) => (
                      <div key={index} className="aspect-square w-full bg-muted rounded-md overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={`${room.name} - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {room.images.length > 4 && (
                      <div className="aspect-square w-full bg-muted rounded-md overflow-hidden flex items-center justify-center">
                        <span className="text-sm text-muted-foreground">+{room.images.length - 4} more</span>
                      </div>
                    )}
                  </div>
                )}
                {room.amenities && room.amenities.length > 0 && (
                  <p><strong>Amenities:</strong> {room.amenities.join(", ")}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RoomsManager;