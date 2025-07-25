import { HugeiconsIcon } from '@hugeicons/vue';
import {
  KitchenUtensilsIcon,
  Layers01Icon,
  Store01Icon,
  TradeMarkIcon,
} from '@hugeicons/core-free-icons';

export const adminSidebarMenu = [
  {
    name: 'POS',
    path: '/',
    iconComponent: HugeiconsIcon,
    iconProps: { icon: Store01Icon, size: 22 },
  },
  {
    name: 'Products',
    path: '/products',
    iconComponent: HugeiconsIcon,
    iconProps: { icon: KitchenUtensilsIcon, size: 22 },
  },
  {
    name: 'Categorias',
    path: '/categories',
    iconComponent: HugeiconsIcon,
    iconProps: { icon: Layers01Icon, size: 22 },
  },
  {
    name: 'Marcas',
    path: '/brands',
    iconComponent: HugeiconsIcon,
    iconProps: { icon: TradeMarkIcon, size: 22 },
  },
];