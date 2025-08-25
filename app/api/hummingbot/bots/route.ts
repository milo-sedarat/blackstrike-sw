import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';
import { db } from '@/lib/firebase-admin';
import { createHummingbotClient } from '@/lib/hummingbot/client';
import { encrypt, decrypt } from '@/lib/encryption';

// Rate limiting
const rateLimit = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 100; // requests per window

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = rateLimit.get(userId);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimit.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT_MAX) {
    return false;
  }

  userLimit.count++;
  return true;
}

async function getHummingbotConfig(userId: string) {
  const userDoc = await db.collection('users').doc(userId).get();
  const userData = userDoc.data();

  if (!userData?.hummingbotConfig) {
    throw new Error('Hummingbot not configured for user');
  }

  return {
    gatewayUrl: process.env.HUMMINGBOT_GATEWAY_URL || 'http://localhost:15865',
    apiKey: decrypt(userData.hummingbotConfig.apiKey),
    apiSecret: decrypt(userData.hummingbotConfig.apiSecret),
    userId,
  };
}

// GET /api/hummingbot/bots - Get all bots for user
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    if (!checkRateLimit(userId)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const config = await getHummingbotConfig(userId);
    const client = createHummingbotClient(config);

    const bots = await client.getBots();

    // Audit log
    await db.collection('audit_logs').add({
      userId,
      action: 'get_bots',
      timestamp: new Date(),
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent'),
    });

    return NextResponse.json(bots);
  } catch (error) {
    console.error('Error getting bots:', error);
    return NextResponse.json(
      { error: 'Failed to get bots' },
      { status: 500 }
    );
  }
}

// POST /api/hummingbot/bots - Create new bot
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    if (!checkRateLimit(userId)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const body = await request.json();
    const { name, strategy, config, exchange, tradingPair } = body;

    // Validate required fields
    if (!name || !strategy || !exchange || !tradingPair) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const hummingbotConfig = await getHummingbotConfig(userId);
    const client = createHummingbotClient(hummingbotConfig);

    const newBot = await client.createBot({
      name,
      strategy,
      config: config || {},
      status: 'stopped',
      exchange,
      tradingPair,
    });

    // Store bot in Firestore for additional metadata
    await db.collection('bots').doc(newBot.id).set({
      userId,
      ...newBot,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Audit log
    await db.collection('audit_logs').add({
      userId,
      action: 'create_bot',
      botId: newBot.id,
      timestamp: new Date(),
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent'),
      details: { name, strategy, exchange, tradingPair },
    });

    return NextResponse.json(newBot);
  } catch (error) {
    console.error('Error creating bot:', error);
    return NextResponse.json(
      { error: 'Failed to create bot' },
      { status: 500 }
    );
  }
} 