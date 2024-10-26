export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      chat: {
        Row: {
          authorId: string
          chatId: number
          communityId: number | null
          createdAt: string
          height: number | null
          imageUrl: string | null
          message: string | null
          talkId: number | null
          width: number | null
        }
        Insert: {
          authorId: string
          chatId?: number
          communityId?: number | null
          createdAt?: string
          height?: number | null
          imageUrl?: string | null
          message?: string | null
          talkId?: number | null
          width?: number | null
        }
        Update: {
          authorId?: string
          chatId?: number
          communityId?: number | null
          createdAt?: string
          height?: number | null
          imageUrl?: string | null
          message?: string | null
          talkId?: number | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_authorId_fkey"
            columns: ["authorId"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["userId"]
          }
        ]
      }
      community: {
        Row: {
          category: string
          color: string
          communityId: number
          createdAt: string
          description: string
          imageUrl: string | null
          memberIds: string[] | null
          name: string
          ownerId: string
          updatedAt: string
        }
        Insert: {
          category: string
          color: string
          communityId?: number
          createdAt?: string
          description: string
          imageUrl?: string | null
          memberIds?: string[] | null
          name: string
          ownerId: string
          updatedAt?: string
        }
        Update: {
          category?: string
          color?: string
          communityId?: number
          createdAt?: string
          description?: string
          imageUrl?: string | null
          memberIds?: string[] | null
          name?: string
          ownerId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_ownerId_fkey"
            columns: ["ownerId"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["userId"]
          }
        ]
      }
      farm: {
        Row: {
          createdAt: string
          crop: string
          description: string
          farmId: number
          imageUrls: string[] | null
          latitude: number
          location: unknown | null
          longitude: number
          name: string
          ownerId: string
          privated: boolean
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          crop: string
          description: string
          farmId?: number
          imageUrls?: string[] | null
          latitude: number
          location?: unknown | null
          longitude: number
          name: string
          ownerId: string
          privated: boolean
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          crop?: string
          description?: string
          farmId?: number
          imageUrls?: string[] | null
          latitude?: number
          location?: unknown | null
          longitude?: number
          name?: string
          ownerId?: string
          privated?: boolean
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "farm_ownerId_fkey"
            columns: ["ownerId"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["userId"]
          }
        ]
      }
      like: {
        Row: {
          createdAt: string
          farmId: number | null
          likeId: number
          rentalId: number | null
          userId: string
        }
        Insert: {
          createdAt?: string
          farmId?: number | null
          likeId?: number
          rentalId?: number | null
          userId: string
        }
        Update: {
          createdAt?: string
          farmId?: number | null
          likeId?: number
          rentalId?: number | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "like_farmId_fkey"
            columns: ["farmId"]
            isOneToOne: false
            referencedRelation: "farm"
            referencedColumns: ["farmId"]
          },
          {
            foreignKeyName: "like_rentalId_fkey"
            columns: ["rentalId"]
            isOneToOne: false
            referencedRelation: "rental"
            referencedColumns: ["rentalId"]
          }
        ]
      }
      notification: {
        Row: {
          clicked: boolean
          createdAt: string
          farmId: number | null
          notificationId: number
          recieverId: string
          rentalId: number | null
          senderId: string
          talkId: number | null
        }
        Insert: {
          clicked: boolean
          createdAt?: string
          farmId?: number | null
          notificationId?: number
          recieverId: string
          rentalId?: number | null
          senderId: string
          talkId?: number | null
        }
        Update: {
          clicked?: boolean
          createdAt?: string
          farmId?: number | null
          notificationId?: number
          recieverId?: string
          rentalId?: number | null
          senderId?: string
          talkId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_farmId_fkey"
            columns: ["farmId"]
            isOneToOne: false
            referencedRelation: "farm"
            referencedColumns: ["farmId"]
          },
          {
            foreignKeyName: "notification_recieverId_fkey"
            columns: ["recieverId"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "notification_rentalId_fkey"
            columns: ["rentalId"]
            isOneToOne: false
            referencedRelation: "rental"
            referencedColumns: ["rentalId"]
          },
          {
            foreignKeyName: "notification_senderId_fkey"
            columns: ["senderId"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "notification_talkId_fkey"
            columns: ["talkId"]
            isOneToOne: false
            referencedRelation: "talk"
            referencedColumns: ["talkId"]
          }
        ]
      }
      record: {
        Row: {
          amount: string
          createdAt: string
          farmId: number | null
          note: string | null
          pesticide: string
          ratio: number
          recordId: number
          updateAt: string
          weather: string
          work: string
        }
        Insert: {
          amount: string
          createdAt?: string
          farmId?: number | null
          note?: string | null
          pesticide: string
          ratio: number
          recordId?: number
          updateAt?: string
          weather: string
          work: string
        }
        Update: {
          amount?: string
          createdAt?: string
          farmId?: number | null
          note?: string | null
          pesticide?: string
          ratio?: number
          recordId?: number
          updateAt?: string
          weather?: string
          work?: string
        }
        Relationships: [
          {
            foreignKeyName: "record_farmId_fkey"
            columns: ["farmId"]
            isOneToOne: false
            referencedRelation: "farm"
            referencedColumns: ["farmId"]
          }
        ]
      }
      rental: {
        Row: {
          area: number | null
          city: string | null
          createdAt: string
          description: string
          equipment: string[] | null
          fee: number
          imageUrls: string[] | null
          latitude: number
          location: unknown
          longitude: number
          name: string
          ownerId: string
          prefecture: string | null
          privated: boolean
          rate: string
          rentalId: number
          updatedAt: string
          like_count: number | null
        }
        Insert: {
          area?: number | null
          city?: string | null
          createdAt?: string
          description: string
          equipment?: string[] | null
          fee: number
          imageUrls?: string[] | null
          latitude: number
          location?: unknown
          longitude: number
          name: string
          ownerId: string
          prefecture?: string | null
          privated: boolean
          rate: string
          rentalId?: number
          updatedAt?: string
        }
        Update: {
          area?: number | null
          city?: string | null
          createdAt?: string
          description?: string
          equipment?: string[] | null
          fee?: number
          imageUrls?: string[] | null
          latitude?: number
          location?: unknown
          longitude?: number
          name?: string
          ownerId?: string
          prefecture?: string | null
          privated?: boolean
          rate?: string
          rentalId?: number
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "rental_ownerId_fkey"
            columns: ["ownerId"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["userId"]
          }
        ]
      }
      talk: {
        Row: {
          chatId: number | null
          createdAt: string
          recieverId: string
          senderId: string
          talkId: number
          updatedAt: string
        }
        Insert: {
          chatId?: number | null
          createdAt?: string
          recieverId: string
          senderId: string
          talkId?: number
          updatedAt?: string
        }
        Update: {
          chatId?: number | null
          createdAt?: string
          recieverId?: string
          senderId?: string
          talkId?: number
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "talk_chatId_fkey"
            columns: ["chatId"]
            isOneToOne: false
            referencedRelation: "chat"
            referencedColumns: ["chatId"]
          },
          {
            foreignKeyName: "talk_recieverId_fkey"
            columns: ["recieverId"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["userId"]
          },
          {
            foreignKeyName: "talk_senderId_fkey"
            columns: ["senderId"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["userId"]
          }
        ]
      }
      user: {
        Row: {
          avatarUrl: string | null
          color: string
          createdAt: string
          name: string
          profile: string | null
          stripeId: string | null
          token: string | null
          updatedAt: string
          userId: string
        }
        Insert: {
          avatarUrl?: string | null
          color?: string
          createdAt?: string
          name: string
          profile?: string | null
          stripeId?: string | null
          token?: string | null
          updatedAt?: string
          userId: string
        }
        Update: {
          avatarUrl?: string | null
          color?: string
          createdAt?: string
          name?: string
          profile?: string | null
          stripeId?: string | null
          token?: string | null
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_userId_fkey"
            columns: ["userId"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      like_count: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      sort_by_location_farm: {
        Args: {
          lat: number
          long: number
        }
        Returns: Record<string, unknown>[]
      }
      sort_by_location_rental: {
        Args: {
          lat: number
          long: number
        }
        Returns: Record<string, unknown>[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
