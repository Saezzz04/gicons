export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
}

interface BraveSearchResponse {
  web?: {
    results?: Array<{
      title: string;
      url: string;
      description: string;
    }>;
  };
}

export async function braveWebSearch(
  query: string,
  count: number = 5,
): Promise<WebSearchResult[]> {
  const apiKey = process.env.BRAVE_SEARCH_API_KEY;
  if (!apiKey) {
    throw new Error('BRAVE_SEARCH_API_KEY environment variable is required');
  }

  const params = new URLSearchParams({
    q: query,
    count: String(count),
  });

  const res = await fetch(
    `https://api.search.brave.com/res/v1/web/search?${params}`,
    {
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip',
        'X-Subscription-Token': apiKey,
      },
      signal: AbortSignal.timeout(10000),
    },
  );

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Brave Search API error: HTTP ${res.status} - ${text}`);
  }

  const data: BraveSearchResponse = await res.json();
  const results = data.web?.results ?? [];

  return results.map((r) => ({
    title: r.title,
    url: r.url,
    snippet: r.description,
  }));
}
