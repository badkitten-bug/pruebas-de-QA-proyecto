import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAnimalStore } from '../../store/animalStore';
import type { MedicalRecord } from '../../types';

// Utilizamos Zod para asegurar que los campos requeridos no estén vacíos.
const medicalRecordSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  treatment: z.string().min(1, 'Treatment is required'),
  veterinarian: z.string().min(1, 'Veterinarian name is required'),
});
// Definimos el tipo de datos que usará el formulario basado en el esquema de validación anterior.
type MedicalRecordFormData = z.infer<typeof medicalRecordSchema>;

interface Props {
  animalId: string;
  onSuccess?: () => void;
}

// Componente para registrar el historial médico de un animal.
export function MedicalRecordForm({ animalId, onSuccess }: Props) {
   // Se extrae la función addMedicalRecord desde el store para agregar el historial médico.
  const addMedicalRecord = useAnimalStore((state) => state.addMedicalRecord);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<MedicalRecordFormData>({
    resolver: zodResolver(medicalRecordSchema),
  });

   // Esta función se ejecuta al enviar el formulario. Toma los datos, agrega la fecha y luego llama a la acción para añadir el historial médico.
  const onSubmit = (data: MedicalRecordFormData) => {
    const newRecord: Omit<MedicalRecord, 'id'> = {
      ...data,
      date: new Date(),
    };
     // Llamamos a la función de la tienda para agregar el registro médico del animal
    addMedicalRecord(animalId, newRecord);
    reset();
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripcion</label>
        <textarea
          {...register('description')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
      </div>

      <div>
        <label htmlFor="treatment" className="block text-sm font-medium text-gray-700">Tratamiento</label>
        <textarea
          {...register('treatment')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.treatment && <p className="mt-1 text-sm text-red-600">{errors.treatment.message}</p>}
      </div>

      <div>
        <label htmlFor="veterinarian" className="block text-sm font-medium text-gray-700">Veterinario</label>
        <input
          type="text"
          {...register('veterinarian')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.veterinarian && <p className="mt-1 text-sm text-red-600">{errors.veterinarian.message}</p>}
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        agregar registro medico
      </button>
    </form>
  );
}