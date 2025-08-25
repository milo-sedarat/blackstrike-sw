import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase-admin';
import { encrypt, decrypt } from '@/lib/encryption';

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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    // Import HummingbotClient dynamically
    const { HummingbotClient } = await import('@/lib/hummingbot/client');
    const client = new HummingbotClient(config);

    // Get exchange from Hummingbot
    const exchange = await client.getExchange(params.id);

    // Audit log
    await db.collection('audit_logs').add({
      userId,
      action: 'get_exchange',
      timestamp: new Date(),
      ip: 'unknown',
      details: { exchangeId: params.id }
    });

    return NextResponse.json(exchange);
  } catch (error) {
    console.error('Error getting exchange:', error);
    return NextResponse.json(
      { error: 'Failed to get exchange' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { name, apiKey, apiSecret, passphrase, sandbox } = body;

    // Get Hummingbot configuration
    const config = await getHummingbotConfig(userId);
    
    // Import HummingbotClient dynamically
    const { HummingbotClient } = await import('@/lib/hummingbot/client');
    const client = new HummingbotClient(config);

    // Update exchange in Hummingbot
    const updates: any = {};
    if (name) updates.name = name;
    if (apiKey) updates.apiKey = apiKey;
    if (apiSecret) updates.apiSecret = apiSecret;
    if (passphrase !== undefined) updates.passphrase = passphrase;
    if (sandbox !== undefined) updates.sandbox = sandbox;

    const updatedExchange = await client.updateExchange(params.id, updates);

    // Update encrypted config in Firestore if credentials changed
    if (apiKey || apiSecret || passphrase !== undefined) {
      const encryptedUpdates: any = {};
      if (apiKey) encryptedUpdates.apiKey = encrypt(apiKey);
      if (apiSecret) encryptedUpdates.apiSecret = encrypt(apiSecret);
      if (passphrase !== undefined) {
        encryptedUpdates.passphrase = passphrase ? encrypt(passphrase) : null;
      }
      if (name) encryptedUpdates.name = name;
      if (sandbox !== undefined) encryptedUpdates.sandbox = sandbox;

      await db.collection('exchange_configs').doc(params.id).update(encryptedUpdates);
    }

    // Audit log
    await db.collection('audit_logs').add({
      userId,
      action: 'update_exchange',
      timestamp: new Date(),
      ip: 'unknown',
      details: { exchangeId: params.id, updatedFields: Object.keys(updates) }
    });

    return NextResponse.json(updatedExchange);
  } catch (error) {
    console.error('Error updating exchange:', error);
    return NextResponse.json(
      { error: 'Failed to update exchange' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    // Import HummingbotClient dynamically
    const { HummingbotClient } = await import('@/lib/hummingbot/client');
    const client = new HummingbotClient(config);

    // Delete exchange from Hummingbot
    await client.deleteExchange(params.id);

    // Delete encrypted config from Firestore
    await db.collection('exchange_configs').doc(params.id).delete();

    // Audit log
    await db.collection('audit_logs').add({
      userId,
      action: 'delete_exchange',
      timestamp: new Date(),
      ip: 'unknown',
      details: { exchangeId: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting exchange:', error);
    return NextResponse.json(
      { error: 'Failed to delete exchange' },
      { status: 500 }
    );
  }
} 