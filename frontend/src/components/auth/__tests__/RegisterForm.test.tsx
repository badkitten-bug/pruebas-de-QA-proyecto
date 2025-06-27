import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { RegisterForm } from '../RegisterForm';
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

// Mock de crypto.randomUUID
Object.defineProperty(window, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-123',
  },
});

// Wrapper para proporcionar el Router
const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('RegisterForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock del store por defecto
    mockUseAuthStore.mockReturnValue({
      register: jest.fn(),
      login: jest.fn(),
      user: null,
      isAuthenticated: false,
      users: [],
      logout: jest.fn(),
    });
  });

  describe('Renderizado', () => {
    it('debe renderizar el formulario de registro correctamente', () => {
      renderWithRouter(<RegisterForm />);
      
      expect(screen.getByText('Registro de Usuario')).toBeInTheDocument();
      expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
      expect(screen.getByLabelText('Apellido')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Repetir Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
      expect(screen.getByLabelText('Repetir Contraseña')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument();
      expect(screen.getByText(/¿Ya tienes cuenta?/i)).toBeInTheDocument();
    });

    it('debe mostrar el ícono de PawPrint', () => {
      renderWithRouter(<RegisterForm />);
      
      const iconElement = document.querySelector('.h-12.w-12.text-indigo-600');
      expect(iconElement).toBeInTheDocument();
    });
  });

  describe('Validaciones de formulario', () => {
    it('debe mostrar error cuando el nombre está vacío', async () => {
      renderWithRouter(<RegisterForm />);
      
      const submitButton = screen.getByRole('button', { name: /registrarse/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('El nombre es obligatorio')).toBeInTheDocument();
      });
    });

    it('debe mostrar error cuando el apellido está vacío', async () => {
      renderWithRouter(<RegisterForm />);
      
      const submitButton = screen.getByRole('button', { name: /registrarse/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('El apellido es obligatorio')).toBeInTheDocument();
      });
    });

    it('debe mostrar error cuando el email no es válido', async () => {
      renderWithRouter(<RegisterForm />);
      
      const emailInput = screen.getByLabelText('Email');
      fireEvent.change(emailInput, { target: { value: 'email-invalido' } });
      
      const submitButton = screen.getByRole('button', { name: /registrarse/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Email inválido')).toBeInTheDocument();
      });
    });

    it('debe mostrar error cuando los emails no coinciden', async () => {
      renderWithRouter(<RegisterForm />);
      
      const emailInput = screen.getByLabelText('Email');
      const retypeEmailInput = screen.getByLabelText('Repetir Email');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(retypeEmailInput, { target: { value: 'different@example.com' } });
      
      const submitButton = screen.getByRole('button', { name: /registrarse/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Los emails no coinciden')).toBeInTheDocument();
      });
    });

    it('debe mostrar error cuando la contraseña es muy corta', async () => {
      renderWithRouter(<RegisterForm />);
      
      const passwordInput = screen.getByLabelText('Contraseña');
      fireEvent.change(passwordInput, { target: { value: '123' } });
      
      const submitButton = screen.getByRole('button', { name: /registrarse/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('La contraseña debe tener al menos 6 caracteres')).toBeInTheDocument();
      });
    });

    it('debe mostrar error cuando las contraseñas no coinciden', async () => {
      renderWithRouter(<RegisterForm />);
      
      const passwordInput = screen.getByLabelText('Contraseña');
      const rePasswordInput = screen.getByLabelText('Repetir Contraseña');
      
      fireEvent.change(passwordInput, { target: { value: '123456' } });
      fireEvent.change(rePasswordInput, { target: { value: '654321' } });
      
      const submitButton = screen.getByRole('button', { name: /registrarse/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument();
      });
    });

    it('debe aceptar datos válidos sin mostrar errores', async () => {
      renderWithRouter(<RegisterForm />);
      
      const nameInput = screen.getByLabelText('Nombre');
      const apellidoInput = screen.getByLabelText('Apellido');
      const emailInput = screen.getByLabelText('Email');
      const retypeEmailInput = screen.getByLabelText('Repetir Email');
      const passwordInput = screen.getByLabelText('Contraseña');
      const rePasswordInput = screen.getByLabelText('Repetir Contraseña');
      
      fireEvent.change(nameInput, { target: { value: 'Juan' } });
      fireEvent.change(apellidoInput, { target: { value: 'Pérez' } });
      fireEvent.change(emailInput, { target: { value: 'juan@example.com' } });
      fireEvent.change(retypeEmailInput, { target: { value: 'juan@example.com' } });
      fireEvent.change(passwordInput, { target: { value: '123456' } });
      fireEvent.change(rePasswordInput, { target: { value: '123456' } });
      
      const submitButton = screen.getByRole('button', { name: /registrarse/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText('El nombre es obligatorio')).not.toBeInTheDocument();
        expect(screen.queryByText('El apellido es obligatorio')).not.toBeInTheDocument();
        expect(screen.queryByText('Email inválido')).not.toBeInTheDocument();
        expect(screen.queryByText('Los emails no coinciden')).not.toBeInTheDocument();
        expect(screen.queryByText('La contraseña debe tener al menos 6 caracteres')).not.toBeInTheDocument();
        expect(screen.queryByText('Las contraseñas no coinciden')).not.toBeInTheDocument();
      });
    });
  });

  describe('Funcionalidad de registro', () => {
    it('debe llamar a register con datos correctos', async () => {
      const mockRegister = jest.fn().mockReturnValue({ success: true });
      mockUseAuthStore.mockReturnValue({
        register: mockRegister,
        login: jest.fn(),
        user: null,
        isAuthenticated: false,
        users: [],
        logout: jest.fn(),
      });

      renderWithRouter(<RegisterForm />);
      
      const nameInput = screen.getByLabelText('Nombre');
      const apellidoInput = screen.getByLabelText('Apellido');
      const emailInput = screen.getByLabelText('Email');
      const retypeEmailInput = screen.getByLabelText('Repetir Email');
      const passwordInput = screen.getByLabelText('Contraseña');
      const rePasswordInput = screen.getByLabelText('Repetir Contraseña');
      
      fireEvent.change(nameInput, { target: { value: 'Juan' } });
      fireEvent.change(apellidoInput, { target: { value: 'Pérez' } });
      fireEvent.change(emailInput, { target: { value: 'juan@example.com' } });
      fireEvent.change(retypeEmailInput, { target: { value: 'juan@example.com' } });
      fireEvent.change(passwordInput, { target: { value: '123456' } });
      fireEvent.change(rePasswordInput, { target: { value: '123456' } });
      
      const submitButton = screen.getByRole('button', { name: /registrarse/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith({
          id: 'test-uuid-123',
          name: 'Juan Pérez',
          email: 'juan@example.com',
          password: '123456',
          role: 'adopter',
        });
      });
    });

    it('debe mostrar mensaje de éxito cuando el registro es exitoso', async () => {
      const mockRegister = jest.fn().mockReturnValue({ success: true });
      mockUseAuthStore.mockReturnValue({
        register: mockRegister,
        login: jest.fn(),
        user: null,
        isAuthenticated: false,
        users: [],
        logout: jest.fn(),
      });

      renderWithRouter(<RegisterForm />);
      
      const nameInput = screen.getByLabelText('Nombre');
      const apellidoInput = screen.getByLabelText('Apellido');
      const emailInput = screen.getByLabelText('Email');
      const retypeEmailInput = screen.getByLabelText('Repetir Email');
      const passwordInput = screen.getByLabelText('Contraseña');
      const rePasswordInput = screen.getByLabelText('Repetir Contraseña');
      
      fireEvent.change(nameInput, { target: { value: 'Juan' } });
      fireEvent.change(apellidoInput, { target: { value: 'Pérez' } });
      fireEvent.change(emailInput, { target: { value: 'juan@example.com' } });
      fireEvent.change(retypeEmailInput, { target: { value: 'juan@example.com' } });
      fireEvent.change(passwordInput, { target: { value: '123456' } });
      fireEvent.change(rePasswordInput, { target: { value: '123456' } });
      
      const submitButton = screen.getByRole('button', { name: /registrarse/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('¡Registro exitoso! Redirigiendo...')).toBeInTheDocument();
      });
    });

    it('debe navegar al login después del registro exitoso', async () => {
      const mockRegister = jest.fn().mockReturnValue({ success: true });
      mockUseAuthStore.mockReturnValue({
        register: mockRegister,
        login: jest.fn(),
        user: null,
        isAuthenticated: false,
        users: [],
        logout: jest.fn(),
      });

      renderWithRouter(<RegisterForm />);
      
      const nameInput = screen.getByLabelText('Nombre');
      const apellidoInput = screen.getByLabelText('Apellido');
      const emailInput = screen.getByLabelText('Email');
      const retypeEmailInput = screen.getByLabelText('Repetir Email');
      const passwordInput = screen.getByLabelText('Contraseña');
      const rePasswordInput = screen.getByLabelText('Repetir Contraseña');
      
      fireEvent.change(nameInput, { target: { value: 'Juan' } });
      fireEvent.change(apellidoInput, { target: { value: 'Pérez' } });
      fireEvent.change(emailInput, { target: { value: 'juan@example.com' } });
      fireEvent.change(retypeEmailInput, { target: { value: 'juan@example.com' } });
      fireEvent.change(passwordInput, { target: { value: '123456' } });
      fireEvent.change(rePasswordInput, { target: { value: '123456' } });
      
      const submitButton = screen.getByRole('button', { name: /registrarse/i });
      fireEvent.click(submitButton);

      // Esperar el timeout de 1500ms
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      }, { timeout: 2000 });
    });

    it('debe mostrar error cuando el registro falla', async () => {
      const mockRegister = jest.fn().mockReturnValue({ 
        success: false, 
        error: 'El email ya está registrado.' 
      });
      mockUseAuthStore.mockReturnValue({
        register: mockRegister,
        login: jest.fn(),
        user: null,
        isAuthenticated: false,
        users: [],
        logout: jest.fn(),
      });

      renderWithRouter(<RegisterForm />);
      
      const nameInput = screen.getByLabelText('Nombre');
      const apellidoInput = screen.getByLabelText('Apellido');
      const emailInput = screen.getByLabelText('Email');
      const retypeEmailInput = screen.getByLabelText('Repetir Email');
      const passwordInput = screen.getByLabelText('Contraseña');
      const rePasswordInput = screen.getByLabelText('Repetir Contraseña');
      
      fireEvent.change(nameInput, { target: { value: 'Juan' } });
      fireEvent.change(apellidoInput, { target: { value: 'Pérez' } });
      fireEvent.change(emailInput, { target: { value: 'juan@example.com' } });
      fireEvent.change(retypeEmailInput, { target: { value: 'juan@example.com' } });
      fireEvent.change(passwordInput, { target: { value: '123456' } });
      fireEvent.change(rePasswordInput, { target: { value: '123456' } });
      
      const submitButton = screen.getByRole('button', { name: /registrarse/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('El email ya está registrado.')).toBeInTheDocument();
      });
    });

    it('debe mostrar mensaje genérico cuando no hay error específico', async () => {
      const mockRegister = jest.fn().mockReturnValue({ 
        success: false, 
        error: undefined 
      });
      mockUseAuthStore.mockReturnValue({
        register: mockRegister,
        login: jest.fn(),
        user: null,
        isAuthenticated: false,
        users: [],
        logout: jest.fn(),
      });

      renderWithRouter(<RegisterForm />);
      
      const nameInput = screen.getByLabelText('Nombre');
      const apellidoInput = screen.getByLabelText('Apellido');
      const emailInput = screen.getByLabelText('Email');
      const retypeEmailInput = screen.getByLabelText('Repetir Email');
      const passwordInput = screen.getByLabelText('Contraseña');
      const rePasswordInput = screen.getByLabelText('Repetir Contraseña');
      
      fireEvent.change(nameInput, { target: { value: 'Juan' } });
      fireEvent.change(apellidoInput, { target: { value: 'Pérez' } });
      fireEvent.change(emailInput, { target: { value: 'juan@example.com' } });
      fireEvent.change(retypeEmailInput, { target: { value: 'juan@example.com' } });
      fireEvent.change(passwordInput, { target: { value: '123456' } });
      fireEvent.change(rePasswordInput, { target: { value: '123456' } });
      
      const submitButton = screen.getByRole('button', { name: /registrarse/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Error desconocido')).toBeInTheDocument();
      });
    });
  });

  describe('Navegación', () => {
    it('debe tener enlace para login', () => {
      renderWithRouter(<RegisterForm />);
      
      const loginLink = screen.getByText('Inicia sesión');
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute('href', '/login');
    });
  });

  describe('Interacciones de usuario', () => {
    it('debe limpiar errores al cambiar campos', async () => {
      renderWithRouter(<RegisterForm />);
      
      // Primero causar un error
      const submitButton = screen.getByRole('button', { name: /registrarse/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('El nombre es obligatorio')).toBeInTheDocument();
      });

      // Luego corregir el error
      const nameInput = screen.getByLabelText('Nombre');
      fireEvent.change(nameInput, { target: { value: 'Juan' } });

      await waitFor(() => {
        expect(screen.queryByText('El nombre es obligatorio')).not.toBeInTheDocument();
      });
    });

    it('debe limpiar mensajes de éxito al enviar nuevo formulario', async () => {
      const mockRegister = jest.fn()
        .mockReturnValueOnce({ success: true })
        .mockReturnValueOnce({ success: false, error: 'Error' });
      
      mockUseAuthStore.mockReturnValue({
        register: mockRegister,
        login: jest.fn(),
        user: null,
        isAuthenticated: false,
        users: [],
        logout: jest.fn(),
      });

      renderWithRouter(<RegisterForm />);
      
      const nameInput = screen.getByLabelText('Nombre');
      const apellidoInput = screen.getByLabelText('Apellido');
      const emailInput = screen.getByLabelText('Email');
      const retypeEmailInput = screen.getByLabelText('Repetir Email');
      const passwordInput = screen.getByLabelText('Contraseña');
      const rePasswordInput = screen.getByLabelText('Repetir Contraseña');
      
      // Primer envío exitoso
      fireEvent.change(nameInput, { target: { value: 'Juan' } });
      fireEvent.change(apellidoInput, { target: { value: 'Pérez' } });
      fireEvent.change(emailInput, { target: { value: 'juan@example.com' } });
      fireEvent.change(retypeEmailInput, { target: { value: 'juan@example.com' } });
      fireEvent.change(passwordInput, { target: { value: '123456' } });
      fireEvent.change(rePasswordInput, { target: { value: '123456' } });
      
      const submitButton = screen.getByRole('button', { name: /registrarse/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('¡Registro exitoso! Redirigiendo...')).toBeInTheDocument();
      });

      // Segundo envío con error
      fireEvent.change(emailInput, { target: { value: 'juan2@example.com' } });
      fireEvent.change(retypeEmailInput, { target: { value: 'juan2@example.com' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText('¡Registro exitoso! Redirigiendo...')).not.toBeInTheDocument();
        expect(screen.getByText('Error')).toBeInTheDocument();
      });
    });
  });
}); 