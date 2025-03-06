'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateSurveyPage() {
    const [question, setQuestion] = useState('');
    const [answer1, setAnswer1] = useState('');
    const [answer2, setAnswer2] = useState('');
    const [answer3, setAnswer3] = useState('');
    const [answer4, setAnswer4] = useState('');
    const [state, setState] = useState(true);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newSurvey = {
            question,
            answer1,
            answer2,
            answer3,
            answer4,
            state
        };

        try {
            const response = await fetch('http://localhost:5000/surveys', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newSurvey)
            });

            if (response.ok) {
                alert('Encuesta creada exitosamente');
                router.push('/surveys');
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error creating survey:', error);
            alert('Hubo un problema al crear la encuesta');
        }
    };

    const handleCancel = () => {
        router.push('/surveys');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-lg w-96"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Crear Nueva Encuesta</h2>
                <div className="mb-4">
                    <label className="block text-gray-700">Pregunta</label>
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="w-full p-2 border rounded-lg mt-1 text-gray-900"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Respuesta 1</label>
                    <input
                        type="text"
                        value={answer1}
                        onChange={(e) => setAnswer1(e.target.value)}
                        className="w-full p-2 border rounded-lg mt-1 text-gray-900"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Respuesta 2</label>
                    <input
                        type="text"
                        value={answer2}
                        onChange={(e) => setAnswer2(e.target.value)}
                        className="w-full p-2 border rounded-lg mt-1 text-gray-900"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Respuesta 3</label>
                    <input
                        type="text"
                        value={answer3}
                        onChange={(e) => setAnswer3(e.target.value)}
                        className="w-full p-2 border rounded-lg mt-1 text-gray-900"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Respuesta 4</label>
                    <input
                        type="text"
                        value={answer4}
                        onChange={(e) => setAnswer4(e.target.value)}
                        className="w-full p-2 border rounded-lg mt-1 text-gray-900"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700">Estado</label>
                    <select
                        value={state.toString()}
                        onChange={(e) => setState(e.target.value === 'true')}
                        className="w-full p-2 border rounded-lg mt-1 text-gray-900"
                    >
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                    </select>
                </div>
                <div className="flex justify-between">
                    <button
                        type="submit"
                        className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition w-1/2 mr-2"
                    >
                        Registrar Encuesta
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition w-1/2"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}
