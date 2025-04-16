import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (!username || !password) {
            setError('Preencha todos os campos.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/register', { username, password });

            if (response.status === 201) {
                setSuccess('Usuário registrado com sucesso! Redirecionando...');
                setError('');
                setTimeout(() => navigate('/login'), 2000); // Redireciona após 2 segundos
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Erro ao registrar usuário.');
        }
    };

    return (
        <div>
            <h2>Registrar</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <input 
                placeholder="Usuário" 
                value={username}
                onChange={(e) => setUsername(e.target.value)} 
            />
            <input 
                placeholder="Senha" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
            />
            <button onClick={handleRegister}>Registrar</button>
        </div>
    );
}

export default Register;
