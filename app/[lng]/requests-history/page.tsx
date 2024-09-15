import { auth } from '@/auth';
import History from '@/app/[lng]/components/History/History';

async function requestHistory() {
  const session = await auth();
  return <History session={session} />;
}

export default requestHistory;
