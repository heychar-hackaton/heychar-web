'use server';

import { AccessToken, AgentDispatchClient } from 'livekit-server-sdk';
import { getInterviewForApply } from './interviews';
import { getOrganisationSecrets } from './organisations';

export async function generateLiveKitToken(
  roomName: string,
  participantName: string
) {
  try {
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.LIVEKIT_URL;

    if (!(apiKey && apiSecret && wsUrl)) {
      throw new Error('LiveKit configuration missing');
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: participantName,
      ttl: '10m',
    });

    at.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    const token = await at.toJwt();

    return {
      success: true,
      token,
      wsUrl,
      roomName,
      participantName,
    };
  } catch (error) {
    console.error('Error creating token:', error);
    return {
      success: false,
      error: 'Failed to create token',
    };
  }
}

export async function dispatchAgent(
  roomName: string,
  phoneNumber?: string | null
) {
  const agentDispatchClient = new AgentDispatchClient(
    process.env.LIVEKIT_URL || '',
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET
  );

  // Извлекаем ID интервью из имени комнаты
  const interviewId = roomName.replace('interview-', '');
  const interview = await getInterviewForApply(interviewId);

  if (!interview?.organisation?.id) {
    throw new Error('Interview or organisation not found');
  }

  const secrets = await getOrganisationSecrets(interview.organisation.id);

  if (!secrets) {
    throw new Error('No secrets found for organisation');
  }

  console.log(`Dispatching agent with provider: ${secrets.provider}`);

  const metadata = {
    company: {
      name: interview.organisation.name,
      description: interview.organisation.description,
    },
    job: {
      name: interview.job?.name,
      description: interview.job?.description,
    },
    candidate: {
      name: interview.candidate?.name,
      description: interview.candidate?.description,
    },
    phone_number: phoneNumber,
    // Provider-specific secrets
    provider: secrets.provider,
    api_key: secrets.apiKey,
    folder_id: secrets.folderId, // Only for Yandex
  };

  await agentDispatchClient.createDispatch(
    roomName,
    process.env.LIVEKIT_AGENT_NAME || 'hr-agent',
    {
      metadata: JSON.stringify(metadata),
    }
  );
}
