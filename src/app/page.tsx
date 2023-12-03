"use client";

import React, { useEffect } from "react";
import type { Data } from "@/lib/types";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";

import { TrashIcon, EraserIcon } from "@radix-ui/react-icons";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";

const testData: Data[] = [
	{
		id: 1,
		name: "Ken",
		email: "ken@mail.com",
		role: "admin"
	},
	{
		id: 2,
		name: "Kenta",
		email: "keysan@mail.com",
		role: "admin"
	},
	{
		id: 3,
		name: "Kenya",
		email: "kenkp@mail.com",
		role: "member"
	}
];

export default function Home() {
	const [data, setData] = React.useState<Data[]>([]);
	const [editing, setEditing] = React.useState(0);
	const [formData, setFormData] = React.useState<Data>({
		id: -1,
		name: "",
		email: "",
		role: "member"
	});

	useEffect(() => {
		const getData = async () => {
			const response = await fetch(
				"https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
			);
			const dataResponse = await response.json();
			setData(dataResponse);
		};

		getData();
	}, []);

	const columns: ColumnDef<Data>[] = [
		{
			id: "select",
			header: ({ table }) => (
				<Checkbox
					checked={
						table.getIsAllRowsSelected() ||
						(table.getIsSomePageRowsSelected() && "indeterminate") ||
						table.getIsAllPageRowsSelected()
					}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				/>
			),
			cell: ({ row }) => {
				return (
					<Checkbox
						checked={row.getIsSelected()}
						onCheckedChange={(value) => row.toggleSelected(!!value)}
					/>
				);
			}
		},
		{
			accessorKey: "name",
			header: "Name",
			cell: ({ row }) => {
				if (editing === row.original.id)
					return (
						<Input
							value={formData.name}
							onChange={(e) =>
								setFormData((oldVal) => {
									return { ...oldVal, name: e.target.value };
								})
							}
						/>
					);
				return <div>{row.getValue("name")}</div>;
			}
		},
		{
			accessorKey: "email",
			header: "Email",
			cell: ({ row }) => {
				if (editing === row.original.id)
					return (
						<Input
							value={formData.email}
							onChange={(e) =>
								setFormData((oldVal) => {
									return { ...oldVal, email: e.target.value };
								})
							}
						/>
					);
				return <div>{row.getValue("email")}</div>;
			}
		},
		{
			accessorKey: "role",
			header: "Role",
			cell: ({ row }) => {
				if (editing === row.original.id)
					return (
						<Select
							onValueChange={(e: "admin" | "member") => {
								setFormData((oldVal) => {
									return { ...oldVal, role: e };
								});
							}}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder={formData.role} />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Role</SelectLabel>
									<SelectItem value="admin">Admin</SelectItem>
									<SelectItem value="member">Member</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					);
				return <div>{row.getValue("role")}</div>;
			}
		},
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }) => {
				if (editing === row.original.id)
					return (
						<Button
							className="save"
							variant={"outline"}
							onClick={() => {
								setData((oldData) =>
									oldData.map((item) => (item.id === editing ? formData : item))
								);
								setEditing(0);
							}}>
							Save
						</Button>
					);
				return (
					<div className="flex gap-2">
						<Button
							className="edit"
							variant={"secondary"}
							onClick={() => {
								setFormData({
									id: row.original.id,
									name: row.original.name,
									email: row.original.email,
									role: row.original.role
								});
								setEditing(row.original.id);
							}}>
							<EraserIcon />
						</Button>
						<Button
							className="delete"
							variant={"destructive"}
							onClick={() => {
								setData((oldData) =>
									oldData.filter((item) => item.id !== row.original.id)
								);
							}}>
							<TrashIcon />
						</Button>
					</div>
				);
			}
		}
	];

	return (
		<main className="flex flex-col items-center">
			<h1 className="text-4xl mt-4">FE Intern Assessment</h1>
			<div className="mb-4">By Akshit Goyal</div>
			<DataTable
				columns={columns}
				data={data}
				deleteData={(ids) => {
					setData((oldData) =>
						oldData.filter((item) => !ids.includes(item.id))
					);
				}}
			/>
		</main>
	);
}
