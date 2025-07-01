import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Book, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SentimentDataPoint {
  id: number;
  by: string;
  text: string;
  time: number;
  score: number;
  storyId: number;
  storyTitle: string;
}

const SentimentAnalysis = () => {
  const { timestamp } = useParams<{ timestamp: string }>();
  const numericTimestamp = timestamp ? parseInt(timestamp, 10) : 0;
  const analysisDate = new Date(numericTimestamp);

  const { data: allSentiments, isLoading } = useQuery<SentimentDataPoint[]>({
    queryKey: ['comment-sentiments'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-comment-sentiments');
      if (error) throw new Error(`Failed to fetch sentiment data.`);
      return data;
    },
    staleTime: 300000, // 5 minutes
  });

  const relevantComments = React.useMemo(() => {
    if (!allSentiments || !numericTimestamp) return [];
    
    const startOfHour = new Date(analysisDate);
    startOfHour.setMinutes(0, 0, 0);
    const endOfHour = new Date(startOfHour);
    endOfHour.setHours(endOfHour.getHours() + 1);

    return allSentiments
      .filter(comment => {
        const commentTime = new Date(comment.time * 1000);
        return commentTime >= startOfHour && commentTime < endOfHour;
      })
      .sort((a, b) => Math.abs(b.score) - Math.abs(a.score));
  }, [allSentiments, numericTimestamp, analysisDate]);

  const storiesWithComments = React.useMemo(() => {
    const storyMap = new Map<number, { title: string, comments: SentimentDataPoint[] }>();
    relevantComments.forEach(comment => {
      if (!storyMap.has(comment.storyId)) {
        storyMap.set(comment.storyId, { title: comment.storyTitle, comments: [] });
      }
      storyMap.get(comment.storyId)!.comments.push(comment);
    });
    return Array.from(storyMap.entries()).map(([id, data]) => ({ id, ...data }));
  }, [relevantComments]);

  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-10 w-48 mb-6" />
        <Skeleton className="h-8 w-96 mb-2" />
        <Skeleton className="h-6 w-full mb-8" />
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-lg" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <Button asChild variant="ghost" className="-ml-4">
          <Link to="/"><ArrowLeft className="h-4 w-4 mr-2" />Back to Dashboard</Link>
        </Button>
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-2">Sentiment Analysis</h1>
      <p className="text-muted-foreground mb-6">
        Showing comments with the strongest sentiment from around{' '}
        <strong>{format(analysisDate, 'MMM d, h a')}</strong>.
      </p>
      <ScrollArea className="flex-grow pr-4 -mr-4">
        <div className="space-y-6">
          {storiesWithComments.map(story => (
            <Card key={story.id}>
              <CardHeader>
                <CardTitle>{story.title}</CardTitle>
                <CardDescription className="flex items-center justify-between pt-2">
                  <span>{story.comments.length} influential comment(s) found for this story.</span>
                  <Button asChild variant="secondary" size="sm">
                    <Link to={`/story/${story.id}`}>
                      <Book className="h-4 w-4 mr-2" />
                      View Full Story & All Comments
                    </Link>
                  </Button>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {story.comments.map(comment => (
                  <div key={comment.id} className="p-3 rounded-md border bg-background">
                    <div className="flex justify-between items-start">
                      <div className="prose prose-sm prose-invert max-w-none text-foreground/90 mb-2" dangerouslySetInnerHTML={{ __html: comment.text }} />
                      <Badge className={cn("ml-4 whitespace-nowrap", 
                        comment.score > 0.1 ? 'bg-green-600/80' : 
                        comment.score < -0.1 ? 'bg-red-600/80' : 'bg-muted-foreground/80'
                      )}>
                        {comment.score.toFixed(2)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>{comment.by}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SentimentAnalysis;