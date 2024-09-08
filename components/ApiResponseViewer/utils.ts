export function getResponseStatusColor(statusCode: number) {
  if (statusCode >= 100 && statusCode < 200) {
    // Informational responses (1xx)
    return 'lightblue';
  } else if (statusCode >= 200 && statusCode < 300) {
    // Successful responses (2xx)
    return 'green';
  } else if (statusCode >= 300 && statusCode < 400) {
    // Redirection messages (3xx)
    return 'orange';
  } else if (statusCode >= 400 && statusCode < 500) {
    // Client error responses (4xx)
    return 'red';
  } else if (statusCode >= 500 && statusCode < 600) {
    // Server error responses (5xx)
    return 'darkred';
  } else {
    // Unknown status code
    return 'gray';
  }
}
