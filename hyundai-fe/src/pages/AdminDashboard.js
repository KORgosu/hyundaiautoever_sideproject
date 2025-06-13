// C:\Users\nexon\hyundaiautoever_sideproject\hyundai-fe\src\pages\AdminDashboard.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PartFormModal from '../components/PartFormModal'; // PartFormModal 임포트 확인
import { jwtDecode } from 'jwt-decode'; // JWT 디코딩을 위해 추가

function AdminDashboard() {
    // --- 상태 변수 선언 ---
    const [parts, setParts] = useState([]); // 부품 목록 상태
    const [showModal, setShowModal] = useState(false); // 모달 표시 여부 상태
    const [currentPart, setCurrentPart] = useState(null); // 수정할 현재 부품 상태
    const navigate = useNavigate(); // 라우팅을 위한 useNavigate 훅

    // --- 유틸리티 함수: 인증 헤더 가져오기 ---
    const getAuthHeaders = () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            // 토큰이 없으면 로그인 페이지로 리디렉션
            navigate('/login');
            return {};
        }
        try {
            const decodedToken = jwtDecode(token);
            // 토큰 만료 시간 (exp) 확인. Date.now()는 밀리초, exp는 초 단위이므로 1000을 곱함.
            if (decodedToken.exp * 1000 < Date.now()) {
                alert('세션이 만료되었습니다. 다시 로그인해주세요.');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                navigate('/login');
                return {};
            }
        } catch (error) {
            console.error("Token decoding failed or invalid:", error);
            alert('유효하지 않은 토큰입니다. 다시 로그인해주세요.');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            navigate('/login');
            return {};
        }
        return {
            Authorization: `Bearer ${token}`,
        };
    };

    // --- 부품 목록 불러오기 함수 ---
    const fetchParts = async () => {
        try {
            const headers = getAuthHeaders();
            if (!headers.Authorization) return; // 토큰이 없으면 함수 종료

            const response = await axios.get('http://127.0.0.1:8000/api/admin-parts/', {
                headers: headers,
            });
            setParts(response.data); // 받아온 데이터를 parts 상태에 저장
        } catch (err) {
            console.error('Error fetching parts:', err.response || err);
            if (err.response && err.response.status === 401) {
                alert('인증이 필요합니다. 다시 로그인해주세요.');
                navigate('/login');
            } else {
                alert(`부품 목록 로딩 실패: ${JSON.stringify(err.response ? err.response.data : err.message)}`);
            }
        }
    };

    // --- 컴포넌트 마운트 시 부품 목록 로드 ---
    useEffect(() => {
        fetchParts();
    }, []); // 빈 배열은 컴포넌트가 처음 마운트될 때 한 번만 실행

    // --- 부품 추가 또는 수정 처리 함수 ---
    const handleAddEdit = async (partData) => {
        try {
            const headers = getAuthHeaders();
            if (!headers.Authorization) return;

            if (currentPart) {
                // 수정: PUT 요청
                await axios.put(`http://127.0.0.1:8000/api/admin-parts/${partData.part_code}/`, partData, {
                    headers: headers,
                });
                alert('부품이 성공적으로 수정되었습니다.');
            } else {
                // 추가: POST 요청
                await axios.post('http://127.0.0.1:8000/api/admin-parts/', partData, {
                    headers: headers,
                });
                alert('부품이 성공적으로 추가되었습니다.');
            }
            setShowModal(false); // 모달 닫기
            setCurrentPart(null); // 현재 수정 중인 부품 초기화
            fetchParts(); // 목록 새로고침
        } catch (err) {
            console.error('Error saving part:', err.response || err);
            alert(`부품 저장 실패: ${JSON.stringify(err.response ? err.response.data : err.message)}`);
        }
    };

    // --- 부품 삭제 처리 함수 ---
    const handleDelete = async (partCode) => {
        if (window.confirm('정말로 이 부품을 삭제하시겠습니까?')) {
            try {
                const headers = getAuthHeaders();
                if (!headers.Authorization) return;

                await axios.delete(`http://127.0.0.1:8000/api/admin-parts/${partCode}/`, {
                    headers: headers,
                });
                alert('부품이 성공적으로 삭제되었습니다.');
                fetchParts(); // 목록 새로고침
            } catch (err) {
                console.error('Error deleting part:', err.response || err);
                alert(`부품 삭제 실패: ${JSON.stringify(err.response ? err.response.data : err.message)}`);
            }
        }
    };

    // --- 부품 수정 모달 열기 함수 ---
    const handleEditClick = (part) => {
        // 현재 part 객체에서 변경된 필드 이름으로 데이터를 매핑하여 currentPart 상태에 저장
        setCurrentPart({
            part_code: part.part_code,
            name: part.name,
            description: part.description,
            price: part.price,
            quantity: part.quantity,
            manufacturer: part.manufacturer,
            model: part.model,
            location: part.location
        });
        setShowModal(true); // 모달 열기
    };

    // --- 부품 추가 모달 열기 함수 ---
    const handleAddPartClick = () => {
        setCurrentPart(null); // 새 부품 추가이므로 currentPart 초기화
        setShowModal(true); // 모달 열기
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>관리자 대시보드</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <button onClick={handleAddPartClick} style={{ padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    새 부품 추가
                </button>
                <button onClick={handleLogout} style={{ padding: '10px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    로그아웃
                </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>부품 코드</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>이름</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>제조사</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>모델</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>재고</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>가격</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>액션</th>
                    </tr>
                </thead>
                <tbody>
                    {parts.map((part) => (
                        <tr key={part.part_code}>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{part.part_code}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{part.name}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{part.manufacturer}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{part.model}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{part.quantity}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>{part.price}</td>
                            <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                <button onClick={() => handleEditClick(part)} style={{ padding: '5px 10px', backgroundColor: '#ffc107', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}>
                                    수정
                                </button>
                                <button onClick={() => handleDelete(part.part_code)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                    삭제
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <PartFormModal
                    part={currentPart}
                    onClose={() => setShowModal(false)}
                    onSave={handleAddEdit}
                />
            )}
        </div>
    );
}

export default AdminDashboard;