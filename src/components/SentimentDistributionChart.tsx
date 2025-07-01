import React from 'react';
import { Skeleton } from './ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface SentimentDataPoint {
  score: number;
}

interface SentimentDistributionChartProps {
  data: SentimentDataPoint[];
  isLoading: boolean;
}

const SentimentDistributionChart = ({ data, isLoading }: SentimentDistributionChartProps) => {
  const distributionData = React.useMemo(() => {
    if (!data || data.length === 0) return [];

    const buckets = new Map<number, number>();
    for (let i = -1; i <= 1; i += 0.2) {
      buckets.set(Number(i.toFixed(1)), 0);
    }

    data.forEach(comment => {
      const bucket = Math.round(comment.score * 5) / 5;
      buckets.set(bucket, (buckets.get(bucket) || 0) + 1);
    });

    return Array.from(buckets.entries())
      .map(([score, count]) => ({ score, count }))
      .sort((a, b) => a.score - b.score);
  }, [data]);

  if (isLoading) {
    return <Skeleton className="h-full w-full" />;
  }

  if (!distributionData || distributionData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Not enough data for sentiment distribution.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={distributionData}
        margin={{ top: 20, right: 20, bottom: 5, left: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
        <XAxis
          dataKey="score"
          tickFormatter={(score) => score.toFixed(1)}
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
          contentStyle={{
            background: 'hsl(var(--background))',
            borderColor: 'hsl(var(--border))',
            borderRadius: 'var(--radius)',
          }}
        />
        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SentimentDistributionChart;