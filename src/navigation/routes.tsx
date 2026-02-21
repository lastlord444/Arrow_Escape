import type { ComponentType, JSX } from 'react';

import { LevelSelectPage } from '@/pages/LevelSelectPage/LevelSelectPage';
import { GamePage } from '@/pages/GamePage/GamePage';

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes: Route[] = [
  { path: '/', Component: LevelSelectPage, title: 'Seviye Sec' },
  { path: '/play/:id', Component: GamePage, title: 'Oyun' },
];
