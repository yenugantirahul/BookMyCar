import { FolderOpen } from 'lucide-react';
import React from 'react';

export function EmptyState({
  title = 'No items found',
  description = 'Try adjusting your search or filters to find what you are looking for.',
  action,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-lg bg-gray-50/50 min-h-[300px] max-w-md mx-auto space-y-4">
      <div className="p-3 bg-gray-100 rounded-full text-gray-400">
        <FolderOpen className="h-8 w-8" />
      </div>
      <div className="space-y-1">
        <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
        <p className="text-sm text-gray-500 max-w-xs">{description}</p>
      </div>
      {action}
    </div>
  );
}
