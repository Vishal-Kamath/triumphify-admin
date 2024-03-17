export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  category_image: string | null;

  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;

  created_at: Date;
  updated_at: Date | null;
}
