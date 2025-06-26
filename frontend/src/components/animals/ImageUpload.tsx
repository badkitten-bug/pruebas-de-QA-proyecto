import React, { useRef } from 'react';
import { Upload } from 'lucide-react';


// La propiedad 'onImageSelect' es una función que recibe la imagen en formato base64.
// 'currentImage' es una propiedad opcional que permite mostrar una imagen actual.
interface ImageUploadProps {
  onImageSelect: (base64Image: string) => void;
  currentImage?: string;
}
// El componente ImageUpload permite al usuario cargar una imagen y la pasa como base64 a la función 'onImageSelect'.
export function ImageUpload({ onImageSelect, currentImage }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Este manejador se activa cuando el usuario selecciona un archivo.
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
       // Obtener el primer archivo de la lista de archivos seleccionados.
    const file = event.target.files?.[0];
    // Si un archivo ha sido seleccionado, procedemos a leerlo.
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onImageSelect(base64String);
      };
        // Iniciar la lectura del archivo como URL de datos (base64).
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      {currentImage ? (
        <div className="relative group">
          <img
            src={currentImage}
            alt="Animal"
            className="w-full h-48 object-cover rounded-lg"
          />
          <div
            className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-8 w-8 text-white" />
          </div>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-8 w-8 mx-auto text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">Click para subir image</p>
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}