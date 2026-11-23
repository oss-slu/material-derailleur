import React, { ReactNode } from 'react';
import '../css/LoginPage.css';

const loginAssets = (process.env.PUBLIC_URL || '') + '/login';

interface AuthPageLayoutProps {
    eyebrow: string;
    title: ReactNode;
    description: string;
    children: ReactNode;
}

export default function AuthPageLayout({
    eyebrow,
    title,
    description,
    children,
}: AuthPageLayoutProps) {
    return (
        <div className="login-page">
            <div className="login-layout">
                <section className="login-content" aria-labelledby="auth-title">
                    <div className="login-intro">
                        <p className="login-eyebrow">{eyebrow}</p>
                        <h1 id="auth-title">{title}</h1>
                        <p>{description}</p>
                    </div>
                    {children}
                </section>

                <div className="login-gallery">
                    <img
                        className="login-workshop-photo"
                        src={loginAssets + '/bike-workshop.png'}
                        alt="A BWorks participant practicing on a bicycle"
                    />
                    <img
                        className="login-classroom-photo"
                        src={loginAssets + '/learning-together.png'}
                        alt="Students learning together in the BWorks computer lab"
                    />
                    <img
                        className="login-gallery-badge"
                        src={loginAssets + '/be-more.png'}
                        alt=""
                    />
                </div>
            </div>
        </div>
    );
}
