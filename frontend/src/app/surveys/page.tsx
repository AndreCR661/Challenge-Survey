'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Survey {
  id: number;
  question: string;
}

export default function SurveysPage() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch('http://localhost:5000/surveys');
        const data = await response.json();
        setSurveys(data);
      } catch (error) {
        console.error('Error fetching surveys:', error);
      }
    };

    fetchSurveys();
  }, []);

  // const handleViewResults = (id: number, question: string) => {
  //   router.push(`/surveys/${encodeURIComponent(question)}/results`);
  // };

  const handleViewResults = async (question: string) => {
    try {
        const response = await fetch('http://localhost:5000/id_surveys', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question })
        });

        const data = await response.json();

        if (data.error) {
            alert(data.error);
            return;
        }

        router.push(`/surveys/${data.id}/results`);
    } catch (error) {
        console.error('Error getting survey ID:', error);
    }
  };
  
  const handleCreateSurvey = () => {
    router.push('/surveys/create');
  };

  const handleLogout = () => {
    localStorage.removeItem('user'); // Borra los datos del usuario
    router.push('/');
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
      >
        Cerrar Sesión
      </button>
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">Encuestas</h1>
      <ul className="space-y-4">
        {surveys.map((survey) => (
          <li key={survey.question} className="bg-white p-4 rounded-2xl shadow-md">
            <button
              onClick={() => handleViewResults(survey.question)}
              className="text-gray-900 font-medium w-full text-left hover:underline"
            >
              {survey.question}
            </button>
          </li>
        ))}
      </ul>
      <div className="flex justify-center mt-8">
        <button
          onClick={handleCreateSurvey}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
        >
          Crear Encuesta
        </button>
      </div>
    </div>
  );
}
