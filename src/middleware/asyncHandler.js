// Async utility to handle asynchronous Express route handlers using Promises and async/await
// This middleware function wraps the provided requestHandler in a Promise
// and catches any errors that may occur during its execution.

export function asyncHandler(fn) {
  return function (req, res, next) {
    // Resolve the Promise with the result of the requestHandler
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
