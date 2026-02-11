import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function CheckInPage() {
  const { t } = useTranslation();
  const [remainingTime, setRemainingTime] = useState<number>(3600);
  const [lastCheckIn, setLastCheckIn] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const handleCheckIn = async () => {
    // TODO: 实现签到逻辑
    setLastCheckIn(new Date());
    setRemainingTime(3600);
    console.log('Checked in!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">{t('checkin.title')}</h2>

      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <p className="text-gray-600 mb-2">{t('checkin.description')}</p>
        </div>

        <div className="mb-8">
          <div className="text-6xl font-bold text-blue-600 mb-4">
            {formatTime(remainingTime)}
          </div>
          <p className="text-sm text-gray-600">{t('promise.remaining')}</p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="text-left">
            <p className="text-sm text-gray-600">{t('checkin.lastCheckIn')}</p>
            <p className="font-semibold">{lastCheckIn.toLocaleString()}</p>
          </div>
          <div className="text-left">
            <p className="text-sm text-gray-600">{t('checkin.nextCheckIn')}</p>
            <p className="font-semibold">
              {new Date(lastCheckIn.getTime() + 3600 * 1000).toLocaleString()}
            </p>
          </div>
        </div>

        <button
          onClick={handleCheckIn}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors"
        >
          {t('checkin.checkInNow')}
        </button>
      </div>
    </div>
  );
}