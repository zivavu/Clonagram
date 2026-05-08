export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
   // Allows to automatically instantiate createClient with right options
   // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
   __InternalSupabase: {
      PostgrestVersion: '14.5';
   };
   public: {
      Tables: {
         comments: {
            Row: {
               content: string;
               created_at: string | null;
               id: string;
               parent_id: string | null;
               post_id: string;
               user_id: string;
            };
            Insert: {
               content: string;
               created_at?: string | null;
               id?: string;
               parent_id?: string | null;
               post_id: string;
               user_id: string;
            };
            Update: {
               content?: string;
               created_at?: string | null;
               id?: string;
               parent_id?: string | null;
               post_id?: string;
               user_id?: string;
            };
            Relationships: [
               {
                  foreignKeyName: 'comments_parent_id_fkey';
                  columns: ['parent_id'];
                  isOneToOne: false;
                  referencedRelation: 'comments';
                  referencedColumns: ['id'];
               },
               {
                  foreignKeyName: 'comments_post_id_fkey';
                  columns: ['post_id'];
                  isOneToOne: false;
                  referencedRelation: 'posts';
                  referencedColumns: ['id'];
               },
               {
                  foreignKeyName: 'comments_user_id_fkey';
                  columns: ['user_id'];
                  isOneToOne: false;
                  referencedRelation: 'profiles';
                  referencedColumns: ['id'];
               },
            ];
         };
         conversation_participants: {
            Row: {
               conversation_id: string;
               user_id: string;
            };
            Insert: {
               conversation_id: string;
               user_id: string;
            };
            Update: {
               conversation_id?: string;
               user_id?: string;
            };
            Relationships: [
               {
                  foreignKeyName: 'conversation_participants_conversation_id_fkey';
                  columns: ['conversation_id'];
                  isOneToOne: false;
                  referencedRelation: 'conversations';
                  referencedColumns: ['id'];
               },
               {
                  foreignKeyName: 'conversation_participants_user_id_fkey';
                  columns: ['user_id'];
                  isOneToOne: false;
                  referencedRelation: 'profiles';
                  referencedColumns: ['id'];
               },
            ];
         };
         conversations: {
            Row: {
               created_at: string | null;
               id: string;
            };
            Insert: {
               created_at?: string | null;
               id?: string;
            };
            Update: {
               created_at?: string | null;
               id?: string;
            };
            Relationships: [];
         };
         follows: {
            Row: {
               created_at: string | null;
               follower_id: string;
               following_id: string;
            };
            Insert: {
               created_at?: string | null;
               follower_id: string;
               following_id: string;
            };
            Update: {
               created_at?: string | null;
               follower_id?: string;
               following_id?: string;
            };
            Relationships: [
               {
                  foreignKeyName: 'follows_follower_id_fkey';
                  columns: ['follower_id'];
                  isOneToOne: false;
                  referencedRelation: 'profiles';
                  referencedColumns: ['id'];
               },
               {
                  foreignKeyName: 'follows_following_id_fkey';
                  columns: ['following_id'];
                  isOneToOne: false;
                  referencedRelation: 'profiles';
                  referencedColumns: ['id'];
               },
            ];
         };
         hashtags: {
            Row: {
               id: string;
               name: string;
            };
            Insert: {
               id?: string;
               name: string;
            };
            Update: {
               id?: string;
               name?: string;
            };
            Relationships: [];
         };
         likes: {
            Row: {
               created_at: string | null;
               post_id: string;
               user_id: string;
            };
            Insert: {
               created_at?: string | null;
               post_id: string;
               user_id: string;
            };
            Update: {
               created_at?: string | null;
               post_id?: string;
               user_id?: string;
            };
            Relationships: [
               {
                  foreignKeyName: 'likes_post_id_fkey';
                  columns: ['post_id'];
                  isOneToOne: false;
                  referencedRelation: 'posts';
                  referencedColumns: ['id'];
               },
               {
                  foreignKeyName: 'likes_user_id_fkey';
                  columns: ['user_id'];
                  isOneToOne: false;
                  referencedRelation: 'profiles';
                  referencedColumns: ['id'];
               },
            ];
         };
         messages: {
            Row: {
               content: string | null;
               conversation_id: string;
               created_at: string | null;
               id: string;
               media_url: string | null;
               sender_id: string;
            };
            Insert: {
               content?: string | null;
               conversation_id: string;
               created_at?: string | null;
               id?: string;
               media_url?: string | null;
               sender_id: string;
            };
            Update: {
               content?: string | null;
               conversation_id?: string;
               created_at?: string | null;
               id?: string;
               media_url?: string | null;
               sender_id?: string;
            };
            Relationships: [
               {
                  foreignKeyName: 'messages_conversation_id_fkey';
                  columns: ['conversation_id'];
                  isOneToOne: false;
                  referencedRelation: 'conversations';
                  referencedColumns: ['id'];
               },
               {
                  foreignKeyName: 'messages_sender_id_fkey';
                  columns: ['sender_id'];
                  isOneToOne: false;
                  referencedRelation: 'profiles';
                  referencedColumns: ['id'];
               },
            ];
         };
         notifications: {
            Row: {
               actor_id: string;
               comment_id: string | null;
               created_at: string | null;
               id: string;
               post_id: string | null;
               read: boolean | null;
               type: string;
               user_id: string;
            };
            Insert: {
               actor_id: string;
               comment_id?: string | null;
               created_at?: string | null;
               id?: string;
               post_id?: string | null;
               read?: boolean | null;
               type: string;
               user_id: string;
            };
            Update: {
               actor_id?: string;
               comment_id?: string | null;
               created_at?: string | null;
               id?: string;
               post_id?: string | null;
               read?: boolean | null;
               type?: string;
               user_id?: string;
            };
            Relationships: [
               {
                  foreignKeyName: 'notifications_actor_id_fkey';
                  columns: ['actor_id'];
                  isOneToOne: false;
                  referencedRelation: 'profiles';
                  referencedColumns: ['id'];
               },
               {
                  foreignKeyName: 'notifications_comment_id_fkey';
                  columns: ['comment_id'];
                  isOneToOne: false;
                  referencedRelation: 'comments';
                  referencedColumns: ['id'];
               },
               {
                  foreignKeyName: 'notifications_post_id_fkey';
                  columns: ['post_id'];
                  isOneToOne: false;
                  referencedRelation: 'posts';
                  referencedColumns: ['id'];
               },
               {
                  foreignKeyName: 'notifications_user_id_fkey';
                  columns: ['user_id'];
                  isOneToOne: false;
                  referencedRelation: 'profiles';
                  referencedColumns: ['id'];
               },
            ];
         };
         post_hashtags: {
            Row: {
               hashtag_id: string;
               post_id: string;
            };
            Insert: {
               hashtag_id: string;
               post_id: string;
            };
            Update: {
               hashtag_id?: string;
               post_id?: string;
            };
            Relationships: [
               {
                  foreignKeyName: 'post_hashtags_hashtag_id_fkey';
                  columns: ['hashtag_id'];
                  isOneToOne: false;
                  referencedRelation: 'hashtags';
                  referencedColumns: ['id'];
               },
               {
                  foreignKeyName: 'post_hashtags_post_id_fkey';
                  columns: ['post_id'];
                  isOneToOne: false;
                  referencedRelation: 'posts';
                  referencedColumns: ['id'];
               },
            ];
         };
         post_media: {
            Row: {
               created_at: string | null;
               id: string;
               mux_asset_id: string | null;
               mux_playback_id: string | null;
               mux_status: string | null;
               position: number;
               post_id: string;
               thumbnail_url: string | null;
               type: string;
               url: string;
            };
            Insert: {
               created_at?: string | null;
               id?: string;
               mux_asset_id?: string | null;
               mux_playback_id?: string | null;
               mux_status?: string | null;
               position?: number;
               post_id: string;
               thumbnail_url?: string | null;
               type: string;
               url: string;
            };
            Update: {
               created_at?: string | null;
               id?: string;
               mux_asset_id?: string | null;
               mux_playback_id?: string | null;
               mux_status?: string | null;
               position?: number;
               post_id?: string;
               thumbnail_url?: string | null;
               type?: string;
               url?: string;
            };
            Relationships: [
               {
                  foreignKeyName: 'post_media_post_id_fkey';
                  columns: ['post_id'];
                  isOneToOne: false;
                  referencedRelation: 'posts';
                  referencedColumns: ['id'];
               },
            ];
         };
         posts: {
            Row: {
               caption: string | null;
               created_at: string | null;
               id: string;
               type: string;
               user_id: string;
            };
            Insert: {
               caption?: string | null;
               created_at?: string | null;
               id?: string;
               type: string;
               user_id: string;
            };
            Update: {
               caption?: string | null;
               created_at?: string | null;
               id?: string;
               type?: string;
               user_id?: string;
            };
            Relationships: [
               {
                  foreignKeyName: 'posts_user_id_fkey';
                  columns: ['user_id'];
                  isOneToOne: false;
                  referencedRelation: 'profiles';
                  referencedColumns: ['id'];
               },
            ];
         };
         profiles: {
            Row: {
               avatar_url: string | null;
               bio: string | null;
               created_at: string | null;
               full_name: string | null;
               id: string;
               updated_at: string | null;
               username: string;
               website: string | null;
            };
            Insert: {
               avatar_url?: string | null;
               bio?: string | null;
               created_at?: string | null;
               full_name?: string | null;
               id: string;
               updated_at?: string | null;
               username: string;
               website?: string | null;
            };
            Update: {
               avatar_url?: string | null;
               bio?: string | null;
               created_at?: string | null;
               full_name?: string | null;
               id?: string;
               updated_at?: string | null;
               username?: string;
               website?: string | null;
            };
            Relationships: [];
         };
         saves: {
            Row: {
               created_at: string | null;
               post_id: string;
               user_id: string;
            };
            Insert: {
               created_at?: string | null;
               post_id: string;
               user_id: string;
            };
            Update: {
               created_at?: string | null;
               post_id?: string;
               user_id?: string;
            };
            Relationships: [
               {
                  foreignKeyName: 'saves_post_id_fkey';
                  columns: ['post_id'];
                  isOneToOne: false;
                  referencedRelation: 'posts';
                  referencedColumns: ['id'];
               },
               {
                  foreignKeyName: 'saves_user_id_fkey';
                  columns: ['user_id'];
                  isOneToOne: false;
                  referencedRelation: 'profiles';
                  referencedColumns: ['id'];
               },
            ];
         };
         stories: {
            Row: {
               created_at: string | null;
               expires_at: string;
               id: string;
               user_id: string;
            };
            Insert: {
               created_at?: string | null;
               expires_at?: string;
               id?: string;
               user_id: string;
            };
            Update: {
               created_at?: string | null;
               expires_at?: string;
               id?: string;
               user_id?: string;
            };
            Relationships: [
               {
                  foreignKeyName: 'stories_user_id_fkey';
                  columns: ['user_id'];
                  isOneToOne: false;
                  referencedRelation: 'profiles';
                  referencedColumns: ['id'];
               },
            ];
         };
         story_media: {
            Row: {
               created_at: string | null;
               id: string;
               position: number;
               story_id: string;
               type: string;
               url: string;
            };
            Insert: {
               created_at?: string | null;
               id?: string;
               position?: number;
               story_id: string;
               type: string;
               url: string;
            };
            Update: {
               created_at?: string | null;
               id?: string;
               position?: number;
               story_id?: string;
               type?: string;
               url?: string;
            };
            Relationships: [
               {
                  foreignKeyName: 'story_media_story_id_fkey';
                  columns: ['story_id'];
                  isOneToOne: false;
                  referencedRelation: 'stories';
                  referencedColumns: ['id'];
               },
            ];
         };
         story_views: {
            Row: {
               story_id: string;
               viewed_at: string | null;
               viewer_id: string;
            };
            Insert: {
               story_id: string;
               viewed_at?: string | null;
               viewer_id: string;
            };
            Update: {
               story_id?: string;
               viewed_at?: string | null;
               viewer_id?: string;
            };
            Relationships: [
               {
                  foreignKeyName: 'story_views_story_id_fkey';
                  columns: ['story_id'];
                  isOneToOne: false;
                  referencedRelation: 'stories';
                  referencedColumns: ['id'];
               },
               {
                  foreignKeyName: 'story_views_viewer_id_fkey';
                  columns: ['viewer_id'];
                  isOneToOne: false;
                  referencedRelation: 'profiles';
                  referencedColumns: ['id'];
               },
            ];
         };
      };
      Views: {
         [_ in never]: never;
      };
      Functions: {
         [_ in never]: never;
      };
      Enums: {
         [_ in never]: never;
      };
      CompositeTypes: {
         [_ in never]: never;
      };
   };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
   DefaultSchemaTableNameOrOptions extends
      | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
      | { schema: keyof DatabaseWithoutInternals },
   TableName extends DefaultSchemaTableNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals;
   }
      ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
           DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
      : never = never,
> = DefaultSchemaTableNameOrOptions extends {
   schema: keyof DatabaseWithoutInternals;
}
   ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
        Row: infer R;
     }
      ? R
      : never
   : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
     ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
          Row: infer R;
       }
        ? R
        : never
     : never;

export type TablesInsert<
   DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
   TableName extends DefaultSchemaTableNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals;
   }
      ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
      : never = never,
> = DefaultSchemaTableNameOrOptions extends {
   schema: keyof DatabaseWithoutInternals;
}
   ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
        Insert: infer I;
     }
      ? I
      : never
   : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
     ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
          Insert: infer I;
       }
        ? I
        : never
     : never;

export type TablesUpdate<
   DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
   TableName extends DefaultSchemaTableNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals;
   }
      ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
      : never = never,
> = DefaultSchemaTableNameOrOptions extends {
   schema: keyof DatabaseWithoutInternals;
}
   ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
        Update: infer U;
     }
      ? U
      : never
   : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
     ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
          Update: infer U;
       }
        ? U
        : never
     : never;

export type Enums<
   DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
   EnumName extends DefaultSchemaEnumNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals;
   }
      ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
      : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
   schema: keyof DatabaseWithoutInternals;
}
   ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
   : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
     ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
     : never;

export type CompositeTypes<
   PublicCompositeTypeNameOrOptions extends
      | keyof DefaultSchema['CompositeTypes']
      | { schema: keyof DatabaseWithoutInternals },
   CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
      schema: keyof DatabaseWithoutInternals;
   }
      ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
      : never = never,
> = PublicCompositeTypeNameOrOptions extends {
   schema: keyof DatabaseWithoutInternals;
}
   ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
   : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
     ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
     : never;

export const Constants = {
   public: {
      Enums: {},
   },
} as const;
