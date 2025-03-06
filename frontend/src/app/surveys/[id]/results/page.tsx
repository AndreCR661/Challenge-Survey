'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Survey {
    id: number;
    question: string;
    answer1: string;
    answer2: string;
    answer3: string;
    answer4: string;
}

export default function SurveyResultsPage() {
    const router = useRouter();
    const params = useParams();
    const [survey, setSurvey] = useState<Survey | null>(null);
    const [votes, setVotes] = useState<number[]>([]);

    useEffect(() => {
        const fetchSurvey = async () => {
            try {          
              const response = await fetch(`http://localhost:5000/surveys/${params.id}`); 
              const data = await response.json();
               
              if (data.error) {
                alert(data.error);
                router.push('/surveys');
                return;
            }

              setSurvey(data);
          
              await fetchVotes(data.id, data);
            } catch (error) {
              console.error('Error fetching survey:', error);
              alert('Hubo un problema al obtener la encuesta');
            }
        };

        const fetchVotes = async (surveyId: number, surveyData: Survey) => {
            const answers = [surveyData.answer1, surveyData.answer2, surveyData.answer3, surveyData.answer4];
            const counts = [];

            for (const answer of answers) {
                try {
                    const response = await fetch('http://localhost:5000/votes/count', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ survey_id: surveyId, reply: answer })
                    });

                    const data = await response.json();
                    counts.push(data.Matches || 0);
                } catch (error) {
                    console.error(`Error fetching votes for ${answer}:`, error);
                    counts.push(0);
                }
            }

            setVotes(counts);
        };

        fetchSurvey();
    }, [params.id, router]);

    if (!survey) return <div className="text-center mt-8">Cargando encuesta...</div>;

    const data = {
        labels: [survey.answer1, survey.answer2, survey.answer3, survey.answer4],
        datasets: [
            {
                label: 'Votos por respuesta',
                data: votes,
                backgroundColor: ['#4CAF50', '#2196F3', '#FFC107', '#F44336'],
                borderColor: ['#388E3C', '#1976D2', '#FFA000', '#D32F2F'],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: true, text: `Resultados de: ${survey.question}` },
        },
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">{survey.question}</h1>
            <div className="w-full max-w-2xl">
                <Bar data={data} options={options} />
            </div>

            <button
                onClick={() => router.push('/surveys')}
                className="mt-8 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
            >
                Volver a la lista de encuestas
            </button>
        </div>
    );
}
