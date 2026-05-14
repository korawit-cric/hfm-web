'use client';

import { useMemo } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useTranslations } from 'next-intl';

import type { Ranking } from '@repo/api-client';

type Props = {
  rows: Ranking[];
};

const columnHelper = createColumnHelper<Ranking>();

export function RankingMoreTable({ rows }: Props) {
  const t = useTranslations('HomePage.rankingSection');

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: () => t('colName'),
        cell: (info) => (
          <span className="text-darkest-gray font-normal break-words">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('gain', {
        size: 100,
        header: () => t('colGain'),
        cell: (info) => (
          <span className="text-darkest-gray font-bold">
            {info.getValue()}%
          </span>
        ),
      }),
    ],
    [t],
  );

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (rows.length === 0) {
    return <p className="text-medium-gray text-sm">{t('emptyTable')}</p>;
  }

  return (
    <div className="w-full min-w-0">
      <table className="w-full min-w-0 table-fixed border-collapse text-left text-sm">
        <colgroup>
          {table.getAllLeafColumns().map((column) => (
            <col
              key={column.id}
              style={{
                width:
                  column.id === 'gain' ? `${column.getSize()}px` : undefined,
              }}
            />
          ))}
        </colgroup>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  scope="col"
                  className="border-table-border-gray text-secondary-500 min-w-0 border-b px-4 py-3 text-base font-bold uppercase"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="text-medium-gray hover:bg-lightest-gray transition-colors duration-150 ease-in-out"
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="border-table-border-gray min-w-0 border-b px-4 py-3 align-top text-base"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
