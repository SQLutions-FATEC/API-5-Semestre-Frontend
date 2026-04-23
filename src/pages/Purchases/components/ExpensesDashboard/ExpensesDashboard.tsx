import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { projectService } from '../../../../services/projectService';
import type { ExpensesDetailsResponse, ExpensesEvolutionResponse } from '../../../../types/expenses';
import { CircularProgress, Box, Typography } from '@mui/material';
import ExpensesCharts from './ExpensesCharts';
import ExpensesTable from './ExpensesTable';
import './ExpensesDashboard.scss';

const ExpensesDashboard: React.FC = () => {
  const { id = 'PRJ004' } = useParams<{ id: string }>();
  const [details, setDetails] = useState<ExpensesDetailsResponse | null>(null);
  const [evolution, setEvolution] = useState<ExpensesEvolutionResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const idToFetch = id === '1' ? 'PRJ003' : id;
      if (!idToFetch) return;
      try {
        setLoading(true);
        setError(null);

        const [detailsData, evolutionData] = await Promise.all([
          projectService.getExpensesDetails(idToFetch),
          projectService.getExpensesEvolution(idToFetch),
        ]);

        setDetails(detailsData);
        setEvolution(evolutionData);
      } catch (err: any) {
        console.error('Erro ao carregar dados de gastos:', err);
        setError('Não foi possível carregar as informações de gastos.');
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

  // Se houver um erro real de rede ou API, mostramos a mensagem global
  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  // Renderizamos o dashboard sempre que tivermos os objetos (mesmo que com listas vazias)
  return (
    <div className="expenses-dashboard">
      <ExpensesCharts
        evolution={evolution || []}
        total={details?.gasto_total_consolidado || 0}
        pedidos={details?.pedidos || []}
      />
      <ExpensesTable pedidos={details?.pedidos || []} />
    </div>
  );
};

export default ExpensesDashboard;
