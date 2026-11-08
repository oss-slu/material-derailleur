import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AdminUserManagement from '../Components/AdminUserManagement';

test('keeps donor fields editable after validation fails and allows a successful retry', async () => {
    const fetchMock = jest.fn()
        .mockResolvedValueOnce({
            ok: true,
            json: async () => [{
                id: 'user-1', name: 'Jane Doe', email: 'jane@example.com',
                role: 'DONOR', status: 'ACTIVE', createdAt: '2026-01-01',
                hasDonorProfile: false,
            }],
        })
        .mockResolvedValueOnce({ ok: true });
    const originalFetch = global.fetch;
    global.fetch = fetchMock;
    try {
        render(<AdminUserManagement />);
        fireEvent.click(await screen.findByRole('button', { name: 'Update' }));
        expect(screen.getByRole('alert')).toHaveTextContent('Please fill in');
        expect(fetchMock).toHaveBeenCalledTimes(1);

        fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'Jane' } });
        fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByPlaceholderText('ZIP Code'), { target: { value: '63108' } });
        fireEvent.click(screen.getByRole('button', { name: 'Update' }));

        await waitFor(() => expect(screen.getByText('No users found')).toBeInTheDocument());
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
        expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toEqual({
            role: 'DONOR', donorDetails: { firstName: 'Jane', lastName: 'Doe', zipcode: '63108' },
        });
    } finally {
        global.fetch = originalFetch;
    }
});
