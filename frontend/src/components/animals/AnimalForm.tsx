import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAnimalStore } from '../../store/animalStore';
import type { Animal } from '../../types';
import { ImageUpload } from './ImageUpload';

// Definimos el esquema de validación utilizando Zod
const animalSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  species: z.string().min(1, 'Species is required'),
  breed: z.string().optional(),
  age: z.number().min(0).optional(),
  healthStatus: z.enum(['healthy', 'sick', 'recovering', 'critical']),
});
// Inferimos el tipo de datos del formulario a partir del esquema de validación
type AnimalFormData = z.infer<typeof animalSchema>;

export function AnimalForm() {
// Usamos el store de animales para agregar un nuevo animal
  const addAnimal = useAnimalStore((state) => state.addAnimal);
  // Configuramos el formulario utilizando react-hook-form y Zod para la validación
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AnimalFormData>({
    resolver: zodResolver(animalSchema), // Usamos Zod como validador del formulario
  });
  // Mantenemos el estado para la URL de la imagen del animal
  const [imageUrl, setImageUrl] = React.useState<string>();

  const onSubmit = (data: AnimalFormData) => {
     // Creamos un objeto `newAnimal` con los datos del formulario y algunos valores adicionales predeterminados
    const newAnimal: Omit<Animal, 'id'> = {
      ...data,
      intakeDate: new Date(),
      medicalHistory: [],
      adoptionStatus: 'available',
      imageUrl,
    };
    addAnimal(newAnimal);
    reset();    // Reseteamos el formulario para limpiar los campos después de la sumisión
    setImageUrl(undefined);// Limpiamos la URL de la imagen
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900">Registra nuevo animal</h2>
      
      <ImageUpload onImageSelect={setImageUrl} currentImage={imageUrl} />

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
        <input
          type="text"
          {...register('name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="species" className="block text-sm font-medium text-gray-700">especie</label>
        <input
          type="text"
          {...register('species')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.species && <p className="mt-1 text-sm text-red-600">{errors.species.message}</p>}
      </div>

      <div>
        <label htmlFor="breed" className="block text-sm font-medium text-gray-700">raza (optional)</label>
        <input
          type="text"
          {...register('breed')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-700">edad (optional)</label>
        <input
          type="number"
          {...register('age', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="healthStatus" className="block text-sm font-medium text-gray-700">estado de salud</label>
        <select
          {...register('healthStatus')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="healthy">Healthy</option>
          <option value="sick">Sick</option>
          <option value="recovering">Recovering</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Registra animal
      </button>
    </form>
  );
}