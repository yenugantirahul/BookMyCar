import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ErrorMessage({
  title = 'An error occurred',
  message,
  retry,
}: {
  title?: string;
  message: string;
  retry?: () => void;
}) {
  return (
    <div className="p-6 border border-red-100 bg-red-50/50 rounded-lg max-w-md mx-auto flex items-start space-x-4">
      <div className="p-2 bg-red-100 text-red-700 rounded-full shrink-0">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <div className="space-y-3">
        <div className="space-y-1">
          <h4 className="font-semibold text-red-900">{title}</h4>
          <p className="text-sm text-red-700">{message}</p>
        </div>
        {retry && (
          <Button variant="outline" size="sm" onClick={retry} className="bg-white border-red-200 hover:bg-red-50 text-red-700">
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}
