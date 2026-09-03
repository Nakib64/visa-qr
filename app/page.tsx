import React from 'react';
import { getAllVisas } from '@/lib/db';
import { MongoliaPortalHome } from '@/components/MongoliaPortalHome';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const visas = await getAllVisas();
  const sampleVisa = visas[0];

  return (
    <MongoliaPortalHome
      sampleVisaId={sampleVisa?.electronicVisaNumber || sampleVisa?.idNumber || sampleVisa?.id}
      sampleVisaName={sampleVisa ? `${sampleVisa.name} ${sampleVisa.surname}` : undefined}
    />
  );
}
