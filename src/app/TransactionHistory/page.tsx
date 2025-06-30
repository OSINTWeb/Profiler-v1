"use client";

import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { TransactionApiResponse, Transaction } from "@/types/types";

export default function TransactionHistoryPage() {
  const { user, isLoading: authLoading } = useUser();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [userEmail, setUserEmail] = useState<string>("");

  const fetchTransactions = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      // Get ID token for authentication
      const idTokenResponse = await fetch("/api/auth/id-token");
      const idTokenData = await idTokenResponse.json();
      const idToken = idTokenData.idToken;

      if (!idToken) {
        throw new Error("No authentication token available");
      }

      // Fetch transactions from API
      const response = await fetch(
        `https://profiler-api-production.up.railway.app/api/user/transactions?page=${page}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.status} ${response.statusText}`);
      }

      const data: TransactionApiResponse = await response.json();
      
      if (data && data.length > 0) {
        const transactionData = data[0];
        setTransactions(transactionData.transactions);
        setCurrentPage(transactionData.page);
        setTotalPages(transactionData.total_pages);
        setTotalItems(transactionData.total_items);
        setUserEmail(transactionData.email);
      } else {
        setTransactions([]);
        setTotalItems(0);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && !authLoading) {
      fetchTransactions(currentPage);
    }
  }, [user, authLoading, currentPage]);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case "stripe":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "razorpay":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getCountryFlag = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-white/70 text-lg">Please log in to view your transaction history.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh and stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Mail className="w-4 h-4" />
            <span className="text-sm">{userEmail}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <span className="text-sm">Total: {totalItems} transactions</span>
          </div>
        </div>
        <Button
          onClick={() => fetchTransactions(currentPage)}
          disabled={loading}
          variant="outline"
          size="sm"
          className="bg-zinc-900 border-zinc-700 hover:bg-zinc-800"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Error state */}
      {error && (
        <Card className="bg-red-900/20 border-red-500/30">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-400">
              <span>⚠️ {error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading state */}
      {loading && (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="bg-zinc-900/50 border-zinc-800 animate-pulse">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="h-4 bg-zinc-700 rounded w-1/4"></div>
                  <div className="h-3 bg-zinc-700 rounded w-1/2"></div>
                  <div className="h-3 bg-zinc-700 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Transactions list */}
      {!loading && transactions.length > 0 && (
        <div className="grid gap-4">
          {transactions.map((transaction, index) => (
            <Card key={index} className="bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900/70 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getSourceColor(transaction.source)}`}>
                      {transaction.source.toUpperCase()}
                    </div>
                    <div className="text-lg font-semibold text-white">
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </div>
                  </div>
                  {transaction.payment_id && (
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <CreditCard className="w-3 h-3" />
                      <span>{transaction.payment_id}</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{formatDate(transaction.timestamp)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{getCountryFlag(transaction.country)} {transaction.country}</span>
                  </div>
                  {transaction.phone_number && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{transaction.phone_number}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && transactions.length === 0 && !error && (
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="pt-6 text-center py-12">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No transactions found</h3>
            <p className="text-gray-400">You haven't made any transactions yet.</p>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || loading}
            variant="outline"
            size="sm"
            className="bg-zinc-900 border-zinc-700 hover:bg-zinc-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              const isCurrentPage = pageNum === currentPage;
              
              return (
                <Button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  variant={isCurrentPage ? "default" : "outline"}
                  size="sm"
                  className={
                    isCurrentPage
                      ? "bg-white text-black"
                      : "bg-zinc-900 border-zinc-700 hover:bg-zinc-800"
                  }
                  disabled={loading}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || loading}
            variant="outline"
            size="sm"
            className="bg-zinc-900 border-zinc-700 hover:bg-zinc-800"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
