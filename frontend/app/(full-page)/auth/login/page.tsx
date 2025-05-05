/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import axios from 'axios';
import { Toast } from 'primereact/toast';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const [error, setError] = useState('');
    const { layoutConfig } = useContext(LayoutContext);
    const router = useRouter();
    const toast = useRef<Toast>(null);

    const containerClassName = classNames(
        'surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden',
        { 'p-input-filled': layoutConfig.inputStyle === 'filled' }
    );
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // If logged in, redirect and block back button
            router.replace('/dashboard'); // adjust your route
            window.history.pushState(null, '', window.location.href);
            window.onpopstate = function () {
                window.history.go(1);
            };
        }
    }, []);

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });

            // Assuming response returns: { user, token }
            const { user, token } = response.data;

            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);

            router.push('/dashboard');
        } catch (err) {
            setError('Invalid credentials. Please try again.');
            toast.current?.show({
                severity: 'error',
                summary: 'Login Failed',
                detail: 'Invalid email or password',
                life: 3000
            });
        }
    };

    return (
        <div className={containerClassName}>
            <Toast ref={toast} position="top-right" />
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/layout/images/ISIM_LOGO_ar-removebg-preview.png`} alt="ISIMM Logo" className="mb-5 w-6rem" />

                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <div className="text-900 text-3xl font-medium mb-3">Welcome To ISIMM</div>
                            <span className="text-600 font-medium">Sign in to continue</span>
                        </div>

                        <div>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">Email</label>
                            <InputText
                                id="email1"
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address"
                                className="w-full md:w-30rem mb-5"
                                style={{ padding: '1rem' }}
                            />

                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">Password</label>
                            <Password
                                inputId="password1"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                toggleMask
                                className="w-full mb-5"
                                inputClassName="w-full p-3 md:w-30rem"
                            />


                            <Button label="Sign In" className="w-full p-3 text-xl" onClick={handleLogin} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
