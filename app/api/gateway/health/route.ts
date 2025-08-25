import { NextResponse } from 'next/server';
import { createGatewayClient } from '@/lib/gateway/client';

const gatewayClient = createGatewayClient({
  baseUrl: process.env.GATEWAY_URL || 'http://localhost:15888',
});

export async function GET() {
  try {
    const isHealthy = await gatewayClient.healthCheck();
    return NextResponse.json({ 
      status: isHealthy ? 'healthy' : 'unhealthy',
      gateway: isHealthy ? 'connected' : 'disconnected'
    });
  } catch (error) {
    console.error('Gateway health check failed:', error);
    return NextResponse.json(
      { 
        status: 'unhealthy',
        gateway: 'disconnected',
        error: 'Gateway health check failed'
      },
      { status: 503 }
    );
  }
} 