import { AgentDispatchClient } from 'livekit-server-sdk';
import { getInterviewForApply } from '@/actions/interviews';
import { getOrganisationSecrets } from '@/actions/organisations';

export async function createCallRoom(
  interviewId: string,
  phoneNumber?: string | null
) {
  const agentDispatchClient = new AgentDispatchClient(
    process.env.LIVEKIT_URL || '',
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET
  );

  const interview = await getInterviewForApply(interviewId);
  const secrets = await getOrganisationSecrets(
    interview?.organisation?.id || ''
  );
  const roomName = `interview-${interviewId}`;

  const metadata = {
    comapany: {
      name: interview?.organisation?.name,
      description: interview?.organisation?.description,
    },
    job: {
      name: interview?.job?.name,
      description: interview?.job?.description,
    },
    candidate: {
      name: interview?.candidate?.name,
      description: interview?.candidate?.description,
    },
    phone_number: phoneNumber,
    yandex_api_key: secrets?.yandexApiKey,
    yandex_folder_id: secrets?.yandexFolderId,
  };

  await agentDispatchClient.createDispatch(
    roomName,
    process.env.LIVEKIT_AGENT_NAME || '',
    {
      metadata: JSON.stringify(metadata),
    }
  );
}
