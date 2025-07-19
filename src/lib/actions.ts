'use server';

import type { Article, ApiArticle } from '@/types';

const TOP_HEADLINES_URL = 'https://newsapi.org/v2/top-headlines';
const EVERYTHING_URL = 'https://newsapi.org/v2/everything';

function mapApiArticleToArticle(apiArticle: ApiArticle, category: Article['category']): Article | null {
  if (!apiArticle.title || !apiArticle.description || !apiArticle.url) {
    return null;
  }
  return {
    id: apiArticle.url, // Using URL as a unique ID
    title: apiArticle.title,
    description: apiArticle.description,
    category: category,
    sourceUrl: apiArticle.url,
  };
}

export const getNews = async (): Promise<{ articles?: Article[]; error?: string }> => {
  const categories: Article['category'][] = ['Technology', 'Business', 'Sports', 'Entertainment'];
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    const errorMsg = 'News API key is not configured on the server.';
    console.error(errorMsg);
    return { error: errorMsg };
  }

  try {
    const promises = categories.map(category => {
      let url: string;
      const today = new Date();
      const fromDate = today.toISOString().split('T')[0];

      
      // For standard categories, use the 'top-headlines' endpoint
      url = `${TOP_HEADLINES_URL}?country=us&category=${category.toLowerCase()}&apiKey=${apiKey}`;
      

      return fetch(url).then(async (res) => {
        if (!res.ok) {
           const err = await res.json();
           console.error(`Failed to fetch news for category ${category}: ${err.message || res.statusText}`);
           return { status: 'error', reason: err.message || res.statusText, articles: [] };
        }
        return res.json();
      });
    });

    const results = await Promise.all(promises);

    const allArticles: Article[] = [];
    results.forEach((result, index) => {
      if (result.status === 'ok') {
        const category = categories[index];
        result.articles.forEach((apiArticle: ApiArticle) => {
          const mapped = mapApiArticleToArticle(apiArticle, category);
          if (mapped) {
            allArticles.push(mapped);
          }
        });
      }
    });

    if (allArticles.length === 0) {
      return { error: 'Could not fetch any news articles. Please check the API key and network.' };
    }

    // De-duplicate articles based on their ID (URL)
    const uniqueArticles = Array.from(new Map(allArticles.map(article => [article.id, article])).values());
    
    // Sort by most recent first, though API should handle it. This is a fallback.
    return { articles: uniqueArticles };

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'An unknown error occurred while fetching news.';
    console.error('An error occurred while fetching news:', errorMsg);
    return { error: errorMsg };
  }
};
