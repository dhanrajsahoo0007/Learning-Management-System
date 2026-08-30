import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import type { HubCategory, HubPage } from '@/data/aiml/types';
import { resolveAimlIcon } from '@/lib/aimlIcons';

export function ModelCategoryGrid({ hub }: { hub: HubPage }) {
  const groups = hub.groups?.length
    ? hub.groups.map((group) => ({
        name: group.name,
        categories: hub.categories.filter((category) => group.categories.includes(category.title)),
      }))
    : [{ name: undefined, categories: hub.categories }];

  return (
    <div className="space-y-12">
      {groups.map((group) => (
        <div key={group.name ?? 'all'} className="space-y-8">
          {group.name && (
            <h2 className="font-display text-2xl font-semibold tracking-tight">{group.name}</h2>
          )}
          {group.categories.map((category) => (
            <CategorySection key={category.title} category={category} />
          ))}
        </div>
      ))}
    </div>
  );
}

function CategorySection({ category }: { category: HubCategory }) {
  const Icon = resolveAimlIcon(category.icon);
  return (
    <section>
      <div className="mb-4 flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
        <div>
          <h3 className="text-lg font-semibold">{category.title}</h3>
          {category.subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{category.subtitle}</p>
          )}
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {category.cards.map((card) => {
          const CardIcon = resolveAimlIcon(card.icon);
          return (
            <Link key={card.topicId} to={card.href}>
              <Card className="h-full transition-colors hover:bg-accent/40">
                <CardContent className="p-4">
                  <CardIcon className="mb-3 size-5 text-primary" />
                  <p className="font-medium">{card.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{card.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
