import React, { useState, useEffect, ReactNode, Children } from 'react';

interface ErrorBoundaryProps{
    children:ReactNode;
}


const ErrorBoundary:React.FC<ErrorBoundaryProps> = ({children})=>{

    const [hasError, setHasError] = useState(false);

    const resetError = () => setHasError(false);

    useEffect(() => {
        const handleError = (event: ErrorEvent) => {
          console.error('Caught error in ErrorBoundary:', event.error);
          setHasError(true);
        };
    
        window.addEventListener('error', handleError);
    
        return () => {
          window.removeEventListener('error', handleError);
        };
      }, []);

      if (hasError) {
        return (
          <div className="flex flex-col items-center justify-center h-screen bg-red-100 text-red-700">
            <h1 className="text-xl font-bold">Something went wrong</h1>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={resetError}
            >
              Try Again
            </button>
          </div>
        );
      }

      return <>{children}</>;

}

export default ErrorBoundary