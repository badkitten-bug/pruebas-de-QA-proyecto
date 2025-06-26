import React from 'react';
import { useAnimalStore } from '../../store/animalStore';
import { Activity, Heart } from 'lucide-react';

export function AnimalsList() {
  //Aquí se está utilizando useAnimalStore, esto es un hook personalizado para acceder al estado global de los animales
  const animals = useAnimalStore((state) => state.animals);

  const getStatusColor = (status: string) => {
    const colors = {
      healthy: 'bg-green-100 text-green-800',
      sick: 'bg-red-100 text-red-800',
      recovering: 'bg-yellow-100 text-yellow-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Animals in Care</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {animals.length === 0 ? (
          <p className="p-4 text-gray-500 text-center">No animals registered yet</p>
        ) : (
          animals.map((animal) => (
            <div key={animal.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                {animal.imageUrl ? (
                  <img
                    src={animal.imageUrl}
                    alt={animal.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-xl">{animal.name[0]}</span>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{animal.name}</h3>
                  <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                    <span>{animal.species}</span>
                    {animal.breed && <span>• {animal.breed}</span>}
                    {animal.age && <span>• {animal.age} years old</span>}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(animal.healthStatus)}`}>
                    <Activity className="mr-1 h-4 w-4" />
                    {animal.healthStatus}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    animal.adoptionStatus === 'available' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    <Heart className="mr-1 h-4 w-4" />
                    {animal.adoptionStatus}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}