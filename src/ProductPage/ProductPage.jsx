import '../main.css'
import './ProductPage.css'
import { Link, useParams } from 'react-router-dom'
import star from './img/star.svg'
import favorite from './img/favorite.svg'
import { useState, useEffect } from 'react'

export default function ProductPage() {
    const { id } = useParams() 
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:3009/api/catalog/${id}`)
                if (!response.ok) {
                    throw new Error('Товар не найден')
                }
                const data = await response.json()
                setProduct(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchProduct()
    }, [id])

    if (loading) return <div className="loading">Загрузка...</div>
    if (error) return <div className="error">{error}</div>
    if (!product) return <div className="not-found">Товар не найден</div>

    return (
        <section className='productpage'>
            <div className="container">
                <div className="productpage-inner">
                    <div className='navigation'>
                        <Link to='/Главная'>Главная</Link>
                        <span>/</span>
                        <Link to='/Каталог'>Каталог</Link>
                    </div>

                    <div className='productpage-content'>
                        <img className='productpage-img' src={product.image_path} alt={product.product_name} />
                        <div className='productpage-content-right'>
                            <h2>{product.product_name}</h2>
                            <div className='productpage-content-subtitle'>
                                <ul className='productpage-content-reviews'>
                                    {[...Array(5)].map((_, i) => (
                                        <li key={i}><button><img src={star} alt="Звезда рейтинга" /></button></li>
                                    ))}
                                    <li><span>({product.reviews_count || 0})</span></li>
                                </ul>

                                <div className='productpage-content-favorites'>
                                    <img src={favorite} alt="Добавить в избранное" />
                                    <span>В избранное</span>
                                </div>
                            </div>

                            <div className='productpage-content-bot'>
                                <p>{product.price} ₽</p>
                                <div className='productpage-content-basket'>
                                    <button>-</button>
                                    <Link to='/basket'>В корзине 1 шт<br />
                                        перейти
                                    </Link>
                                    <button>+</button>
                                </div>
                            </div>
                            <Link className='buyioc' to='#'>Купить в 1 клик</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}