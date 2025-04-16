import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault(); // Evita reload da página

        if (!username || !password) {
            setError('Preencha todos os campos.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/login', { username, password });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                setError('');
                console.log('🔹 Token armazenado:', response.data.token);
                navigate('/profile'); // Redireciona
            } else {
                setError('Token não recebido. Verifique o backend.');
            }
        } catch (error) {
            console.error('❌ Erro no login:', error.response?.data || error.message);
            setError(error.response?.data?.message || 'Erro no login! Verifique suas credenciais.');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin}>
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
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
}

export default Login;
