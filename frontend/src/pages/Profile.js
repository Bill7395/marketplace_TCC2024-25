import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Profile() {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        axios.get('http://localhost:3001/profile', {
            headers: { Authorization: token }
        })
        .then(response => {
            setUsername(response.data.user.username);
        })
        .catch(() => {
            localStorage.removeItem('token');
            navigate('/login');
        });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div>
            <h2>Perfil</h2>
            {username ? <p>Bem-vindo, <strong>{username}</strong>!</p> : <p>Carregando...</p>}
            <button onClick={handleLogout}>Sair</button>
            <Link to="/Vender">
                <button>Vender</button>
            </Link>
        </div>
    );
}

export default Profile;
