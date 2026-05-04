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
  TrendingUp,
  ListTodo,
} from 'lucide-react';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { ptBR } from '@mui/x-data-grid/locales';
import { Chip } from '@mui/material';
import { sharedDataGridStyles } from '../../../../styles/sharedDataGridStyles';
import { taskService, type EvolucaoHoras, type tarefa } from '../../../../services/taskService';
import './HoursTracking.scss';

type PieSlice = {
  name: string;
  value: number;
  fill: string;
};

const statusColors: Record<string, { bg: string; text: string }> = {
  Concluída: { bg: '#e6fffa', text: '#047481' },
  Concluído: { bg: '#e6fffa', text: '#047481' },
  Bloqueada: { bg: '#fff5f5', text: '#c53030' },
  'Em andamento': { bg: '#ebf8ff', text: '#2b6cb0' },
};

const pieColors = ['#003a70', '#ff4500', '#2b6cb0', '#c53030', '#047481', '#805ad5'];

const tooltipFormatter = (value: unknown) => [`${value}h`, 'Horas'];

const formatHours = (value: number) => `${value.toFixed(1).replace('.', ',')}h`;

const formatDateLabel = (date: string) => {
  const [year, month, day] = date.split('-');

  if (year && month && day) {
    return `${day}/${month}/${year}`;
  }

  return date;
};

const formatTotalHours = (value: number) => {
  const totalMinutes = Math.round(value * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return hours + ' horas' + (minutes ? ' e ' + minutes + ' minutos' : '');
};

const capitalizeText = (text: string) => {
  if (!text) return 'Sem dados';
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
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
    renderCell: (params) => formatHours(Number(params.value ?? 0)),
  },
  {
    field: 'estimativa_horas',
    headerName: 'Estimativa de horas',
    width: 180,
    renderCell: (params) => formatHours(Number(params.value ?? 0)),
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
  const { codigo_projeto } = useParams<{ codigo_projeto: string }>();
  const [tasks, setTasks] = useState<tarefa[]>([]);
  const [evolutionHours, setEvolutionHours] = useState<EvolucaoHoras>({});
  const [selectedTaskCode, setSelectedTaskCode] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(false);

        if (!codigo_projeto) return;
        const response = await taskService.getTaskTracking(codigo_projeto);
        setTasks(Array.isArray(response?.tarefas) ? response.tarefas : []);
        setEvolutionHours(response?.evolucao_horas ?? {});
      } catch (fetchError) {
        console.error('Error fetching task hours:', fetchError);
        setTasks([]);
        setEvolutionHours({});
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [codigo_projeto]);

  const tableData = useMemo(() => tasks, [tasks]);

  const lineData = useMemo(
    () =>
      Object.entries(evolutionHours)
        .sort(([leftDate], [rightDate]) => leftDate.localeCompare(rightDate))
        .map(([date, hours]) => ({
          date: formatDateLabel(date),
          hours: Number(hours ?? 0),
        })),
    [evolutionHours]
  );

  const pieData = useMemo(() => buildPieData(tasks), [tasks]);

  useEffect(() => {
    if (!tasks.length) {
      setSelectedTaskCode('');
      return;
    }

    const hasSelectedTask = tasks.some((task) => task.codigo === selectedTaskCode);

    if (hasSelectedTask) {
      return;
    }

    const defaultTask = [...tasks].sort(
      (left, right) => right.total_horas_trabalhadas - left.total_horas_trabalhadas
    )[0];

    setSelectedTaskCode(defaultTask.codigo);
  }, [tasks, selectedTaskCode]);

  const selectedTask = useMemo(() => {
    if (!tasks.length) {
      return null;
    }

    if (selectedTaskCode) {
      const task = tasks.find((item) => item.codigo === selectedTaskCode);
      if (task) {
        return task;
      }
    }

    return [...tasks].sort(
      (left, right) => right.total_horas_trabalhadas - left.total_horas_trabalhadas
    )[0];
  }, [tasks, selectedTaskCode]);

  const totalHours = useMemo(
    () => tasks.reduce((sum, task) => sum + task.total_horas_trabalhadas, 0),
    [tasks]
  );

  const baseCellStyles = sharedDataGridStyles['& .MuiDataGrid-cell'];
  const mergedCellStyles = baseCellStyles
    ? { ...baseCellStyles, borderBottom: '1px solid #edf2f7' }
    : { borderBottom: '1px solid #edf2f7' };

  const renderChartContent = () => {
    if (loading) {
      return (
        <div style={{ color: '#718096', fontSize: '0.95rem', padding: '1rem' }}>
          Carregando dados do projeto...
        </div>
      );
    }

    if (error) {
      return (
        <div style={{ color: '#c53030', fontSize: '0.95rem', padding: '1rem' }}>
          Não foi possível carregar as tarefas do projeto.
        </div>
      );
    }

    if (lineData.length) {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lineData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
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
      );
    }

    return (
      <div style={{ color: '#718096', fontSize: '0.95rem', padding: '1rem' }}>
        Nenhuma tarefa encontrada para este projeto.
      </div>
    );
  };

  const renderDonutContent = () => {
    if (loading) {
      return (
        <div style={{ color: '#718096', fontSize: '0.85rem', padding: '1rem' }}>Carregando...</div>
      );
    }

    if (pieData.length) {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={120}
              paddingAngle={1}
              dataKey="value"
              stroke="none"
            />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    return null;
  };

  return (
    <div className="hours-tracking-wrapper">
      <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <h2
          style={{
            fontSize: '1.875rem',
            fontWeight: '700',
            color: '#1e293b',
            margin: 0,
            letterSpacing: '-0.025em',
          }}
        >
          Acompanhamento de horas
        </h2>
        <span style={{ color: '#64748b', fontSize: '1rem', fontWeight: '400' }}>
          Projeto {codigo_projeto}
        </span>
      </div>

      <div className="charts-section">
        <div className="task-details-card" data-testid="task-details-card">
          <div className="task-info-section">
            <span className="chart-label section-absolute-title">
              <CheckSquare /> Tarefa
            </span>
            <div className="task-info-grid">
              <div className="property-group">
                <span className="prop-label">
                  <CheckSquare /> Código da tarefa
                </span>
                <div className="task-code" style={{ marginTop: '0.25rem' }}>
                  <div className="task-code-select-wrapper">
                    <select
                      className="task-code-select"
                      value={selectedTaskCode}
                      onChange={(event) => setSelectedTaskCode(event.target.value)}
                      disabled={!tasks.length || loading}
                    >
                      {tasks.map((task) => (
                        <option key={task.codigo} value={task.codigo}>
                          {task.codigo}
                        </option>
                      ))}
                    </select>
                    <ChevronDown />
                  </div>
                </div>
              </div>

              <div className="property-group">
                <span className="prop-label">
                  <AppWindow /> Título
                </span>
                <span className="prop-value" style={{ lineHeight: '1.3' }}>
                  {selectedTask?.titulo || ''}
                </span>
              </div>

              <div className="property-group">
                <span className="prop-label">
                  <User /> Responsável
                </span>
                <span className="prop-value">
                  {capitalizeText(selectedTask?.responsavel || '')}
                </span>
              </div>

              <div className="property-group">
                <span className="prop-label">
                  <Users /> Status
                </span>
                <span className="prop-value">{capitalizeText(selectedTask?.status || '')}</span>
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
            </div>
          </div>

          <div className="vertical-divider"></div>

          <div className="donut-chart-section">
            <span className="chart-label section-absolute-title">
              <PieChartIcon /> Horas trabalhadas
            </span>
            <div className="donut-and-legend">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="donut-wrapper">{renderDonutContent()}</div>
              </div>

              <div className="legend-container">
                {pieData.length ? (
                  pieData.map((entry) => (
                    <div key={entry.name} className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: entry.fill }} />
                      <span>
                        {entry.value.toString().replace('.', ',')}% {capitalizeText(entry.name)}
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

        <hr className="section-divider" />

        <div className="line-chart-container">
          <div className="chart-header">
            <span className="chart-label">
              <TrendingUp /> Evolução de horas trabalhadas
            </span>
            <div className="total-hours-badge">
              <Clock />
              <span>Horas trabalhadas totais: {formatTotalHours(totalHours)}</span>
            </div>
          </div>

          <div className="chart-wrapper">{renderChartContent()}</div>
        </div>
      </div>

      <hr className="section-divider" />

      <div className="table-section">
        <div style={{ width: '100%' }}>
          <h3 className="table-title">
            <ListTodo /> Detalhamento de tarefas
          </h3>
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
                ...mergedCellStyles,
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
