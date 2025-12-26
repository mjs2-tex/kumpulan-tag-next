'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { printLabels } from './PrintLabels';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import axios from 'axios';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

interface ItemData {
  no_piece: string;
  quantity: number;
  nama_produk: string;
  warna_produk: string;
  production_name: string;
}

const TagCrudGrid = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productionName = searchParams.get('production_name') || "";

  const [items, setItems] = useState<ItemData[]>([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH DATA
  ========================= */
  useEffect(() => {
    if (!productionName) {
      Swal.fire({
        icon: 'error',
        title: 'Parameter tidak valid',
        text: 'Production name tidak ditemukan',
        timer: 3000,
        showConfirmButton: false,
      });
      router.replace('/');
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get('/api/inspect-afq', {
          params: { production_name: productionName },
          timeout: 5000,
        });

        setItems(res.data.data || []);
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal memuat data',
          text: 'Periksa kembali koneksi',
          timer: 3000,
          showConfirmButton: false,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productionName, router]);

  /* =========================
     TABLE COLUMNS
  ========================= */
  const columns: ColumnDef<ItemData>[] = [
    {
      header: 'No',
      cell: ({ row }) => row.original.no_piece,
    },
    {
      header: 'Color',
      cell: ({ row }) => (
        <span className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full border border-white/50"
            style={{
              backgroundColor: row.original.warna_produk.toLowerCase(),
            }}
          />
          {row.original.warna_produk}
        </span>
      ),
    },
    {
      header: 'Length',
      accessorKey: 'quantity',
    },
    {
      header: 'Barcode',
      accessorKey: 'production_name',
      cell: ({ getValue }) => (
        <span className="font-mono text-blue-300">
          {getValue<string>()}
        </span>
      ),
    },
    {
      header: 'Action',
      cell: ({ row }) => (
        <button
          onClick={async () => await printLabels([row.original])}
          className="bg-red-500/20 hover:bg-red-500 text-red-200 hover:text-white px-3 py-1 rounded-md border border-red-500/50 text-xs"
        >
          Print
        </button>
      ),
    },
  ];

  /* =========================
     TABLE INSTANCE
  ========================= */
  const filteredData = useMemo(() =>
    items.filter((item: any) => item.grade_id !== 3),
    [items]
  );

  const table = useReactTable({
    data: filteredData, // ⬅️ Gunakan data yang sudah difilter
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  if (loading) {
    return <div className="text-white p-6">Memuat data...</div>;
  }

  return (
    <div className="relative z-10 w-full max-w-4xl p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 text-white">
      <h2 className="text-2xl font-bold mb-6 text-center">SABRINA TAG</h2>

      {/* ========================= TABLE ========================= */}
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white/20">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="p-3 text-sm font-semibold">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-white/10">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-white/5">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="p-3 text-sm">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-10 text-center text-white/40 italic">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ========================= PAGINATION ========================= */}
      <div className="flex justify-between items-center mt-4 text-white">
        <div className="text-sm">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 bg-white/10 rounded disabled:opacity-40"
          >
            Prev
          </button>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 bg-white/10 rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {/* ========================= FOOTER ========================= */}
      <div className="flex items-end justify-between mt-6 w-full">
        <Link
          href={`/pilihtag?production_name=${productionName}`}
          className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg"
        >
          BACK
        </Link>

        <button
          onClick={() => printLabels(filteredData)}
          className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg"
        >
          Print Data
        </button>
      </div>
    </div>
  );
}

const Page = () => {
  return (
    <Suspense fallback={<div className="text-white">Loading...</div>}>
      <TagCrudGrid />
    </Suspense>
  )
}

export default Page
