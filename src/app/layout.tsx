import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "HireQuotient Assessment | Akshit Goyal",
	description:
		"This is an assessment for HireQuotient. Submitted by Akshit Goyal. It is a simple web app that allows user to administrate a list of users."
};

export default function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>{children}</body>
		</html>
	);
}
