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

// GET /api/hummingbot/bots/[id] - Get specific bot
export async function GET(
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

    const bot = await client.getBot(params.id);

    return NextResponse.json(bot);
  } catch (error) {
    console.error('Error getting bot:', error);
    return NextResponse.json(
      { error: 'Failed to get bot' },
      { status: 500 }
    );
  }
}

// PUT /api/hummingbot/bots/[id] - Update bot
export async function PUT(
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

    const body = await request.json();
    const config = await getHummingbotConfig(userId);
    const client = createHummingbotClient(config);

    const updatedBot = await client.updateBot(params.id, body);

    // Update Firestore record
    await db.collection('bots').doc(params.id).update({
      ...body,
      updatedAt: new Date(),
    });

    return NextResponse.json(updatedBot);
  } catch (error) {
    console.error('Error updating bot:', error);
    return NextResponse.json(
      { error: 'Failed to update bot' },
      { status: 500 }
    );
  }
}

// DELETE /api/hummingbot/bots/[id] - Delete bot
export async function DELETE(
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

    await client.deleteBot(params.id);

    // Delete from Firestore
    await db.collection('bots').doc(params.id).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting bot:', error);
    return NextResponse.json(
      { error: 'Failed to delete bot' },
      { status: 500 }
    );
  }
} 