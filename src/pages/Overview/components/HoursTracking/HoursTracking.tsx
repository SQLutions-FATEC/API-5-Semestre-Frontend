import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
} from 'recharts';
import {
  Clock,
  CheckSquare,
  ChevronDown,
  AppWindow,
  User,
  Users,
  CalendarDays,
  PieChart as PieChartIcon,
} from 'lucide-react';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { ptBR } from '@mui/x-data-grid/locales';
import { Chip } from '@mui/material';
import { sharedDataGridStyles } from '../../../../styles/sharedDataGridStyles';
import { taskService, type tarefa } from '../../../../services/taskService';
import './HoursTracking.scss';

type PieSlice = {
  name: string;
  value: number;
  fill: string;
};

const statusColors: Record<string, { bg: string; text: string }> = {
  Concluída: { bg: '#e6fffa', text: '#047481' },
  Bloqueada: { bg: '#fff5f5', text: '#c53030' },
  'Em andamento': { bg: '#ebf8ff', text: '#2b6cb0' },
};

const pieColors = ['#003a70', '#ff4500', '#2b6cb0', '#c53030', '#047481', '#805ad5'];

const tooltipFormatter = (value: unknown) => [`${value}h`, 'Horas'];

const formatHours = (value: number) => `${value.toFixed(1).replace('.', ',')}h`;

const formatTotalHours = (value: number) => {
  const totalMinutes = Math.round(value * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours} horas${minutes ? ` e ${minutes} minutos` : ''}`;
};

const buildPieData = (tasks: tarefa[]): PieSlice[] => {
  const groupedHours = tasks.reduce<Record<string, number>>((accumulator, task) => {
    accumulator[task.responsavel] =
      (accumulator[task.responsavel] || 0) + task.total_horas_trabalhadas;
    return accumulator;
  }, {});

  const totalHours = Object.values(groupedHours).reduce((sum, hours) => sum + hours, 0);

  return Object.entries(groupedHours).map(([name, hours], index) => ({
    name,
    value: totalHours ? Number(((hours / totalHours) * 100).toFixed(1)) : 0,
    fill: pieColors[index % pieColors.length],
  }));
};

const columns: GridColDef[] = [
  { field: 'codigo', headerName: 'Código da tarefa', width: 160 },
  { field: 'titulo', headerName: 'Título', flex: 1, minWidth: 200 },
  { field: 'responsavel', headerName: 'Responsável', width: 220 },
  {
    field: 'total_horas_trabalhadas',
    headerName: 'Horas trabalhadas',
    width: 170,
    valueFormatter: ({ value }) => formatHours(Number(value)),
  },
  {
    field: 'estimativa_horas',
    headerName: 'Estimativa de horas',
    width: 180,
    valueFormatter: ({ value }) => formatHours(Number(value)),
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 150,
    renderCell: (params) => {
      const colors = statusColors[params.value as string] || { bg: '#edf2f7', text: '#4a5568' };

      return (
        <Chip
          label={params.value as string}
          size="small"
          sx={{
            fontWeight: 700,
            backgroundColor: colors.bg,
            color: colors.text,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
          }}
        />
      );
    },
  },
];

export default function HoursTracking() {
  const { id = 'PRJ003' } = useParams<{ id: string }>();
  const projectId = id === '1' ? 'PRJ003' : id;
  const [tasks, setTasks] = useState<tarefa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await taskService.getTasks(projectId);
        setTasks(response);
      } catch (fetchError) {
        console.error('Error fetching task hours:', fetchError);
        setTasks([]);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId]);

  const tableData = useMemo(() => tasks, [tasks]);

  const lineData = useMemo(
    () =>
      tasks.map((task) => ({
        label: task.codigo,
        hours: task.total_horas_trabalhadas,
      })),
    [tasks]
  );

  const pieData = useMemo(() => buildPieData(tasks), [tasks]);

  const selectedTask = useMemo(() => {
    if (!tasks.length) {
      return null;
    }

    return [...tasks].sort(
      (left, right) => right.total_horas_trabalhadas - left.total_horas_trabalhadas
    )[0];
  }, [tasks]);

  const totalHours = useMemo(
    () => tasks.reduce((sum, task) => sum + task.total_horas_trabalhadas, 0),
    [tasks]
  );

  return (
    <div className="hours-tracking-wrapper">
      <div className="hours-header">
        <h2>Acompanhamento de horas</h2>
        <span style={{ color: '#718096', fontSize: '0.875rem' }}>Projeto {projectId}</span>
      </div>

      <div className="charts-section">
        <div className="line-chart-container">
          <span className="chart-label">Horas trabalhadas por tarefa</span>

          <div className="chart-wrapper">
            {loading ? (
              <div style={{ color: '#718096', fontSize: '0.95rem', padding: '1rem' }}>
                Carregando dados do projeto...
              </div>
            ) : error ? (
              <div style={{ color: '#c53030', fontSize: '0.95rem', padding: '1rem' }}>
                Não foi possível carregar as tarefas do projeto.
              </div>
            ) : lineData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 12, fill: '#4a5568' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis
                    domain={[0, 'auto']}
                    tick={{ fontSize: 12, fill: '#4a5568' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                    label={{
                      value: 'Horas trabalhadas',
                      angle: -90,
                      position: 'insideLeft',
                      style: { fontSize: 12, fill: '#4a5568' },
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a202c',
                      color: '#fff',
                      borderRadius: '4px',
                      border: 'none',
                    }}
                    itemStyle={{ color: '#fff' }}
                    cursor={{ fill: 'transparent' }}
                    formatter={(value) => tooltipFormatter(value ?? '')}
                  />
                  <Line
                    type="linear"
                    dataKey="hours"
                    stroke="#003a70"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#003a70', strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#1a202c' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ color: '#718096', fontSize: '0.95rem', padding: '1rem' }}>
                Nenhuma tarefa encontrada para este projeto.
              </div>
            )}
          </div>

          <div className="total-hours-badge">
            <Clock />
            <span>Horas trabalhadas totais: {formatTotalHours(totalHours)}</span>
          </div>
        </div>

        <div className="task-details-card">
          <div className="property-group">
            <div className="prop-value-row">
              <span className="prop-label" style={{ fontSize: '1.2rem', color: '#4a5568' }}>
                <CheckSquare /> Tarefa
              </span>
              <div className="task-code">
                <span style={{ fontSize: '0.75rem', color: '#718096' }}>Código da tarefa</span>
                {selectedTask?.codigo || '---'} <ChevronDown />
              </div>
            </div>
          </div>

          <div className="property-group">
            <span className="prop-label">
              <AppWindow /> Título
            </span>
            <span className="prop-value">{selectedTask?.titulo || 'Sem dados'}</span>
          </div>

          <div className="property-group">
            <span className="prop-label">
              <User /> Responsável
            </span>
            <span className="prop-value">{selectedTask?.responsavel || 'Sem dados'}</span>
          </div>

          <div className="property-group">
            <span className="prop-label">
              <Users /> Status
            </span>
            <span className="prop-value">{selectedTask?.status || 'Sem dados'}</span>
          </div>

          <div className="property-group">
            <span className="prop-label">
              <CalendarDays /> Horas trabalhadas
            </span>
            <span className="prop-value">
              {selectedTask ? formatHours(selectedTask.total_horas_trabalhadas) : 'Sem dados'}
            </span>
          </div>

          <div className="property-group">
            <span className="prop-label">
              <CalendarDays /> Estimativa de horas
            </span>
            <span className="prop-value">
              {selectedTask ? formatHours(selectedTask.estimativa_horas) : 'Sem dados'}
            </span>
          </div>

          <div className="donut-chart-section">
            <span className="donut-label">
              <PieChartIcon /> Horas trabalhadas
            </span>
            <div className="donut-wrapper">
              {loading ? (
                <div style={{ color: '#718096', fontSize: '0.85rem', padding: '1rem' }}>
                  Carregando...
                </div>
              ) : pieData.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={65}
                      paddingAngle={0}
                      dataKey="value"
                      stroke="none"
                    />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : null}
            </div>

            <div className="legend-container">
              {pieData.length ? (
                pieData.map((entry) => (
                  <div key={entry.name} className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: entry.fill }} />
                    <span>
                      {entry.value.toString().replace('.', ',')}% {entry.name}
                    </span>
                  </div>
                ))
              ) : (
                <span style={{ color: '#718096', fontSize: '0.875rem' }}>
                  Sem dados para exibir
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="table-section">
        <div style={{ width: '100%' }}>
          <DataGrid
            rows={tableData}
            columns={columns}
            getRowId={(row) => row.codigo}
            autoHeight
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
            disableRowSelectionOnClick
            localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
            sx={{
              ...sharedDataGridStyles,
              '& .MuiDataGrid-cell': {
                ...(sharedDataGridStyles['& .MuiDataGrid-cell'] ?? {}),
                borderBottom: '1px solid #edf2f7',
              },
              '& .MuiDataGrid-root': {
                border: 'none',
              },
              '& .MuiDataGrid-main': {
                borderBottom: 'none',
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
