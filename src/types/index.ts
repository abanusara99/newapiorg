export type Article = {
  id: string;
  title: string;
  description: string;
  category: 'Technology' | 'Business' | 'Sports' | 'Entertainment';
  sourceUrl: string;
};

// Type for the raw article from the News API
export type ApiArticle = {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
};
