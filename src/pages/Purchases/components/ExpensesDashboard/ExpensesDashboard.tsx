import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { projectService } from '../../../../services/projectService';
import type {
  ExpensesDetailsResponse,
  ExpensesEvolutionResponse,
} from '../../../../types/expenses';
import { CircularProgress } from '@mui/material';
import ExpensesCharts from './ExpensesCharts';
import ExpensesTable from './ExpensesTable';
import './ExpensesDashboard.scss';

const ExpensesDashboard: React.FC = () => {
  const { id = 'PRJ003' } = useParams<{ id: string }>();
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
      } catch (err) {
        console.error('Erro ao carregar dados de gastos:', err);
        setError('Não existem dados de gastos cadastrados para este projeto.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="expenses-loading-container">
        <CircularProgress />
      </div>
    );
  }

  if (error || !details || !evolution) {
    return (
      <div className="expenses-dashboard-empty">
        <h3>{error || 'Não existem dados cadastrados para este projeto.'}</h3>
      </div>
    );
  }

  return (
    <div className="expenses-dashboard">
      <ExpensesCharts
        evolution={evolution}
        total={details.gasto_total_consolidado}
        pedidos={details.pedidos}
      />
      <ExpensesTable pedidos={details.pedidos} />
    </div>
  );
};

export default ExpensesDashboard;
