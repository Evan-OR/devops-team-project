const login = async (username: string, password: string) => {
  const req = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const mes = await req.json();

  console.log(mes);
};

const register = async (email: string, username: string, password: string) => {
  const req = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, username, password }),
  });
  const mes = await req.json();

  console.log(mes);
};

export { login, register };
