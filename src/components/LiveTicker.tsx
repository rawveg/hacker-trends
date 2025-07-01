import React from 'react';
import { ArrowUp, MessageSquare } from 'lucide-react';
import { Story } from '@/types/hacker-news';
import { Skeleton } from './ui/skeleton';
import { useSettings } from '@/contexts/SettingsContext';

interface LiveTickerProps {
  stories: Story[];
  isLoading: boolean;
}

const TickerItem = ({ story }: { story: Story }) => (
  <a
    href={story.url || `https://news.ycombinator.com/item?id=${story.id}`}
    target="_blank"
    rel="noopener noreferrer"
    className="flex-shrink-0 w-72 bg-white/5 p-4 rounded-lg flex flex-col justify-between hover:bg-white/10 transition-colors group"
  >
    <p className="text-sm font-medium text-foreground line-clamp-3 group-hover:text-primary">
      {story.title}
    </p>
    <div className="flex items-center justify-end gap-4 text-xs text-muted-foreground mt-2">
      <div className="flex items-center gap-1">
        <ArrowUp className="h-3 w-3" />
        <span>{story.score}</span>
      </div>
      <div className="flex items-center gap-1">
        <MessageSquare className="h-3 w-3" />
        <span>{story.descendants || 0}</span>
      </div>
    </div>
  </a>
);

const LiveTicker = ({ stories, isLoading }: LiveTickerProps) => {
  const { settings } = useSettings();

  if (isLoading) {
    return (
      <div className="flex space-x-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="flex-shrink-0 w-72 h-24 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!stories || stories.length === 0) {
    return (
      <div className="flex items-center justify-center h-24 text-muted-foreground">
        Could not load stories.
      </div>
    );
  }

  // Duplicate stories for a seamless looping effect
  const tickerStories = [...stories, ...stories];

  return (
    <div className="relative w-full overflow-hidden group h-24 flex items-center">
      <div 
        className="flex animate-marquee group-hover:[animation-play-state:paused]"
        style={{ '--marquee-duration': `${settings.tickerSpeed}s` } as React.CSSProperties}
      >
        {tickerStories.map((story, index) => (
          <div key={`${story.id}-${index}`} className="mx-2 flex-shrink-0">
            <TickerItem story={story} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveTicker;