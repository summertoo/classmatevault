import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { CONTRACT_PACKAGE_ID } from '../utils/config';
import { useNetwork } from '../contexts/NetworkContext';

interface Promise {
  id: string;
  creator: string;
  beneficiary: string;
  amount: number;
  check_in_interval: number;
  last_check_in: number;
  is_claimed: boolean;
}

export function PromisePage() {
  const { t } = useTranslation();
  const { network } = useNetwork();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  
  const [beneficiary, setBeneficiary] = useState('');
  const [amount, setAmount] = useState('');
  const [interval, setInterval] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [promises, setPromises] = useState<Promise[]>([]);
  const [createdPromiseId, setCreatedPromiseId] = useState('');

  const fetchPromises = async () => {
    if (!currentAccount) return;
    
    try {
      const packageId = CONTRACT_PACKAGE_ID[network];
      
      // Query for created Promise objects by looking at transactions
      // We'll use event-based approach similar to ClassroomPage
      const events = await suiClient.queryEvents({
        query: { MoveEventType: `${packageId}::promise::PromiseCreated` },
        limit: 50,
      });

      const promiseIds = new Set<string>();
      for (const event of events.data) {
        const fields = event.parsedJson as any;
        if (fields?.promise_id) {
          promiseIds.add(fields.promise_id);
        }
      }

      // Also try to find Promise objects from the transaction that created them
      const allPromises: Promise[] = [];
      
      // If we have promise IDs from events, fetch their details
      for (const id of promiseIds) {
        try {
          const obj = await suiClient.getObject({
            id,
            options: { showType: true, showContent: true },
          });
          const content = obj.data?.content as { fields?: any };
          if (content?.fields) {
            allPromises.push({
              id: id,
              creator: content.fields.creator || '',
              beneficiary: content.fields.beneficiary || '',
              amount: Number(content.fields.amount || 0) / 1_000_000_000,
              check_in_interval: Number(content.fields.check_in_interval || 0),
              last_check_in: Number(content.fields.last_check_in || 0),
              is_claimed: content.fields.is_claimed || false,
            });
          }
        } catch (e) {
          console.error('Error fetching promise:', id, e);
        }
      }

      // If no promises from events, try a different approach
      if (allPromises.length === 0) {
        // Get recent transactions from the current account
        // This is a simplified approach - in production you'd want a more efficient method
        const ownedObjects = await suiClient.getOwnedObjects({
          owner: currentAccount.address,
          options: { showType: true, showContent: true },
        });
        
        for (const obj of ownedObjects.data) {
          const type = obj.data?.type || '';
          if (type.includes('Promise')) {
            const content = obj.data?.content as { fields?: any };
            if (content?.fields) {
              allPromises.push({
                id: obj.data?.objectId || '',
                creator: content.fields.creator || '',
                beneficiary: content.fields.beneficiary || '',
                amount: Number(content.fields.amount || 0) / 1_000_000_000,
                check_in_interval: Number(content.fields.check_in_interval || 0),
                last_check_in: Number(content.fields.last_check_in || 0),
                is_claimed: content.fields.is_claimed || false,
              });
            }
          }
        }
      }

      setPromises(allPromises);
    } catch (error) {
      console.error('Error fetching promises:', error);
    }
  };

  useEffect(() => {
    fetchPromises();
  }, [currentAccount, network]);

  const handleCreatePromise = async () => {
    if (!beneficiary || !amount || !interval) {
      alert('Please fill in all fields');
      return;
    }
    if (!currentAccount) {
      alert('Please connect wallet first');
      return;
    }

    setIsLoading(true);
    try {
      const tx = new Transaction();
      const packageId = CONTRACT_PACKAGE_ID[network];
      const amountValue = BigInt(Number(amount) * 1_000_000_000);
      
      const [coin] = tx.splitCoins(tx.gas, [amountValue]);
      
      tx.moveCall({
        target: `${packageId}::promise::create_promise`,
        arguments: [
          tx.pure.address(beneficiary),
          tx.pure.u64(Number(interval)),
          coin,
          tx.object('0x6'),
        ],
      });

      await signAndExecute({ transaction: tx }, {
        onSuccess: async (result) => {
          console.log('Promise created:', result);
          const txResult = await suiClient.waitForTransaction({ digest: result.digest });
          const effects = txResult.effects;
          
          if (effects?.created) {
            for (const created of effects.created) {
              const objId = created.reference.objectId;
              if (objId) {
                const obj = await suiClient.getObject({
                  id: objId,
                  options: { showType: true, showContent: true }
                });
                const type = obj.data?.type || '';
                if (type.includes('Promise')) {
                  setCreatedPromiseId(objId);
                  alert('Promise created successfully! ID: ' + objId);
                  setBeneficiary('');
                  setAmount('');
                  setInterval('');
                  await fetchPromises();
                  break;
                }
              }
            }
          } else {
            alert('Promise created! Please refresh to see it.');
            await fetchPromises();
          }
        },
        onError: (error) => {
          console.error('Error creating promise:', error);
          alert('Failed to create promise: ' + error.message);
        },
      });
    } catch (error) {
      console.error('Error creating promise:', error);
      alert('Failed to create promise: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async (promiseObjId: string) => {
    if (!currentAccount) {
      alert('Please connect wallet first');
      return;
    }

    setIsLoading(true);
    try {
      const tx = new Transaction();
      const packageId = CONTRACT_PACKAGE_ID[network];
      
      tx.moveCall({
        target: `${packageId}::promise::check_in`,
        arguments: [
          tx.object(promiseObjId),
          tx.object('0x6'),
        ],
      });

      await signAndExecute({ transaction: tx }, {
        onSuccess: async (result) => {
          console.log('Checked in:', result);
          await suiClient.waitForTransaction({ digest: result.digest });
          alert('Check-in successful!');
          await fetchPromises();
        },
        onError: (error) => {
          console.error('Error checking in:', error);
          alert('Failed to check in: ' + error.message);
        },
      });
    } catch (error) {
      console.error('Error checking in:', error);
      alert('Failed to check in: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp: number) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getRemainingTime = (lastCheckIn: number, interval: number) => {
    if (!lastCheckIn || !interval) return 'N/A';
    const now = Date.now();
    const elapsed = now - lastCheckIn;
    const remaining = interval * 1000 - elapsed;
    
    if (remaining <= 0) return 'Overdue!';
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleCreatePromise}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : t('promise.create')}
          </button>
        </div>
      </div>

      {createdPromiseId && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Latest Created Promise</h3>
          <p className="text-sm text-green-700">Promise ID: {createdPromiseId}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">{t('promise.myPromises')}</h3>
        {promises.length === 0 ? (
          <p className="text-gray-600">No promises yet. Create one to get started!</p>
        ) : (
          <div className="space-y-4">
            {promises.map((promise) => (
              <div key={promise.id} className="border rounded p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-lg">
                        {promise.amount} SUI
                      </h4>
                      {promise.is_claimed && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          Claimed
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      Beneficiary: {promise.beneficiary.slice(0, 8)}...
                    </p>
                    <p className="text-sm text-gray-600">
                      Interval: {promise.check_in_interval} seconds
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Last Check-in: {formatTime(promise.last_check_in)}
                    </p>
                    <p className="text-xs mt-1">
                      <span className="font-medium">Remaining: </span>
                      <span className={getRemainingTime(promise.last_check_in, promise.check_in_interval) === 'Overdue!' ? 'text-red-600 font-bold' : 'text-blue-600'}>
                        {getRemainingTime(promise.last_check_in, promise.check_in_interval)}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {!promise.is_claimed && (
                      <button
                        onClick={() => handleCheckIn(promise.id)}
                        disabled={isLoading}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 text-sm"
                      >
                        {t('promise.checkIn')}
                      </button>
                    )}
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded text-center">
                      ID: {promise.id.slice(0, 8)}...
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}