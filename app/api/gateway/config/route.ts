import { NextResponse } from 'next/server';
import { createGatewayClient } from '@/lib/gateway/client';

const gatewayClient = createGatewayClient({
  baseUrl: process.env.GATEWAY_URL || 'http://localhost:15888',
});

export async function GET() {
  try {
    const config = await gatewayClient.getConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error fetching Gateway config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Gateway config' },
      { status: 500 }
    );
  }
} 