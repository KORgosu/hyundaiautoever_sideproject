// hyundai-fe/src/pages/GuestPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormAction, useNavigate } from 'react-router-dom';

function GuestPage() {
    const [parts, setParts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchParts();
    }, []);

    const fetchParts = async () => {
        setLoading(true);
        try {
            // Guest API는 토큰이 필요 없을 수 있습니다. (백엔드 설정에 따라 다름)
            // 만약 토큰이 필요하다면 로그인 페이지에서 가져온 토큰을 사용합니다.
            // const token = localStorage.getItem('accessToken');
            const response = await axios.get('http://127.0.0.1:8000/api/guest-parts/'); // 읽기 전용 MongoDB API
            setParts(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching guest parts:', err.response || err);
            setError('부품 목록을 불러오는 데 실패했습니다.');
            // Guest 페이지는 인증 없이 접근 가능하게 할 수도 있지만,
            // 인증이 필요하다면 로그인 페이지로 리디렉션
            // if (err.response && err.response.status === 401) {
            //     alert('세션이 만료되었거나 권한이 없습니다. 다시 로그인 해주세요.');
            //     navigate('/login');
            // }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>데이터를 불러오는 중...</div>;
    if (error) return <div style={{ color: 'red', textAlign: 'center', padding: '50px' }}>오류: {error}</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Guest 페이지 (부품 조회)</h2>
                <button onClick={handleLogout} style={{ padding: '10px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    로그아웃
                </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>ID</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>이름</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>제조사</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>카테고리</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>재고</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>가격</th>
                    </tr>
                </thead>
                <tbody>
                    {parts.map((part) => (
                        <tr key={part.part_id}>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{part.part_id}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{part.part_name}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{part.manufacturer}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{part.category}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{part.stock_quantity}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{part.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default GuestPage;