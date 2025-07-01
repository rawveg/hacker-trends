import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Story } from '@/types/hacker-news';
import { Skeleton } from './ui/skeleton';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ZAxis, Cell } from 'recharts';

interface ScoreVsCommentsChartProps {
  stories: Story[];
  isLoading: boolean;
}

const CustomTooltip = ({ active, payload }: { active?: boolean, payload?: any[] }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background/80 backdrop-blur-sm border border-border p-3 rounded-lg shadow-lg max-w-xs">
        <p className="text-sm font-bold text-foreground truncate">{data.title}</p>
        <p className="text-xs text-muted-foreground mt-1">Score: <span className="font-semibold text-primary">{data.score}</span></p>
        <p className="text-xs text-muted-foreground">Comments: <span className="font-semibold text-primary">{data.descendants}</span></p>
      </div>
    );
  }
  return null;
};

const ColorLegend = () => (
  <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground mt-2 pr-5">
    <span>Old</span>
    <div className="h-3 w-24 rounded-full" style={{ background: 'linear-gradient(to right, hsl(220, 30%, 50%), hsl(24, 100%, 50%))' }} />
    <span>New</span>
  </div>
);

const ScoreVsCommentsChart = ({ stories, isLoading }: ScoreVsCommentsChartProps) => {
  const navigate = useNavigate();

  const storiesWithColor = React.useMemo(() => {
    if (!stories || stories.length === 0) return [];
    
    const times = stories.map(s => s.time);
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const timeRange = maxTime - minTime;

    if (timeRange === 0) {
      return stories.map(story => ({ ...story, color: 'hsl(24, 100%, 50%)' }));
    }

    return stories.map(story => {
      const normalizedTime = (story.time - minTime) / timeRange;
      const h = 220 + (24 - 220) * normalizedTime;
      const s = 30 + (100 - 30) * normalizedTime;
      const l = 50;
      const color = `hsl(${h}, ${s}%, ${l}%)`;
      return { ...story, color };
    });
  }, [stories]);

  const handleChartClick = (data: any) => {
    if (data && data.id) {
      navigate(`/story/${data.id}`);
    }
  };

  if (isLoading) {
    return <Skeleton className="h-full w-full" />;
  }

  if (!stories || stories.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Not enough data to display chart.
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 10, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis 
              type="number" 
              dataKey="score" 
              name="Score" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              type="number" 
              dataKey="descendants" 
              name="Comments" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <ZAxis type="number" dataKey="score" range={[40, 300]} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
            <Scatter 
              name="Stories" 
              data={storiesWithColor} 
              onClick={handleChartClick}
              className="cursor-pointer"
            >
              {storiesWithColor.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <ColorLegend />
    </div>
  );
};

export default ScoreVsCommentsChart;