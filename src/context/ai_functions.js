const fetchAIRecommendations = async (queue) => {
    console.log("🔍 AI recommendation triggered");

    const listenedSongs = queue.filter((t) => t.listenedTo);
    if (listenedSongs.length === 0) {
      console.log("⚠️ No songs listened to yet, skipping AI call.");
      return;
    }

    try {
      const apiKey = import.meta.env.VITE_TOGETHER_API_KEY;

      const referenceSection = listenedSongs
        .map((t, i) => `${i + 1}. ${t.name} - ${t.primaryArtists}`)
        .join("\n");

      const excludeSection = queue
        .map((t, i) => `${i + 1}. ${t.name} - ${t.primaryArtists}`)
        .join("\n");

      const prompt =
        `You are a smart music recommendation AI.\n\n` +
        `🎧 Below is a list of songs the user has listened to and enjoyed:\n` +
        `${referenceSection}\n\n` +
        `🚫 These are all the songs already in the user's playlist (do NOT recommend any of these):\n` +
        `${excludeSection}\n\n` +
        `🎯 Recommend 5 *new* songs that:\n` +
        `- Match the **vibe/mood/feel** of the first list (e.g. dancey, romantic, chill, emotional, etc).\n` +
        `- Prefer **artists** who make music with a similar style to those above.\n` +
        `- Stay in the **same language** as the reference songs.\n` +
        `- DO NOT include any songs already listed above.\n\n` +
        `📋 Respond in the following format:\n1. Song Name - Artist\n2. ...`;

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
          const match = line.match(/^\s*\d+\.\s*([^-]+?)\s*-\s*(.+?)\s*$/);
          if (match) {
            return {
              name: match[1].trim(),
              artist: match[2].trim(),
            };
          }
          return null;
        })
        .filter(Boolean);

      console.log("🎵 AI Recommendations:", recommendations);

      for (const rec of recommendations) {
        const res = await fetch(
          `${
            import.meta.env.VITE_APP_API_URL
          }/search/songs?query=${encodeURIComponent(
            `${rec.name} ${rec.artist}`
          )}&limit=1`
        );
        const json = await res.json();

        if (json?.data?.results?.length > 0) {
          const song = json.data.results[0];

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
      .map((t) => {
        const yearInfo = t.year ? ` (${t.year})` : "";
        return `${t.name} - ${t.primaryArtists}${yearInfo}`;
      })
      .join("\n");

    const excludeSection = queue
      .map((t) => `${t.name} - ${t.primaryArtists}`)
      .join("\n");

    const prompt =
`You are a music recommendation AI.

The user has liked the following songs:
${referenceSection}

Do not recommend any of these songs again:
${excludeSection}

Your goal:
Recommend 5 *popular and widely loved* songs that match the vibe, genre, and language of the liked songs.

Guidelines:
- You are allowed to recommend songs from the same artist multiple times, as long as their music is consistently good and they are well-known.
- Prioritize artists the user already likes. Recommend **other good songs** by these artists if they have multiple popular tracks.
- Avoid recommending songs by artists who are only known for one viral or trending song.
- Prefer songs released in the past few years (e.g. 2021 or later), but older songs are fine if they are still widely loved.
- Do not include niche, underground, or unknown artists or songs.

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
      let res = await fetch(
        `${import.meta.env.VITE_APP_API_URL}/search/songs?query=${encodeURIComponent(
          rec.name
        )}&limit=1`
      );
      let json = await res.json();

      if (!json?.data?.results?.length) {
        res = await fetch(
          `${import.meta.env.VITE_APP_API_URL}/search/songs?query=${encodeURIComponent(
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