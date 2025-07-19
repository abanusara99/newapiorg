import type { Article } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Cpu, Briefcase, Trophy, Film } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface NewsCardProps {
  article: Article;
  onCardClick: () => void;
  onFavoriteToggle: () => void;
  isFavorited: boolean;
}

const categoryIcons = {
  Technology: <Cpu className="h-4 w-4" />,
  Business: <Briefcase className="h-4 w-4" />,
  Sports: <Trophy className="h-4 w-4" />,
  Entertainment: <Film className="h-4 w-4" />,
};

export function NewsCard({
  article,
  onCardClick,
  onFavoriteToggle,
  isFavorited,
}: NewsCardProps) {
  const categoryKey = article.category as keyof typeof categoryIcons;
  return (
    <Card 
      onClick={onCardClick}
      className="flex flex-col overflow-hidden h-full cursor-pointer group transition-all hover:shadow-lg hover:-translate-y-1"
      aria-label={`Read more about ${article.title}`}
    >
      <CardHeader className="flex-1 pb-2">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="w-fit mb-2 flex items-center gap-2">
            {categoryIcons[categoryKey]}
            {article.category}
          </Badge>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle();
            }}
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={cn('h-4 w-4', isFavorited ? 'fill-accent stroke-accent' : 'text-muted-foreground')}
            />
          </Button>
        </div>
        <CardTitle className="text-lg font-headline font-semibold leading-tight group-hover:text-accent transition-colors">
          {article.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-3 text-sm">
          {article.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
