import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Story } from '@/types/hacker-news';
import { Skeleton } from './ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface TopSubmittersChartProps {
  stories: Story[];
  isLoading: boolean;
}

const TopSubmittersChart = ({ stories, isLoading }: TopSubmittersChartProps) => {
  const navigate = useNavigate();

  const submitterData = React.useMemo(() => {
    if (!stories || stories.length === 0) return [];

    const submitterCounts = new Map<string, number>();
    stories.forEach(story => {
      submitterCounts.set(story.by, (submitterCounts.get(story.by) || 0) + 1);
    });

    return Array.from(submitterCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [stories]);

  const handleBarClick = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const submitterName = data.activePayload[0].payload.name;
      if (submitterName) {
        navigate(`/keyword/${encodeURIComponent(submitterName)}`);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2 h-full pt-4">
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i} className="h-7 w-full" />
        ))}
      </div>
    );
  }

  if (!submitterData || submitterData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Not enough data to display submitters.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={submitterData}
        layout="vertical"
        margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
        onClick={handleBarClick}
        className="cursor-pointer"
      >
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          width={100}
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
        />
        <Tooltip
          cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
          contentStyle={{
            background: 'hsl(var(--background))',
            borderColor: 'hsl(var(--border))',
            borderRadius: 'var(--radius)',
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
        />
        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={18} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TopSubmittersChart;