import { AttributesWithState } from "./attribute";

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand_name: string;
  category_id: string;

  description: string;
  product_accordians: {
    title: string;
    description: string;
  }[];
  product_images: string[];

  meta_title: string;
  meta_description: string;
  meta_keywords: string;

  created_at: Date;
  updated_at: Date | null;
}

export interface ProductDetails extends Product {
  variations: {
    id: string;
    key: string;
    combinations: Record<string, string>;
    quantity: number;
    discount: number;
    price: number;
  }[];
  attributes: AttributesWithState[];
}

export type TemplateAContent = {
  title: string;
  description: string;
  template_image: string;
};
interface TemplateAShema {
  template: "A";
  content: TemplateAContent;
}

export type TemplateBContent = {
  title0: string;
  description0: string;
  template_image0: string;
  title1: string;
  description1: string;
  template_image1: string;
  title2: string;
  description2: string;
  template_image2: string;
};
interface TemplateBShema {
  template: "B";
  content: TemplateBContent;
}

export type TemplateCContent = {
  title0: string;
  description0: string;
  template_image0: string;
  title1: string;
  description1: string;
  template_image1: string;
};
interface TemplateCShema {
  template: "C";
  content: TemplateCContent;
}

export type Showcase = {
  id: string;
  product_id: string;
  index: number;
  created_at?: Date;
  updated_at?: Date | null;
} & (TemplateAShema | TemplateBShema | TemplateCShema);

export interface ProductReview {
  id: string;
  product_id: string;
  pinned: boolean;
  user_id: string;
  user_username: string;
  user_image: string;
  review_title: string;
  review_description: string;
  rating: number;
  status: "pending" | "approved" | "rejected";

  created_at: Date;
  updated_at: Date | null;
}

export interface Variation {
  id: string;
  key: string;
  combinations: unknown;
  quantity: number;
  discount: number;
  price: number;
}

export interface ProductReview {
  id: string;
  product_id: string;
  user_username: string;
  user_image: string;
  review_title: string;
  review_description: string;
  rating: number;
  status: "pending" | "approved" | "rejected";

  created_at: Date;
  updated_at: Date | null;
}

export interface ProductReviewTableType {
  product_id: string;
  product_name: string;
  product_images: string[];
  count: number;
  avg_rating: string;
}

export interface ProductReviewStats {
  ratings: {
    rating: number;
    count: number;
  }[];
  total_reviews: number;
  average_rating: number;
}