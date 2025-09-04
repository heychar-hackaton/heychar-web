import type { Metadata } from 'next';
import { getCandidates } from '@/actions/candidates';
import { EmptyCandidatesState } from './components/empty-state';
import { CandidateList } from './components/list';

export const metadata: Metadata = {
  title: 'Кандидаты',
};

export default async function Page() {
  const items = await getCandidates();

  if (!items.length) {
    return <EmptyCandidatesState />;
  }

  return <CandidateList candidates={items} />;
}
