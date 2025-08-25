import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';
import { db } from '@/lib/firebase-admin';
import { createHummingbotClient } from '@/lib/hummingbot/client';

async function getHummingbotConfig(userId: string) {
  const userDoc = await db.collection('users').doc(userId).get();
  const userData = userDoc.data();

  if (!userData?.hummingbotConfig) {
    throw new Error('Hummingbot not configured for user');
  }

  return {
    gatewayUrl: process.env.HUMMINGBOT_GATEWAY_URL || 'http://localhost:15865',
    apiKey: userData.hummingbotConfig.apiKey,
    apiSecret: userData.hummingbotConfig.apiSecret,
    userId,
  };
}

// POST /api/hummingbot/bots/[id]/stop - Stop bot
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const config = await getHummingbotConfig(userId);
    const client = createHummingbotClient(config);

    await client.stopBot(params.id);

    // Update status in Firestore
    await db.collection('bots').doc(params.id).update({
      status: 'stopped',
      updatedAt: new Date(),
    });

    // Audit log
    await db.collection('audit_logs').add({
      userId,
      action: 'stop_bot',
      botId: params.id,
      timestamp: new Date(),
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent'),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error stopping bot:', error);
    return NextResponse.json(
      { error: 'Failed to stop bot' },
      { status: 500 }
    );
  }
} 