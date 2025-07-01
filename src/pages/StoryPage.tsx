import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StoryExplorer from '@/components/StoryExplorer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const StoryPage = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const numericStoryId = storyId ? parseInt(storyId, 10) : null;

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <Button onClick={() => navigate(-1)} variant="ghost" className="-ml-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
      <div className="flex-grow rounded-2xl border border-border bg-card/50 overflow-hidden">
        <StoryExplorer storyId={numericStoryId} />
      </div>
    </div>
  );
};

export default StoryPage;