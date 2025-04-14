import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css'

const AdminPanel = () => {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        product_name: '',
        price: '',
        description: '',
        image_path: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('adminAuth');
        if (!isAuthenticated) {
            navigate('/admin/login');
        } else {
            fetchProducts();
        }
    }, [navigate]);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:3009/api/catalog');
            if (!response.ok) throw new Error('Ошибка загрузки');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error:', error);
            alert('Ошибка при загрузке товаров');
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const productData = {
                ...formData,
                price: parseFloat(formData.price)
            };

            const credentials = btoa('admin:admin');

            const response = await fetch('http://localhost:3009/admin/products', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${credentials}`
                },
                body: JSON.stringify(productData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Ошибка: ${errorData.error || 'Неизвестная ошибка'}`);
                return;
            }

            await fetchProducts();
            setFormData({ product_name: '', price: '', description: '', image_path: '' });
            alert('Товар успешно добавлен!');
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Произошла ошибка при добавлении товара');
        }
    };

    const handleDelete = async (id) => {
        try {
            if (!window.confirm('Вы точно хотите удалить этот товар?')) return;

            const credentials = btoa('admin:admin');
            const response = await fetch(`http://localhost:3009/admin/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Basic ${credentials}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Ошибка удаления');
            }

            await fetchProducts();
            alert('Товар успешно удален!');
        } catch (error) {
            console.error('Delete error:', error);
            alert(error.message);
        }
    };


    return (
        <div className="admin-panel">
            <h1 className='title-admin-h'>Админ панель</h1>
            <button className='getout-admin' onClick={() => { 
                localStorage.removeItem('adminAuth');
                navigate('/admin/login');
            }}>
                Выйти
            </button>
            <form className='form-add-product' onSubmit={handleAddProduct}>
                <input
                    type="text"
                    placeholder="Название продукта"
                    value={formData.product_name}
                    onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Цена"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                />
                <input
                    type="text"
                    placeholder="Описание"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Ссылка на фотку"
                    value={formData.image_path}
                    onChange={(e) => setFormData({ ...formData, image_path: e.target.value })}
                />
                <button className='button-add-product' type="submit">Добавить продукт</button>
            </form>




            <div className="products-list">
                <h2>Список товаров ({products.length})</h2>
                <div className="products-grid">
                    {products.map(product => (
                        <div key={product.id} className="product-card">
                            <img
                                src={product.image_path || 'placeholder-image.jpg'}
                                alt={product.product_name}
                                className="product-image"
                            />
                            <div className="product-info">
                                <h3>{product.product_name}</h3>
                                <p>Цена: ${product.price}</p>
                                {product.description && <p>{product.description}</p>}
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(product.id)}
                                >
                                    Удалить товар
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    );
};

export default AdminPanel;