"use client";

import { useState, useEffect, useMemo, useTransition } from 'react';
import type { Article } from '@/types';
import { getNews } from '@/lib/actions';
import { useFavorites } from '@/hooks/use-favorites';
import { NewsCard } from '@/components/news-card';
import { ArticleModal } from '@/components/article-modal';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Search, Cpu, Briefcase, Trophy, Heart, Newspaper, Film } from 'lucide-react';
import { Icons } from '@/components/icons';

const categories = [
  { name: 'All', icon: Newspaper },
  { name: 'Technology', icon: Cpu },
  { name: 'Business', icon: Briefcase },
  { name: 'Sports', icon: Trophy },
  { name: 'Entertainment', icon: Film },
  { name: 'Favorites', icon: Heart },
];

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    startTransition(async () => {
      try {
        const result = await getNews();
        if (result.error) {
          setError(result.error);
          setArticles([]);
        } else if (result.articles) {
          setArticles(result.articles);
          setError(null);
        }
      } catch (err) {
        setError('Failed to fetch news. Please try again later.');
      }
    });
  }, []);

  const filteredArticles = useMemo(() => {
    let currentArticles: Article[];

    if (activeTab === 'Favorites') {
      currentArticles = favorites;
    } else if (activeTab === 'All') {
      currentArticles = articles;
    } else {
      currentArticles = articles.filter(
        (article) => article.category.toLowerCase() === activeTab.toLowerCase()
      );
    }
    
    if (!searchQuery) {
      return currentArticles;
    }

    return currentArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [articles, activeTab, searchQuery, favorites]);

  const handleFavoriteToggle = (article: Article) => {
    if (isFavorite(article.id)) {
      removeFavorite(article.id);
    } else {
      addFavorite(article);
    }
  };

  const loading = isPending;

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
            <div className="flex gap-2 items-center">
              <Icons.logo className="h-6 w-6 text-accent" />
              <h1 className="text-2xl font-bold font-headline tracking-tight">NewMars</h1>
            </div>
            <div className="flex flex-1 items-center justify-end space-x-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search articles..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search articles"
                />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <div className="container py-6">
            <p className="text-center text-foreground font-bold mb-4">
              Thank you for visiting my page, but this below news are random dated news. I used NewsAPI .org for this project and this project still under construction. Please do not think the news are latest ones. 
            </p>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-6 mb-6">
                {categories.map(({ name, icon: Icon }) => (
                  <TabsTrigger key={name} value={name} className="flex gap-2 items-center">
                    <Icon className="h-4 w-4" />
                    {name}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {categories.map(({ name }) => (
                <TabsContent key={name} value={name}>
                  {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex flex-col space-y-3">
                          <Skeleton className="h-[120px] w-full rounded-xl" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-[200px]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : error ? (
                    <Alert variant="destructive">
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  ) : filteredArticles.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
                      {filteredArticles.map((article) => (
                        <NewsCard
                          key={article.id}
                          article={article}
                          onCardClick={() => setSelectedArticle(article)}
                          onFavoriteToggle={() => handleFavoriteToggle(article)}
                          isFavorited={isFavorite(article.id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <p className="text-muted-foreground">No articles found.</p>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </main>
        
        <footer className="py-6 md:px-8 md:py-0 border-t">
          <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
            <p className="text-center text-sm leading-loose text-muted-foreground">
              Built by <a href="https://github.com/abanusara99" target="_blank" rel="noopener noreferrer" className="font-medium underline underline-offset-4">ABANUSARA</a>. The source code is available on GitHub.
            </p>
          </div>
        </footer>
      </div>

      <ArticleModal
        article={selectedArticle}
        isOpen={!!selectedArticle}
        onOpenChange={(isOpen) => !isOpen && setSelectedArticle(null)}
        onFavoriteToggle={() => selectedArticle && handleFavoriteToggle(selectedArticle)}
        isFavorited={selectedArticle ? isFavorite(selectedArticle.id) : false}
      />
    </>
  );
}
