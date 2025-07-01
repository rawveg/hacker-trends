import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Story } from '@/types/hacker-news';
import { Skeleton } from './ui/skeleton';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface MostDiscussedDomainsProps {
  stories: Story[];
  isLoading: boolean;
}

const MostDiscussedDomains = ({ stories, isLoading }: MostDiscussedDomainsProps) => {
  const navigate = useNavigate();

  const domainData = React.useMemo(() => {
    if (!stories || stories.length === 0) return [];

    const domainCounts = new Map<string, number>();

    stories.forEach(story => {
      if (story.url) {
        try {
          let domain = new URL(story.url).hostname;
          // Remove common subdomains like 'www.' to group domains
          domain = domain.replace(/^www\./, '');
          domainCounts.set(domain, (domainCounts.get(domain) || 0) + 1);
        } catch (e) {
          // Ignore invalid URLs
        }
      }
    });

    return Array.from(domainCounts.entries())
      .map(([domain, count]) => ({ domain, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Get the top 10 domains
  }, [stories]);

  const handleBarClick = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const domain = data.activePayload[0].payload.domain;
      if (domain) {
        navigate(`/keyword/${encodeURIComponent(domain)}`);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2 h-full pt-4">
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i} className="h-7 w-full" />
        ))}
      </div>
    );
  }

  if (!domainData || domainData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Not enough data to display domains.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={domainData}
        layout="vertical"
        margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
        onClick={handleBarClick}
        className="cursor-pointer"
      >
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="domain"
          width={120}
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          className="truncate"
        />
        <Tooltip
          cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
          contentStyle={{
            background: 'hsl(var(--background))',
            borderColor: 'hsl(var(--border))',
            borderRadius: 'var(--radius)',
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
        />
        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={18} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MostDiscussedDomains;