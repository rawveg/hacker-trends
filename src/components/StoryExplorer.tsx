import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Story, Comment as CommentType } from '@/types/hacker-news';
import { Skeleton } from './ui/skeleton';
import Comment from './Comment';
import { ExternalLink, MessageSquare, ArrowUp, User, Clock, ArrowLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from './ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from './ui/button';

interface StoryExplorerProps {
  storyId: number | null;
  onBack?: () => void;
}

const StoryExplorer = ({ storyId, onBack }: StoryExplorerProps) => {
  const isMobile = useIsMobile();

  const { data: story, isLoading: isStoryLoading, error: storyError } = useQuery<Story>({
    queryKey: ['story-with-comments', storyId],
    queryFn: async () => {
      if (!storyId) return null;
      const { data, error } = await supabase.functions.invoke('get-story-with-comments', {
        body: { storyId },
      });
      if (error) throw new Error('Failed to fetch story details.');
      return data;
    },
    enabled: !!storyId,
  });

  if (!storyId) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground p-8 text-center">
        <p>Select a story from the list to explore it.</p>
      </div>
    );
  }

  if (isStoryLoading) {
    return (
      <div className="p-6 space-y-4">
        {isMobile && onBack && <Skeleton className="h-10 w-24 mb-4" />}
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="pt-4 space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (storyError || !story) {
    return (
      <div className="flex items-center justify-center h-full text-destructive p-8">
        Error loading story.
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {isMobile && onBack && (
        <div className="p-4 md:p-6">
          <Button onClick={onBack} variant="ghost" className="-ml-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to list
          </Button>
        </div>
      )}
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-bold text-foreground">{story.title}</h2>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-2">
          <div className="flex items-center gap-1.5"><User className="h-3 w-3" /><span>{story.by}</span></div>
          <div className="flex items-center gap-1.5"><Clock className="h-3 w-3" /><span>{formatDistanceToNow(new Date(story.time * 1000), { addSuffix: true })}</span></div>
          <div className="flex items-center gap-1.5 text-primary"><ArrowUp className="h-3 w-3" /><span>{story.score} points</span></div>
        </div>
        <div className="mt-4">
          <a href={story.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline font-semibold flex items-center gap-1.5">
            Open Original Article in New Tab <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-4">
          <h3 className="text-lg font-semibold">Comments ({story.descendants || 0})</h3>
          {story.comments && story.comments.length > 0 ? (
            story.comments.map((comment: CommentType) => <Comment key={comment.id} comment={comment} />)
          ) : (
            <p className="text-muted-foreground">No comments to display.</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default StoryExplorer;