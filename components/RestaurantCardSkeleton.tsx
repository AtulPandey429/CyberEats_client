import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function RestaurantCardSkeleton() {
  return (
    <Card className="animate-pulse border-theme">
      <CardHeader className="pb-2">
        <div className="h-5 w-2/3 rounded bg-surface-elevated" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-4 w-full rounded bg-surface-elevated" />
        <div className="h-4 w-5/6 rounded bg-surface-elevated" />
        <div className="flex gap-2">
          <div className="h-6 w-16 rounded-full bg-surface-elevated" />
          <div className="h-6 w-16 rounded-full bg-surface-elevated" />
        </div>
      </CardContent>
    </Card>
  );
}
