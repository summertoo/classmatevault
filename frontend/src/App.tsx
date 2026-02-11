import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NetworkProvider, useNetwork } from './contexts/NetworkContext';
import { useTranslation } from 'react-i18next';
import './index.css';
import './i18n';

const queryClient = new QueryClient();

function Header() {
  const { t } = useTranslation();
  const { network, setNetwork } = useNetwork();
  const { i18n } = useTranslation();

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">ClassmateVault</h1>
        <div className="flex items-center gap-4">
          <select
            value={network}
            onChange={(e) => setNetwork(e.target.value as 'testnet' | 'mainnet')}
            className="bg-white/20 rounded px-3 py-1 text-sm"
          >
            <option value="testnet">{t('common.testnet')}</option>
            <option value="mainnet">{t('common.mainnet')}</option>
          </select>
          <select
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="bg-white/20 rounded px-3 py-1 text-sm"
          >
            <option value="zh">中文</option>
            <option value="en">English</option>
          </select>
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}

function HomePage() {
  const { t } = useTranslation();
  const currentAccount = useCurrentAccount();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">{t('home.title')}</h2>
        <p className="text-xl text-gray-600 mb-8">{t('home.description')}</p>
        {!currentAccount && (
          <p className="text-lg text-yellow-600">{t('home.connectWallet')}</p>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-xl font-semibold mb-2">{t('home.features.contact')}</h3>
          <p className="text-gray-600">Encrypted classroom contacts on blockchain</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">💝</div>
          <h3 className="text-xl font-semibold mb-2">{t('home.features.legacy')}</h3>
          <p className="text-gray-600">Legacy gifting with automatic check-in</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">🔗</div>
          <h3 className="text-xl font-semibold mb-2">{t('home.features.decentralized')}</h3>
          <p className="text-gray-600">Fully decentralized on Sui blockchain</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NetworkProvider>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <HomePage />
        </div>
      </NetworkProvider>
    </QueryClientProvider>
  );
}

export default App;