import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Prediction } from '../capture/types.capture';
import { getProcessedImageBase64 } from './utils';

const ProcessedImage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get parameters from URL
  const originalImageUrl = searchParams.get("imgurl");
  const modelResultsParam = searchParams.get("modelresults"); // Get the encoded results string

  // State for the processed image
  const [processedBase64, setProcessedBase64] = useState<string | null>(null);
  // State for the parsed model results
  const [modelResults, setModelResults] = useState<Prediction[] | null>(null); // <-- State for parsed results

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // --- Parse Model Results (runs once when params change) ---
  useEffect(() => {
      if (modelResultsParam) {
          try {
              // Parse the URL-decoded JSON string back into an array
              const parsedResults: Prediction[] = JSON.parse(modelResultsParam);
              setModelResults(parsedResults);
              console.log("Parsed model results:", parsedResults);
          } catch (parseError) {
              console.error("Failed to parse model results parameter:", parseError);
              setError("Could not read model results from URL.");
              setModelResults(null); // Ensure state is null on error
          }
      } else {
          console.warn("Model results parameter is missing from URL.");
          setModelResults(null); // No results passed
      }
  }, [modelResultsParam]); // Re-run only if the results parameter changes
  // ---------------------------------------------------------


  // --- Fetch Processed Image (runs when originalImageUrl changes) ---
  useEffect(() => {
    if (originalImageUrl) {
      const fetchProcessedImage = async () => {
        setIsLoading(true);
        // Keep existing error unless overwritten by image fetch error
        // setError(null); // Don't clear error from results parsing here
        setProcessedBase64(null);

        console.log("Calling image processing function with URL:", originalImageUrl);

        try {
          const base64Data = await getProcessedImageBase64(originalImageUrl);
          setProcessedBase64(base64Data);
          console.log("Received processed image data.");
          // Clear error only if image fetch is successful
          setError(null);

        } catch (fetchErr: any) {
          console.error("Error fetching processed image:", fetchErr);
          // Prioritize showing the image fetch error
          setError(fetchErr.message || "Failed to process the image.");
          setProcessedBase64(null); // Ensure no stale image is shown
        } finally {
          setIsLoading(false);
        }
      };

      fetchProcessedImage();
    } else {
        // Only set error if results parsing didn't already set one
        if (!error) {
             setError("No valid image URL provided in the link.");
        }
        setIsLoading(false);
        setProcessedBase64(null);
    }
  }, [originalImageUrl, error]); // Rerun if URL changes, also depends on error state now
                                 // to potentially clear error on successful fetch
  // ----------------------------------------------------------------


  // ---- Render Logic ----

  // Show loading indicator (only show if actively fetching image)
  if (isLoading) {
    return <div>Loading processed image...</div>;
  }

  // Show error message first if something went wrong
  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        {/* Changed navigate target */}
        <button onClick={() => navigate("/dashboard")}>Go Back</button>
      </div>
    );
  }

  // Show the processed image AND the model results
  return (
    <div>
      <h2>Processed Image & Results</h2>

      {/* Display Processed Image */}
      {processedBase64 ? (
          <img
              src={processedBase64}
              alt="Processed content"
              style={{ maxWidth: '100%', height: 'auto', marginBottom: '20px' }}
          />
      ) : (
          <p>Processed image could not be loaded.</p> // Show if only image failed
      )}

      <hr /> {/* Separator */}

      {/* Display Model Results */}
      <h3>Model Predictions:</h3>
      {modelResults && modelResults.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', display: 'inline-block' }}>
          {modelResults.map((prediction, index) => (
            <li key={index}>
              {prediction.letter}: {(prediction.confidence * 100).toFixed(2)}%
            </li>
          ))}
        </ul>
      ) : (
        <p>No model prediction results were provided or could be read.</p>
      )}

      <br />
      {/* Changed navigate target */}
      <button onClick={() => navigate("/dashboard")}>Go Back</button>
    </div>
  );

};

export default ProcessedImage;