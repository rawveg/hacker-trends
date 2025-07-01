import { useMemo } from 'react';
import DashboardWidget from '@/components/DashboardWidget';
import LiveTicker from '@/components/LiveTicker';
import KeywordCloud from '@/components/KeywordCloud';
import MostDiscussedDomains from '@/components/MostDiscussedDomains';
import SentimentTrendChart from '@/components/SentimentTrendChart';
import SubmissionActivityHeatmap from '@/components/SubmissionActivityHeatmap';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Story } from '@/types/hacker-news';
import StatCard from '@/components/StatCard';
import { MessageSquare, Rss, Globe, Smile, Zap, Clock } from 'lucide-react';
import ScoreVsCommentsChart from '@/components/ScoreVsCommentsChart';
import TopSubmittersChart from '@/components/TopSubmittersChart';
import SentimentDistributionChart from '@/components/SentimentDistributionChart';
import DomainSentimentChart from '@/components/DomainSentimentChart';

interface SentimentDataPoint {
  id: number;
  by: string;
  text: string;
  time: number;
  score: number;
  storyId: number;
  storyTitle: string;
}

const Index = () => {
  const { data: stories, isLoading, error } = useQuery<Story[]>({
    queryKey: ['top-stories'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-top-stories');
      if (error) throw new Error(`Failed to fetch top stories.`);
      return data;
    },
    refetchInterval: 60000,
  });

  const { data: sentimentData, isLoading: isSentimentLoading } = useQuery<SentimentDataPoint[]>({
    queryKey: ['comment-sentiments'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-comment-sentiments');
      if (error) throw new Error(`Failed to fetch sentiment data.`);
      return data;
    },
    refetchInterval: 300000,
  });

  const stats = useMemo(() => {
    if (!stories || !sentimentData) {
      return {
        totalComments: 0,
        activeStories: 0,
        uniqueDomains: 0,
        averageSentiment: '0.00',
        peakActivityHour: 'N/A',
        highestScoringStory: null,
      };
    }

    const totalComments = sentimentData.length;
    const activeStories = stories.length;
    const uniqueDomains = new Set(
      stories.filter(s => s.url).map(s => {
        try {
          return new URL(s.url).hostname.replace(/^www\./, '');
        } catch { return null; }
      }).filter(Boolean)
    ).size;

    const averageSentiment = sentimentData.length > 0
      ? (sentimentData.reduce((acc, curr) => acc + curr.score, 0) / sentimentData.length).toFixed(2)
      : '0.00';

    const grid = Array(7).fill(0).map(() => Array(24).fill(0));
    let maxCount = 0;
    let peakHour = -1;
    stories.forEach(story => {
      const date = new Date(story.time * 1000);
      const hour = date.getHours();
      const day = date.getDay();
      grid[day][hour]++;
      if (grid[day][hour] > maxCount) {
        maxCount = grid[day][hour];
        peakHour = hour;
      }
    });
    
    const formatHour = (h: number) => {
      if (h === -1) return 'N/A';
      if (h === 0) return '12 AM';
      if (h === 12) return '12 PM';
      return h > 12 ? `${h - 12} PM` : `${h} AM`;
    };

    return {
      totalComments,
      activeStories,
      uniqueDomains,
      averageSentiment,
      peakActivityHour: formatHour(peakHour),
      highestScoringStory: [...stories].sort((a, b) => b.score - a.score)[0],
    };
  }, [stories, sentimentData]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-3 md:grid-cols-6">
        <StatCard
          title="Total Comments"
          value={stats.totalComments.toLocaleString()}
          icon={MessageSquare}
          isLoading={isSentimentLoading}
          iconClassName="text-sky-500"
        />
        <StatCard
          title="Active Stories"
          value={stats.activeStories}
          icon={Rss}
          isLoading={isLoading}
          iconClassName="text-amber-500"
        />
        <StatCard
          title="Unique Domains"
          value={stats.uniqueDomains}
          icon={Globe}
          isLoading={isLoading}
          iconClassName="text-teal-500"
        />
        <StatCard
          title="Avg. Sentiment"
          value={stats.averageSentiment}
          icon={Smile}
          isLoading={isSentimentLoading}
          iconClassName="text-rose-500"
        />
        <StatCard
          title="Peak Activity"
          value={stats.peakActivityHour}
          icon={Clock}
          isLoading={isLoading}
          iconClassName="text-indigo-500"
        />
        <StatCard
          title="Top Story Score"
          value={stats.highestScoringStory ? stats.highestScoringStory.score.toLocaleString() : 'N/A'}
          icon={Zap}
          isLoading={isLoading}
          iconClassName="text-lime-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <DashboardWidget title="Live Front Page Ticker">
              <LiveTicker stories={stories || []} isLoading={isLoading} />
          </DashboardWidget>
        </div>
        
        <DashboardWidget title="Top Keywords & Topics" className="lg:col-span-2 h-96">
          <KeywordCloud stories={stories || []} isLoading={isLoading} />
        </DashboardWidget>
        <DashboardWidget title="Overall Sentiment Trend" className="h-96">
          <SentimentTrendChart data={sentimentData || []} isLoading={isSentimentLoading} />
        </DashboardWidget>

        <DashboardWidget title="Most Discussed Domains" className="h-96">
          <MostDiscussedDomains stories={stories || []} isLoading={isLoading} />
        </DashboardWidget>
        <DashboardWidget title="Submission Activity" className="lg:col-span-2 h-96">
          <SubmissionActivityHeatmap stories={stories || []} isLoading={isLoading} />
        </DashboardWidget>

        <DashboardWidget title="Score vs. Comments" className="lg:col-span-2 h-96">
          <ScoreVsCommentsChart stories={stories || []} isLoading={isLoading} />
        </DashboardWidget>
        <DashboardWidget title="Sentiment Distribution" className="h-96">
          <SentimentDistributionChart data={sentimentData || []} isLoading={isSentimentLoading} />
        </DashboardWidget>

        <DashboardWidget title="Top Submitters" className="h-96">
          <TopSubmittersChart stories={stories || []} isLoading={isLoading} />
        </DashboardWidget>
        <DashboardWidget title="Sentiment by Domain" className="lg:col-span-2 h-96">
          <DomainSentimentChart stories={stories || []} sentimentData={sentimentData || []} isLoading={isLoading || isSentimentLoading} />
        </DashboardWidget>
      </div>
    </div>
  );
};

export default Index;