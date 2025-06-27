import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { PawPrint } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Incluye un signo "@" en la dirección de correo electrónico.' }),
  password: z.string().min(6),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  // Se utiliza el hook useNavigate de React Router para poder navegar entre rutas.
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const [error, setError] = React.useState<string | null>(null);

  // Recibe los datos del formulario (data), realiza el login y luego navega a la ruta del dashboard.
  const onSubmit = (data: LoginFormData) => {
    setError(null);
    const result = login(data.email, data.password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error ?? 'Credenciales incorrectas');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <PawPrint className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Refugio Cariño Animal
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electronico
              </label>
              <div className="mt-1">
                <input
                  {...register('email')}
                  type="email"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                contrasena
              </label>
              <div className="mt-1">
                <input
                  {...register('password')}
                  type="password"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
            </div>
            <div className="text-sm text-center mt-2">
              ¿No tienes cuenta?{' '}
              <a href="/register" className="text-indigo-600 hover:underline">Regístrate</a>
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}