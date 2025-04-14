import '../main.css'
import './Loginregistration.css'
import logfacebook from './img/logfacebook.svg'
import logwk from './img/logwk.svg'
import logclassmates from './img/logclassmates.svg'
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function Loginregistration() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [step, setStep] = useState(1);
    const [code, setCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const navigate = useNavigate(); 

    const handleContinue = () => {
        if (step === 1) {
            setIsCodeSent(true);
            setStep(2);
        } else if (step === 2) {
            if (code === '123456') {
                alert('Код подтвержден! Теперь вы можете зарегистрироваться.');
                navigate('/registration'); 
            } else {
                alert('Неверный код. Попробуйте снова.');
            }
        }
    };

    const handleBack = () => {
        setStep(1);
        setPhoneNumber('');
        setCode('');
    };
    return (
        <>
            <section className="loginregistration">
                <div className="loginregistration-inner">

                    <div className="loginregistration-form">
                        <div className="loginregistration-form-title">
                            {step === 1 ? (
                                <>
                                    <h3>Вход и регистрация</h3>
                                    <p>Введите ваш номер телефона и мы вышлем вам код подтверждения для регистрации</p>
                                </>
                            ) : (
                                <>
                                    <h3>{phoneNumber}</h3>
                                    <p>Мы отправили вам смс с кодом подтверждения</p>
                                </>
                            )}
                        </div>

                        {step === 1 ? (
                            <form className='loginregistration-form-input' onSubmit={(e) => e.preventDefault()}>
                                <input
                                    placeholder='+ 7 (123)-456-78-90'
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </form>
                        ) : (
                            <form className='loginregistration-form-input' onSubmit={(e) => e.preventDefault()}>
                                <input
                                    placeholder='Введите код подтверждения'
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                />
                            </form>
                        )}

                        <div className="loginregistration-form-btn">
                            <button className='loginregistration-form-btn-first' onClick={handleContinue}>
                                Продолжить
                            </button>
                            {step === 2 && (
                                <>
                                    <button className='loginregistration-form-btn-resend'>
                                        <u>Отправить код еще раз</u>
                                    </button>
                                    <button className='loginregistration-form-btn-back' onClick={handleBack}>
                                        <u>Назад</u>
                                    </button>
                                </>
                            )}
                        </div>

                        {step === 1 && (
                            <div className="loginregistration-form-social">
                                <p>или продолжить через соцсети</p>
                                <div className='loginregistration-form-social-link'>
                                    <Link><img src={logfacebook} alt="" /></Link>
                                    <Link><img src={logwk} alt="" /></Link>
                                    <Link><img src={logclassmates} alt="" /></Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    )
}