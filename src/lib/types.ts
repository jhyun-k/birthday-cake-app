export interface Cake {
  id: string;
  ownerName: string;
  birthday: string; // YYYY-MM-DD
  cakeType: CakeType;
  createdAt: number;
}

export type CakeType = 'cream' | 'chocolate' | 'strawberry' | 'vanilla';

export interface CakeTypeInfo {
  id: CakeType;
  name: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
  sideColor: string;
}

export interface Topping {
  id: string;
  emoji: string;
  name: string;
  category: 'fruit' | 'sweet' | 'decoration';
}

export interface Message {
  id: string;
  cakeId: string;
  author: string;
  content: string;
  isAnonymous: boolean;
  isSecret: boolean;
  password?: string;
  toppingId: string;
  positionX: number;
  positionY: number;
  createdAt: number;
}
