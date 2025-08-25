# Hummingbot Integration for BlackStrike

This document outlines the complete integration of Hummingbot with the BlackStrike trading platform, replacing mock data with real trading functionality.

## 🚀 Overview

The integration provides:
- **Real-time bot management** through Hummingbot Gateway API
- **Secure API key storage** with encryption
- **WebSocket connections** for live updates
- **Multi-user bot isolation** with proper authentication
- **Audit logging** for all trading actions
- **Rate limiting** and security measures

## 📁 File Structure

```
lib/
├── hummingbot/
│   └── client.ts              # Hummingbot API client
├── firebase-admin.ts          # Firebase Admin SDK setup
└── encryption.ts              # API key encryption utilities

app/api/hummingbot/
├── bots/
│   ├── route.ts               # Bot CRUD operations
│   ├── [id]/
│   │   ├── route.ts           # Individual bot management
│   │   ├── start/route.ts     # Start bot endpoint
│   │   └── stop/route.ts      # Stop bot endpoint
│   └── ws/route.ts            # WebSocket endpoint

hooks/
└── use-hummingbot.ts          # React hook for bot management

app/bots/
└── page.tsx                   # Updated bots page with real functionality
```

## 🔧 Setup Requirements

### 1. Environment Variables

Add these to your `.env.local`:

```bash
# Hummingbot Gateway
HUMMINGBOT_GATEWAY_URL=http://localhost:15865

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Encryption
ENCRYPTION_KEY=your-32-character-secret-key-here
```

### 2. Hummingbot Installation

```bash
# Install Hummingbot
git clone https://github.com/hummingbot/hummingbot.git
cd hummingbot
./install

# Start Hummingbot Gateway
./gateway/start.sh
```

### 3. Dependencies

```bash
# Install required packages
pnpm add @radix-ui/react-dialog
pnpm add firebase-admin
pnpm add @types/node
```

## 🔐 Security Features

### API Key Encryption
- All exchange API keys are encrypted at rest using AES-256-CBC
- Keys are decrypted only when needed for API calls
- Encryption key is stored in environment variables

### Authentication & Authorization
- Firebase Authentication for user management
- JWT tokens for API authentication
- User-specific bot isolation
- Rate limiting (100 requests/minute per user)

### Audit Logging
All bot operations are logged to Firestore:
- Bot creation, updates, deletion
- Start/stop actions
- User IP and user agent tracking
- Timestamp and action details

## 📊 API Endpoints

### Bot Management

#### GET /api/hummingbot/bots
Get all bots for the authenticated user.

#### POST /api/hummingbot/bots
Create a new trading bot.

**Request Body:**
```json
{
  "name": "My Grid Bot",
  "strategy": "grid_trading",
  "exchange": "binance",
  "tradingPair": "BTC/USDT",
  "config": {
    "grid_spacing": 0.01,
    "order_amount": 0.001
  }
}
```

#### PUT /api/hummingbot/bots/[id]
Update bot configuration.

#### DELETE /api/hummingbot/bots/[id]
Delete a bot.

#### POST /api/hummingbot/bots/[id]/start
Start a bot.

#### POST /api/hummingbot/bots/[id]/stop
Stop a bot.

### WebSocket Endpoint

#### GET /api/hummingbot/ws
Real-time bot monitoring (WebSocket connection).

**Events:**
- `bot_status`: Bot status changes
- `trade_executed`: New trades
- `performance_update`: Performance metrics
- `error`: Error notifications

## 🎯 Supported Strategies

1. **Grid Trading** (`grid_trading`)
   - Automated buy/sell orders at regular intervals
   - Configurable grid spacing and order amounts

2. **Dollar Cost Average** (`dca`)
   - Regular purchases regardless of price
   - Reduces impact of volatility

3. **Momentum Trading** (`momentum`)
   - Follows price trends
   - Technical indicator-based decisions

4. **Cross-Exchange Arbitrage** (`arbitrage`)
   - Exploits price differences between exchanges
   - Risk-free profit opportunities

5. **Swing Trading** (`swing`)
   - Medium-term position holding
   - Technical analysis based

6. **Scalping** (`scalping`)
   - High-frequency small trades
   - Minimal profit per trade

## 🔄 Real-time Features

### WebSocket Integration
- Live bot status updates
- Real-time trade notifications
- Performance metric updates
- Error alerts

### Auto-reconnection
- Automatic WebSocket reconnection
- Exponential backoff strategy
- Maximum retry attempts

## 📈 Performance Monitoring

### Metrics Tracked
- Total P&L (Profit & Loss)
- Total trading volume
- Win rate percentage
- Number of trades
- Bot uptime

### Data Storage
- Performance data stored in Firestore
- Real-time updates via WebSocket
- Historical data for analysis

## 🚀 Deployment

### Production Setup

1. **Hummingbot Gateway**
   ```bash
   # Deploy to production server
   docker run -d \
     --name hummingbot-gateway \
     -p 15865:15865 \
     -v /path/to/config:/conf \
     hummingbot/gateway:latest
   ```

2. **Environment Configuration**
   ```bash
   # Production environment variables
   HUMMINGBOT_GATEWAY_URL=https://your-gateway-domain.com
   NODE_ENV=production
   ```

3. **Security Considerations**
   - Use HTTPS for all API communications
   - Implement proper CORS policies
   - Set up firewall rules
   - Regular security audits

### Monitoring

1. **Health Checks**
   - Gateway connectivity monitoring
   - Bot status monitoring
   - Performance metrics tracking

2. **Alerting**
   - Bot failure notifications
   - Performance threshold alerts
   - Security incident alerts

## 🛠️ Development

### Local Development

1. **Start Hummingbot Gateway**
   ```bash
   cd hummingbot
   ./gateway/start.sh
   ```

2. **Run BlackStrike**
   ```bash
   pnpm dev
   ```

3. **Test Integration**
   - Create test bots
   - Verify API endpoints
   - Test WebSocket connections

### Testing

```bash
# Run tests
pnpm test

# Test API endpoints
curl -X GET http://localhost:3000/api/hummingbot/bots \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔧 Troubleshooting

### Common Issues

1. **Gateway Connection Failed**
   - Check if Hummingbot Gateway is running
   - Verify `HUMMINGBOT_GATEWAY_URL` environment variable
   - Check firewall settings

2. **Authentication Errors**
   - Verify Firebase configuration
   - Check JWT token validity
   - Ensure user is authenticated

3. **WebSocket Connection Issues**
   - Check WebSocket endpoint availability
   - Verify authentication headers
   - Check browser WebSocket support

### Debug Mode

Enable debug logging:
```bash
DEBUG=* pnpm dev
```

## 📚 Additional Resources

- [Hummingbot Documentation](https://hummingbot.org/docs/)
- [Hummingbot Gateway API](https://hummingbot.org/docs/gateway/)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This integration is part of the BlackStrike project and follows the same licensing terms. 