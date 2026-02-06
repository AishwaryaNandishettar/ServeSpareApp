export const vendorLogin = async (email, password) => {
  const response = await fetch("http://localhost:8080/api/vendor/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json();
};
