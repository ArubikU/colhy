
import { DashboardClient } from './client-page';
import { getActiveModels } from '@/lib/ai';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const models = await getActiveModels();

  return <DashboardClient models={models} />;
}
