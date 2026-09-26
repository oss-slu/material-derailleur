import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from '../Components/Register';

const renderRegister = () => {
    render(
        <BrowserRouter>
            <Register />
        </BrowserRouter>,
    );

    // Put something in the CAPTCHA box so the Register button is enabled.
    fireEvent.change(screen.getByPlaceholderText('Enter CAPTCHA'), {
        target: { value: 'test' },
    });
};

describe('Register required field validation', () => {
    test('shows an error when name is missing', () => {
        renderRegister();

        fireEvent.click(screen.getByRole('button', { name: 'Register' }));

        expect(screen.getByText('Name is required')).toBeInTheDocument();
    });

    test('shows an error when email is missing', () => {
        renderRegister();

        fireEvent.change(screen.getByLabelText('Name'), {
            target: { value: 'Test User' },
        });

        fireEvent.click(screen.getByRole('button', { name: 'Register' }));

        expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    test('shows an error when password is missing', () => {
        renderRegister();

        fireEvent.change(screen.getByLabelText('Name'), {
            target: { value: 'Test User' },
        });

        fireEvent.change(screen.getByLabelText('Email address'), {
            target: { value: 'test@example.com' },
        });

        fireEvent.click(screen.getByRole('button', { name: 'Register' }));

        expect(screen.getByText('Password is required')).toBeInTheDocument();
    });

    test('shows an error when confirm password is missing', () => {
        renderRegister();

        fireEvent.change(screen.getByLabelText('Name'), {
            target: { value: 'Test User' },
        });

        fireEvent.change(screen.getByLabelText('Email address'), {
            target: { value: 'test@example.com' },
        });

        fireEvent.change(screen.getByLabelText('Password'), {
            target: { value: 'StrongPassword123!' },
        });

        fireEvent.click(screen.getByRole('button', { name: 'Register' }));

        expect(
            screen.getByText('Please confirm your password'),
        ).toBeInTheDocument();
    });
});
