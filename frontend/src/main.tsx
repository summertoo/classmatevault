import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WalletProvider } from '@mysten/dapp-kit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './i18n'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WalletProvider autoConnect={true}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WalletProvider>
  </StrictMode>,
)
