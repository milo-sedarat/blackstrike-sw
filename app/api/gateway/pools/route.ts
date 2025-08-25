import { NextRequest, NextResponse } from 'next/server';
import { createGatewayClient } from '@/lib/gateway/client';

const gatewayClient = createGatewayClient({
  baseUrl: process.env.GATEWAY_URL || 'http://localhost:15888',
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const connector = searchParams.get('connector');

    if (!connector) {
      return NextResponse.json(
        { error: 'Connector parameter is required' },
        { status: 400 }
      );
    }

    const pools = await gatewayClient.getPools(connector);
    return NextResponse.json(pools);
  } catch (error) {
    console.error('Error fetching pools:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pools' },
      { status: 500 }
    );
  }
} 