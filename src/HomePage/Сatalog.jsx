import '../main.css'
import './Catalog.css'
import like from './img/like.svg'
import shoppingcard from './img/shoppingcard.svg'
import arrow from './img/arrow.svg'
import { Link } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { useCart } from '../CartContext'
import { useAuth } from '../AuthContext'


export default function Catalog({ searchQuery = '', hideAddToCart = false }) {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();
    const { fetchCartCount } = useCart();

    const addToCart = async (productId) => {
        try {
            const response = await fetch('https://rainbow-backend-a9w1.onrender.com/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id:  user.id,
                    product_id: productId,
                    quantity: 1
                })
            });

            if (response.ok) {
                await fetchCartCount(); 
                alert('Товар добавлен в корзину!');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };



    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const url = searchQuery
                    ? `https://rainbow-backend-a9w1.onrender.com/api/catalog?q=${encodeURIComponent(searchQuery)}`
                    : 'https://rainbow-backend-a9w1.onrender.com/api/catalog';

                const response = await fetch(url);
                const result = await response.json();

            
                const uniqueData = result.filter(
                    (item, index, self) => index === self.findIndex(t => t.id === item.id)
                );

                setData(uniqueData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [searchQuery]);

    return (
        <section className='catalog'>
            <div className="container">
                <div className="catalog-inner">
                    <Link className='linktocatalog' to='/Каталог'>Каталог</Link>
                    {isLoading ? (
                        <div className="loading">Загрузка...</div>
                    ) : data.length === 0 ? (
                        <div className="no-results">
                            {searchQuery
                                ? `Товары по запросу "${searchQuery}" не найдены`
                                : 'В каталоге пока нет товаров'}
                        </div>
                    ) : (
                        <>
                            <div className='card-container'>
                                {data.map((catalog) => (
                                    <div className='card' key={catalog.id}>
                                        <div className='card-top'>
                                            <img className='card-like' src={like} alt="Добавить в избранное" />
                                            <Link to={`/product/${catalog.id}`} className="card-link">
                                                <img
                                                    className='card-img'
                                                    src={catalog.image_path}
                                                    alt={catalog.product_name}
                                                />
                                            </Link>
                                        </div>
                                        <div className="card-bot">
                                            <p>{catalog.product_name}</p>
                                            <div className='card-bot_p-s'>
                                                <span>{catalog.price} ₽</span>
                                                {!hideAddToCart && (
                                                    <div>
                                                        <img
                                                            src={shoppingcard}
                                                            alt="Добавить в корзину"
                                                            onClick={() => addToCart(catalog.id)}
                                                            style={{ cursor: 'pointer' }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {!searchQuery && (
                                <button className='see-all'>
                                    <p>Смотреть все</p>
                                    <img src={arrow} alt="Стрелка" />
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </section>
    )
}