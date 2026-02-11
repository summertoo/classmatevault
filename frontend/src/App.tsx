import { useState } from 'react';
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NetworkProvider, useNetwork } from './contexts/NetworkContext';
import { useTranslation } from 'react-i18next';
import { useSuiClient } from '@mysten/dapp-kit';
import { useEffect } from 'react';
import { ClassroomPage } from './pages/ClassroomPage';
import { ContactsPage } from './pages/ContactsPage';
import { PromisePage } from './pages/PromisePage';
import { CheckInPage } from './pages/CheckInPage';
import './index.css';
import './i18n';

const queryClient = new QueryClient();

function Header({ currentPage, setCurrentPage }: { currentPage: string; setCurrentPage: (page: string) => void }) {
  const { t } = useTranslation();
  const { network, setNetwork } = useNetwork();
  const { i18n } = useTranslation();
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const [balance, setBalance] = useState<string>('0');

  useEffect(() => {
    async function fetchBalance() {
      if (currentAccount) {
        try {
          const result = await suiClient.getBalance({
            owner: currentAccount.address,
            coinType: '0x2::sui::SUI',
          });
          setBalance((Number(result.totalBalance) / 1000000000).toFixed(4));
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
      } else {
        setBalance('0');
      }
    }
    fetchBalance();
  }, [currentAccount, suiClient]);

  const navItems = [
    { id: 'home', label: t('common.home') },
    { id: 'classroom', label: t('common.classroom') },
    { id: 'contacts', label: t('common.contacts') },
    { id: 'promise', label: t('common.promise') },
    { id: 'checkin', label: t('common.checkin') },
  ];

  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center mb-4">
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
            {balance && <span className="bg-white/20 rounded px-3 py-1 text-sm mr-4">SUI: {balance}</span>}
            <ConnectButton />
          </div>
        </div>
        <nav className="flex gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === item.id
                  ? 'bg-white text-purple-600 font-semibold'
                  : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
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
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'classroom':
        return <ClassroomPage />;
      case 'contacts':
        return <ContactsPage />;
      case 'promise':
        return <PromisePage />;
      case 'checkin':
        return <CheckInPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <NetworkProvider>
        <div className="min-h-screen bg-gray-50">
          <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
          {renderPage()}
        </div>
      </NetworkProvider>
    </QueryClientProvider>
  );
}

export default App;