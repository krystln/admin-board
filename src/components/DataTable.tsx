"use client";

import React from "react";

import {
	Table,
	TableHeader,
	TableCell,
	TableBody,
	TableRow,
	TableHead
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import {
	ColumnDef,
	useReactTable,
	getCoreRowModel,
	flexRender,
	getPaginationRowModel,
	getFilteredRowModel
} from "@tanstack/react-table";
import { Input } from "./ui/input";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	deleteData: (ids: number[]) => void;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	deleteData
}: DataTableProps<TData, TValue>) {
	const [filters, setFilters] = React.useState("");

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onGlobalFilterChange: setFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			globalFilter: filters
		}
	});

	return (
		<div className="w-4/5 h-screen">
			<div className="flex gap-2 items-center">
				<Input
					type="text"
					value={filters}
					placeholder="Search"
					className="my-2 search"
					onChange={(e) => {
						setFilters(e.target.value);
					}}
				/>
				<Button
					variant={"destructive"}
					className="delete-selected delete"
					onClick={() => {
						const ids: number[] = [];
						table.getSelectedRowModel().rows.forEach((row) => {
							ids.push(row.original.id);
						});
						deleteData(ids);
					}}>
					Delete Selected
				</Button>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<div className="flex-1 text-sm text-muted-foreground">
					{table.getFilteredSelectedRowModel().rows.length} of{" "}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
				<div className="space-x-2 flex items-center">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.setPageIndex(0)}
						disabled={!table.getCanPreviousPage()}>
						{"<<"}
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}>
						{"<"}
					</Button>
					<div className="flex gap-2">
						{Array.from({ length: table.getPageCount() }).map((_, i) => (
							<Button
								key={i}
								disabled={table.getState().pagination.pageIndex === i}
								variant={"secondary"}
								onClick={() => table.setPageIndex(i)}>
								{i + 1}
							</Button>
						))}
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}>
						{">"}
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.setPageIndex(table.getPageCount() - 1)}
						disabled={!table.getCanNextPage()}>
						{">>"}
					</Button>
				</div>
			</div>
		</div>
	);
}

export default DataTable;
