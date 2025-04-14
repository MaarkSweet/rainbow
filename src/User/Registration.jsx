import '../main.css'
import './Registration.css'
import './Loginregistration.css'
import registrationstar from './img/registrationstar.svg'
import showpassword from './img/showpassword.svg'
import btnrating from './img/btnrating.svg'
import React, { useState } from 'react';



export default function Registration() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [show, setShow] = useState(false);
    const [password, setPassword] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [isRegistered, setIsRegistered] = useState(false); 

    
    const handleFirstNameChange = (e) => {
        setFirstName(e.target.value);
    };

    const handleLastNameChange = (e) => {
        setLastName(e.target.value);
    };

    const toggleShowPassword = () => {
        setShow(!show); 
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);

        const isValidPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value);
        setIsValid(isValidPassword);
    };

   
    const handleSubmit = async (e) => {
        e.preventDefault();

       
        if (!isValid) {
            alert('Пароль не соответствует требованиям');
            return;
        }

        
        const userData = {
            firstName,
            lastName,
            email: e.target.email.value,
            password,
        };

        try {
         
            const response = await fetch('http://localhost:3009/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

           
            if (response.ok) {
                const data = await response.json();
                alert('Регистрация прошла успешно!');
                setIsRegistered(true); 
                console.log('Данные пользователя:', data);
            } else {
                const errorData = await response.json();
                alert(`Ошибка: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при отправке данных');
        }
    };

  
    const handleLogin = async (e) => {
        e.preventDefault();

        const loginData = {
            email: e.target.email.value,
            password: e.target.password.value,
        };

        try {
            const response = await fetch('http://localhost:3009/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            if (response.ok) {
                window.location.href = '/';
            } else {
                const errorData = await response.json();
                alert(`Ошибка: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при отправке данных');
        }
    };
    return (
        <>
            <section className='loginregistration'>
                <div className="loginregistration-inner">


                    <div className="loginregistration-registration">
                        <div className='loginregistration-registration-title'>
                            <div className='first-last-name'>
                                <span>{isRegistered ? '' : `${firstName.charAt(0)}${lastName.charAt(0)}`}</span>
                            </div>
                            <h3>{isRegistered ? 'Вход' : `${firstName} ${lastName}`}</h3>
                        </div>

                        {isRegistered ? (
                            
                            <form className='loginregistration-registration-form' onSubmit={handleLogin}>
                                <div className='loginregistration-registration-form-inner'>
                                    <label htmlFor="">E-mail<img src={registrationstar} alt="" /></label>
                                    <input
                                        type="email"
                                        placeholder='name@inbox.ru'
                                        name="email"
                                        required
                                    />
                                </div>

                                <div className='loginregistration-registration-form-inner'>
                                    <label htmlFor="">Пароль<img src={registrationstar} alt="" /></label>
                                    <input className='input-form-relative'
                                        type={show ? "text" : "password"}
                                        placeholder='********'
                                        name="password"
                                        required
                                    />
                                    <button  type="button" onClick={toggleShowPassword}>
                                        <img className='showpassword' src={showpassword} alt="" />
                                        <img className='btnrating' src={btnrating} alt="" />
                                    </button>
                                </div>

                                <button type="submit" className='loginregistration-registration-login'>
                                    Войти
                                </button>
                            </form>
                        ) : (
                            
                            <form className='loginregistration-registration-form' onSubmit={handleSubmit}>
                                <div className='loginregistration-registration-form-inner'>
                                    <label htmlFor="">Ваше имя<img src={registrationstar} alt="" /></label>
                                    <input
                                        type="text"
                                        placeholder='Иван'
                                        value={firstName}
                                        onChange={handleFirstNameChange}
                                        required
                                    />
                                </div>

                                <div className='loginregistration-registration-form-inner'>
                                    <label htmlFor="">Ваша фамилия<img src={registrationstar} alt="" /></label>
                                    <input
                                        type="text"
                                        placeholder='Петров'
                                        value={lastName}
                                        onChange={handleLastNameChange}
                                        required
                                    />
                                </div>

                                <div className='loginregistration-registration-form-inner'>
                                    <label htmlFor="">E-mail<img src={registrationstar} alt="" /></label>
                                    <input
                                        type="email"
                                        placeholder='name@inbox.ru'
                                        name="email"
                                        required
                                    />
                                </div>

                                <div className='loginregistration-registration-form-inner'>
                                    <label htmlFor="">Пароль<img src={registrationstar} alt="" /></label>
                                    <input
                                        type={show ? "text" : "password"}
                                        placeholder='********'
                                        value={password}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                    <button type="button" onClick={toggleShowPassword}>
                                        <img className='showpassword' src={showpassword} alt="" />
                                        <img className='btnrating' src={btnrating} alt="" />
                                    </button>
                                    {!isValid && (
                                        <div className="registration-warning">
                                            Пароль должен состоять из 8 цифр и латинских строчных и заглавных символов.
                                        </div>
                                    )}
                                </div>

                                <div className='loginregistration-registration-form-inner showpassword-repeat'>
                                    <label htmlFor="">Повторите пароль<img src={registrationstar} alt="" /></label>
                                    <input
                                        type={show ? "text" : "password"}
                                        placeholder='********'
                                        required
                                    />
                                    <button type="button" onClick={toggleShowPassword}>
                                        <img className='showpassword' src={showpassword} alt="" />
                                    </button>
                                </div>

                                <button type="submit" className='loginregistration-registration-login'>
                                    Зарегистрироваться
                                </button>
                            </form>
                        )}
                    </div>

                </div>
            </section>
        </>
    )
}