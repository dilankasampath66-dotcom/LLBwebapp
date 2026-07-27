'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import Chip from '@/components/ui/Chip';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import { useDebounce } from '@/hooks/useDebounce';

interface Subject {
  id: string;
  name: string;
  level: number;
}

interface FilterBarProps {
  mode: 'content' | 'judgement';
}

const LEVELS = [3, 4, 5, 6];

export function FilterBar({ mode }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Read initial state from URL
  const initialLevels = searchParams.get('level') 
    ? searchParams.get('level')!.split(',').map(Number)
    : LEVELS;
  
  const [selectedLevels, setSelectedLevels] = useState<number[]>(initialLevels);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>(searchParams.get('subject') || 'all');
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('session') || '');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Fetch subjects based on selected levels
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const levelQuery = selectedLevels.length > 0 ? `?level=${selectedLevels.join(',')}` : '';
        const res = await fetch(`/api/subjects${levelQuery}`);
        const data = await res.json();
        setSubjects(data.subjects || []);
      } catch (error) {
        console.error('Failed to fetch subjects:', error);
      }
    };
    fetchSubjects();
  }, [selectedLevels]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (selectedLevels.length > 0 && selectedLevels.length < 4) {
      params.set('level', selectedLevels.join(','));
    } else {
      params.delete('level');
    }

    if (selectedSubject && selectedSubject !== 'all') {
      params.set('subject', selectedSubject);
    } else {
      params.delete('subject');
    }

    if (mode === 'content' && debouncedSearch) {
      params.set('session', debouncedSearch);
    } else {
      params.delete('session');
    }

    router.push(`?${params.toString()}`, { scroll: false });
  }, [selectedLevels, selectedSubject, debouncedSearch, mode, router, searchParams]);

  const toggleLevel = (level: number) => {
    setSelectedLevels(prev => {
      if (prev.includes(level)) {
        return prev.filter(l => l !== level);
      }
      return [...prev, level].sort();
    });
  };

  const subjectOptions = [
    { value: 'all', label: 'All Subjects' },
    ...subjects.map(s => ({ value: s.id, label: `${s.name} (Level ${s.level})` }))
  ];

  return (
    <div className="sticky top-16 z-40 bg-surface/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-text-secondary">Level:</span>
            <div className="flex gap-2">
              {LEVELS.map(level => (
                <Chip
                  key={level}
                  label={`Level ${level}`}
                  selected={selectedLevels.includes(level)}
                  onClick={() => toggleLevel(level)}
                  color={selectedLevels.includes(level) ? 'primary' : 'default'}
                />
              ))}
            </div>
          </div>

          <div className="flex-1 max-w-xs">
            <Select
              options={subjectOptions}
              value={selectedSubject}
              onChange={setSelectedSubject}
              placeholder="Filter by subject..."
            />
          </div>

          {mode === 'content' && (
            <div className="flex-1 max-w-xs relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-text-secondary" />
              </div>
              <Input
                type="text"
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full"
              />
            </div>
          )}
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex items-center justify-between gap-3">
          {mode === 'content' && (
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-text-secondary" />
              </div>
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full h-10"
              />
            </div>
          )}
          
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-surface-hover rounded-md border border-border text-sm font-medium transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {(selectedLevels.length < 4 || selectedSubject !== 'all') && (
              <span className="w-2 h-2 rounded-full bg-primary-light ml-1" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 md:hidden"
              onClick={() => setIsMobileFiltersOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 bg-surface z-50 md:hidden rounded-t-2xl border-t border-border p-4 pb-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-lg font-bold">Filters</h3>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-2 text-text-secondary hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-3">
                    Study Level
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {LEVELS.map(level => (
                      <Chip
                        key={level}
                        label={`Level ${level}`}
                        selected={selectedLevels.includes(level)}
                        onClick={() => toggleLevel(level)}
                        color={selectedLevels.includes(level) ? 'primary' : 'default'}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-3">
                    Subject
                  </label>
                  <Select
                    options={subjectOptions}
                    value={selectedSubject}
                    onChange={setSelectedSubject}
                    placeholder="Select subject"
                  />
                </div>

                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="w-full py-3 bg-primary hover:bg-primary-light text-white rounded-md font-medium transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
