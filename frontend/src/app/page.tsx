'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/verify_user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            console.log(data);
            if (response.ok) {
                localStorage.setItem('user_id', data.user_id);
                if (username === 'admin') {
                    router.push('/surveys');
                } else {
                    router.push('/principal');
                }
            } else {
                alert('Credenciales incorrectas o no tienes permisos de administrador');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Iniciar Sesión</h2>
                <div className="mb-4">
                    <label className="block text-gray-700">Usuario</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 border rounded-lg mt-1 text-gray-900"
                        placeholder="Ingresa tu usuario"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700">Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded-lg mt-1 text-gray-900"
                        placeholder="Ingresa tu contraseña"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
                >
                    Iniciar Sesión
                </button>
            </form>
        </div>
    );
}

