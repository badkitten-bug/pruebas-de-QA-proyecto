import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { PawPrint } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre es obligatorio'),
  apellido: z.string().min(2, 'El apellido es obligatorio'),
  email: z.string().email('Email inválido'),
  retypeEmail: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  rePassword: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
}).refine((data) => data.email === data.retypeEmail, {
  message: 'Los emails no coinciden',
  path: ['retypeEmail'],
}).refine((data) => data.password === data.rePassword, {
  message: 'Las contraseñas no coinciden',
  path: ['rePassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });
  const { register: registerUser } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onSubmit = (data: RegisterFormData) => {
    setError(null);
    setSuccess(false);
    const result = registerUser({
      id: crypto.randomUUID(),
      name: data.name + ' ' + data.apellido,
      email: data.email,
      password: data.password,
      role: 'adopter',
    });
    if (!result.success) {
      setError(result.error || 'Error desconocido');
    } else {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <PawPrint className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Registro de Usuario
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
              <input {...register('name')} id="name" className="block w-full px-3 py-2 border rounded-md" />
              {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
            </div>
            <div>
              <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">Apellido</label>
              <input {...register('apellido')} id="apellido" className="block w-full px-3 py-2 border rounded-md" />
              {errors.apellido && <p className="text-sm text-red-600">{errors.apellido.message}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input {...register('email')} id="email" type="email" className="block w-full px-3 py-2 border rounded-md" />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="retypeEmail" className="block text-sm font-medium text-gray-700">Repetir Email</label>
              <input {...register('retypeEmail')} id="retypeEmail" type="email" className="block w-full px-3 py-2 border rounded-md" />
              {errors.retypeEmail && <p className="text-sm text-red-600">{errors.retypeEmail.message}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input {...register('password')} id="password" type="password" className="block w-full px-3 py-2 border rounded-md" />
              {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
            </div>
            <div>
              <label htmlFor="rePassword" className="block text-sm font-medium text-gray-700">Repetir Contraseña</label>
              <input {...register('rePassword')} id="rePassword" type="password" className="block w-full px-3 py-2 border rounded-md" />
              {errors.rePassword && <p className="text-sm text-red-600">{errors.rePassword.message}</p>}
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">¡Registro exitoso! Redirigiendo...</div>}
            <div>
              <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Registrarse
              </button>
            </div>
            <div className="text-sm text-center">
              ¿Ya tienes cuenta?{' '}
              <a href="/login" className="text-indigo-600 hover:underline">Inicia sesión</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 