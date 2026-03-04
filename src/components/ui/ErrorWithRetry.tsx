import { RefreshCw, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ErrorWithRetryProps {
  title?: string;
  message?: string;
  error?: string | null;
  onRetry: () => void;
  isLoading?: boolean;
}

export function ErrorWithRetry({
  title = 'Error',
  message,
  error,
  onRetry,
  isLoading = false,
}: ErrorWithRetryProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="p-4 bg-red-50 rounded-lg border border-red-100">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-red-800 font-semibold">{title}</h3>
              {message && (
                <p className="text-red-700 text-sm mt-1">{message}</p>
              )}
              {error && (
                <p className="text-red-600 text-sm mt-2 font-mono bg-red-100/50 p-2 rounded">
                  {error}
                </p>
              )}
              <Button
                variant="outline"
                className="mt-4 text-red-700 border-red-300 hover:bg-red-100 hover:text-red-800"
                onClick={onRetry}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Retrying...' : 'Retry'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
