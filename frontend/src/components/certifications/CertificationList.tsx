import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CertificationCard } from './CertificationCard';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import type { Certification } from '@/data/certificationsData';

const LEVELS = ['All', 'Foundational', 'Associate', 'Professional', 'Expert'];

export const CertificationList: React.FC<{
  certifications: Certification[];
  providers: string[];
}> = ({ certifications, providers }) => {
  const navigate = useNavigate();
  const reduced = usePrefersReducedMotion();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return certifications.filter((cert) => {
      const matchesSearch =
        !query ||
        cert.title.toLowerCase().includes(query) ||
        cert.description.toLowerCase().includes(query);
      const matchesProvider = selectedProvider === 'All' || cert.provider === selectedProvider;
      const matchesLevel = selectedLevel === 'All' || cert.level === selectedLevel;
      return matchesSearch && matchesProvider && matchesLevel;
    });
  }, [certifications, searchQuery, selectedProvider, selectedLevel]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-foreground md:text-6xl">
          Cloud <span className="text-primary">Certifications</span>
        </h1>
        <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
          Master cloud platforms and technologies with structured learning paths, practice exams,
          and industry-recognised certifications.
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Label htmlFor="cert-search" className="sr-only">
              Search certifications
            </Label>
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              id="cert-search"
              type="search"
              placeholder="Search certifications…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex flex-col gap-1.5 md:w-48">
            <Label htmlFor="provider-filter" className="sr-only">
              Provider
            </Label>
            <Select value={selectedProvider} onValueChange={setSelectedProvider}>
              <SelectTrigger id="provider-filter" className="w-full">
                <SelectValue placeholder="Provider" />
              </SelectTrigger>
              <SelectContent>
                {providers.map((provider) => (
                  <SelectItem key={provider} value={provider}>
                    {provider === 'All' ? 'All providers' : provider}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5 md:w-48">
            <Label htmlFor="level-filter" className="sr-only">
              Level
            </Label>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger id="level-filter" className="w-full">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                {LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level === 'All' ? 'All levels' : level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <div className="py-12 text-center">
          <Award className="mx-auto mb-4 size-12 text-muted-foreground" aria-hidden />
          <h3 className="mb-2 text-lg font-semibold text-foreground">No certifications found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={reduced ? false : { y: 16 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(index, 8) * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              <CertificationCard
                certification={cert}
                onClick={() => navigate(`/certifications/${cert.id}`)}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
