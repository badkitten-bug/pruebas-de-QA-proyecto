import React from 'react';
import { useAdoptionStore } from '../../store/adoptionStore';
import { useAnimalStore } from '../../store/animalStore';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

export function AdoptionRequestList() {
  // Extraemos las solicitudes de adopción y la función para actualizar el estado desde el store de adopciones
  const adoptionRequests = useAdoptionStore((state) => state.adoptionRequests);
  const updateStatus = useAdoptionStore((state) => state.updateStatus);
  // Extraemos los animales disponibles desde el store de animales
  const animals = useAnimalStore((state) => state.animals);

   // Función que devuelve el color adecuado según el estado de la solicitud (pendiente, aprobada o rechazada)
  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // Función que devuelve el nombre del animal correspondiente a un `animalId`
  const getAnimalName = (animalId: string) => {
    // Buscamos el animal en el array de animales usando el `animalId`
    return animals.find((animal) => animal.id === animalId)?.name || 'Unknown Animal'; // Si no se encuentra el animal, devolvemos 'Unknown Animal'
  };
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">peticion de Adoption </h2>
      </div>
      <div className="divide-y divide-gray-200">
        {adoptionRequests.length === 0 ? (
          <p className="p-4 text-gray-500 text-center">sin peticiones de adopcion</p>
        ) : (
          adoptionRequests.map((request) => (
            <div key={request.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {getAnimalName(request.animalId)}
                  </h3>
                  <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                    <span>Submitted: {request.submissionDate.toLocaleDateString()}</span>
                    <span>Last Updated: {request.lastUpdated.toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      request.status
                    )}`}
                  >
                    <Clock className="mr-1 h-4 w-4" />
                    {request.status}
                  </span>
                  {request.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateStatus(request.id, 'approved')}
                        className="p-1 text-green-600 hover:text-green-800"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => updateStatus(request.id, 'rejected')}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}