import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupRestaurant from './page'; // Adjust the path according to your file structure
import axios from 'axios';
import { useRouter } from 'next/navigation';
import '@testing-library/jest-dom';

jest.mock('axios');
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

describe('SignupRestaurant Component', () => {
    const mockPush = jest.fn();

    beforeEach(() => {
        useRouter.mockReturnValue({ push: mockPush });
        jest.clearAllMocks();
    });

    test('renders signup form', () => {
        render(<SignupRestaurant />);

        expect(screen.getByText(/Sign up - Restaurant/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();

        // ใช้ getAllByPlaceholderText และเลือกฟิลด์รหัสผ่านตัวแรก
        expect(screen.getAllByPlaceholderText(/Password/i)[0]).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Confirm Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

    test('validates password length and matches', async () => {
        render(<SignupRestaurant />);

        // ใช้ getAllByPlaceholderText เพื่อเลือกฟิลด์รหัสผ่านตัวแรก
        fireEvent.change(screen.getAllByPlaceholderText(/Password/i)[0], { target: { value: '123' } });
        expect(screen.getByText(/3 more character\(s\) needed/i)).toBeInTheDocument();

        fireEvent.change(screen.getAllByPlaceholderText(/Password/i)[0], { target: { value: '123456' } });
        expect(screen.getByText(/Password is valid/i)).toBeInTheDocument();

        fireEvent.change(screen.getAllByPlaceholderText(/Confirm Password/i)[0], { target: { value: '1234567' } });
        expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });

    test('shows error message for incomplete form', async () => {
        render(<SignupRestaurant />);

        fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
        expect(await screen.findByText(/Please complete the password and confirm password/i)).toBeInTheDocument();
    });

    test('submits the form and navigates to detail page on success', async () => {
        axios.post.mockResolvedValueOnce({ data: { data: { user: { id: 1 } } } });

        render(<SignupRestaurant />);

        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@example.com' } });
        const passwordInput = screen.getAllByPlaceholderText(/Password/i)[0]; // Select the first "Password" input
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/signupdetail'));
    });

    test('shows error message for existing email', async () => {
        axios.post.mockRejectedValueOnce({
            response: { data: { message: 'This email already register. Please try again.' } },
        });

        render(<SignupRestaurant />);

        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'existing@example.com' } });
        const passwordInput = screen.getAllByPlaceholderText(/Password/i)[0]; // Select the first "Password" input
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

        expect(await screen.findByText(/This email already register. Please try again./i)).toBeInTheDocument();
    });

    it('shows error message for email rate limit exceeded', async () => {
        axios.post.mockRejectedValue({
            response: { data: { message: 'AuthApiError: email rate limit exceeded' } }
        });

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        render(<SignupRestaurant />);

        // Fill in the form
        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@example.com' } });
        
        // Use getAllByPlaceholderText to get all inputs with the placeholder "Password"
        const passwordInputs = screen.getAllByPlaceholderText(/Password/i);
        fireEvent.change(passwordInputs[0], { target: { value: 'password123' } }); // First password field
        fireEvent.change(passwordInputs[1], { target: { value: 'password123' } }); // Confirm password field
        
        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

        // Assert that the error message is displayed
        expect(await screen.findByText(/This email already register. Please try again./i)).toBeInTheDocument();

        consoleErrorSpy.mockRestore();
    });
});
