import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4">
      <div className="bg-zinc-900 rounded-2xl shadow-lg p-8 flex flex-col items-center">
        <div className="mb-4">
          <svg className="w-20 h-20 text-teal-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#18181b" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12l3 3 5-5" />
          </svg>
        </div>
        <h1 className="text-teal-400 text-3xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-300 mb-6 text-center max-w-xs">
          Thank you for your purchase. Your payment has been processed successfully and your premium features are now unlocked.
        </p>
        <Link href="/">
          <button className="px-6 py-2 bg-teal-400 hover:bg-teal-500 text-black rounded-lg font-semibold shadow transition-all duration-200">
            Go to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
  