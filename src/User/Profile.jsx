import { useAuth } from '../AuthContext.jsx';
import './Profile.css'
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import arrowleft from '../BasketPage/img/arrowleft.svg'

export default function Profile() {
    const { user, logout, updateUser } = useAuth();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [message, setMessage] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [addressMessage, setAddressMessage] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || '+7');
    const [phoneMessage, setPhoneMessage] = useState('');
    const phoneInputRef = useRef(null);

    const fetchAddressSuggestions = async (query) => {
        const token = "0ff147ff2686d7939290aacb2c35466435a44115";

        const response = await fetch("https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Token " + token
            },
            body: JSON.stringify({ query, count: 5 })
        });

        const data = await response.json();

        const filtered = data.suggestions.filter(s => s.data.country === "Россия");

        setSuggestions(filtered);
        if (data.suggestions.length > 0 && filtered.length === 0) {
            setAddressMessage("На данный адрес доставка не осуществляется");
        } else {
            setAddressMessage("");
        }
    };

    const handleAddressChange = (e) => {
        const value = e.target.value;
        setDeliveryAddress(value);
        fetchAddressSuggestions(value);
    };

    const handleSuggestionClick = (suggestion) => {
        setDeliveryAddress(suggestion.value);
        setSuggestions([]);
        setAddressMessage('');
    };

    const handleCheckOldPassword = async () => {
        const response = await fetch('https://rainbow-backend-a9w1.onrender.com/api/change-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email, oldPassword, newPassword: oldPassword })
        });

        const data = await response.json();

        if (response.ok) {
            setIsVerified(true);
            setMessage('');
        } else {
            setMessage(data.error);
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== repeatPassword) {
            setMessage('Новые пароли не совпадают');
            return;
        }

        const response = await fetch('https://rainbow-backend-a9w1.onrender.com/api/change-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email, oldPassword, newPassword })
        });

        const data = await response.json();

        if (response.ok) {
            setMessage('Пароль успешно обновлён');
            setOldPassword('');
            setNewPassword('');
            setRepeatPassword('');
            setIsVerified(false);
        } else {
            setMessage(data.error);
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetch(`https://rainbow-backend-a9w1.onrender.com/api/favorites/${user.id}`)
                .then(res => res.json())
                .then(data => setFavorites(data))
                .catch(err => console.error(err));
        }
    }, [user]);

    const handleUpdateAddress = async () => {
        const response = await fetch('https://rainbow-backend-a9w1.onrender.com/api/update-address', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email, deliveryAddress })
        });

        const data = await response.json();

        if (response.ok) {
            setAddressMessage('Адрес успешно обновлён');
        } else {
            setAddressMessage(data.error || 'Ошибка обновления адреса');
        }
    };

    const removeFromFavorites = async (productName) => {
        try {
            const response = await fetch('https://rainbow-backend-a9w1.onrender.com/api/favorites/remove', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: user.id, productName })
            });

            const data = await response.json();

            if (response.ok) {
                setFavorites(data.updatedFavorites);
            } else {
                console.error('Ошибка при удалении из избранного:', data.error);
            }
        } catch (err) {
            console.error('Ошибка сети:', err);
        }
    };

    const scrollToPhoneInput = () => {
        phoneInputRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    const handlePhoneChange = (e) => {
        let value = e.target.value;

        if (!value.startsWith('+7')) {
            value = '+7' + value.replace(/\D/g, '').slice(1);
        } else {
            value = '+7' + value.slice(2).replace(/\D/g, '');
        }

        if (value.length > 12) {
            value = value.substring(0, 12);
        }

        setPhoneNumber(value);
    };

    const handleUpdatePhone = async () => {
        if (phoneNumber.length !== 12 || !/^\+7\d{10}$/.test(phoneNumber)) {
            setPhoneMessage('Номер должен начинаться с +7 и содержать 11 цифр');
            return;
        }

        try {
            const response = await fetch('https://rainbow-backend-a9w1.onrender.com/api/update-phone', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, phoneNumber })
            });

            const data = await response.json();

            if (response.ok) {
                setPhoneMessage('Номер успешно обновлён');
                updateUser({ phone_number: phoneNumber });
            } else {
                setPhoneMessage(data.error || 'Ошибка обновления номера');
            }
        } catch (err) {
            setPhoneMessage('Ошибка сети');
        }
    };
    return (
        <section className='user-page'>
            <div className='container'>
                <div className='navigation navigation-bas'>
                    <img src={arrowleft} alt="" />
                    <Link to='/Главная'>Назад</Link>
                </div>
                <div className='user-page-inner'>
                    <h2>Ваш профиль</h2>
                    {user && (
                        <div className="user-info">
                            <ul>
                                <li><p>Имя: {user.first_name}</p></li>
                                <li><p>Фамилия: {user.last_name}</p></li>
                                <li><p>Email: {user.email}</p></li>
                                <li className='phone_number'>
                                    <p>
                                        Телефон: {user.phone_number || 'не указан'}
                                        {!user.phone_number && (
                                            <button
                                                className="phone-link"
                                                onClick={scrollToPhoneInput}
                                            >
                                                {' '}(указать)
                                            </button>
                                        )}
                                    </p>
                                </li>
                            </ul>
                            <button onClick={logout} className="logout-button">
                                Выйти из аккаунта
                            </button>

                            <hr />
                            <h3>Адрес доставки</h3>
                            <div className="delivery-address-form">
                                <input
                                    type="text"
                                    placeholder="Введите ваш адрес"
                                    value={deliveryAddress}
                                    onChange={handleAddressChange}
                                />
                                {suggestions.length > 0 && (
                                    <ul className="suggestions-list">
                                        {suggestions.map((sug, idx) => (
                                            <li key={idx} onClick={() => handleSuggestionClick(sug)}>
                                                {sug.value}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <button onClick={handleUpdateAddress}>Сохранить адрес</button>
                                {addressMessage && <p className="message">{addressMessage}</p>}
                            </div>

                            <hr />
                            <h3>Избранное</h3>
                            {favorites.length === 0 ? (
                                <p>У вас пока нет избранных товаров.</p>
                            ) : (
                                <div className="favorites-list">
                                    {favorites.map((fav, index) => (
                                        <div className="favorite-item" key={index}>
                                            <img src={fav.image} alt={fav.name} className="favorite-img" />
                                            <div>
                                                <h4>{fav.name}</h4>
                                                <p>{fav.price} ₽</p>
                                            </div>
                                            <button onClick={() => removeFromFavorites(fav.name)}>Удалить</button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <hr />
                            <h3>Смена пароля</h3>
                            {!isVerified ? (
                                <div className="change-password-form">
                                    <input
                                        type="password"
                                        placeholder="Старый пароль"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                    />
                                    <button onClick={handleCheckOldPassword}>Проверить пароль</button>
                                </div>
                            ) : (
                                <div className="change-password-form">
                                    <input
                                        type="password"
                                        placeholder="Новый пароль"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <input
                                        type="password"
                                        placeholder="Повторите новый пароль"
                                        value={repeatPassword}
                                        onChange={(e) => setRepeatPassword(e.target.value)}
                                    />
                                    <button onClick={handleChangePassword}>Сменить пароль</button>
                                </div>
                            )}
                            {message && <p className="message">{message}</p>}
                            <hr />
                            <div className='enter-phone-number' ref={phoneInputRef}>
                                <h3>Телефон</h3>
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={handlePhoneChange}
                                    placeholder="+7XXXXXXXXXX"
                                />
                                <button onClick={handleUpdatePhone}>
                                    {user.phone_number ? 'Обновить номер' : 'Сохранить номер'}
                                </button>
                                {phoneMessage && <p className="message">{phoneMessage}</p>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
