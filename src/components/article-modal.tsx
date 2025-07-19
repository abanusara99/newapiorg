import type { Article } from '@/types';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArticleModalProps {
  article: Article | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isFavorited: boolean;
  onFavoriteToggle: () => void;
}

export function ArticleModal({
  article,
  isOpen,
  onOpenChange,
  isFavorited,
  onFavoriteToggle,
}: ArticleModalProps) {
  const [displayDate, setDisplayDate] = useState('');

  useEffect(() => {
    if (isOpen) {
      setDisplayDate(new Date().toLocaleString());
    }
  }, [isOpen]);
  
  if (!article) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-headline">{article.title}</DialogTitle>
          <p className="text-sm text-muted-foreground pt-2">{displayDate}</p>
          <DialogDescription className="text-base pt-2">
            {article.description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start gap-2 pt-4">
          <Button
            onClick={onFavoriteToggle}
            variant="outline"
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={cn('mr-2 h-4 w-4', isFavorited && 'fill-accent stroke-accent')} />
            <span>{isFavorited ? 'Favorited' : 'Favorite'}</span>
          </Button>
          <Button asChild>
            <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer">
              Read More
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
