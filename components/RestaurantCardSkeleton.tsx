import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function RestaurantCardSkeleton() {
  return (
    <Card className="animate-pulse border-cyan-400/10">
      <CardHeader className="pb-2">
        <div className="h-5 w-2/3 rounded bg-slate-800" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-4 w-full rounded bg-slate-800" />
        <div className="h-4 w-5/6 rounded bg-slate-800" />
        <div className="flex gap-2">
          <div className="h-6 w-16 rounded-full bg-slate-800" />
          <div className="h-6 w-16 rounded-full bg-slate-800" />
        </div>
      </CardContent>
    </Card>
  );
}
