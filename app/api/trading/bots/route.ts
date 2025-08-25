import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase-admin';
import { tradingEngine } from '@/lib/trading-engine';

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

    // Get all bots for the user
    const bots = await tradingEngine.getBots();

    // Audit log
    await db.collection('audit_logs').add({
      userId,
      action: 'get_bots',
      timestamp: new Date(),
      ip: 'unknown',
      details: { count: bots.length }
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
    const { name, strategy, exchange, tradingPair, investment, config } = body;

    // Validate required fields
    if (!name || !strategy || !exchange || !tradingPair || !investment) {
      return NextResponse.json(
        { error: 'Missing required fields: name, strategy, exchange, tradingPair, investment' },
        { status: 400 }
      );
    }

    // Initialize trading engine
    await tradingEngine.initialize();

    // Create the bot
    const newBot = await tradingEngine.createBot({
      name,
      strategy,
      exchange,
      tradingPair,
      investment: parseFloat(investment),
      config: config || {}
    });

    // Store bot in Firestore
    await db.collection('bots').doc(newBot.id).set({
      ...newBot,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Audit log
    await db.collection('audit_logs').add({
      userId,
      action: 'create_bot',
      timestamp: new Date(),
      ip: 'unknown',
      details: { 
        botId: newBot.id,
        botName: name,
        strategy,
        exchange,
        investment
      }
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