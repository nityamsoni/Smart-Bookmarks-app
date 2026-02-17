export type Bookmark = {
  id: string;
  user_id: string;
  title: string;
  url: string;
  category: string | null;
  is_favorite: boolean;
  is_pinned: boolean;
  created_at: string;
};
