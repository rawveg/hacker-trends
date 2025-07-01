import React from 'react';
import { Story } from '@/types/hacker-news';
import { Skeleton } from './ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useNavigate } from 'react-router-dom';

interface SubmissionActivityHeatmapProps {
  stories: Story[];
  isLoading: boolean;
}

const processActivityData = (stories: Story[]) => {
  if (!stories || stories.length === 0) return { grid: [], maxCount: 0 };

  const grid = Array(7).fill(0).map(() => Array(24).fill(0));
  let maxCount = 0;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  stories.forEach(story => {
    const date = new Date(story.time * 1000);
    if (date < sevenDaysAgo) return;

    const dayOfWeek = date.getDay();
    const hour = date.getHours();
    
    grid[dayOfWeek][hour]++;
    if (grid[dayOfWeek][hour] > maxCount) {
      maxCount = grid[dayOfWeek][hour];
    }
  });

  return { grid, maxCount };
};

const SubmissionActivityHeatmap = ({ stories, isLoading }: SubmissionActivityHeatmapProps) => {
  const navigate = useNavigate();
  const { grid, maxCount } = React.useMemo(() => processActivityData(stories), [stories]);

  const handleCellClick = (dayIndex: number, hourIndex: number) => {
    const now = new Date();
    const todayDay = now.getDay();
    const daysToSubtract = (todayDay - dayIndex + 7) % 7;
    
    const targetDate = new Date();
    targetDate.setDate(now.getDate() - daysToSubtract);
    targetDate.setHours(hourIndex, 0, 0, 0);

    navigate(`/activity/${targetDate.getTime()}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 h-full justify-center p-4">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-4 w-8 rounded-sm" />
            <div className="flex gap-1.5 flex-1">
              {[...Array(24)].map((_, j) => (
                <Skeleton key={j} className="h-5 w-full rounded-sm" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (maxCount === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Not enough recent data for activity heatmap.
      </div>
    );
  }

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = ['12a', '', '', '3a', '', '', '6a', '', '', '9a', '', '', '12p', '', '', '3p', '', '', '6p', '', '', '9p', '', ''];

  return (
    <div className="flex flex-col gap-2 p-4 h-full justify-center">
      <div className="flex items-center gap-3">
        <div className="w-8" />
        <div className="flex flex-1 gap-1.5">
          {hours.map((hour, i) => (
            <div key={i} className="w-full text-xs text-muted-foreground text-center">
              {hour}
            </div>
          ))}
        </div>
      </div>
      {days.map((day, dayIndex) => (
        <div key={day} className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground w-8 text-right">{day}</span>
          <div className="flex flex-1 gap-1.5">
            {grid[dayIndex].map((count, hourIndex) => {
              const opacity = count > 0 ? Math.max(0.15, count / maxCount) : 0;
              const bgColor = count > 0 ? `hsl(var(--primary) / ${opacity})` : 'hsl(var(--muted) / 0.2)';
              
              return (
                <TooltipProvider key={hourIndex} delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        onClick={() => handleCellClick(dayIndex, hourIndex)}
                        className="h-5 w-full rounded-sm cursor-pointer"
                        style={{ backgroundColor: bgColor }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{count} {count === 1 ? 'submission' : 'submissions'}</p>
                      <p className="text-xs text-muted-foreground">
                        {day}, {hourIndex}:00 - {hourIndex}:59
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubmissionActivityHeatmap;