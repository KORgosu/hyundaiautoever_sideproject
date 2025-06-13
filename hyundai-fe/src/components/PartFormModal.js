// hyundai-fe/src/components/PartFormModal.js (새로 생성할 파일)

import React, { useState, useEffect } from 'react'; // React와 useState, useEffect 임포트 추가

function PartFormModal({ part, onClose, onSave }) {
    const [formData, setFormData] = useState({
        part_code: '', // 'part_id' 대신 'part_code'
        name: '',      // 'part_name' 대신 'name'
        description: '',
        price: '',
        quantity: '',  // 'stock_quantity' 대신 'quantity'
        manufacturer: '',
        model: '',     // MariaDB에 'model' 컬럼이 있으니 추가
        location: ''
        // 'category' 필드는 MariaDB에 없으므로 여기서 제거
    });

    useEffect(() => {
        if (part) {
            setFormData({
                part_code: part.part_code || '',
                name: part.name || '',
                description: part.description || '',
                price: part.price || '',
                quantity: part.quantity || '',
                manufacturer: part.manufacturer || '',
                model: part.model || '',
                location: part.location || ''
            });
        } else {
            // 새 부품 추가 시 폼 초기화
            setFormData({
                part_code: '', name: '', description: '', price: '',
                quantity: '', manufacturer: '', model: '', location: ''
            });
        }
    }, [part]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                <h3>{part ? '부품 수정' : '새 부품 추가'}</h3>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Part Code:</label>
                        <input
                            type="text"
                            name="part_code" // 'part_id' -> 'part_code'
                            value={formData.part_code}
                            onChange={handleChange}
                            required
                            readOnly={!!part}
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Part Name:</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Description:</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}></textarea>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Price:</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} required step="0.01" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Stock Quantity:</label>
                        <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Manufacturer:</label>
                        <input type="text" name="manufacturer" value={formData.manufacturer} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSsizing: 'border-box' }} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Model:</label>
                        <input type="text" name="model" value={formData.model} onChange={handleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Location:</label>
                        <input type="text" name="location" value={formData.location} onChange={handleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                        <button type="button" onClick={onClose} style={{ padding: '10px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>
                            취소
                        </button>
                        <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            {part ? '수정' : '추가'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PartFormModal;