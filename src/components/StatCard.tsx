import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: string | number;
  isLoading: boolean;
  className?: string;
  iconClassName?: string;
}

const StatCard = ({ icon: Icon, title, value, isLoading, className, iconClassName }: StatCardProps) => {
  if (isLoading) {
    return <Skeleton className="h-20 md:h-28 w-full rounded-2xl" />;
  }

  return (
    <Card className={cn('bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-lg rounded-2xl', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
        <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={cn("h-4 w-4 md:h-5 md:w-5 text-muted-foreground", iconClassName)} />
      </CardHeader>
      <CardContent>
        <div className="text-lg md:text-2xl lg:text-3xl font-bold text-foreground">
          {value}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;