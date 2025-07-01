import React from 'react';
import { cn } from '@/lib/utils';

interface DashboardWidgetProps {
  children: React.ReactNode;
  className?: string;
  title: string;
}

const DashboardWidget = ({ children, className, title }: DashboardWidgetProps) => {
  return (
    <div
      className={cn(
        'bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-2xl shadow-lg p-4 md:p-6 flex flex-col',
        className
      )}
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <div className="flex-grow">{children}</div>
    </div>
  );
};

export default DashboardWidget;