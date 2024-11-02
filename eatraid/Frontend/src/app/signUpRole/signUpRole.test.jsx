import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignUpRole from './page'; // ปรับตามที่อยู่ของไฟล์
import { useRouter } from 'next/navigation';

jest.mock('axios');
import axios from 'axios';

beforeEach(() => {
    axios.get.mockResolvedValue({ data: { /* ข้อมูลที่คุณต้องการ */ } });
});

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('SignUpRole Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
  });

  test('renders Sign Up Role options', () => {
    render(<SignUpRole />);

    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
    expect(screen.getByText(/User/i)).toBeInTheDocument();
    expect(screen.getByText(/Restaurant/i)).toBeInTheDocument();
  });

  test('selects User role and continues', () => {
    render(<SignUpRole />);

    fireEvent.click(screen.getByText(/User/i));
    fireEvent.click(screen.getByText(/Continue/i));

    expect(mockPush).toHaveBeenCalledWith('/signupUser');
  });

  test('selects Restaurant role and continues', () => {
    render(<SignUpRole />);

    fireEvent.click(screen.getByText(/Restaurant/i));
    fireEvent.click(screen.getByText(/Continue/i));

    expect(mockPush).toHaveBeenCalledWith('/signupRestaurant');
  });

  test('does not navigate if no option is selected', () => {
    render(<SignUpRole />);

    fireEvent.click(screen.getByText(/Continue/i));

    expect(mockPush).not.toHaveBeenCalled();
  });
});
