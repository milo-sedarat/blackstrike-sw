import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase-admin';
import { encrypt } from '@/lib/encryption';

interface ExchangeConnection {
  id: string;
  name: string;
  type: 'cex' | 'dex';
  status: 'connected' | 'disconnected' | 'error';
  balance: number;
  lastSync: Date;
  apiKey?: string;
  apiSecret?: string;
  passphrase?: string;
}

export async function GET(request: NextRequest) {
  try {
    if (!auth || !db) {
      return NextResponse.json({ error: 'Service not available' }, { status: 503 });
    }

    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // Get exchange connections from Firestore
    const connectionsSnapshot = await db.collection('exchange_connections').where('userId', '==', userId).get();
    const connections: ExchangeConnection[] = [];

    connectionsSnapshot.forEach(doc => {
      const data = doc.data();
      connections.push({
        id: doc.id,
        name: data.name,
        type: data.type,
        status: data.status || 'disconnected',
        balance: data.balance || 0,
        lastSync: data.lastSync?.toDate() || new Date(),
        // Don't return sensitive data
      });
    });

    return NextResponse.json(connections);
  } catch (error) {
    console.error('Error fetching exchange connections:', error);
    return NextResponse.json({ error: 'Failed to fetch exchange connections' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!auth || !db) {
      return NextResponse.json({ error: 'Service not available' }, { status: 503 });
    }

    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const body = await request.json();
    const { name, type, apiKey, apiSecret, passphrase } = body;

    if (!name || !type) {
      return NextResponse.json({ error: 'Missing required fields: name, type' }, { status: 400 });
    }

    const connectionId = `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Encrypt sensitive data
    const encryptedConnection = {
      id: connectionId,
      name,
      type,
      status: 'connected',
      balance: 0,
      lastSync: new Date(),
      userId,
      apiKey: apiKey ? encrypt(apiKey) : undefined,
      apiSecret: apiSecret ? encrypt(apiSecret) : undefined,
      passphrase: passphrase ? encrypt(passphrase) : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Store in Firestore
    await db.collection('exchange_connections').doc(connectionId).set(encryptedConnection);

    // Log the action
    await db.collection('audit_logs').add({
      userId,
      action: 'connect_exchange',
      timestamp: new Date(),
      ip: 'unknown',
      details: { 
        exchangeId: connectionId, 
        exchangeName: name, 
        type 
      },
    });

    // Return safe data (without sensitive info)
    const safeConnection = {
      id: connectionId,
      name,
      type,
      status: 'connected',
      balance: 0,
      lastSync: new Date(),
    };

    return NextResponse.json(safeConnection);
  } catch (error) {
    console.error('Error connecting exchange:', error);
    return NextResponse.json({ error: 'Failed to connect exchange' }, { status: 500 });
  }
} 