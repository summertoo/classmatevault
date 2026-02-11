import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function ClassroomPage() {
  const { t } = useTranslation();
  const [school, setSchool] = useState('');
  const [className, setClassName] = useState('');

  const handleCreateClassroom = async () => {
    if (!school || !className) {
      alert('Please fill in all fields');
      return;
    }
    // TODO: 实现创建班级的交易逻辑
    console.log('Creating classroom:', { school, className });
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
            />
          </div>
          <button
            onClick={handleCreateClassroom}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {t('classroom.create')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">{t('classroom.myClassrooms')}</h3>
        <p className="text-gray-600">No classrooms yet. Create one to get started!</p>
      </div>
    </div>
  );
}