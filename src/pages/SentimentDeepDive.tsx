import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Story } from '@/types/hacker-news';
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUp, MessageSquare, ArrowLeft } from 'lucide-react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { cn } from '@/lib/utils';
import StoryExplorer from '@/components/StoryExplorer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

interface SentimentDataPoint {
  score: number;
  storyId: number;
}

const SentimentDeepDive = () => {
  const { category } = useParams<{ category: string }>();
  const [selectedStoryId, setSelectedStoryId] = React.useState<number | null>(null);

  const { data: allStories, isLoading: storiesLoading } = useQuery<Story[]>({
    queryKey: ['top-stories'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-top-stories');
      if (error) throw new Error(`Failed to fetch top stories.`);
      return data;
    },
    staleTime: 300000,
  });

  const { data: sentimentData, isLoading: sentimentLoading } = useQuery<SentimentDataPoint[]>({
    queryKey: ['comment-sentiments'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-comment-sentiments');
      if (error) throw new Error(`Failed to fetch sentiment data.`);
      return data;
    },
    staleTime: 300000,
  });

  const filteredStories = React.useMemo(() => {
    if (!allStories || !sentimentData || !category) return [];

    let relevantComments: SentimentDataPoint[];
    if (category === 'Positive') {
      relevantComments = sentimentData.filter(c => c.score > 0.05);
    } else if (category === 'Negative') {
      relevantComments = sentimentData.filter(c => c.score < -0.05);
    } else { // Neutral
      relevantComments = sentimentData.filter(c => c.score >= -0.05 && c.score <= 0.05);
    }

    const storyIds = new Set(relevantComments.map(c => c.storyId));
    return allStories.filter(s => storyIds.has(s.id)).sort((a, b) => b.score - a.score);
  }, [allStories, sentimentData, category]);

  React.useEffect(() => {
    if (filteredStories.length > 0) {
      setSelectedStoryId(filteredStories[0].id);
    } else {
      setSelectedStoryId(null);
    }
  }, [filteredStories]);

  const isLoading = storiesLoading || sentimentLoading;

  const TableSkeleton = () => (
    <div className="p-4 space-y-2">
      {[...Array(10)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
    </div>
  );

  return (
    <div className="h-full flex flex-col">
       <div className="mb-4">
        <Button asChild variant="ghost" className="-ml-4">
          <Link to="/"><ArrowLeft className="h-4 w-4 mr-2" />Back to Dashboard</Link>
        </Button>
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-2">
        Deep-Dive: <span className="text-primary">{category} Comments</span>
      </h1>
      <p className="text-muted-foreground mb-6">
        Exploring {filteredStories.length} stories with comments in the "{category}" sentiment category.
      </p>
      
      <ResizablePanelGroup direction="horizontal" className="rounded-2xl border border-border bg-card/50 flex-grow overflow-hidden">
        <ResizablePanel defaultSize={35} minSize={25}>
          <ScrollArea className="h-full">
            {isLoading ? (
              <TableSkeleton />
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

export default SentimentDeepDive;