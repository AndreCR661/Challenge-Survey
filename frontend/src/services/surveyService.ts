export const getSurveys = async () => {
    try {
        const response = await fetch('http://127.0.0.1:5000/surveys/names');
        if (!response.ok) {
            throw new Error('Error al obtener las encuestas');
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
};
