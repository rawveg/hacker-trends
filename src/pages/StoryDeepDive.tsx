import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Story } from '@/types/hacker-news';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUp, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';

const StoryDeepDive = () => {
  const navigate = useNavigate();

  const { data: stories, isLoading, error } = useQuery<Story[]>({
    queryKey: ['top-stories'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-top-stories');
      if (error) {
        console.error("Supabase function invocation error:", error);
        throw new Error(`Failed to fetch top stories.`);
      }
      return data.sort((a: Story, b: Story) => b.score - a.score);
    },
    refetchInterval: 300000, // 5 minutes
  });

  const TableSkeleton = () => (
    <div className="p-2 md:p-6 space-y-2">
      {[...Array(25)].map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );

  const handleSelectStory = (id: number) => {
    navigate(`/story/${id}`);
  };

  return (
    <div className="h-full flex flex-col">
      <h1 className="text-3xl font-bold text-foreground mb-2">Story Deep-Dive</h1>
      <p className="text-muted-foreground mb-6">Explore the top 100 stories currently on Hacker News. Select a story to analyze further.</p>
      
      <div className="rounded-2xl border border-border bg-card/50 flex-grow overflow-hidden">
        <ScrollArea className="h-full">
          {isLoading ? (
            <TableSkeleton />
          ) : error ? (
            <div className="flex items-center justify-center h-full text-destructive">
              Error loading stories.
            </div>
          ) : (
            <Table>
              <TableHeader className="sticky top-0 bg-card/80 backdrop-blur-xl z-10">
                <TableRow>
                  <TableHead className="w-[70%]">Title</TableHead>
                  <TableHead className="text-center">Score</TableHead>
                  <TableHead className="text-center">Comments</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stories?.map((story) => (
                  <TableRow 
                    key={story.id} 
                    onClick={() => handleSelectStory(story.id)}
                    className='cursor-pointer hover:bg-muted/50'
                  >
                    <TableCell className="font-medium">{story.title}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1 text-primary">
                        <ArrowUp className="h-3 w-3" />
                        {story.score}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1 text-muted-foreground">
                        <MessageSquare className="h-3 w-3" />
                        {story.descendants || 0}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default StoryDeepDive;