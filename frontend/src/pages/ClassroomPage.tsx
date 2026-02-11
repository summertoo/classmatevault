import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { CONTRACT_PACKAGE_ID } from '../utils/config';
import { useNetwork } from '../contexts/NetworkContext';

interface Classroom {
  id: string;
  school: string;
  class_name: string;
  creator: string;
  member_count: number;
}

export function ClassroomPage() {
  const { t } = useTranslation();
  const { network } = useNetwork();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  
  const [school, setSchool] = useState('');
  const [className, setClassName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [createdClassroomId, setCreatedClassroomId] = useState('');

  const fetchClassrooms = async () => {
    if (!currentAccount) return;
    
    try {
      const packageId = CONTRACT_PACKAGE_ID[network];
      
      const events = await suiClient.queryEvents({
        query: { MoveEventType: `${packageId}::classmate::ClassroomCreated` },
        limit: 50,
      });

      const classroomIds = new Set<string>();
      for (const event of events.data) {
        const fields = event.parsedJson as any;
        if (fields?.classroom_id) {
          classroomIds.add(fields.classroom_id);
        }
      }

      const classroomList: Classroom[] = [];
      for (const id of classroomIds) {
        try {
          const obj = await suiClient.getObject({
            id,
            options: { showType: true, showContent: true },
          });
          const content = obj.data?.content as { fields?: any };
          if (content?.fields) {
            classroomList.push({
              id: id,
              school: content.fields.school || '',
              class_name: content.fields.class_name || '',
              creator: content.fields.creator || '',
              member_count: Number(content.fields.member_count || 0),
            });
          }
        } catch (e) {
          console.error('Error fetching classroom:', id, e);
        }
      }

      setClassrooms(classroomList);
    } catch (error) {
      console.error('Error fetching classrooms:', error);
    }
  };

  useEffect(() => {
    fetchClassrooms();
  }, [currentAccount, network]);

  const handleCreateClassroom = async () => {
    if (!school || !className) {
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
      
      tx.moveCall({
        target: `${packageId}::classmate::create_classroom`,
        arguments: [tx.pure.string(school), tx.pure.string(className)],
      });

      await signAndExecute({ transaction: tx }, {
        onSuccess: async (result) => {
          console.log('Classroom created:', result);
          const txResult = await suiClient.waitForTransaction({ digest: result.digest });
          const effects = txResult.effects;
          
          if (effects?.created && effects.created.length > 0) {
            for (const created of effects.created) {
              const objId = created.reference.objectId;
              if (objId) {
                const obj = await suiClient.getObject({
                  id: objId,
                  options: { showType: true, showContent: true }
                });
                const type = obj.data?.type || '';
                if (type.includes('Classroom')) {
                  setCreatedClassroomId(objId);
                  alert('Classroom created successfully! ID: ' + objId);
                  setSchool('');
                  setClassName('');
                  await fetchClassrooms();
                  break;
                }
              }
            }
          } else {
            alert('Classroom created! Please refresh to see it.');
            await fetchClassrooms();
          }
        },
        onError: (error) => {
          console.error('Error creating classroom:', error);
          alert('Failed to create classroom: ' + error.message);
        },
      });
    } catch (error) {
      console.error('Error creating classroom:', error);
      alert('Failed to create classroom: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">{t('classroom.title')}</h2>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">{t('classroom.create')}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('classroom.school')}</label>
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Enter school name"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('classroom.className')}</label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Enter class name"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleCreateClassroom}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : t('classroom.create')}
          </button>
        </div>
      </div>

      {createdClassroomId && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Latest Created Classroom</h3>
          <p className="text-sm text-green-700">Classroom ID: {createdClassroomId}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">{t('classroom.myClassrooms')}</h3>
        {classrooms.length === 0 ? (
          <p className="text-gray-600">No classrooms yet. Create one to get started!</p>
        ) : (
          <div className="space-y-4">
            {classrooms.map((classroom) => (
              <div key={classroom.id} className="border rounded p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-lg">{classroom.class_name}</h4>
                    <p className="text-gray-600">{classroom.school}</p>
                    <p className="text-sm text-gray-500 mt-1">Members: {classroom.member_count}</p>
                    <p className="text-xs text-gray-400 mt-1">Creator: {classroom.creator.slice(0, 8)}...</p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    ID: {classroom.id.slice(0, 8)}...
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}