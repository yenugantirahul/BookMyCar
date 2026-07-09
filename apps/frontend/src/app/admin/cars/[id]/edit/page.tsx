'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers';
import { getCar, updateCar, uploadCarImage, deleteCarImage } from '@/lib/api';
import type { Car } from '@/types';
import { CarForm } from '@/components/admin/car-form';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { ErrorMessage } from '@/components/shared/error-message';
import Link from 'next/link';
import { ArrowLeft, Camera, Trash2, CheckCircle2 } from 'lucide-react';

export default function AdminEditCarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { session } = useAuth();

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form submit state
  const [submitLoading, setSubmitLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Images upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isPrimaryImage, setIsPrimaryImage] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const loadCar = () => {
    setLoading(true);
    setError(null);
    getCar(id)
      .then((res) => {
        if (res.success) {
          setCar(res.data);
        } else {
          setError(res.error?.message ?? 'Vehicle not found');
        }
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch vehicle details');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCar();
  }, [id]);

  const handleSubmit = async (payload: any) => {
    if (!session) return;
    setSubmitLoading(true);
    setUpdateSuccess(false);

    try {
      const res = await updateCar(id, payload, session.access_token);
      if (res.success) {
        setCar(res.data);
        setUpdateSuccess(true);
      } else {
        throw new Error(res.error?.message ?? 'Failed to update vehicle');
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleImageUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile || !session || !car) return;

    setImageLoading(true);
    setImageError(null);

    try {
      const res = await uploadCarImage(car.id, imageFile, isPrimaryImage, session.access_token);
      if (res.success) {
        setImageFile(null);
        setIsPrimaryImage(false);
        // Reset file input
        const fileInput = document.getElementById('car-image-file') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        loadCar(); // Refresh images list
      } else {
        setImageError(res.error?.message ?? 'Upload failed');
      }
    } catch (err: any) {
      setImageError(err.message || 'Something went wrong during image upload');
    } finally {
      setImageLoading(false);
    }
  };

  const handleSetPrimary = async (imageId: string) => {
    if (!session || !car) return;

    try {
      const res = await fetch(`/api/v1/cars/${car.id}/images/${imageId}/primary`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const data = await res.json();
      if (data.success) {
        loadCar();
      } else {
        alert(data.error?.message ?? 'Failed to set primary image');
      }
    } catch (err: any) {
      alert(err.message || 'Error setting primary image');
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!session || !car || !confirm('Are you sure you want to delete this image?')) return;

    try {
      const res = await deleteCarImage(car.id, imageId, session.access_token);
      if (res.success) {
        loadCar();
      } else {
        alert(res.error?.message ?? 'Failed to delete image');
      }
    } catch (err: any) {
      alert(err.message || 'Error deleting image');
    }
  };

  if (loading) return <div className="py-24"><LoadingSpinner message="Loading vehicle information..." /></div>;
  if (error || !car) return <div className="py-24"><ErrorMessage message={error ?? 'Vehicle not found'} retry={loadCar} /></div>;

  return (
    <div className="space-y-6">
      <Link
        href="/admin/cars"
        className="inline-flex items-center space-x-1.5 text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Fleet</span>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Edit Vehicle: {car.make} {car.model}
          </h1>
          <p className="text-gray-500 mt-1">Configure vehicle parameters and manage gallery images.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Core Specs Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
              {updateSuccess && (
                <div className="p-3 bg-green-50 text-green-700 text-sm rounded border border-green-200 flex items-center space-x-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Specs updated successfully!</span>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <CarForm
                initialData={car}
                onSubmit={handleSubmit}
                loading={submitLoading}
                submitButtonText="Save Specifications"
              />
            </CardContent>
          </Card>
        </div>

        {/* Media / Images Gallery Management */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Images</CardTitle>
              <CardDescription>Add new photos to the vehicle gallery.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleImageUpload} className="space-y-4">
                {imageError && <p className="text-red-700 text-xs">{imageError}</p>}
                <div>
                  <Label htmlFor="car-image-file">Choose Image File</Label>
                  <Input
                    id="car-image-file"
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                    required
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    id="is-primary-checkbox"
                    type="checkbox"
                    checked={isPrimaryImage}
                    onChange={(e) => setIsPrimaryImage(e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <Label htmlFor="is-primary-checkbox" className="cursor-pointer text-sm">
                    Set as Primary (Hero) Image
                  </Label>
                </div>
                <Button type="submit" disabled={imageLoading || !imageFile} className="w-full">
                  <Camera className="h-4 w-4 mr-1.5" />
                  <span>{imageLoading ? 'Uploading...' : 'Upload Image'}</span>
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gallery Management</CardTitle>
              <CardDescription>Existing vehicle photos ({car.images?.length ?? 0} total)</CardDescription>
            </CardHeader>
            <CardContent>
              {(!car.images || car.images.length === 0) ? (
                <p className="text-sm text-gray-400 text-center py-6">No images uploaded yet.</p>
              ) : (
                <div className="space-y-4">
                  {car.images.map((img) => (
                    <div key={img.id} className="flex items-center justify-between border p-3 rounded-lg bg-gray-50/50">
                      <div className="flex items-center space-x-3">
                        <img src={img.url} alt="Thumbnail" className="h-10 w-16 object-cover rounded border" />
                        <div>
                          {img.isPrimary ? (
                            <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                              Primary
                            </span>
                          ) : (
                            <button
                              onClick={() => handleSetPrimary(img.id)}
                              className="text-xs text-blue-600 hover:underline font-semibold"
                            >
                              Make Primary
                            </button>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteImage(img.id)}
                        className="text-gray-400 hover:text-red-600 p-1.5 rounded transition-colors"
                        title="Delete Image"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
