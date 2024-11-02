import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './page';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import '@testing-library/jest-dom';

jest.mock('axios');
jest.mock('next/navigation', () => ({
useRouter: jest.fn(),
}));

describe('Login Component', () => {
const mockPush = jest.fn();

beforeEach(() => {
useRouter.mockReturnValue({ push: mockPush });
jest.clearAllMocks();
});

test('renders login form with email and password fields', () => {
render(<Login />);

expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
});

test('displays error message when fields are empty and submit is clicked', async () => {
render(<Login />);

fireEvent.click(screen.getByRole('button', { name: /log in/i }));

expect(await screen.findByText('Please fill in both email and password.')).toBeInTheDocument();
});

test('sends login request for owner role and redirects', async () => {
    const userResponseOwner = { data: [{ Role: 'owner' }] };
    axios.post.mockResolvedValue({ data: { user: { id: 1 } } });
    axios.get.mockResolvedValue(userResponseOwner);

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/login'),
        { email: 'test@example.com', password: 'password123' },
        { withCredentials: true }
    ));

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/user'), { withCredentials: true }));
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/info')));
});

test('sends login request for customer role and redirects to home', async () => {
    const userResponseCustomer = { data: [{ Role: 'customer' }] };
    axios.post.mockResolvedValue({ data: { user: { id: 2 } } });
    axios.get.mockResolvedValue(userResponseCustomer);

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'customer@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/login'),
        { email: 'customer@example.com', password: 'password123' },
        { withCredentials: true }
    ));

    await waitFor(() => expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/user'), { withCredentials: true }));
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/')));
});

test('displays error message on login failure', async () => {
    axios.post.mockRejectedValue({ response: { data: { message: 'Invalid credentials' } } });

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
});
});