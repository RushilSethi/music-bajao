const fetchAIRecommendations = async (queue) => {
    console.log("AI recommendation triggered");

    const listenedSongs = queue.filter((t) => t.listenedTo);
    if (listenedSongs.length === 0) {
      console.log("No songs listened to yet, skipping AI call.");
      return;
    }

    try {
      const apiKey = import.meta.env.VITE_TOGETHER_API_KEY;

      const referenceSection = listenedSongs
        .map((t) => `${t.name} - ${t.primaryArtists}`)
        .join("\n");

      const excludeSection = queue
        .map((t) => `${t.name} - ${t.primaryArtists}`)
        .join("\n");

      const prompt =
`You are a smart music recommendation AI.

The user has liked these songs:
${referenceSection}

Do not recommend any of these:
${excludeSection}

Your task:
Recommend 5 *popular and widely liked* songs that match the mood, genre, and language of the songs above.

Important:
- Only include artists who are well-known and have **several popular tracks**, not just one viral or trending song.
- Avoid artists who are known for only a single hit.
- You can include repeated artists **only if they meet the above criteria**.
- Do NOT include obscure or niche artists or songs.

Format:
1. Song Name - Artist
2. ...
`;
            
      const response = await fetch(
        "https://api.together.xyz/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "mistralai/Mistral-7B-Instruct-v0.2",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 200,
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
        .filter(Boolean);

      console.log("AI Recommendations:", recommendations);

      for (const rec of recommendations) {
        // Search only by song name first
        let res = await fetch(
          `${
            import.meta.env.VITE_APP_API_URL
          }/search/songs?query=${encodeURIComponent(rec.name)}&limit=1`
        );
        let json = await res.json();

        // Fallback: try with artist name if not found
        if (!json?.data?.results?.length) {
          res = await fetch(
            `${
              import.meta.env.VITE_APP_API_URL
            }/search/songs?query=${encodeURIComponent(
              `${rec.name} ${rec.artist}`
            )}&limit=1`
          );
          json = await res.json();
        }

        const song = json?.data?.results?.[0];
        if (song) {
          setQueue((prev) => {
            const exists = prev.some((s) => s.id === song.id);
            return exists ? prev : [...prev, { ...song, listenedTo: false }];
          });
        }
      }
    } catch (error) {
      console.error("AI Recommendation error:", error);
      showToast("Failed to fetch AI recommendations.");
    }
  };