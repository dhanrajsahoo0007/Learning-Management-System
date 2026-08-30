import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CertificationList } from '@/components/certifications/CertificationList';
import { RoadmapView } from '@/components/certifications/RoadmapView';
import { certificationService } from '@/api/certifications';
import type { Certification } from '@/data/certificationsData';

const ListSkeleton: React.FC = () => (
  <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <Skeleton className="mx-auto mb-4 h-12 w-2/3" />
    <Skeleton className="mx-auto mb-8 h-6 w-1/2" />
    <Skeleton className="mb-8 h-24 w-full" />
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-72 w-full" />
      ))}
    </div>
  </div>
);

const CertificationHub: React.FC = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [providers, setProviders] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [certsData, providersData] = await Promise.all([
          certificationService.getAll(),
          certificationService.getProviders(),
        ]);
        setCertifications(certsData);
        const providerNames = providersData.map((p: any) =>
          typeof p === 'string' ? p : p.name
        );
        setProviders(['All', ...providerNames]);
      } catch (error) {
        console.error('Failed to fetch certifications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <ListSkeleton />;

  return <CertificationList certifications={certifications} providers={providers} />;
};

const CertificationDetail: React.FC = () => {
  const { certId } = useParams();
  const navigate = useNavigate();
  const [certification, setCertification] = useState<Certification | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCert = async () => {
      if (!certId) return;
      setLoading(true);
      try {
        const data = await certificationService.getById(certId);
        setCertification(data);
      } catch (error) {
        console.error('Failed to fetch certification:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCert();
  }, [certId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-5 w-1/2" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-36 w-full" />
        ))}
      </div>
    );
  }

  if (!certification) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8">
        <h2 className="mb-2 text-2xl font-bold text-foreground">Certification not found</h2>
        <p className="mb-6 text-muted-foreground">
          This certification does not exist or is no longer available.
        </p>
        <Button onClick={() => navigate('/certifications')}>Back to certifications</Button>
      </div>
    );
  }

  return (
    <RoadmapView certification={certification} onBack={() => navigate('/certifications')} />
  );
};

const Certifications: React.FC = () => (
  <Routes>
    <Route index element={<CertificationHub />} />
    <Route path=":certId" element={<CertificationDetail />} />
  </Routes>
);

export default Certifications;
