import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupUser from './page'; // Adjust the path according to your file structure
import { useRouter } from 'next/navigation';
import '@testing-library/jest-dom';
import axios from 'axios';

jest.mock('axios');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('SignupUser Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
  });

  test('renders signup form', () => {
    render(<SignupUser />);

    expect(screen.getByText(/Sign up - User/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();

    const passwordInputs = screen.getAllByPlaceholderText(/Password/i);
    expect(passwordInputs[0]).toBeInTheDocument(); // ฟิลด์ Password
    expect(screen.getByPlaceholderText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  test('validates password length and matches', async () => {
    render(<SignupUser />);

    const passwordInputs = screen.getAllByPlaceholderText(/Password/i);

    // ตั้งค่าพาสเวิร์ดในฟิลด์แรก
    fireEvent.change(passwordInputs[0], { target: { value: '123' } });
    expect(screen.getByText(/3 more character\(s\) needed/i)).toBeInTheDocument();

    // อัปเดตพาสเวิร์ดให้เป็นค่าที่ถูกต้อง
    fireEvent.change(passwordInputs[0], { target: { value: '123456' } });
    expect(screen.getByText(/Password is valid/i)).toBeInTheDocument();

    // ตั้งค่าฟิลด์ยืนยันพาสเวิร์ด
    fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), { target: { value: '1234567' } });
    expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
  });


  test('submits the form and navigates to verify page on success', async () => {
    axios.post.mockResolvedValueOnce({ data: { data: { user: { id: 1 } } } });

    render(<SignupUser />);

    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@example.com' } });
    const passwordInputs = screen.getAllByPlaceholderText(/Password/i);
    fireEvent.change(passwordInputs[0], { target: { value: 'password123' } }); // ฟิลด์รหัสผ่าน
    fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/verify'));
  });

  test('shows error message for existing email', async () => {
    axios.post.mockRejectedValueOnce({ response: { data: { message: 'This email already register. Please try again.' } } });

    render(<SignupUser />);

    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'existing@example.com' } });
    const passwordInputs = screen.getAllByPlaceholderText(/Password/i);
    fireEvent.change(passwordInputs[0], { target: { value: 'password123' } }); // ฟิลด์รหัสผ่าน
    fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(await screen.findByText(/This email already register. Please try again./i)).toBeInTheDocument();
  });

  test('shows error message for password rate limit', async () => {
    axios.post.mockRejectedValueOnce({ response: { data: { message: 'AuthApiError: email rate limit exceeded' } } });

    render(<SignupUser />);

    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@example.com' } });
    const passwordInputs = screen.getAllByPlaceholderText(/Password/i);
    fireEvent.change(passwordInputs[0], { target: { value: 'password123' } }); // ฟิลด์รหัสผ่าน

    fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(await screen.findByText(/Cannot send OTP multiple times/i)).toBeInTheDocument();
  });
});
