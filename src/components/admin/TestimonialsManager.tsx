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
import { Plus, Edit, Trash2, Star } from "lucide-react";

// Hotel constant - since we're always using Thendral Park Inn
const HOTEL_NAME = "Thendral Park Inn";

interface Testimonial {
  id: string;
  hotel_id: string | null;
  guest_name: string;
  guest_location: string | null;
  rating: number | null;
  review_text: string;
  image_url: string | null;
  created_at: string;
}

const TestimonialsManager = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [hotelId, setHotelId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    guest_name: "",
    guest_location: "",
    rating: "",
    review_text: "",
    image_url: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTestimonials();
    fetchHotelId();
  }, []);

  const fetchTestimonials = async () => {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch testimonials",
        variant: "destructive",
      });
    } else {
      // Transform the data to match our interface
      const transformedData = (data || []).map((item: any) => ({
        ...item,
        image_url: item.guest_image_url || item.image_url,
      }));
      setTestimonials(transformedData);
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

    if (!hotelId) {
      toast({
        title: "Error",
        description: "Hotel information not loaded. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }

    const submitData = {
      hotel_id: hotelId,
      guest_name: formData.guest_name,
      guest_location: formData.guest_location || null,
      rating: formData.rating ? parseInt(formData.rating) : null,
      review_text: formData.review_text,
      image_url: formData.image_url || null,
    };

    console.log('Submitting testimonial data:', submitData);

    if (editingTestimonial) {
      const { error } = await supabase
        .from("testimonials")
        .update(submitData)
        .eq("id", editingTestimonial.id);

      if (error) {
        console.error('Update testimonial error:', error);
        toast({
          title: "Error",
          description: `Failed to update testimonial: ${error.message}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Testimonial updated successfully",
        });
        fetchTestimonials();
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from("testimonials")
        .insert([submitData]);

      if (error) {
        console.error('Create testimonial error:', error);
        toast({
          title: "Error",
          description: `Failed to create testimonial: ${error.message}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Testimonial created successfully",
        });
        fetchTestimonials();
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    const { error } = await supabase
      .from("testimonials")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete testimonial",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Testimonial deleted successfully",
      });
      fetchTestimonials();
    }
  };

  const resetForm = () => {
    setFormData({
      guest_name: "",
      guest_location: "",
      rating: "",
      review_text: "",
      image_url: "",
    });
    setEditingTestimonial(null);
    setIsDialogOpen(false);
  };

  const openEditDialog = (testimonial: Testimonial) => {
    setFormData({
      guest_name: testimonial.guest_name,
      guest_location: testimonial.guest_location || "",
      rating: testimonial.rating?.toString() || "",
      review_text: testimonial.review_text,
      image_url: testimonial.image_url || "",
    });
    setEditingTestimonial(testimonial);
    setIsDialogOpen(true);
  };



  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Testimonials Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingTestimonial(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}
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
                <Label htmlFor="guest_name">Guest Name *</Label>
                <Input
                  id="guest_name"
                  value={formData.guest_name}
                  onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="guest_location">Guest Location</Label>
                <Input
                  id="guest_location"
                  value={formData.guest_location}
                  onChange={(e) => setFormData({ ...formData, guest_location: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="image_url">Guest Image URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <Label htmlFor="rating">Rating (1-5)</Label>
                <Select value={formData.rating} onValueChange={(value) => setFormData({ ...formData, rating: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Star</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="review_text">Review Text *</Label>
                <Textarea
                  id="review_text"
                  value={formData.review_text}
                  onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingTestimonial ? "Update" : "Create"}
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
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div className="flex flex-col items-start">
                  <span>{testimonial.guest_name}</span>
                  {testimonial.rating && renderStars(testimonial.rating)}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(testimonial)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(testimonial.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Hotel:</strong> {HOTEL_NAME}</p>
                {testimonial.guest_location && (
                  <p><strong>Location:</strong> {testimonial.guest_location}</p>
                )}
                {testimonial.image_url && (
                  <div>
                    <p><strong>Guest Image:</strong></p>
                    <img
                      src={testimonial.image_url}
                      alt={`${testimonial.guest_name}'s photo`}
                      className="w-16 h-16 rounded-full object-cover mt-1"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <p className="text-muted-foreground italic">"{testimonial.review_text}"</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsManager;