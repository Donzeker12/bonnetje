import { Link } from '@inertiajs/react';
import { ReactNode } from 'react';

interface PageHeaderProps {
  title: ReactNode;
  backHref?: string;
  backLabel?: string;
  maxWidthClass?: string;
}

export default function PageHeader({
  title,
  backHref = '/dashboard',
  backLabel = 'Terug naar Dashboard',
  maxWidthClass = 'max-w-7xl',
}: PageHeaderProps) {
  return (
    <header className="bg-white shadow">
      <div className={`${maxWidthClass} mx-auto px-4 py-4 sm:py-6`}>
        <div className="flex justify-between items-center gap-2">
          <h1 className="text-xl sm:text-3xl font-bold text-gray-900 truncate">{title}</h1>
          <Link
            href={backHref}
            className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm sm:text-base whitespace-nowrap"
          >
            <span className="sm:hidden">←</span>
            <span className="hidden sm:inline">← {backLabel}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
