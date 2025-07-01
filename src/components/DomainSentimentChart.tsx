import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Story } from '@/types/hacker-news';
import { Skeleton } from './ui/skeleton';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend, LabelList } from 'recharts';
import { ScrollArea } from './ui/scroll-area';

interface SentimentDataPoint {
  score: number;
  storyId: number;
}

interface DomainSentimentChartProps {
  stories: Story[];
  sentimentData: SentimentDataPoint[];
  isLoading: boolean;
}

const CustomTooltip = ({ active, payload }: { active?: boolean, payload?: any[] }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const percentage = data.percentage;
    return (
      <div className="bg-background/90 backdrop-blur-sm border border-border p-3 rounded-lg shadow-lg max-w-xs">
        <p className="text-sm font-bold mb-2" style={{ color: data.fill }}>
          {data.name} ({percentage}%)
        </p>
        <p className="text-xs text-muted-foreground mb-1">
          {data.value.toLocaleString()} {data.value === 1 ? 'comment' : 'comments'} from {data.domains.length} domains.
        </p>
        <ScrollArea className="max-h-48">
          <ul className="text-xs text-muted-foreground space-y-1 pr-4">
            {data.domains.map((domain: string) => (
              <li key={domain}>{domain}</li>
            ))}
          </ul>
        </ScrollArea>
      </div>
    );
  }
  return null;
};

const DomainSentimentChart = ({ stories, sentimentData, isLoading }: DomainSentimentChartProps) => {
  const navigate = useNavigate();

  const chartData = React.useMemo(() => {
    if (!stories || stories.length === 0 || !sentimentData || sentimentData.length === 0) return [];

    const storyIdToDomain = new Map<number, string>();
    stories.forEach(story => {
      if (story.url) {
        try {
          let domain = new URL(story.url).hostname.replace(/^www\./, '');
          storyIdToDomain.set(story.id, domain);
        } catch (e) { /* ignore invalid URLs */ }
      }
    });

    const sentimentBuckets = {
      Positive: { name: 'Positive', color: '#22c55e', domains: new Set<string>(), commentCount: 0 },
      Neutral: { name: 'Neutral', color: '#9ca3af', domains: new Set<string>(), commentCount: 0 },
      Negative: { name: 'Negative', color: '#ef4444', domains: new Set<string>(), commentCount: 0 },
    };

    sentimentData.forEach(comment => {
      const domain = storyIdToDomain.get(comment.storyId);
      if (!domain) return;

      let bucket;
      if (comment.score > 0.05) {
        bucket = sentimentBuckets.Positive;
      } else if (comment.score < -0.05) {
        bucket = sentimentBuckets.Negative;
      } else {
        bucket = sentimentBuckets.Neutral;
      }
      
      bucket.domains.add(domain);
      bucket.commentCount++;
    });

    const totalComments = sentimentData.length;

    return Object.values(sentimentBuckets)
      .map(bucket => ({
        name: bucket.name,
        value: bucket.commentCount,
        domains: Array.from(bucket.domains).sort(),
        fill: bucket.color,
        percentage: totalComments > 0 ? ((bucket.commentCount / totalComments) * 100).toFixed(1) : "0.0",
      }))
      .filter(d => d.value > 0)
      .sort((a, b) => {
        if (a.name === 'Positive') return -1;
        if (b.name === 'Positive') return 1;
        if (a.name === 'Negative') return 1;
        if (b.name === 'Negative') return -1;
        return 0;
      });

  }, [stories, sentimentData]);

  const handleSegmentClick = (data: any) => {
    if (data && data.name) {
      navigate(`/sentiment-deep-dive/${data.name}`);
    }
  };

  if (isLoading) {
    return <Skeleton className="h-full w-full rounded-full" />;
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Not enough data to display domain sentiments.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
          layout="vertical"
          verticalAlign="middle"
          align="right"
          wrapperStyle={{ fontSize: '12px', color: 'hsl(var(--muted-foreground))' }}
        />
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius="60%"
          outerRadius="85%"
          paddingAngle={5}
          dataKey="value"
          nameKey="name"
          onClick={handleSegmentClick}
          className="cursor-pointer"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.fill} className="focus:outline-none ring-0" />
          ))}
          <LabelList 
            dataKey="percentage" 
            position="outside"
            formatter={(value: string) => `${value}%`}
            fill="hsl(var(--muted-foreground))"
            fontSize={12}
            className="pointer-events-none"
          />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DomainSentimentChart;