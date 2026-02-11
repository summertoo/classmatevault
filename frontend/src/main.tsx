import { createRoot } from 'react-dom/client'
import { WalletProvider, SuiClientProvider } from '@mysten/dapp-kit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NETWORK_CONFIG } from './utils/config'
import App from './App.tsx'
import './index.css'
import './i18n'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function Providers({ children }: { children: React.ReactNode }) {
  const networks = {
    testnet: { url: NETWORK_CONFIG.testnet.fullnode },
    mainnet: { url: NETWORK_CONFIG.mainnet.fullnode },
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="testnet">
        <WalletProvider>
          {children}
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <Providers>
    <App />
  </Providers>
)