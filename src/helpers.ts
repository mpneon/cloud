import Response from './Response';

export function isConstructor<T = any>(value: any): value is { new (): T } {
  try {
    new new Proxy(value, {
      construct() {
        return {};
      }
    })();
    return true;
  } catch (err) {
    return false;
  }
}

export function response(body: any, status?: number) {
  const response = new Response(body);
  
  if (status) {
    response.status = status;
  }

  return response;
}