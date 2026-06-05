import type { ArchivedStory } from '@/src/actions/story/getArchivedStories';

export type MonthGroup = {
   label: string;
   stories: ArchivedStory[];
};
