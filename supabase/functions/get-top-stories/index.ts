import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const HN_API_BASE = "https://hacker-news.firebaseio.com/v0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // This is needed for CORS preflight requests.
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Fetch the IDs of the top stories
    const topStoriesRes = await fetch(`${HN_API_BASE}/topstories.json`);
    if (!topStoriesRes.ok) {
      throw new Error(`Failed to fetch top stories: ${topStoriesRes.statusText}`);
    }
    const storyIds = await topStoriesRes.json();

    // Fetch the details for the top 100 stories concurrently
    const top100Ids = storyIds.slice(0, 100);
    const storyPromises = top100Ids.map(id => 
      fetch(`${HN_API_BASE}/item/${id}.json`).then(res => res.json())
    );

    const stories = await Promise.all(storyPromises);
    
    // Filter out any potential nulls if an item failed to fetch
    const validStories = stories.filter(story => story !== null);

    return new Response(
      JSON.stringify(validStories),
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