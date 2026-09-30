export interface Category {
  id: number;
  name: string;
}

export interface Product {
  ID: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  category_id: number;
  category: Category;
}