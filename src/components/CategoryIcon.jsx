import {
  Utensils, Shirt, Sparkles, AtSign, Truck, Laptop, Home as HomeIcon,
  Smartphone, Dumbbell, GraduationCap, Landmark, PartyPopper, LayoutGrid,
} from 'lucide-react';

const ICONS = {
  utensils: Utensils,
  shirt: Shirt,
  sparkles: Sparkles,
  instagram: AtSign,
  truck: Truck,
  laptop: Laptop,
  home: HomeIcon,
  smartphone: Smartphone,
  dumbbell: Dumbbell,
  graduationCap: GraduationCap,
  landmark: Landmark,
  partyPopper: PartyPopper,
};

const CategoryIcon = ({ icon, size = 20, className = '' }) => {
  const Cmp = ICONS[icon] || LayoutGrid;
  return <Cmp size={size} className={className} strokeWidth={1.75} />;
};

export default CategoryIcon;
