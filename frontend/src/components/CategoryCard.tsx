import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  icon: LucideIcon;
  title: string;
  count: number;
  link: string;
}

export default function CategoryCard({ icon: Icon, title, count, link }: CategoryCardProps) {
  return (
    <Link
      to={link}
      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:scale-105 border border-gray-100"
    >
      <div className="flex flex-col items-center text-center gap-3">
        <div className="p-4 bg-[#F3F4F6] rounded-full">
          <Icon className="w-8 h-8 text-[#1E3A8A]" />
        </div>
        <h3 className="text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{count} serviços</p>
      </div>
    </Link>
  );
}
