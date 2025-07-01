import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Story } from '@/types/hacker-news';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from './ui/skeleton';
import { cn } from '@/lib/utils';

interface KeywordCloudProps {
  stories: Story[];
  isLoading: boolean;
}

const STOP_WORDS = new Set([
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', "aren't", 'as', 'at',
    'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
    'can', "can't", 'cannot', 'could', "couldn't", 'com',
    'did', "didn't", 'do', 'does', "doesn't", 'doing', 'don', "don't", 'down', 'during',
    'each',
    'few', 'for', 'from', 'further',
    'had', "hadn't", 'has', "hasn't", 'have', "haven't", 'having', 'he', "he'd", "he'll", "he's", 'her', 'here', "here's", 'hers', 'herself', 'him', 'himself', 'his', 'how', "how's",
    'i', "i'd", "i'll", "i'm", "i've", 'if', 'in', 'into', 'is', "isn't", 'it', "it's", 'its', 'itself',
    "let's",
    'me', 'more', 'most', "mustn't", 'my', 'myself',
    'no', 'nor', 'not',
    'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
    'same', 'shan', "shan't", 'she', "she'd", "she'll", "she's", 'should', "shouldn't", 'so', 'some', 'such',
    'than', 'that', "that's", 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', "there's", 'these', 'they', "they'd", "they'll", "they're", "they've", 'this', 'those', 'through', 'to', 'too',
    'under', 'until', 'up',
    'very',
    'was', "wasn't", 'we', "we'd", "we'll", "we're", "we've", 'were', "weren't", 'what', "what's", 'when', "when's", 'where', "where's", 'which', 'while', 'who', "who's", 'whom', 'why', "why's", 'with', "won't", 'would', "wouldn't",
    'you', "you'd", "you'll", "you're", "you've", 'your', 'yours', 'yourself', 'yourselves',
    'hn', 'ask', 'show', 'tell', 'new', 'using', 'one', 'like', 'get', 'app', 'web', 'use', 'how', 'why', 'vs'
]);

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const colorPalette = [
  { bg: 'bg-sky-950/70', text: 'text-sky-300', border: 'border-sky-700/50' },
  { bg: 'bg-amber-950/70', text: 'text-amber-300', border: 'border-amber-700/50' },
  { bg: 'bg-teal-950/70', text: 'text-teal-300', border: 'border-teal-700/50' },
  { bg: 'bg-indigo-950/70', text: 'text-indigo-300', border: 'border-indigo-700/50' },
  { bg: 'bg-rose-950/70', text: 'text-rose-300', border: 'border-rose-700/50' },
];

const KeywordCloud = ({ stories, isLoading }: KeywordCloudProps) => {
  const navigate = useNavigate();

  const keywords = React.useMemo(() => {
    if (!stories || stories.length === 0) return [];
    const wordCounts = new Map<string, number>();
    stories.forEach(story => {
      const words = story.title.toLowerCase().match(/\b(\w+)\b/g) || [];
      words.forEach(word => {
        if (word.length > 1 && !STOP_WORDS.has(word) && isNaN(parseInt(word))) {
          wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
        }
      });
    });
    const sortedKeywords = Array.from(wordCounts.entries())
      .filter(([, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 25)
      .map(([text, value]) => ({ text, value }));
    return shuffleArray(sortedKeywords);
  }, [stories]);

  const handleKeywordClick = (keyword: string) => {
    navigate(`/keyword/${encodeURIComponent(keyword)}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-4 items-center justify-center h-full">
        {[...Array(25)].map((_, i) => <Skeleton key={i} className="h-8 w-24 rounded-full" />)}
      </div>
    );
  }

  if (keywords.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Not enough data to generate keywords.
      </div>
    );
  }

  const maxFreq = Math.max(...keywords.map(k => k.value), 1);

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 items-center justify-center h-full p-4 overflow-hidden">
      {keywords.map(({ text, value }, index) => {
        const color = colorPalette[index % colorPalette.length];
        return (
          <Badge
            key={text}
            onClick={() => handleKeywordClick(text)}
            className={cn(
              'border cursor-pointer transition-all duration-300',
              color.bg, color.text, color.border,
              'hover:bg-primary/20 hover:text-primary hover:border-primary/80'
            )}
            style={{
              fontSize: `${0.75 + (value / maxFreq) * 1.0}rem`,
              padding: `${0.3 + (value / maxFreq) * 0.25}rem ${0.6 + (value / maxFreq) * 0.5}rem`,
            }}
          >
            {text}
          </Badge>
        );
      })}
    </div>
  );
};

export default KeywordCloud;