import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase-admin';
import { tradingEngine } from '@/lib/trading-engine';

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

    // Initialize trading engine
    await tradingEngine.initialize();

    // Get the specific bot
    const bot = await tradingEngine.getBot(params.id);
    if (!bot) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 });
    }

    return NextResponse.json(bot);
  } catch (error) {
    console.error('Error getting bot:', error);
    return NextResponse.json(
      { error: 'Failed to get bot' },
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
    const { action, config } = body;

    // Initialize trading engine
    await tradingEngine.initialize();

    let result;
    switch (action) {
      case 'start':
        await tradingEngine.startBot(params.id);
        result = { success: true, message: 'Bot started successfully' };
        break;
      case 'stop':
        await tradingEngine.stopBot(params.id);
        result = { success: true, message: 'Bot stopped successfully' };
        break;
      case 'update':
        // Update bot configuration
        const bot = await tradingEngine.getBot(params.id);
        if (!bot) {
          return NextResponse.json({ error: 'Bot not found' }, { status: 404 });
        }
        // Update bot config in Firestore
        await db.collection('bots').doc(params.id).update({
          config: { ...bot.config, ...config },
          updatedAt: new Date()
        });
        result = { success: true, message: 'Bot updated successfully' };
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Audit log
    await db.collection('audit_logs').add({
      userId,
      action: `bot_${action}`,
      timestamp: new Date(),
      ip: 'unknown',
      details: { botId: params.id, action }
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating bot:', error);
    return NextResponse.json(
      { error: 'Failed to update bot' },
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

    // Initialize trading engine
    await tradingEngine.initialize();

    // Delete the bot
    await tradingEngine.deleteBot(params.id);

    // Remove from Firestore
    await db.collection('bots').doc(params.id).delete();

    // Audit log
    await db.collection('audit_logs').add({
      userId,
      action: 'delete_bot',
      timestamp: new Date(),
      ip: 'unknown',
      details: { botId: params.id }
    });

    return NextResponse.json({ success: true, message: 'Bot deleted successfully' });
  } catch (error) {
    console.error('Error deleting bot:', error);
    return NextResponse.json(
      { error: 'Failed to delete bot' },
      { status: 500 }
    );
  }
} 