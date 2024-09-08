export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F5F7FA]">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
}
