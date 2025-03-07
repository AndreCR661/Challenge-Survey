'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FaVoteYea, FaArrowLeft } from 'react-icons/fa';

interface Survey {
    id: number;
    question: string;
    answer1: string;
    answer2: string;
    answer3?: string;
    answer4?: string;
}

export default function SurveyDetailPage() {
    const [survey, setSurvey] = useState<Survey | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<string>('');
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                const response = await fetch(`http://localhost:5000/surveys/active/${params.id}`);
                const data = await response.json();

                if (data.error) {
                    alert(data.error);
                    router.push('/principal');
                    return;
                }

                setSurvey(data);
                localStorage.setItem('survey_id', data.id.toString());
            } catch (error) {
                console.error('Error fetching survey:', error);
            }
        };

        if (params.id) fetchSurvey();
    }, [params.id, router]);

    const handleVote = async () => {
        const user_id = localStorage.getItem('user_id');
        const survey_id = localStorage.getItem('survey_id');

        if (!user_id || !survey_id) {
            alert('Falta información del usuario o de la encuesta');
            return;
        }

        if (!selectedAnswer) {
            alert('Por favor selecciona una respuesta');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/votesurvey', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reply: selectedAnswer,
                    user_id: parseInt(user_id),
                    survey_id: parseInt(survey_id)
                })
            });

            const data = await response.json();

            if (data.error) {
                alert(data.error);
                return;
            }

            alert('¡Voto registrado correctamente!');
            localStorage.removeItem('survey_id');
            router.push('/surveys');
        } catch (error) {
            console.error('Error registrando el voto:', error);
        }
    };

    const handleBackToSurveys = () => {
        localStorage.removeItem('survey_id');
        router.push('/principal');
    };

    if (!survey) return <p className="text-center text-gray-500">Cargando encuesta...</p>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-8">
            <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Encuesta</h1>
            <div className="bg-white p-6 rounded-2xl shadow-lg max-w-2xl mx-auto">
                <h2 className="text-2xl font-semibold mb-4 text-gray-600">{survey.question}</h2>
                <form className="space-y-4">
                    {[survey.answer1, survey.answer2, survey.answer3, survey.answer4]
                        .filter(Boolean)
                        .map((answer) => (
                            <div key={answer} className="flex items-center text-gray-500">
                                <input
                                    type="radio"
                                    id={answer}
                                    name="answer"
                                    value={answer}
                                    onChange={(e) => setSelectedAnswer(e.target.value)}
                                    className="mr-2 cursor-pointer"
                                />
                                <label htmlFor={answer} className="text-lg cursor-pointer">{answer}</label>
                            </div>
                        ))}
                </form>
                <button
                    onClick={handleVote}
                    className="mt-6 w-full bg-blue-500 text-white py-2 rounded-2xl text-lg font-semibold hover:bg-blue-600 flex items-center justify-center gap-2 cursor-pointer"
                >
                    <FaVoteYea /> Votar
                </button>
                <button
                    onClick={handleBackToSurveys}
                    className="mt-4 w-full bg-gray-500 text-white py-2 rounded-2xl text-lg font-semibold hover:bg-gray-600 flex items-center justify-center gap-2 cursor-pointer"
                >
                    <FaArrowLeft /> Volver a la lista de encuestas
                </button>
            </div>
        </div>
    );
}
