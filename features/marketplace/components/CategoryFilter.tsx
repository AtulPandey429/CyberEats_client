'use client';

import { CategoryPill } from '@/components/CategoryPill';

interface CategoryFilterProps {
  categories: string[];
  selected?: string;
  onSelect: (category?: string) => void;
}

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <CategoryPill label="All" active={!selected} onClick={() => onSelect(undefined)} />
      {categories.map((category) => (
        <CategoryPill
          key={category}
          label={category}
          active={selected === category}
          onClick={() => onSelect(category)}
        />
      ))}
    </div>
  );
}
