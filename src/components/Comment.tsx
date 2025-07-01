import React from 'react';
import { Comment as CommentType } from '@/types/hacker-news';
import { formatDistanceToNow } from 'date-fns';
import { User, Clock, Smile, Meh, Frown } from 'lucide-react';
import { cn } from '@/lib/utils';

const SentimentIndicator = ({ score }: { score: number }) => {
  if (score > 0.1) {
    return <Smile className="h-4 w-4 text-green-500" />;
  }
  if (score < -0.1) {
    return <Frown className="h-4 w-4 text-red-500" />;
  }
  return <Meh className="h-4 w-4 text-yellow-500" />;
};

interface CommentProps {
  comment: CommentType;
}

const Comment = ({ comment }: CommentProps) => {
  const [isExpanded, setIsExpanded] = React.useState(true);

  return (
    <div>
      {/* Comment Header & Text */}
      <div>
        <div className="flex items-center text-xs text-muted-foreground gap-4 mb-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <User className="h-3 w-3" />
            <span>{comment.by}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            <span>{formatDistanceToNow(new Date(comment.time * 1000), { addSuffix: true })}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <SentimentIndicator score={comment.sentiment} />
            <span className={cn(
              comment.sentiment > 0.1 && 'text-green-500',
              comment.sentiment < -0.1 && 'text-red-500',
            )}>
              {comment.sentiment.toFixed(2)}
            </span>
          </div>
        </div>
        <div
          className="prose prose-sm prose-invert max-w-none text-foreground/90 break-words"
          dangerouslySetInnerHTML={{ __html: comment.text }}
        />
      </div>

      {/* Replies Section */}
      {comment.kids && comment.kids.length > 0 && (
        <div className="mt-2">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-muted-foreground hover:text-primary"
          >
            {isExpanded ? `Hide ${comment.kids.length} replies` : `Show ${comment.kids.length} replies`}
          </button>
          
          {isExpanded && (
            <div className="mt-4 pl-4 border-l border-white/20 space-y-4">
              {comment.kids.map(reply => (
                <Comment key={reply.id} comment={reply} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Comment;