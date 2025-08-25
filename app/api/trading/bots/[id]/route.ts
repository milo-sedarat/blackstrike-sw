import { NextRequest, NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase-admin';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const botDoc = await db.collection('bots').doc(params.id).get();
    
    if (!botDoc.exists) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 });
    }

    const botData = botDoc.data();
    if (botData?.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      id: botDoc.id,
      ...botData,
    });
  } catch (error) {
    console.error('Error fetching bot:', error);
    return NextResponse.json({ error: 'Failed to fetch bot' }, { status: 500 });
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

    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const body = await request.json();
    const { action, config } = body;

    const botDoc = await db.collection('bots').doc(params.id).get();
    
    if (!botDoc.exists) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 });
    }

    const botData = botDoc.data();
    if (botData?.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let result;
    switch (action) {
      case 'start':
        await db.collection('bots').doc(params.id).update({ 
          status: 'running',
          updatedAt: new Date()
        });
        result = { success: true, message: 'Bot started successfully' };
        break;
        
      case 'stop':
        await db.collection('bots').doc(params.id).update({ 
          status: 'stopped',
          updatedAt: new Date()
        });
        result = { success: true, message: 'Bot stopped successfully' };
        break;
        
      case 'update':
        await db.collection('bots').doc(params.id).update({ 
          config: { ...botData.config, ...config },
          updatedAt: new Date()
        });
        result = { success: true, message: 'Bot updated successfully' };
        break;
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Log the action
    await db.collection('audit_logs').add({
      userId,
      action: `bot_${action}`,
      timestamp: new Date(),
      ip: 'unknown',
      details: { botId: params.id, action },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating bot:', error);
    return NextResponse.json({ error: 'Failed to update bot' }, { status: 500 });
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

    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const botDoc = await db.collection('bots').doc(params.id).get();
    
    if (!botDoc.exists) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 });
    }

    const botData = botDoc.data();
    if (botData?.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await db.collection('bots').doc(params.id).delete();

    // Log the action
    await db.collection('audit_logs').add({
      userId,
      action: 'delete_bot',
      timestamp: new Date(),
      ip: 'unknown',
      details: { botId: params.id },
    });

    return NextResponse.json({ success: true, message: 'Bot deleted successfully' });
  } catch (error) {
    console.error('Error deleting bot:', error);
    return NextResponse.json({ error: 'Failed to delete bot' }, { status: 500 });
  }
} 