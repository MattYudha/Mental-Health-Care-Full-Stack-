require("dotenv").config({ path: "../.env" }); // Sesuaikan path jika .env ada di root backend
const app = require("./app");

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(
    `Supabase URL configured: ${process.env.SUPABASE_URL ? "Yes" : "No"}`
  );
});
