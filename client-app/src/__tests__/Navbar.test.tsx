import '@testing-library/jest-dom';
import { act, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../Components/Navbar';

const createToken = (expiresInSeconds: number) => {
    const payload = {
        exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
        role: 'ADMIN',
        status: 'ACTIVE',
    };

    return `header.${btoa(JSON.stringify(payload))}.signature`;
};

describe('Navbar session timeout', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        localStorage.clear();
        localStorage.setItem('name', 'Test User');
    });

    afterEach(() => {
        jest.useRealTimers();
        localStorage.clear();
    });

    test('clears the session when the token is already expired', () => {
        localStorage.setItem('token', createToken(-60));

        render(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>,
        );

        expect(localStorage.getItem('token')).toBeNull();
        expect(localStorage.getItem('name')).toBeNull();
    });

    test('clears the session when the token reaches its expiration time', () => {
        localStorage.setItem('token', createToken(30));

        render(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>,
        );

        expect(localStorage.getItem('token')).not.toBeNull();

        act(() => {
            jest.advanceTimersByTime(31_000);
        });

        expect(localStorage.getItem('token')).toBeNull();
        expect(localStorage.getItem('name')).toBeNull();
    });
});
