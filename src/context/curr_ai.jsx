const fetchAIRecommendations = async (currentQueue) => {
    console.log("AI recommendation fallback triggered");

    const listenedSongs = currentQueue.filter(
      (t) => t.listenedTo && t.source === "home"
    );
    if (listenedSongs.length === 0) {
      console.log(
        "No songs listened to yet from home source, skipping AI fallback."
      );
      return;
    }

    try {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      if (!apiKey) {
        console.log("No AI API key found, skipping AI recommendations");
        return;
      }

      const referenceSection = listenedSongs
        .slice(-3) // last 3 songs
        .map((t) => `${t.name} - ${t.primaryArtists}`)
        .join("\n");

      const excludeSection = currentQueue
        .map((t) => `${t.name} - ${t.primaryArtists}`)
        .join("\n");

      const prompt = `You are a music recommendation AI.

The user has recently listened to these songs:
${referenceSection}

Do not recommend any of these (already in queue):
${excludeSection}

Your task:
- Identify the genres, mood, and *era* (decade/year) of the recent songs.
- Recommend 3 popular songs that match the same vibe and era, or from closely related genres/artists that the listener is likely to enjoy.
- Prioritize songs from a similar time period (if the user is listening to older music, suggest more from that era).
- Avoid suggesting extremely obscure songs — keep them recognizable but still fresh.

Output Format (strictly follow):
1. Song Name - Artist
2. Song Name - Artist
3. Song Name - Artist`;

      // ✅ OpenRouter request
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            "model": "openrouter/free",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 120,
            temperature: 0.7,
          }),
        }
      );

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content;
      if (!reply) throw new Error("Invalid AI response");

      const recommendations = reply
        .split(/\n+/)
        .map((line) => {
          const match = line.match(/^\s*\d+\.\s*(.+?)\s*-\s*(.+?)\s*$/);
          if (match) {
            return {
              name: match[1].trim(),
              artist: match[2].trim(),
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(0, 3);

      console.log("AI Recommendations:", recommendations);

      if (recommendations.length === 0) {
        console.log("No valid AI recommendations parsed");
        return;
      }

      // Search for each AI recommendation
      const foundSongs = [];
      for (const rec of recommendations) {
        try {
          const res = await fetch(
            `${
              import.meta.env.VITE_APP_API_URL
            }/search/songs?query=${encodeURIComponent(
              rec.name + " " + rec.artist
            )}&limit=1`
          );
          const json = await res.json();
          const candidates = json?.data?.results || [];

          if (candidates.length > 0) {
            const song = candidates[0];
            const exists = currentQueue.some((s) => s.id === song.id);
            if (!exists) {
              foundSongs.push({
                ...song,
                listenedTo: false,
                isCurrentlyPlaying: false,
                source: "home",
              });
            }
          }
        } catch (error) {
          console.error(
            `Error searching for ${rec.name} - ${rec.artist}:`,
            error
          );
        }
      }

      if (foundSongs.length > 0) {
        addToQueue(foundSongs, "home");
        // showToast(`Added ${foundSongs.length} AI recommended songs`);
      }
    } catch (error) {
      console.error("AI Recommendation fallback error:", error);
      showToast("Could not fetch additional recommendations");
    }
  };




  _________________________________________________________

  current prompt

const prompt = `You are a music recommendation engine inside a streaming app.

IMPORTANT BEHAVIOR RULES:
- Do NOT explain your reasoning.
- Do NOT show analysis, thoughts, or decision steps.
- Do NOT output anything except the final song list.

Context:
The user has recently listened to the following songs (most recent first):
${referenceSection}

These songs are already in the queue and MUST NOT be recommended again:
${excludeSection}

Your goal:
Recommend exactly 3 songs the user is very likely to enjoy next.

How to decide (internal only):
- Infer the dominant GENRES, MOOD, ENERGY LEVEL, and ERA (decade / general time period).
- Stay close to the same era and vibe unless a very natural adjacent suggestion fits better.
- Prefer popular or well-known songs over obscure picks.
- Artist familiarity is good, but avoid repeating the same artist too much.
- Avoid remixes, live versions, covers, or alternate versions.

Hard rules:
- NEVER recommend a song listed above.
- Output MUST contain exactly 3 items.
- Follow the output format exactly.
- No extra text before or after the list.

Output format (strict):
1. Song Name - Artist
2. Song Name - Artist
3. Song Name - Artist

If unsure, choose safe, widely-liked songs that fit the inferred vibe.`;
