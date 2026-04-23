import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';
import type { ExpenseDetail } from '../../../../types/expenses';
import { Inbox } from 'lucide-react';
import './ExpensesTable.scss';

type Props = {
  pedidos: ExpenseDetail[];
};

const getStatusColors = (status: string) => {
  const s = status.toUpperCase();
  if (s.includes('CANCELADO') || s.includes('REJEITADA')) {
    return { bg: '#fff5f5', text: '#c53030' };
  }
  if (s.includes('ENTREGUE') || s.includes('APROVADA') || s.includes('RECEBIDO')) {
    return { bg: '#e6fffa', text: '#047481' };
  }
  if (s.includes('PARCIAL') || s.includes('PENDENTE') || s.includes('ABERTO')) {
    return { bg: '#fffaf0', text: '#9c4221' };
  }
  return { bg: '#f7fafc', text: '#4a5568' };
};

export default function ExpensesTable({ pedidos }: Props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const hasData = pedidos && pedidos.length > 0;
  const emptyRows = hasData ? Math.max(0, (1 + page) * rowsPerPage - pedidos.length) : 0;

  // Mocked dates for the table
  const mockDates = ['12/04/2026', '15/04/2026', '18/04/2026', '20/04/2026', '22/04/2026'];

  return (
    <div className="expenses-table-container">
      <div className="table-header-box">
        <h3 className="table-title">Histórico</h3>
      </div>
      <TableContainer className="table-container-paper">
        <Table sx={{ minWidth: 650 }} aria-label="expenses table">
          <TableHead>
            <TableRow>
              <TableCell className="header-cell with-separator">Cod de pedido</TableCell>
              <TableCell className="header-cell with-separator">Nome Material</TableCell>
              <TableCell className="header-cell with-separator">Fornecedor</TableCell>
              <TableCell className="header-cell with-separator">Valor Total</TableCell>
              <TableCell className="header-cell with-separator">Data do Pedido</TableCell>
              <TableCell className="header-cell align-center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!hasData ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      color: '#94a3b8',
                      gap: '8px',
                    }}
                  >
                    <Inbox size={40} />
                    <span>Nenhum pedido encontrado para este projeto</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              pedidos
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((pedido, index) => {
                  const colors = getStatusColors(pedido.status);
                  return (
                    <TableRow
                      key={`${pedido.numero_pedido}-${index}`}
                      className="table-row-striped"
                    >
                      <TableCell className="body-cell">{pedido.numero_pedido}</TableCell>
                      <TableCell className="body-cell">{pedido.material_nome}</TableCell>
                      <TableCell className="body-cell">{pedido.fornecedor_nome}</TableCell>
                      <TableCell className="body-cell" style={{ fontWeight: 600 }}>
                        {pedido.valor_total_pedido.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </TableCell>
                      <TableCell className="body-cell">
                        {mockDates[index % mockDates.length]}
                      </TableCell>
                      <TableCell className="body-cell align-center">
                        <span
                          className="status-chip"
                          style={{
                            backgroundColor: colors.bg,
                            color: colors.text,
                          }}
                        >
                          {pedido.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
            )}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={pedidos.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Linhas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </TableContainer>
    </div>
  );
}
