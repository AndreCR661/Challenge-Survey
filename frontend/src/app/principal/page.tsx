'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaPoll, FaSignOutAlt } from 'react-icons/fa';

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

    const handleSurveyClick = async (question: string, index: number) => {
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
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-8">
            <button
                onClick={handleLogout}
                className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center gap-2"
            >
                <FaSignOutAlt /> Cerrar Sesión
            </button>
            <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8 decoration-blue-500">
                Lista de Encuestas
            </h1>
            <ul className="bg-white p-6 rounded-2xl shadow-2xl max-w-2xl mx-auto space-y-4">
                {surveys.length > 0 ? (
                    surveys.map((survey, index) => (
                        <li key={survey.question} className="border border-gray-300 rounded-lg p-4 hover:bg-blue-100 transition">
                            <button
                                onClick={() => handleSurveyClick(survey.question, index + 1)}
                                className="text-lg text-blue-500 hover:underline flex items-center gap-2 cursor-pointer"
                            >
                                <FaPoll className="text-blue-700" />
                                <span className="font-bold text-gray-800">{index + 1}.</span> {survey.question}
                            </button>
                        </li>
                    ))
                ) : (
                    <div className="text-center text-gray-500">
                        <p>No hay encuestas disponibles.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                        >
                            Recargar Encuestas
                        </button>
                    </div>
                )}
            </ul>
        </div>
    );
    
}
