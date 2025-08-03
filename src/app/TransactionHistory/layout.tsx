import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transaction History - Profiler.me",
  description: "View your payment transaction history and manage your account.",
};

export default function TransactionHistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col">
        <div className="max-w-6xl w-full mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Transaction History</h1>
            <p className="text-muted-foreground">View and manage your payment transactions</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
