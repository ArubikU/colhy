
import { db } from '@/lib/db';
import { aiModels } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

async function check() {
    const allModels = await db.select().from(aiModels);
    console.log(`Total models: ${allModels.length}`);

    const activeModels = await db.select().from(aiModels).where(eq(aiModels.isActive, true));
    console.log(`Active models: ${activeModels.length}`);

    console.log('Active Models List:');
    activeModels.forEach(m => console.log(`${m.provider} - ${m.name} (${m.id})`));

    process.exit(0);
}

check().catch(console.error);
