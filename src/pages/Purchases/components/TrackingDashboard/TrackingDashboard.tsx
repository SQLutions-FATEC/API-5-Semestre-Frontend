import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { projectService } from '../../../../services/projectService';
import type { PurchasesResponse } from '../../../../types/purchase';
import type { CriticalAlertsResponse } from '../../../../types/alerts';
import { CircularProgress, Box, Typography } from '@mui/material';
import TrackingCards from './TrackingCards';
import TrackingTable from './TrackingTable';
import './TrackingDashboard.scss';

const TrackingDashboard: React.FC = () => {
  const { id = 'PRJ003' } = useParams<{ id: string }>();
  const [compras, setCompras] = useState<PurchasesResponse | null>(null);
  const [alertas, setAlertas] = useState<CriticalAlertsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const idToFetch = id === '1' ? 'PRJ003' : id;
      if (!idToFetch) return;
      try {
        setLoading(true);
        setError(null);

        const [comprasData, alertasData] = await Promise.all([
          projectService.getPurchases(idToFetch),
          projectService.getCriticalAlerts(idToFetch),
        ]);

        setCompras(comprasData);
        setAlertas(alertasData);
      } catch (err) {
        console.error('Erro ao carregar dados de acompanhamento:', err);
        setError('Não foi possível carregar as informações de acompanhamento.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !compras || !alertas) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error">{error || 'Dados indisponíveis'}</Typography>
      </Box>
    );
  }

  return (
    <div className="tracking-dashboard">
      <TrackingCards alertas={alertas} compras={compras} />
      <TrackingTable orders={compras.pedidos} />
    </div>
  );
};

export default TrackingDashboard;
