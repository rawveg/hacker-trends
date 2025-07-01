import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import Sentiment from 'https://esm.sh/sentiment'

const HN_API_BASE = "https://hacker-news.firebaseio.com/v0";
const sentiment = new Sentiment();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const fetchItem = (id) => fetch(`${HN_API_BASE}/item/${id}.json`).then(res => res.json());

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const topStoriesRes = await fetch(`${HN_API_BASE}/topstories.json`);
    const storyIds = await topStoriesRes.json();
    const top50Ids = storyIds.slice(0, 50);

    const storyPromises = top50Ids.map(fetchItem);
    const stories = await Promise.all(storyPromises);

    const allCommentsPromises = stories
      .filter(story => story && story.kids)
      .map(async (story) => {
        const commentIds = story.kids.slice(0, 20); // Get up to 20 comments per story
        const commentPromises = commentIds.map(fetchItem);
        const comments = await Promise.all(commentPromises);
        
        return comments
          .filter(c => c && c.text && !c.deleted)
          .map(c => ({
            ...c,
            storyId: story.id,
            storyTitle: story.title,
          }));
      });

    const commentsByStory = await Promise.all(allCommentsPromises);
    const allComments = commentsByStory.flat();

    const sentimentData = allComments.map(c => {
      const result = sentiment.analyze(c.text);
      return {
        id: c.id,
        by: c.by,
        text: c.text,
        time: c.time,
        score: result.comparative,
        storyId: c.storyId,
        storyTitle: c.storyTitle,
      };
    });

    return new Response(
      JSON.stringify(sentimentData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})