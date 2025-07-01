import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Story } from '@/types/hacker-news';
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUp, MessageSquare } from 'lucide-react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { cn } from '@/lib/utils';
import StoryExplorer from '@/components/StoryExplorer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

const ActivityDeepDive = () => {
  const { timestamp } = useParams<{ timestamp: string }>();
  const [selectedStoryId, setSelectedStoryId] = React.useState<number | null>(null);
  const numericTimestamp = timestamp ? parseInt(timestamp, 10) : 0;

  const { data: allStories, isLoading, error } = useQuery<Story[]>({
    queryKey: ['top-stories'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-top-stories');
      if (error) throw new Error(`Failed to fetch top stories.`);
      return data;
    },
    staleTime: 300000, // 5 minutes
  });

  const filteredStories = React.useMemo(() => {
    if (!allStories || !numericTimestamp) return [];
    
    const startTime = numericTimestamp;
    const endTime = startTime + 60 * 60 * 1000; // 1 hour window

    return allStories.filter(story => {
      const storyTime = story.time * 1000;
      return storyTime >= startTime && storyTime < endTime;
    }).sort((a, b) => b.score - a.score);
  }, [allStories, numericTimestamp]);

  React.useEffect(() => {
    if (filteredStories.length > 0) {
      setSelectedStoryId(filteredStories[0].id);
    } else {
      setSelectedStoryId(null);
    }
  }, [filteredStories]);

  const TableSkeleton = () => (
    <div className="p-4 space-y-2">
      {[...Array(10)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
    </div>
  );

  const formattedDate = numericTimestamp ? format(new Date(numericTimestamp), 'eeee, MMMM d, h a') : '';

  return (
    <div className="h-full flex flex-col">
      <h1 className="text-3xl font-bold text-foreground mb-2">
        Activity Deep-Dive
      </h1>
      <p className="text-muted-foreground mb-6">
        Exploring {filteredStories.length} stories submitted around <span className="text-primary font-medium">{formattedDate}</span>.
      </p>
      
      <ResizablePanelGroup direction="horizontal" className="rounded-2xl border border-border bg-card/50 flex-grow overflow-hidden">
        <ResizablePanel defaultSize={35} minSize={25}>
          <ScrollArea className="h-full">
            {isLoading ? (
              <TableSkeleton />
            ) : error ? (
              <div className="p-4 text-destructive">Error loading stories.</div>
            ) : (
              <Table>
                <TableBody>
                  {filteredStories.map((story) => (
                    <TableRow
                      key={story.id}
                      onClick={() => setSelectedStoryId(story.id)}
                      className={cn('cursor-pointer', selectedStoryId === story.id && 'bg-primary/10')}
                    >
                      <TableCell>
                        <p className="font-medium line-clamp-2">{story.title}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                          <div className="flex items-center gap-1 text-primary"><ArrowUp className="h-3 w-3" />{story.score}</div>
                          <div className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />{story.descendants || 0}</div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={65}>
          <StoryExplorer storyId={selectedStoryId} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ActivityDeepDive;