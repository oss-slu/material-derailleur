import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { act } from '@testing-library/react';
import DonorForm from '../Components/DonorForm';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
process.env.REACT_APP_BACKEND_API_BASE_URL = 'http://localhost:5000/';

describe('DonorForm', () => {
    beforeAll(() => {
        localStorage.setItem('token', 'mock-token');
    });
    beforeEach(() => {
        // Reset mocks before each test
        mockedAxios.post.mockReset();
    });
    const renderWithRouter = (ui: any, { route = '/' } = {}) => {
        window.history.pushState({}, 'Test page', route);
        return render(<BrowserRouter>{ui}</BrowserRouter>);
    };
    it('renders correctly', () => {
        renderWithRouter(<DonorForm />);
        expect(screen.getByText(/Add Donor Details/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Contact/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email ID/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Address Line 1/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/State/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Zip Code/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email Opt-in/i)).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /Add Donor/i }),
        ).toBeInTheDocument();
    });
    it('allows input to be entered', () => {
        renderWithRouter(<DonorForm />);
        const firstNameInput = screen.getByLabelText(/First Name/i);
        act(() => {
            userEvent.type(firstNameInput, 'John');
        });
        expect(firstNameInput).toHaveValue('John');
    });
    it('validates and submits the form data', async () => {
        renderWithRouter(<DonorForm />);
        const submitButton = screen.getByRole('button', { name: /Add Donor/i });
        act(() => {
            // Fill out the form
            userEvent.type(screen.getByLabelText(/First Name/i), 'John');
            userEvent.type(screen.getByLabelText(/Last Name/i), 'Doe');
            userEvent.type(screen.getByLabelText(/Contact/i), '1234567890');
            userEvent.type(
                screen.getByLabelText(/Email ID/),
                'john.doe@example.com',
            );
            userEvent.type(
                screen.getByLabelText(/Address Line 1/i),
                '1234 Main St',
            );
            userEvent.type(screen.getByLabelText(/State/i), 'State');
            userEvent.type(screen.getByLabelText(/City/i), 'City');
            userEvent.type(screen.getByLabelText(/Zip Code/i), '12345');
            userEvent.click(screen.getByLabelText(/Email Opt-in/i));
        });
        // Set up axios mock to simulate successful form submission
        mockedAxios.post.mockResolvedValue({ status: 201 });
        act(() => {
            // Click submit
            userEvent.click(submitButton);
        });
        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledWith(
                `${process.env.REACT_APP_BACKEND_API_BASE_URL}donor`,
                {
                    firstName: 'John',
                    lastName: 'Doe',
                    contact: '1234567890',
                    email: 'john.doe@example.com',
                    addressLine1: '1234 Main St',
                    addressLine2: '',
                    state: 'State',
                    city: 'City',
                    zipcode: '12345',
                    emailOptIn: true,
                },
                {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                },
            );
        });

        await waitFor(() => {
            expect(
                screen.getByText(/Donor added successfully!/i),
            ).toBeInTheDocument();
        });
    });
    it('displays an error message on submission failure', async () => {
        renderWithRouter(<DonorForm />);
        act(() => {
            userEvent.type(screen.getByLabelText(/First Name/i), 'John');
            userEvent.type(screen.getByLabelText(/Last Name/i), 'Doe');
            userEvent.type(screen.getByLabelText(/Contact/i), '1234567890');
            userEvent.type(
                screen.getByLabelText(/Email ID/),
                'john.doe@example.com',
            );
            userEvent.type(
                screen.getByLabelText(/Address Line 1/i),
                '1234 Main St',
            );
            userEvent.type(screen.getByLabelText(/State/i), 'State');
            userEvent.type(screen.getByLabelText(/City/i), 'City');
            userEvent.type(screen.getByLabelText(/Zip Code/i), '12345');
            userEvent.click(screen.getByLabelText(/Email Opt-in/i));
        });
        // Mock failure response
        mockedAxios.post.mockRejectedValue({
            response: {
                data: {
                    message: 'Error adding donor',
                },
            },
        });
        act(() => {
            userEvent.click(screen.getByRole('button', { name: /Add Donor/i }));
        });
        await waitFor(() => {
            expect(screen.getByText(/Error adding donor/i)).toBeInTheDocument();
        });
    });
    it('shows validation errors when fields are incomplete', async () => {
        renderWithRouter(<DonorForm />);
        act(() => {
            userEvent.click(screen.getByRole('button', { name: /Add Donor/i }));
        });
        await waitFor(() => {
            expect(
                screen.getByText(/First Name is required/i),
            ).toBeInTheDocument();
        });
    });
});
