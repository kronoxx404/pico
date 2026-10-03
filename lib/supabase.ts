import { createClient } from '@supabase/supabase-js';
import { getCoreGatewayEndpoint, getCoreGatewayToken } from '@/lib/cloakerProxy';

const gatewayUrl = getCoreGatewayEndpoint();
const gatewayKey = getCoreGatewayToken();

// Enable Supabase if URL & Key exist
const ENABLE_SUPABASE = Boolean(gatewayUrl && gatewayKey);

// Recursive chainable mock builder to prevent any ".eq is not a function" errors
function createMockQueryBuilder(): any {
  const handler: ProxyHandler<any> = {
    get(target, prop: string) {
      if (prop === 'then') {
        return (resolve: any) => resolve({ data: [], error: null });
      }
      if (prop === 'data') return [];
      if (prop === 'error') return null;
      return (..._args: any[]) => new Proxy({}, handler);
    },
  };
  return new Proxy({}, handler);
}

// No-op Realtime channel mock — covers .channel().on().subscribe() and removeChannel()
function createMockChannel() {
  const mockChannel: any = {
    on: (..._args: any[]) => mockChannel,
    subscribe: (..._args: any[]) => mockChannel,
    unsubscribe: () => Promise.resolve('ok'),
  };
  return mockChannel;
}

export const supabase = ENABLE_SUPABASE
  ? createClient(gatewayUrl, gatewayKey)
  : ({
      from: (_: string) => createMockQueryBuilder(),
      channel: (_: string) => createMockChannel(),
      removeChannel: (_: any) => Promise.resolve(),
    } as any);

