// src/app/models/Product.model.ts

export interface Topping {
  _id: string;
  name: string;
  __v?: number;
}

export interface IceCream {
  _id: string;
  name: string;
  __v?: number;
}

export interface Products {
  _id: string;
  name: string;
  photo: string;
  description: string;
  recommendation: string;
  price: number;
  category: string;
  toppings: Topping[];     // ✅ AGREGADO
  iceCream: IceCream[];    // ✅ AGREGADO
  deletedAt?: null;
  __v?: number;
}