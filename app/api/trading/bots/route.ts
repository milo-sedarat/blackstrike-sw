import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase-admin';

// Simple bot management without the complex trading engine for now
interface SimpleBot {
  id: string;
  name: string;
  strategy: string;
  status: 'running' | 'stopped' | 'paused' | 'error';
  exchange: string;
  tradingPair: string;
  investment: number;
  currentValue: number;
  totalPnL: number;
  totalTrades: number;
  winRate: number;
  createdAt: Date;
  performance: {
    totalPnL: number;
    totalVolume: number;
    winRate: number;
    totalTrades: number;
  };
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

    // Get bots from Firestore
    const botsSnapshot = await db.collection('bots').where('userId', '==', userId).get();
    const bots: SimpleBot[] = [];

    botsSnapshot.forEach(doc => {
      const data = doc.data();
      bots.push({
        id: doc.id,
        name: data.name,
        strategy: data.strategy,
        status: data.status || 'stopped',
        exchange: data.exchange,
        tradingPair: data.tradingPair,
        investment: data.investment,
        currentValue: data.currentValue || data.investment,
        totalPnL: data.totalPnL || 0,
        totalTrades: data.totalTrades || 0,
        winRate: data.winRate || 0,
        createdAt: data.createdAt?.toDate() || new Date(),
        performance: {
          totalPnL: data.performance?.totalPnL || 0,
          totalVolume: data.performance?.totalVolume || 0,
          winRate: data.performance?.winRate || 0,
          totalTrades: data.performance?.totalTrades || 0,
        },
      });
    });

    return NextResponse.json(bots);
  } catch (error) {
    console.error('Error fetching bots:', error);
    return NextResponse.json({ error: 'Failed to fetch bots' }, { status: 500 });
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
    const { name, strategy, exchange, tradingPair, investment, config } = body;

    if (!name || !strategy || !exchange || !tradingPair || !investment) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, strategy, exchange, tradingPair, investment' 
      }, { status: 400 });
    }

    const botId = `bot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newBot: SimpleBot = {
      id: botId,
      name,
      strategy,
      exchange,
      tradingPair,
      investment: parseFloat(investment),
      currentValue: parseFloat(investment),
      totalPnL: 0,
      totalTrades: 0,
      winRate: 0,
      status: 'stopped',
      createdAt: new Date(),
      performance: {
        totalPnL: 0,
        totalVolume: 0,
        winRate: 0,
        totalTrades: 0,
      },
    };

    // Store bot in Firestore
    await db.collection('bots').doc(botId).set({
      ...newBot,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      config: config || {},
    });

    // Log the action
    await db.collection('audit_logs').add({
      userId,
      action: 'create_bot',
      timestamp: new Date(),
      ip: 'unknown',
      details: { 
        botId, 
        botName: name, 
        strategy, 
        exchange, 
        investment 
      },
    });

    return NextResponse.json(newBot);
  } catch (error) {
    console.error('Error creating bot:', error);
    return NextResponse.json({ error: 'Failed to create bot' }, { status: 500 });
  }
} 