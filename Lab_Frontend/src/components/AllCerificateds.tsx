import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, User, MapPin, Award, ShieldCheck, Inbox, FileText, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Interface for the certificate data we will assemble
interface CertificateInfo {
  hash: string;
  name: string;
  date: string;
}

// --- Skeleton Component for Loading State ---
const CertificateSkeleton = () => (
  <div className="border rounded-lg overflow-hidden animate-pulse">
    <div className="bg-gray-200 h-48 w-full"></div>
    <div className="p-4 space-y-3">
      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-10 bg-gray-200 rounded w-full mt-2"></div>
    </div>
  </div>
);

// --- Empty State Component ---
const EmptyState = () => (
  <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center text-center py-16 bg-gray-50 rounded-lg">
    <Inbox className="h-16 w-16 text-gray-400 mb-4" />
    <h3 className="text-xl font-semibold text-gray-700">No Certificates Found</h3>
    <p className="text-gray-500 mt-1">No certificates have been uploaded for this lab account yet.</p>
  </div>
);

function LabProfileAndCertificates() {
  // ✅ Using the dynamic user from the useAuth hook. Contract is no longer needed here.
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<CertificateInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ✅ Renamed function to reflect its new purpose
    const fetchCertificatesFromPinata = async () => {
      // Ensure the user (with licenseId) is loaded
      if (!user?.licenseId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // ✅ --- Fetch Certificates directly from Pinata by filtering metadata ---
        // This query looks for pins where the metadata contains a keyvalue pair
        // matching the user's licenseId.
        const metadataFilter = `metadata[keyvalues]={"licenseId":{"value":"${user.licenseId}","op":"eq"}}`;
        const url = `https://api.pinata.cloud/data/pinList?status=pinned&${metadataFilter}`;

        const pinataApiKey = "9ee892bfc12b953147be"; // Use environment variables in production
        const pinataSecretApiKey = "c85fc4ba88949c3302c358f04734f9b51b2c971f1de682e0f90304eb6a8a01d3"; // Use environment variables

        const { data } = await axios.get(url, {
          headers: {
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey,
          },
        });

        if (data.rows && data.rows.length > 0) {
            const certificateDetails = data.rows.map((row: any) => ({
                hash: row.ipfs_pin_hash,
                name: row.metadata.name || `Certificate-${row.ipfs_pin_hash.slice(0, 6)}`,
                date: row.date_pinned || new Date().toISOString(),
            }));
            setCertificates(certificateDetails);
        } else {
            setCertificates([]);
        }

      } catch (error) {
        console.error("Failed to fetch Pinata certificates:", error);
        toast({
          title: "Fetch Error",
          description: "Could not retrieve certificate data from IPFS.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificatesFromPinata();
  }, [user]); // Re-run only when user is available

  const handleDownload = async (hash: string, filename: string) => {
    try {
      toast({ title: "Starting Download...", description: filename });
      
      const response = await axios.get(`https://ipfs.io/ipfs/${hash}`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename.endsWith('.png') ? filename : `${filename}.png`);
      document.body.appendChild(link);
      link.click();
      
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({ title: "Download Complete", description: `${filename} has been saved.` });

    } catch (error) {
      console.error("Download failed:", error);
      toast({ 
        title: "Download Failed", 
        description: "Could not download the certificate image.", 
        variant: "destructive", 
      });
    }
  };

  if (!user) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="flex items-center space-x-2 text-gray-500">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className='text-lg'>Loading User Profile...</span>
            </div>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Card */}
        <Card className="mb-8 shadow-lg border-2 border-gray-100 bg-white">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full border-2 border-blue-200">
                <User className="h-10 w-10 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-3xl font-extrabold text-gray-900">
                  {user.laboratoryName}
                </CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  Laboratory Profile & Stored Certificates
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base pt-4">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border">
              <Award className="h-6 w-6 text-indigo-600 flex-shrink-0" />
              <div>
                <p className="text-gray-500 font-medium text-sm">License ID</p>
                <p className="text-gray-900 font-semibold">{user.licenseId}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border">
              <MapPin className="h-6 w-6 text-indigo-600 flex-shrink-0" />
              <div>
                <p className="text-gray-500 font-medium text-sm">Location</p>
                <p className="text-gray-900 font-semibold">{user.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Certificates Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
             <ShieldCheck className="h-8 w-8 text-green-600"/>
             <h2 className="text-2xl font-bold text-gray-800">Verified Certificates on IPFS</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <>
                <CertificateSkeleton />
                <CertificateSkeleton />
                <CertificateSkeleton />
              </>
            ) : certificates.length > 0 ? (
              certificates.map((cert) => (
                <Card key={cert.hash} className="overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="relative">
                        <img
                            src={`https://ipfs.io/ipfs/${cert.hash}`}
                            alt={cert.name}
                            className="w-full h-60 object-cover object-top"
                        />
                         <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                    </div>
                  <CardContent className="p-4 bg-white">
                      <div className='flex items-start gap-2'>
                        <FileText className='h-5 w-5 text-gray-400 mt-1'/>
                        <div>
                            <h3 className="font-bold text-lg text-gray-800 leading-tight">{cert.name}</h3>
                            <p className="text-sm text-gray-500">
                                Issued: {new Date(cert.date).toLocaleDateString()}
                            </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleDownload(cert.hash, cert.name)}
                        className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LabProfileAndCertificates;