import React from 'react';
import { useForm } from 'react-hook-form'; // Importamos el hook para manejo de formularios
import { zodResolver } from '@hookform/resolvers/zod'; // Para integrar la validación de Zod con React Hook Form
import { z } from 'zod'; // Zod es la librería para validaciones de datos
import { useAdoptionStore } from '../../store/adoptionStore'; // Importamos el estado global para las solicitudes de adopción
import { useAnimalStore } from '../../store/animalStore'; // Importamos el estado global para los animales disponibles

// Definimos el esquema de validación para el formulario utilizando Zod
const adoptionRequestSchema = z.object({
  animalId: z.string().min(1, 'Please select an animal'),// Validación para asegurar que se seleccione un animal
  adopterId: z.string().min(1, 'Adopter information is required'), // Validación para asegurar que se ingrese la información del adoptante
});
// Inferimos el tipo de datos para el formulario desde el esquema de validación
type AdoptionRequestFormData = z.infer<typeof adoptionRequestSchema>;
 // Extraemos la función para agregar solicitudes desde el estado global
export function AdoptionRequestForm() {
  const addRequest = useAdoptionStore((state) => state.addRequest);
  const animals = useAnimalStore((state) => 
    state.animals.filter((animal) => animal.adoptionStatus === 'available')
  );

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AdoptionRequestFormData>({
    resolver: zodResolver(adoptionRequestSchema),
  });

    // Función que se ejecuta al enviar el formulario
  const onSubmit = (data: AdoptionRequestFormData) => {
    addRequest({
      ...data, // Guardamos los datos del formulario
      status: 'pending', // Establecemos el estado de la solicitud como pendiente
    });
    reset(); // Reseteamos el formulario después de enviarlo
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900">Nueva peticion de adopcion</h2>

      <div>
        <label htmlFor="animalId" className="block text-sm font-medium text-gray-700">
          Selecciona animal
        </label>
        <select
          {...register('animalId')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Selecciona un animal...</option>
          {animals.map((animal) => (
            <option key={animal.id} value={animal.id}>
              {animal.name} - {animal.species}
            </option>
          ))}
        </select>
        {errors.animalId && (
          <p className="mt-1 text-sm text-red-600">{errors.animalId.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="adopterId" className="block text-sm font-medium text-gray-700">
          Informacion del adoptante
        </label>
        <input
          type="text"
          {...register('adopterId')}
          placeholder="Enter adopter's name or ID"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.adopterId && (
          <p className="mt-1 text-sm text-red-600">{errors.adopterId.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Subir peticion de adopcion
      </button>
    </form>
  );
}