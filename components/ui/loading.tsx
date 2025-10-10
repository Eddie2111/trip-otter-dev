export function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4 dark:border-blue-400"></div>
        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    </div>
  );
}

export function LoadingSmall() {
  return (
    <div className="flex">
      <div className="">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2 dark:border-blue-400"></div>
      </div>
    </div>
  );
}

export function ChatTypingStatus() {
  return (
    <div className="text-left justify-start m-2 p-2">
      <div className="flex items-center space-x-1">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
      </div>
    </div>
  )
}