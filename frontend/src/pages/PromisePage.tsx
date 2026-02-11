import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function PromisePage() {
  const { t } = useTranslation();
  const [beneficiary, setBeneficiary] = useState('');
  const [amount, setAmount] = useState('');
  const [interval, setInterval] = useState('');

  const handleCreatePromise = async () => {
    if (!beneficiary || !amount || !interval) {
      alert('Please fill in all fields');
      return;
    }
    // TODO: 实现创建生前赠款的交易逻辑
    console.log('Creating promise:', { beneficiary, amount, interval });
    setBeneficiary('');
    setAmount('');
    setInterval('');
  };

  const handleCheckIn = async () => {
    // TODO: 实现签到逻辑
    console.log('Checking in...');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">{t('promise.title')}</h2>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">{t('promise.create')}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('promise.beneficiary')}</label>
            <input
              type="text"
              value={beneficiary}
              onChange={(e) => setBeneficiary(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Enter beneficiary address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('promise.amount')}</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Enter amount in SUI"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('promise.interval')}</label>
            <input
              type="number"
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Enter check-in interval in seconds"
            />
          </div>
          <button
            onClick={handleCreatePromise}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {t('promise.create')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">{t('promise.myPromises')}</h3>
        <div className="space-y-4">
          <div className="border rounded p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Sample Promise</span>
              <span className="text-sm text-gray-600">Remaining: {t('promise.remaining')}</span>
            </div>
            <button
              onClick={handleCheckIn}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mr-2"
            >
              {t('promise.checkIn')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}