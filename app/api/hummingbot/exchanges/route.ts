import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase-admin';
import { encrypt } from '@/lib/encryption';

async function getHummingbotConfig(userId: string) {
  if (!db) throw new Error('Database not available');
  
  const userDoc = await db.collection('users').doc(userId).get();
  if (!userDoc.exists) {
    throw new Error('User configuration not found');
  }
  
  const userData = userDoc.data();
  return {
    gatewayUrl: process.env.HUMMINGBOT_GATEWAY_URL || 'http://localhost:1580',
    apiKey: process.env.HUMMINGBOT_API_KEY || '',
    apiSecret: process.env.HUMMINGBOT_API_SECRET || '',
    userId,
  };
}

export async function GET(request: NextRequest) {
  try {
    if (!auth || !db) {
      return NextResponse.json({ error: 'Service not available' }, { status: 503 });
    }

    // Get Firebase token from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // Get Hummingbot configuration
    const config = await getHummingbotConfig(userId);
    
    // Import HummingbotClient dynamically to avoid client-side issues
    const { HummingbotClient } = await import('@/lib/hummingbot/client');
    const client = new HummingbotClient(config);

    // Get exchanges from Hummingbot
    const exchanges = await client.getExchanges();

    // Audit log
    await db.collection('audit_logs').add({
      userId,
      action: 'get_exchanges',
      timestamp: new Date(),
      ip: 'unknown',
      details: { count: exchanges.length }
    });

    return NextResponse.json(exchanges);
  } catch (error) {
    console.error('Error getting exchanges:', error);
    return NextResponse.json(
      { error: 'Failed to get exchanges' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!auth || !db) {
      return NextResponse.json({ error: 'Service not available' }, { status: 503 });
    }

    // Get Firebase token from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // Parse request body
    const body = await request.json();
    const { name, apiKey, apiSecret, passphrase, sandbox = false } = body;

    // Validate required fields
    if (!name || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: 'Missing required fields: name, apiKey, apiSecret' },
        { status: 400 }
      );
    }

    // Get Hummingbot configuration
    const config = await getHummingbotConfig(userId);
    
    // Import HummingbotClient dynamically
    const { HummingbotClient } = await import('@/lib/hummingbot/client');
    const client = new HummingbotClient(config);

    // Add exchange to Hummingbot
    const newExchange = await client.addExchange({
      name,
      apiKey,
      apiSecret,
      passphrase,
      sandbox,
      userId,
    });

    // Store encrypted exchange config in Firestore
    const encryptedConfig = {
      id: newExchange.id,
      name: newExchange.name,
      apiKey: encrypt(apiKey),
      apiSecret: encrypt(apiSecret),
      passphrase: passphrase ? encrypt(passphrase) : null,
      sandbox,
      userId,
      createdAt: new Date(),
    };

    await db.collection('exchange_configs').doc(newExchange.id).set(encryptedConfig);

    // Audit log
    await db.collection('audit_logs').add({
      userId,
      action: 'add_exchange',
      timestamp: new Date(),
      ip: 'unknown',
      details: { exchangeName: name, exchangeId: newExchange.id }
    });

    return NextResponse.json(newExchange);
  } catch (error) {
    console.error('Error adding exchange:', error);
    return NextResponse.json(
      { error: 'Failed to add exchange' },
      { status: 500 }
    );
  }
} 