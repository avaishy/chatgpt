const token = document.cookie
  .split('; ')
  .find(row => row.startsWith('bluetoken='))
  ?.split('=')[1];

const res = await fetch(`${CONFIG.API_BASE_URL}/chats/fetch_llm_response`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`, // ✅ Or pass it as a custom header
  },
  body: JSON.stringify(data),
});