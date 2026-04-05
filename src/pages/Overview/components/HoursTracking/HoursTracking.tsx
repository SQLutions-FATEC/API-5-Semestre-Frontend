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
import './HoursTracking.scss';

// Mock Data
const lineData = [
  { date: '31-01-2025', hours: 7.9 },
  { date: '22-04-2025', hours: 9.4 },
  { date: '23-02-2025', hours: 13.8 },
];

const pieData = [
  { name: 'Felipe Rocha', value: 35.8, fill: '#003a70' }, // Dark Blue
  { name: 'Carla souza', value: 64.2, fill: '#ff4500' }, // Orange Red
];

const tableData = [
  {
    code: 'TSK001',
    title: 'Teste de isolação',
    responsible: 'Gabriel Martins',
    workedHours: '54.9',
    estimate: '148',
    status: 'Bloqueada',
  },
  {
    code: 'TSK002',
    title: 'Prototipação da placa',
    responsible: 'João Pedro Alves',
    workedHours: '86.3',
    estimate: '29',
    status: 'Concluída',
  },
  {
    code: 'TSK003',
    title: 'Roteamento multicamada',
    responsible: 'Tatiane Duarte',
    workedHours: '12.6',
    estimate: '180',
    status: 'Em andamento',
  },
];

export const tooltipFormatter = (value: any) => [`${value}h`, 'Horas'];

const columns: GridColDef[] = [
  { field: 'code', headerName: 'Código da tarefa', width: 160 },
  { field: 'title', headerName: 'Título', flex: 1, minWidth: 200 },
  { field: 'responsible', headerName: 'Responsável', width: 220 },
  { field: 'workedHours', headerName: 'Horas trabalhadas', width: 170 },
  { field: 'estimate', headerName: 'Estimativa de horas', width: 180 },
  {
    field: 'status',
    headerName: 'Status',
    width: 150,
    renderCell: (params) => {
      let colors = { bg: '#edf2f7', text: '#4a5568' };

      switch (params.value) {
        case 'Concluída':
          colors = { bg: '#e6fffa', text: '#047481' };
          break;
        case 'Bloqueada':
          colors = { bg: '#fff5f5', text: '#c53030' };
          break;
        case 'Em andamento':
          colors = { bg: '#ebf8ff', text: '#2b6cb0' };
          break;
      }

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
  return (
    <div className="hours-tracking-wrapper">
      <div className="hours-header">
        <h2>Acompanhamento de horas</h2>
      </div>

      <div className="charts-section">
        {/* Left Side: Line Chart */}
        <div className="line-chart-container">
          <span className="chart-label">Horas trabalhadas</span>

          <div className="chart-wrapper">
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
                  domain={[0, 16]}
                  ticks={[0, 2, 4, 6, 8, 10, 12, 14, 16]}
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
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={tooltipFormatter}
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
          </div>

          <div className="total-hours-badge">
            <Clock />
            <span>Horas trabalhadas totais: 192 horas e 32 minutos</span>
          </div>
        </div>

        {/* Right Side: Task Details & Donut */}
        <div className="task-details-card">
          <div className="property-group">
            <div className="prop-value-row">
              <span className="prop-label" style={{ fontSize: '1.2rem', color: '#4a5568' }}>
                <CheckSquare /> Tarefa
              </span>
              <div className="task-code">
                <span style={{ fontSize: '0.75rem', color: '#718096' }}>Código da tarefa</span>
                TF001 <ChevronDown />
              </div>
            </div>
          </div>

          <div className="property-group">
            <span className="prop-label">
              <AppWindow /> Título
            </span>
            <span className="prop-value">Teste de isolação</span>
          </div>

          <div className="property-group">
            <span className="prop-label">
              <User /> Responsável
            </span>
            <span className="prop-value">Gabriel Martins</span>
          </div>

          <div className="property-group">
            <span className="prop-label">
              <Users /> Trabalhador do dia
            </span>
            <span className="prop-value">Felipe Rocha</span>
          </div>

          <div className="property-group">
            <span className="prop-label">
              <CalendarDays /> Dia trabalhado
            </span>
            <span className="prop-value">23/02/2025</span>
          </div>

          <div className="donut-chart-section">
            <span className="donut-label">
              <PieChartIcon /> Horas trabalhadas
            </span>
            <div className="donut-wrapper">
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
            </div>

            <div className="legend-container">
              {pieData.map((entry) => (
                <div key={entry.name} className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: entry.fill }} />
                  <span>
                    {entry.value.toString().replace('.', ',')}% {entry.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="table-section">
        <div style={{ width: '100%' }}>
          <DataGrid
            rows={tableData}
            columns={columns}
            getRowId={(row) => row.code}
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
                ...(sharedDataGridStyles['& .MuiDataGrid-cell'] as any),
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
