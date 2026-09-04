import app from './src/app.ts';

const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
});