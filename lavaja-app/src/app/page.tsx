'use client'

import { DashboardClient, Layout, RotaAutenticada } from 'components'

const Home: React.FC = () => {
  return (
    <RotaAutenticada>
      <DashboardClient />
    </RotaAutenticada>
  );
}

export default Home