// Vapi voice assistant client. The SDK is loaded on first use so it never
// weighs on the initial page load.
// The public key is designed to live in the browser. Lock it to your domains
// in the Vapi dashboard so it cannot be used from anywhere else.
export const VAPI_PUBLIC_KEY =
  import.meta.env.VITE_VAPI_PUBLIC_KEY || '1d46a8a4-79b1-4168-842b-8607b7f17cba';
export const VAPI_ASSISTANT_ID =
  import.meta.env.VITE_VAPI_ASSISTANT_ID || '8350030f-2ff3-41ba-aa44-ba2f21a759c5';

let instance = null;

export async function getVapi() {
  if (!instance) {
    const { default: Vapi } = await import('@vapi-ai/web');
    instance = new Vapi(VAPI_PUBLIC_KEY);
  }
  return instance;
}
