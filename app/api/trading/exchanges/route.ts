import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase-admin';
import { tradingEngine } from '@/lib/trading-engine';
import { encrypt } from '@/lib/encryption';

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

    // Initialize trading engine
    await tradingEngine.initialize();

    // Get all connections for the user
    const connections = await tradingEngine.getConnections();

    // Audit log
    await db.collection('audit_logs').add({
      userId,
      action: 'get_exchanges',
      timestamp: new Date(),
      ip: 'unknown',
      details: { count: connections.length }
    });

    return NextResponse.json(connections);
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
    const { name, type, apiKey, apiSecret, passphrase } = body;

    // Validate required fields
    if (!name || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: name, type' },
        { status: 400 }
      );
    }

    // Initialize trading engine
    await tradingEngine.initialize();

    // Connect to exchange
    const connection = await tradingEngine.connectExchange({
      name,
      type,
      apiKey,
      apiSecret
    });

    // Store encrypted connection in Firestore
    const encryptedConnection = {
      ...connection,
      userId,
      apiKey: apiKey ? encrypt(apiKey) : undefined,
      apiSecret: apiSecret ? encrypt(apiSecret) : undefined,
      passphrase: passphrase ? encrypt(passphrase) : undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection('exchange_connections').doc(connection.id).set(encryptedConnection);

    // Audit log
    await db.collection('audit_logs').add({
      userId,
      action: 'connect_exchange',
      timestamp: new Date(),
      ip: 'unknown',
      details: { 
        exchangeId: connection.id,
        exchangeName: name,
        type
      }
    });

    // Return connection without sensitive data
    const { apiKey: _, apiSecret: __, passphrase: ___, ...safeConnection } = connection;
    return NextResponse.json(safeConnection);
  } catch (error) {
    console.error('Error connecting exchange:', error);
    return NextResponse.json(
      { error: 'Failed to connect exchange' },
      { status: 500 }
    );
  }
} 