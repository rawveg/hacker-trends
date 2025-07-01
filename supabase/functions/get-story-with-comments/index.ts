import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import Sentiment from 'https://esm.sh/sentiment'

const HN_API_BASE = "https://hacker-news.firebaseio.com/v0";
const sentiment = new Sentiment();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const fetchItem = async (id) => {
  const res = await fetch(`${HN_API_BASE}/item/${id}.json`);
  if (!res.ok) return null;
  return res.json();
}

// Recursive function to fetch comments and their children
const fetchComments = async (commentIds, depth = 0) => {
  if (!commentIds || commentIds.length === 0 || depth > 2) { // Limit recursion depth to 2 levels
    return [];
  }

  const commentPromises = commentIds.map(id => fetchItem(id));
  const comments = await Promise.all(commentPromises);

  const processedComments = await Promise.all(
    comments
      .filter(c => c && c.text && !c.deleted)
      .map(async (comment) => {
        const sentimentResult = sentiment.analyze(comment.text);
        const replies = await fetchComments(comment.kids, depth + 1);
        return {
          id: comment.id,
          by: comment.by,
          text: comment.text,
          time: comment.time,
          sentiment: sentimentResult.comparative,
          kids: replies,
        };
      })
  );

  return processedComments.filter(Boolean);
};


serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { storyId } = await req.json();
    if (!storyId) {
      throw new Error("storyId is required");
    }

    const story = await fetchItem(storyId);
    if (!story) {
      throw new Error("Story not found");
    }

    const comments = await fetchComments(story.kids);

    const responseData = { ...story, comments };

    return new Response(
      JSON.stringify(responseData),
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