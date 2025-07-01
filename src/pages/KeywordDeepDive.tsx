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

const KeywordDeepDive = () => {
  const { keyword } = useParams<{ keyword: string }>();
  const [selectedStoryId, setSelectedStoryId] = React.useState<number | null>(null);

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
    if (!allStories || !keyword) return [];
    const decodedKeyword = decodeURIComponent(keyword).toLowerCase();
    return allStories.filter(story => {
      const titleMatch = story.title.toLowerCase().includes(decodedKeyword);
      const urlMatch = story.url ? story.url.toLowerCase().includes(decodedKeyword) : false;
      const authorMatch = story.by.toLowerCase() === decodedKeyword;
      return titleMatch || urlMatch || authorMatch;
    }).sort((a, b) => b.score - a.score);
  }, [allStories, keyword]);

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

  return (
    <div className="h-full flex flex-col">
      <h1 className="text-3xl font-bold text-foreground mb-2">
        Deep-Dive: <span className="text-primary">{decodeURIComponent(keyword || '')}</span>
      </h1>
      <p className="text-muted-foreground mb-6">
        Exploring {filteredStories.length} stories related to "{decodeURIComponent(keyword || '')}".
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

export default KeywordDeepDive;