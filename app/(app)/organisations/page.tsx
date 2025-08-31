import type { Metadata } from 'next';
import { OrganisationList } from '@/actions/organisations';
import { WIP } from '@/components/ui/wip';
import { EmptyOrganisationsState } from './components/empty-state';

export const metadata: Metadata = {
  title: 'Организации',
};
export default async function Page() {
  const orgs = await OrganisationList();

  if (!orgs.length) {
    return <EmptyOrganisationsState />;
  }

  return <WIP />;
}
