import { useRef, useState } from 'react';
import type { VenueImage } from '../types/venue.types';
import {
  useUploadVenueImageMutation, useDeleteVenueImageMutation, useSetCoverImageMutation,
} from '../useVenueImageMutations';

interface VenueImageManagerProps {
  venueId: string;
  images: VenueImage[];
}

// Client-side check is UX only — catches an obviously-too-big file before
// wasting an upload round trip. The server's own 5MB limit (upload.ts) is
// the real enforcement boundary; this duplication is intentional, same
// pattern as frontend/backend Zod validation throughout this project.
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export function VenueImageManager({ venueId, images }: VenueImageManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadMutation = useUploadVenueImageMutation(venueId);
  const deleteMutation = useDeleteVenueImageMutation(venueId);
  const coverMutation = useSetCoverImageMutation(venueId);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError('Image must be 5MB or smaller.');
      return;
    }
    setError(null);
    uploadMutation.mutate(file, {
      onError: () => setError('Upload failed. Please try a different image.'),
    });
  }

  return (
    <div className="mt-6 space-y-3">
      <h2 className="font-semibold">Photos</h2>

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((image) => (
            <div key={image.id} className="relative overflow-hidden rounded-lg border">
              <img src={image.url} alt="" className="h-32 w-full object-cover" />
              {image.isCover && (
                <span className="absolute left-1 top-1 rounded bg-blue-600 px-1.5 py-0.5 text-xs text-white">
                  Cover
                </span>
              )}
              <div className="flex items-center justify-between gap-1 bg-white/90 p-1 text-xs">
                {!image.isCover && (
                  <button
                    type="button"
                    onClick={() => coverMutation.mutate(image.id)}
                    disabled={coverMutation.isPending}
                    className="text-blue-600 hover:underline disabled:opacity-50"
                  >
                    Set as cover
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(image.id)}
                  disabled={deleteMutation.isPending}
                  className="ml-auto text-red-600 hover:underline disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          disabled={uploadMutation.isPending}
          className="text-sm"
        />
        {uploadMutation.isPending && <p className="mt-1 text-sm text-gray-500">Uploading…</p>}
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}