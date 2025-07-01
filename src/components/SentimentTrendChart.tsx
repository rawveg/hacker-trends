import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Skeleton } from './ui/skeleton';
import { format } from 'date-fns';

interface SentimentDataPoint {
  id: number;
  by: string;
  text: string;
  time: number;
  score: number;
  storyId: number;
  storyTitle: string;
}

interface SentimentTrendChartProps {
  data: SentimentDataPoint[];
  isLoading: boolean;
}

const processSentimentData = (data: SentimentDataPoint[]) => {
  if (!data || data.length === 0) return [];

  const now = new Date();
  const twentyFourHoursAgo = now.getTime() - 24 * 60 * 60 * 1000;

  const hourlyBuckets = data
    .filter(d => d.time * 1000 >= twentyFourHoursAgo)
    .reduce((acc, curr) => {
      const date = new Date(curr.time * 1000);
      const hour = format(date, 'yyyy-MM-dd-HH');
      if (!acc[hour]) {
        acc[hour] = { scores: [], count: 0, time: date };
      }
      acc[hour].scores.push(curr.score);
      acc[hour].count++;
      return acc;
    }, {} as Record<string, { scores: number[], count: number, time: Date }>);

  const chartData = Object.entries(hourlyBuckets).map(([_, value]) => {
    const avgScore = value.scores.reduce((a, b) => a + b, 0) / value.count;
    return {
      time: value.time,
      avgScore: parseFloat(avgScore.toFixed(2)),
    };
  });

  return chartData.sort((a, b) => a.time.getTime() - b.time.getTime());
};

const CustomTooltip = ({ active, payload, label }: { active?: boolean, payload?: any[], label?: any }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/80 backdrop-blur-sm border border-border p-2 rounded-lg shadow-lg">
        <p className="text-sm text-muted-foreground">{format(label, 'MMM d, h a')}</p>
        <p className={`text-lg font-bold ${payload[0].value > 0.05 ? 'text-green-400' : payload[0].value < -0.05 ? 'text-red-400' : 'text-foreground'}`}>
          Avg. Sentiment: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const SentimentTrendChart = ({ data, isLoading }: SentimentTrendChartProps) => {
  const navigate = useNavigate();
  const chartData = React.useMemo(() => processSentimentData(data), [data]);

  const handleChartClick = (chartState: any) => {
    if (chartState && chartState.activePayload && chartState.activePayload.length > 0) {
      const clickedData = chartState.activePayload[0].payload;
      const clickedTimestamp = clickedData.time.getTime();
      navigate(`/sentiment/${clickedTimestamp}`);
    }
  };

  if (isLoading) {
    return <Skeleton className="h-full w-full" />;
  }

  if (!chartData || chartData.length < 2) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Not enough recent data for sentiment trend.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
        onClick={handleChartClick}
        className="cursor-pointer"
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
        <XAxis
          dataKey="time"
          tickFormatter={(time) => format(time, 'h a')}
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          domain={[-1, 1]}
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="avgScore"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SentimentTrendChart;