import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WalletProvider, SuiClientProvider } from '@mysten/dapp-kit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NETWORK_CONFIG } from './utils/config'
import App from './App.tsx'
import './i18n'

const queryClient = new QueryClient()

function Providers({ children }: { children: React.ReactNode }) {
  const networks = {
    testnet: { url: NETWORK_CONFIG.testnet.fullnode },
    mainnet: { url: NETWORK_CONFIG.mainnet.fullnode },
  }

  return (
    <SuiClientProvider networks={networks} defaultNetwork="testnet">
      <WalletProvider autoConnect={true}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WalletProvider>
    </SuiClientProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>,
)
