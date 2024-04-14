import React, { useMemo } from 'react';
import { useTable, usePagination } from 'react-table';
import { useCommonState } from '../../data/commonState';
import './AccountsTable.scss';

const AccountsTable = () => {
  const { accounts: data, updateAccountStatus } = useCommonState();

  const columns = useMemo(
    () => [
      {
        Header: 'Approve Account',
        accessor: '',
        Cell: ({ row }) => {
          const handleToggle = () => {
            const userId = row.original.user_id;
            if (row.original.access === 'admin') {
              updateAccountStatus(userId, 'disabled');
              return;
            }
            updateAccountStatus(userId, 'admin');
          };

          return (
            <div className="toggle-container">
              <label className="toggle-switch">
                <input type="checkbox" onChange={handleToggle} checked={row.original.access === 'admin'} />
                <span className="slider round"></span>
              </label>
            </div>
          );
        },
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ row }) => {
          if (row.original.access === 'toVerifyAccount') {
            return "For Approval";
          }

          if (row.original.access === 'disabled') {
            return "Disabled";
          }

          if (row.original.access === 'admin') {
            return "Approved";
          }

          return `-`;
        },
      },
      {
        Header: 'Last Name',
        accessor: 'last_name',
      },
      {
        Header: 'First Name',
        accessor: 'first_name',
      },
      {
        Header: 'Middle Name',
        accessor: 'middle_name',
        Cell: ({ value }) => (value ? value : "-"),
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Club Name',
        accessor: 'club_name',
      },
      {
        Header: 'Grade & Section',
        accessor: '',
        Cell: ({ row }) => {
          if (row.original.year && row.original.section) {
            return `Grade ${row.original.year} - ${row.original.section}`;
          }

          if (row.original.year) {
            return `Grade ${row.original.year}`;
          }

          if (row.original.section) {
            return `Section ${row.original.section}`;
          }

          return "-";
        },
      }
    ],
    [updateAccountStatus]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    usePagination
  );

  return (
    <>
      <div className="table__container">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps()}
                  >
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <td
                        {...cell.getCellProps()}
                      >
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      { data.length > 10 && <div className="table__pagination">
        <button className="table__pagination-button" onClick={() => previousPage()} disabled={!canPreviousPage}>
          Previous
        </button>
        <button className="table__pagination-button" onClick={() => nextPage()} disabled={!canNextPage}>
          Next
        </button>
        </div>
      }
    </>
  );
};

export default AccountsTable;
