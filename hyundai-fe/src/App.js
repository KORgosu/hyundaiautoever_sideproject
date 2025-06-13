// hyundai-fe/src/App.js (또는 PrivateRoute 컴포넌트가 정의된 곳)
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import GuestPage from './pages/GuestPage';
import { jwtDecode } from 'jwt-decode'; // <-- 이 줄을 추가합니다.

// PrivateRoute 컴포넌트: 인증된 사용자만 접근 허용
const PrivateRoute = ({ children, requiredRole }) => {
    const accessToken = localStorage.getItem('accessToken'); // accessToken을 직접 가져옴

    if (!accessToken) {
        return <Navigate to="/login" replace />; // 토큰 없으면 로그인 페이지로
    }

    let userIsAdmin = false;
    try {
        const decodedToken = jwtDecode(accessToken);
        // 토큰이 유효하고 is_staff 또는 is_superuser가 true인지 확인
        userIsAdmin = decodedToken.is_staff || decodedToken.is_superuser;
    } catch (error) {
        console.error("Error decoding token or token invalid:", error);
        // 토큰 디코딩 실패 또는 토큰이 유효하지 않으면 로그인 페이지로 리디렉션
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return <Navigate to="/login" replace />;
    }

    // requiredRole이 'admin'이고 사용자가 관리자가 아니면 Guest 페이지로
    if (requiredRole === 'admin' && !userIsAdmin) {
        return <Navigate to="/guest-page" replace />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/" element={<Navigate to="/login" replace />} />

                    {/* Admin 대시보드는 Admin 권한이 필요 */}
                    <Route
                        path="/admin-dashboard"
                        element={
                            <PrivateRoute requiredRole="admin">
                                <AdminDashboard />
                            </PrivateRoute>
                        }
                    />

                    {/* Guest 페이지는 로그인만 되어 있으면 접근 가능 (Admin도 가능) */}
                    <Route
                        path="/guest-page"
                        element={
                            <PrivateRoute> {/* requiredRole이 없으면 단순 로그인 여부만 체크 */}
                                <GuestPage />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;