export async function createCheckoutSession() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  if (!backendUrl) {
    console.error('REACT_APP_BACKEND_URL not set');
    return;
  }
  try {
    const res = await fetch(`${backendUrl}/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error('Failed to create session');
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  } catch (err) {
    console.error('Checkout error', err);
  }
}
