import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function ContactsPage() {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [contact, setContact] = useState('');

  const handleAddStudent = async () => {
    if (!name || !studentId || !contact) {
      alert('Please fill in all fields');
      return;
    }
    // TODO: 实现加密和添加学生的交易逻辑
    console.log('Adding student:', { name, studentId, contact });
    setName('');
    setStudentId('');
    setContact('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">{t('contacts.title')}</h2>

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
            />
          </div>
          <button
            onClick={handleAddStudent}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {t('contacts.save')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Classroom Contacts</h3>
        <p className="text-gray-600">No contacts yet. Add a student to get started!</p>
      </div>
    </div>
  );
}