import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LoginForm } from '../LoginForm';
import { useAuthStore } from '../../../store/authStore';

// Mock del store
jest.mock('../../../store/authStore');

const mockUseAuthStore = useAuthStore as jest.MockedFunction<typeof useAuthStore>;

// Mock de react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Wrapper para proporcionar el Router
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock del store por defecto
    mockUseAuthStore.mockReturnValue({
      login: jest.fn(),
      user: null,
      isAuthenticated: false,
      users: [],
      register: jest.fn(),
      logout: jest.fn(),
    });
  });

  describe('Renderizado', () => {
    it('debe renderizar el formulario de login correctamente', () => {
      renderWithRouter(<LoginForm />);
      
      expect(screen.getByText('Refugio Cariño Animal')).toBeInTheDocument();
      expect(screen.getByLabelText(/correo electronico/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/contrasena/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
      expect(screen.getByText(/¿No tienes cuenta?/i)).toBeInTheDocument();
    });

    it('debe mostrar el ícono de PawPrint', () => {
      renderWithRouter(<LoginForm />);
      
      // Verificar que el ícono esté presente (por clase CSS)
      const iconElement = document.querySelector('.h-12.w-12.text-indigo-600');
      expect(iconElement).toBeInTheDocument();
    });
  });

  describe('Validaciones de formulario', () => {
    it('debe mostrar error cuando el email está vacío', async () => {
      renderWithRouter(<LoginForm />);
      
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Incluye un signo "@" en la dirección de correo electrónico./i)).toBeInTheDocument();
      });
    });

    it('debe mostrar error cuando el email no tiene formato válido', async () => {
      renderWithRouter(<LoginForm />);
      
      const emailInput = screen.getByLabelText(/correo electronico/i);
      fireEvent.change(emailInput, { target: { value: 'email-invalido' } });
      
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Incluye un signo "@" en la dirección de correo electrónico./i)).toBeInTheDocument();
      });
    });

    it('debe mostrar error cuando la contraseña es muy corta', async () => {
      renderWithRouter(<LoginForm />);
      
      const emailInput = screen.getByLabelText(/correo electronico/i);
      const passwordInput = screen.getByLabelText(/contrasena/i);
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: '123' } });
      
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/String must contain at least 6 character\(s\)/i)).toBeInTheDocument();
      });
    });

    it('debe aceptar email y contraseña válidos sin mostrar errores', async () => {
      renderWithRouter(<LoginForm />);
      
      const emailInput = screen.getByLabelText(/correo electronico/i);
      const passwordInput = screen.getByLabelText(/contrasena/i);
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: '123456' } });
      
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText(/Incluye un signo "@" en la dirección de correo electrónico./i)).not.toBeInTheDocument();
        expect(screen.queryByText(/String must contain at least 6 character\(s\)/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Funcionalidad de login', () => {
    it('debe llamar a login con credenciales correctas', async () => {
      const mockLogin = jest.fn().mockReturnValue({ success: true });
      mockUseAuthStore.mockReturnValue({
        login: mockLogin,
        user: null,
        isAuthenticated: false,
        users: [],
        register: jest.fn(),
        logout: jest.fn(),
      });

      renderWithRouter(<LoginForm />);
      
      const emailInput = screen.getByLabelText(/correo electronico/i);
      const passwordInput = screen.getByLabelText(/contrasena/i);
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: '123456' } });
      
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', '123456');
      });
    });

    it('debe navegar al dashboard cuando el login es exitoso', async () => {
      const mockLogin = jest.fn().mockReturnValue({ success: true });
      mockUseAuthStore.mockReturnValue({
        login: mockLogin,
        user: null,
        isAuthenticated: false,
        users: [],
        register: jest.fn(),
        logout: jest.fn(),
      });

      renderWithRouter(<LoginForm />);
      
      const emailInput = screen.getByLabelText(/correo electronico/i);
      const passwordInput = screen.getByLabelText(/contrasena/i);
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: '123456' } });
      
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('debe mostrar error cuando el login falla', async () => {
      const mockLogin = jest.fn().mockReturnValue({ 
        success: false, 
        error: 'Credenciales incorrectas o usuario no registrado.' 
      });
      mockUseAuthStore.mockReturnValue({
        login: mockLogin,
        user: null,
        isAuthenticated: false,
        users: [],
        register: jest.fn(),
        logout: jest.fn(),
      });

      renderWithRouter(<LoginForm />);
      
      const emailInput = screen.getByLabelText(/correo electronico/i);
      const passwordInput = screen.getByLabelText(/contrasena/i);
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: '123456' } });
      
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Credenciales incorrectas o usuario no registrado.')).toBeInTheDocument();
      });
    });

    it('debe mostrar mensaje genérico cuando no hay error específico', async () => {
      const mockLogin = jest.fn().mockReturnValue({ 
        success: false, 
        error: undefined 
      });
      mockUseAuthStore.mockReturnValue({
        login: mockLogin,
        user: null,
        isAuthenticated: false,
        users: [],
        register: jest.fn(),
        logout: jest.fn(),
      });

      renderWithRouter(<LoginForm />);
      
      const emailInput = screen.getByLabelText(/correo electronico/i);
      const passwordInput = screen.getByLabelText(/contrasena/i);
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: '123456' } });
      
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Credenciales incorrectas')).toBeInTheDocument();
      });
    });
  });

  describe('Navegación', () => {
    it('debe tener enlace para registro', () => {
      renderWithRouter(<LoginForm />);
      
      const registerLink = screen.getByText('Regístrate');
      expect(registerLink).toBeInTheDocument();
      expect(registerLink).toHaveAttribute('href', '/register');
    });
  });

  describe('Interacciones de usuario', () => {
    it('debe limpiar errores al cambiar campos', async () => {
      renderWithRouter(<LoginForm />);
      
      // Primero causar un error
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Incluye un signo "@" en la dirección de correo electrónico./i)).toBeInTheDocument();
      });

      // Luego corregir el error
      const emailInput = screen.getByLabelText(/correo electronico/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      await waitFor(() => {
        expect(screen.queryByText(/Incluye un signo "@" en la dirección de correo electrónico./i)).not.toBeInTheDocument();
      });
    });
  });
}); 