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

interface Student {
  id: string;
  classroom_id: string;
  student_address: string;
}

// 简单的加密函数
function encryptData(data: string, key: string): string {
  const dataBytes = new TextEncoder().encode(data);
  const keyBytes = new TextEncoder().encode(key);
  const encrypted = Array.from(dataBytes).map((byte, i) => {
    return (byte ^ keyBytes[i % keyBytes.length]).toString(16).padStart(2, '0');
  }).join('');
  return encrypted;
}

export function ContactsPage() {
  const { t } = useTranslation();
  const { network } = useNetwork();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  
  const [selectedClassroomId, setSelectedClassroomId] = useState('');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [contact, setContact] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

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

  const fetchStudents = async (classroomId: string) => {
    if (!currentAccount) return;
    
    try {
      const packageId = CONTRACT_PACKAGE_ID[network];
      
      const events = await suiClient.queryEvents({
        query: { MoveEventType: `${packageId}::classmate::StudentAdded` },
        limit: 100,
      });

      const studentList: Student[] = [];
      for (const event of events.data) {
        const fields = event.parsedJson as any;
        if (fields?.classroom_id === classroomId) {
          // Find the student object ID from transaction effects
          const txResult = await suiClient.getTransactionBlock({
            digest: event.id.txDigest,
            options: { showEffects: true, showObjectChanges: true },
          });
          
          if (txResult.effects?.created) {
            for (const created of txResult.effects.created) {
              const objId = created.reference.objectId;
              const obj = await suiClient.getObject({
                id: objId,
                options: { showType: true, showContent: true },
              });
              const content = obj.data?.content as { fields?: any };
              if (content?.fields && obj.data?.type?.includes('Student')) {
                studentList.push({
                  id: objId,
                  classroom_id: content.fields.classroom_id || '',
                  student_address: content.fields.student_address || '',
                });
              }
            }
          }
        }
      }

      setStudents(studentList);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  useEffect(() => {
    fetchClassrooms();
  }, [currentAccount, network]);

  useEffect(() => {
    if (selectedClassroomId) {
      fetchStudents(selectedClassroomId);
    } else {
      setStudents([]);
    }
  }, [selectedClassroomId]);

  const handleAddStudent = async () => {
    if (!selectedClassroomId) {
      alert('Please select a classroom first');
      return;
    }
    if (!name || !studentId || !contact) {
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
      
      // Use account address as encryption key (simplified)
      const key = currentAccount.address;
      
      // Encrypt data
      const encryptedName = encryptData(name, key);
      const encryptedStudentId = encryptData(studentId, key);
      const encryptedContact = encryptData(contact, key);
      
      tx.moveCall({
        target: `${packageId}::classmate::add_student`,
        arguments: [
          tx.object(selectedClassroomId),
          tx.pure.vector('u8', Array.from(new TextEncoder().encode(encryptedName))),
          tx.pure.vector('u8', Array.from(new TextEncoder().encode(encryptedStudentId))),
          tx.pure.vector('u8', Array.from(new TextEncoder().encode(encryptedContact))),
        ],
      });

      await signAndExecute({ transaction: tx }, {
        onSuccess: async (result) => {
          console.log('Student added:', result);
          await suiClient.waitForTransaction({ digest: result.digest });
          alert('Student added successfully!');
          setName('');
          setStudentId('');
          setContact('');
          await fetchStudents(selectedClassroomId);
          await fetchClassrooms();
        },
        onError: (error) => {
          console.error('Error adding student:', error);
          alert('Failed to add student: ' + error.message);
        },
      });
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Failed to add student: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">{t('contacts.title')}</h2>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Select Classroom</h3>
        <select
          value={selectedClassroomId}
          onChange={(e) => setSelectedClassroomId(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">-- Select a classroom --</option>
          {classrooms.map((classroom) => (
            <option key={classroom.id} value={classroom.id}>
              {classroom.class_name} - {classroom.school}
            </option>
          ))}
        </select>
      </div>

      {selectedClassroomId && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">{t('contacts.addStudent')}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t('contacts.name')}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter student name"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('contacts.studentId')}</label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter student ID"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('contacts.contact')}</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter contact information"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleAddStudent}
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Adding...' : t('contacts.save')}
            </button>
          </div>
        </div>
      )}

      {selectedClassroomId && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Classroom Contacts</h3>
          {students.length === 0 ? (
            <p className="text-gray-600">No contacts yet. Add a student to get started!</p>
          ) : (
            <div className="space-y-4">
              {students.map((student) => (
                <div key={student.id} className="border rounded p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">Student Address: {student.student_address.slice(0, 8)}...</p>
                      <p className="text-xs text-gray-400 mt-1">ID: {student.id.slice(0, 8)}...</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Encrypted
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}