import { Topping } from '@/lib/types';

export const TOPPINGS: Topping[] = [
  // 과일 (Fruits)
  { id: 'strawberry', emoji: '🍓', name: '딸기', category: 'fruit' },
  { id: 'blueberry', emoji: '🫐', name: '블루베리', category: 'fruit' },
  { id: 'cherry', emoji: '🍒', name: '체리', category: 'fruit' },
  { id: 'grape', emoji: '🍇', name: '포도', category: 'fruit' },
  { id: 'orange', emoji: '🍊', name: '오렌지', category: 'fruit' },

  // 과자/사탕 (Sweets)
  { id: 'cookie', emoji: '🍪', name: '쿠키', category: 'sweet' },
  { id: 'chocolate', emoji: '🍫', name: '초콜릿', category: 'sweet' },
  { id: 'candy', emoji: '🍬', name: '사탕', category: 'sweet' },
  { id: 'lollipop', emoji: '🍭', name: '막대사탕', category: 'sweet' },
  { id: 'macaron', emoji: '🧁', name: '마카롱', category: 'sweet' },

  // 장식 (Decorations)
  { id: 'candle', emoji: '🕯️', name: '초', category: 'decoration' },
  { id: 'sparkle', emoji: '✨', name: '반짝이', category: 'decoration' },
  { id: 'star', emoji: '⭐', name: '별', category: 'decoration' },
  { id: 'ribbon', emoji: '🎀', name: '리본', category: 'decoration' },
  { id: 'party', emoji: '🎉', name: '파티', category: 'decoration' },
  { id: 'heart', emoji: '❤️', name: '하트', category: 'decoration' },
  { id: 'flower', emoji: '🌸', name: '꽃', category: 'decoration' },
  { id: 'gift', emoji: '🎁', name: '선물', category: 'decoration' },
];

export function getToppingById(id: string): Topping | undefined {
  return TOPPINGS.find((t) => t.id === id);
}
