// hyundai-fe/src/pages/LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // <-- 이 줄을 추가합니다.

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/token/', {
                username: username,
                password: password,
            });

            const { access, refresh } = response.data;

            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);

            // --- 여기부터 수정 ---
            const decodedToken = jwtDecode(access); // <-- 토큰 디코딩
            console.log('Decoded Token (LoginPage.js):', decodedToken); // 디버깅용 로그

            // is_staff 또는 is_superuser 클레임을 기반으로 리디렉션
            if (decodedToken.is_superuser || decodedToken.is_staff) {
                navigate('/admin-dashboard');
            } else {
                navigate('/guest-page');
            }
            // --- 여기까지 수정 ---

        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : error.message);
            alert('로그인 실패: 사용자 이름 또는 비밀번호를 확인하세요.');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>로그인</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>사용자 이름 (이메일):</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>비밀번호:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    로그인
                </button>
            </form>
        </div>
    );
}

export default LoginPage;