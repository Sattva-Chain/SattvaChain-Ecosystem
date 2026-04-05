// src/components/StatusModal.tsx

import { AlertCircle, CheckCircle, X } from "lucide-react";
import { Button } from "./ui/button";

// Define the shape of the data the modal receives
interface ApiResponse {
    status: 'Normal' | 'Anomaly Detected';
    summary: string;
    anomalies: {
        parameter: string;
        expected_range: string;
        actual_value: string;
    }[] | null;
}

interface StatusModalProps {
    response: ApiResponse;
    onClose: () => void;
    onNavigate: (view: string) => void;
}

export const StatusModal = ({ response, onClose, onNavigate }: StatusModalProps) => {
    const isAnomaly = response.status === 'Anomaly Detected';

    const handleClose = () => {
        onClose(); // Hide the modal
        // If the submission was successful, navigate back to the dashboard
        if (!isAnomaly) {
            onNavigate("dashboard");
        }
    };

    return (
        // Backdrop
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            {/* Modal Panel */}
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-in fade-in-0 zoom-in-95">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                >
                    <X className="h-6 w-6" />
                </button>

                {/* Content */}
                <div className="text-center">
                    {isAnomaly ? (
                        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
                    ) : (
                        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                    )}

                    <h3 className={`mt-4 text-xl font-semibold ${isAnomaly ? 'text-red-600' : 'text-green-600'}`}>
                        {isAnomaly ? "Analysis Failed" : "Submission Successful"}
                    </h3>

                    <p className="mt-2 text-sm text-gray-600">
                        {response.summary}
                    </p>

                    {/* Anomaly Details */}
                    {isAnomaly && response.anomalies && (
                        <div className="mt-4 text-left bg-red-50 p-3 rounded-md border border-red-200">
                            <h4 className="font-bold text-sm text-red-800">Failure Reason:</h4>
                            <ul className="mt-2 space-y-2 text-sm text-red-700">
                                {response.anomalies.map((anomaly, index) => (
                                    <li key={index}>
                                        <strong>{anomaly.parameter.replace(/_/g, ' ')}:</strong>
                                        <div>
                                            The entered value <code className="bg-red-200 px-1 rounded">{anomaly.actual_value}</code> is outside the required range of <code className="bg-red-200 px-1 rounded">{anomaly.expected_range}</code>.
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Action Button */}
                <div className="mt-6">
                    <Button
                        onClick={handleClose}
                        className={`w-full ${isAnomaly ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                    >
                        {isAnomaly ? "Acknowledge & Correct" : "Go to Dashboard"}
                    </Button>
                </div>
            </div>
        </div>
    );
};