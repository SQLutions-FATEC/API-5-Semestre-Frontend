export const sharedDataGridStyles = {
  border: 'none',
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: '#ffffff',
    color: '#475569',
    fontWeight: 700,
    borderBottom: '2px solid #e2e8f0',
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    fontWeight: 'bold !important',
  },
  '& .MuiDataGrid-columnHeader': {
    paddingLeft: '24px',
  },
  '& .MuiDataGrid-row:nth-of-type(even)': {
    backgroundColor: '#f8fafc',
  },
  '& .MuiDataGrid-row:hover': {
    backgroundColor: '#f1f5f9 !important',
  },
  '& .MuiDataGrid-cell': {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '24px !important',
  },
  '& .MuiDataGrid-cell:focus': {
    outline: 'none',
  },
  '& .MuiDataGrid-cell:focus-within': {
    outline: 'none',
  },
};
