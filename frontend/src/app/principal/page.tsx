'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Survey {
    question: string;
}

export default function SurveysPage() {
    const [surveys, setSurveys] = useState<Survey[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                const response = await fetch('http://localhost:5000/surveys/active');
                const data = await response.json();
                setSurveys(data);
            } catch (error) {
                console.error('Error fetching surveys:', error);
            }
        };

        fetchSurveys();
    }, []);

    const handleSurveyClick = async (question: string) => {
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

            localStorage.setItem('survey_id', data.id); // Guarda el ID de la encuesta
            router.push(`/surveys/${data.id}`);
        } catch (error) {
            console.error('Error getting survey ID:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user'); // Borra los datos del usuario
        localStorage.removeItem('survey_id'); // Borra el ID de la encuesta
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <button
            onClick={handleLogout}
            className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
            Cerrar Sesión
            </button>
            <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
                Lista de Encuestas
            </h1>
            <ul className="bg-white p-6 rounded-2xl shadow-lg max-w-2xl mx-auto">
                {surveys.length > 0 ? (
                    surveys.map((survey) => (
                        <li key={survey.question} className="border-b last:border-b-0 py-2">
                            <button
                                onClick={() => handleSurveyClick(survey.question)}
                                className="text-lg text-blue-500 hover:underline"
                            >
                                {survey.question}
                            </button>
                        </li>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No hay encuestas disponibles.</p>
                )}
            </ul>
        </div>
    );
}


