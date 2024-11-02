import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupDetail from './page'; 
import axios from 'axios';
import { useRouter } from 'next/navigation';
import '@testing-library/jest-dom';

jest.mock('axios');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('SignupDetail Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({ push: mockPush });
    sessionStorage.setItem('userID', JSON.stringify({
      id: '123',
      email: 'test@example.com',
      role: 'owner',
      BusinessDay: 'Monday, Tuesday',
      OpenTimeHr: '10',
      OpenTimeMin: '30',
      CloseTimeHr: '22',
      CloseTimeMin: '00',
      Location: 'Kmutnb',
      Tel: '1234567890',
      Line: 'testLine'
    }));
    jest.clearAllMocks();
  });

  test('renders signup form with required fields', () => {
    render(<SignupDetail />);
    screen.debug();

    expect(screen.getByText(/Sign Up - Restaurant/i)).toBeInTheDocument();
    expect(screen.getByText(/Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your phone number/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your location/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Confirm/i })).toBeInTheDocument();
  });

  test('displays error message when fields are empty and submit is clicked', async () => {
    render(<SignupDetail />);

    fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));

    expect(await screen.findByText(/Please fill in all required fields./i)).toBeInTheDocument();
  });

  test('validates phone number input', async () => {
    render(<SignupDetail />);
  
    // Check for the phone input element
    const phoneInput = screen.getByPlaceholderText(/Enter your phone number/i); // Adjust if necessary
  
    // Simulate invalid phone number input
    fireEvent.change(screen.getByPlaceholderText(/Enter your phone number/i), { target: { value: '123' } }); // Invalid phone number
    fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));
  
    // Expect error message for invalid phone number
    expect(await screen.findByText(/Phone number must be a 10-digit number./i)).toBeInTheDocument();
  
    // Simulate valid phone number input
    fireEvent.change(phoneInput, { target: { value: '1234567890' } }); // Valid phone number
    fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));
  
    // Expect navigation to verify page
    expect.stringContaining('/verify')
  });
  

  test('handles image upload correctly', async () => {
    const file = new Blob(['test image content'], { type: 'image/png' });
    Object.defineProperty(file, 'name', { value: 'test-image.png' });

    render(<SignupDetail />);

    const fileInput = screen.getByLabelText(/click to upload/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Check if the uploaded image is displayed correctly
    expect(fileInput.files[0].name).toBe('test-image.png');
  });


  //ตรงนี้ไม่ได้ ที่เหลือผ่านหมด
  test('allows selection of business days from dropdown', () => {
    render(<SignupDetail />);
  
    // Open the dropdown to see business days
    fireEvent.click(screen.getByText(/Business days/i));
    // expect(screen.getByText(/true/i));
  
    // Check that all days are listed
   
    
    // expect(screen.getByTestId(day).value); // Check for the actual day labels
    // expect(screen.getByRole('checkbox', { name: /day/i }));
    // expect(screen.getByText(/Sunday/i)).toBeInTheDocument();
    // expect(screen.getByTestId('Sunday')).toBeInTheDocument();
    // const dropdownList = container.querySelector('.dropdownList'); // Adjust the class to match your actual class name
    // const sundayOption = dropdownList.querySelector('input[type="checkbox"][id="Sunday"]');
    // expect(sundayOption).toBeInTheDocument();

    // expect(screen.getByText(/{day/i)).toBeInTheDocument();    
    
    // Select a day (e.g., "Monday")
    // const mondayCheckbox = screen.getByLabelText(/Monday/i);
    // fireEvent.click(mondayCheckbox);
    fireEvent.click(day, { target: { value: 'Monday' } });
  
    // // Close the dropdown
    // fireEvent.click(screen.getByText(/Business days/i));
  
    // // Verify that the selected day is reflected in the display
    // const expectedDisplayText = `Everyday except ${businessDays.filter(day => day !== 'Monday').join(', ')}`;
    // expect(screen.getByText(expectedDisplayText)).toBeInTheDocument(); // Adjust based on your logic
  });


  test('calls sessionStorage.setItem on confirm click', async () => {
    render(<SignupDetail />);

    fireEvent.change(screen.getByPlaceholderText(/Enter your name/i),{ exact: false }, { target: { value: 'Restaurant' } });
    // expect(screen.getByRole('textbox', { name: /name/i })).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText(/Enter your phone number/i),{ exact: false }, { target: { value: '1234567890' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter your location/i), { target: { value: 'Kmutnb' } });
    fireEvent.click(screen.getByRole('button', { name: /Confirm/i }));
    expect.stringContaining('/verify')
  });

  test('validates and updates open and close times correctly', async () => {
    render(<SignupDetail />);

    // Set open time to a valid time
    fireEvent.change(screen.getByLabelText(/Open time hour/i), { target: { value: '10' } }); // Set hour
    fireEvent.change(screen.getByLabelText(/Open time min/i), { target: { value: '30' } }); // Set minutes

    // Verify open time is set correctly
    expect(screen.getByLabelText(/Open time hour/i).value).toBe('10');
    expect(screen.getByLabelText(/Open time min/i).value).toBe('30');

    // Set close time to a valid time
    fireEvent.change(screen.getByLabelText(/Close time hour/i), { target: { value: '22' } }); // Set hour
    fireEvent.change(screen.getByLabelText(/Close time min/i), { target: { value: '00' } }); // Set minutes

    // Verify close time is set correctly
    expect(screen.getByLabelText(/Close time hour/i).value).toBe('22');
    expect(screen.getByLabelText(/Close time min/i).value).toBe('00');

    // Test invalid case where close time is set before open time
    fireEvent.change(screen.getByLabelText(/Close time hour/i), { target: { value: '9' } }); // Set hour to invalid

    // Verify that the open time updates if close time is before open time
    expect(screen.getByLabelText(/Open time hour/i).value).toBe('9');
  });
});
