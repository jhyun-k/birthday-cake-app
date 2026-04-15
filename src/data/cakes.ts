import { CakeTypeInfo } from '@/lib/types';

export const CAKE_TYPES: CakeTypeInfo[] = [
  {
    id: 'cream',
    name: '생크림',
    color: '#FFF8E7',
    gradientFrom: '#FFFDF5',
    gradientTo: '#F5E6C8',
    borderColor: '#E8D5B0',
    sideColor: '#F0DFC0',
  },
  {
    id: 'chocolate',
    name: '초코',
    color: '#5C3317',
    gradientFrom: '#7B4B2A',
    gradientTo: '#3E1F0D',
    borderColor: '#2E1508',
    sideColor: '#4A2812',
  },
  {
    id: 'strawberry',
    name: '딸기',
    color: '#FFB5C2',
    gradientFrom: '#FFCDD6',
    gradientTo: '#FF8FA3',
    borderColor: '#E87A90',
    sideColor: '#FF9DB0',
  },
  {
    id: 'vanilla',
    name: '바닐라',
    color: '#FFF3C4',
    gradientFrom: '#FFFBE0',
    gradientTo: '#FFE69A',
    borderColor: '#E8D080',
    sideColor: '#FFECAA',
  },
];

export function getCakeTypeInfo(id: string): CakeTypeInfo {
  return CAKE_TYPES.find((c) => c.id === id) || CAKE_TYPES[0];
}
