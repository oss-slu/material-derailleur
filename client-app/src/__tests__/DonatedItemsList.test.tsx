import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DonatedItemsList from '../Components/DonatedItemsList';
import React from 'react';
import axios from 'axios';

jest.mock('axios');

beforeAll(() => {
    process.env.REACT_APP_BACKEND_API_BASE_URL = 'http://localhost:5000/';
    localStorage.setItem('token', 'mock-token');

    (axios.get as jest.Mock).mockImplementation((url: string) => {
        if (url.includes('donatedItem')) {
            return Promise.resolve({
                data: [
                    {
                        id: 1,
                        itemType: 'Book',
                        currentStatus: 'Received',
                        dateDonated: '2024-11-01',
                    },
                ],
            });
        }
        if (url.includes('program')) {
            return Promise.resolve({
                data: [{ id: 1, name: 'Program A' }],
            });
        }
        return Promise.reject(new Error(`Unexpected URL: ${url}`));
    });
});

afterAll(() => {
    jest.restoreAllMocks();
});

describe('DonatedItemsList Component - Hover functionality', () => {
    it('applies hover styles on a table row with the clickable-row class', async () => {
        render(
            <BrowserRouter>
                <DonatedItemsList />
            </BrowserRouter>,
        );

        const itemText = await screen.findByText(/Book/i);
        const itemRow = itemText.closest('tr');

        expect(itemRow).toBeInTheDocument();
        expect(itemRow).toHaveClass('clickable-row');

        fireEvent.mouseOver(itemRow!);
    });
});
