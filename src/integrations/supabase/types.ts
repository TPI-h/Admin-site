export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      amenities: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          hotel_id: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          hotel_id?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          hotel_id?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "amenities_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      attractions: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          distance: string | null
          hotel_id: string | null
          id: string
          image_url: string | null
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          distance?: string | null
          hotel_id?: string | null
          id?: string
          image_url?: string | null
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          distance?: string | null
          hotel_id?: string | null
          id?: string
          image_url?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "attractions_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          hotel_id: string | null
          id: string
          image_url: string
          title: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          hotel_id?: string | null
          id?: string
          image_url: string
          title?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          hotel_id?: string | null
          id?: string
          image_url?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gallery_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      hotels: {
        Row: {
          address: string | null
          created_at: string | null
          description: string | null
          email: string | null
          id: string
          images: string[] | null
          name: string
          phone: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          images?: string[] | null
          name: string
          phone?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          id?: string
          images?: string[] | null
          name?: string
          phone?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      rooms: {
        Row: {
          amenities: string[] | null
          created_at: string | null
          currency: string | null
          description: string | null
          hotel_id: string | null
          id: string
          images: string[] | null
          max_occupancy: number | null
          name: string
          price: number | null
          room_size: string | null
          updated_at: string | null
        }
        Insert: {
          amenities?: string[] | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          hotel_id?: string | null
          id?: string
          images?: string[] | null
          max_occupancy?: number | null
          name: string
          price?: number | null
          room_size?: string | null
          updated_at?: string | null
        }
        Update: {
          amenities?: string[] | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          hotel_id?: string | null
          id?: string
          images?: string[] | null
          max_occupancy?: number | null
          name?: string
          price?: number | null
          room_size?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rooms_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          created_at: string | null
          guest_image_url: string | null
          guest_location: string | null
          guest_name: string
          hotel_id: string | null
          id: string
          rating: number | null
          review_text: string
        }
        Insert: {
          created_at?: string | null
          guest_image_url?: string | null
          guest_location?: string | null
          guest_name: string
          hotel_id?: string | null
          id?: string
          rating?: number | null
          review_text: string
        }
        Update: {
          created_at?: string | null
          guest_image_url?: string | null
          guest_location?: string | null
          guest_name?: string
          hotel_id?: string | null
          id?: string
          rating?: number | null
          review_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
