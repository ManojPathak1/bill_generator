import Head from 'next/head';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { useState, useEffect } from 'react';
import useLocalStorage from "../hooks/useLocalStorage";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default function Home() {
  const [previousReading, setPreviousReading] = useLocalStorage("previousReading", 0);
  const [currentReading, setCurrentReading] = useLocalStorage("currentReading", 0);
  const [days, setDays] = useLocalStorage("days", 0);
  const [amount, setAmount] = useLocalStorage("amount", null);
  const [averageReading, setAverageReading] = useLocalStorage("averageReading", null);
  const classes = useStyles();
  const calculateBill = () => {
    const readings = currentReading - previousReading;
    let amt = 0;
    if (readings > 0 && readings <= 150) amt = readings * 5.5;
    else if (readings > 150 && readings <= 300) amt = 150 * 5.5 + (readings - 150) * 6;
    else if (readings > 300 && readings <= 500) amt = 150 * 5.5 + 150 * 6 + (readings - 300) * 6.5;
    else if (readings > 500) amt = 150 * 5.5 + 150 * 6 + 200 * 6.5 + (readings - 500) * 7;
    amt += 655;
    setAmount(amt);
    setAverageReading(readings/days);
  };
  const resetValue = () => {
    setPreviousReading(0);
    setCurrentReading(0);
    setDays(0);
  };
  return (
    <div className="container">
      <Head>
        <title>Electricity Bill Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h3 className="title">
          Electricity Bill Generator
        </h3>
        <TextField
          id="outlined-number"
          label="Current Reading"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          className={classes.margin}
          value={currentReading}
          onChange={event => setCurrentReading(event.target.value)}
        />
        <TextField
          id="outlined-number"
          label="Previous Reading"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          className={classes.margin}
          value={previousReading}
          onChange={event => setPreviousReading(event.target.value)}
        />
        <TextField
          id="outlined-number"
          label="No. of days"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          variant="outlined"
          className={classes.margin}
          value={days}
          onChange={event => setDays(event.target.value)}
        />
        <Button variant="contained" size="large" color="primary" className={classes.margin} onClick={calculateBill}>
          Calculate
        </Button>
        <Button size="large" className={classes.margin} onClick={resetValue}>
          Reset
        </Button>
        {averageReading && <h1>Average Reading: {averageReading}</h1>}
        {amount && <h1>Amount: {amount}</h1>}
      </main>
      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          padding: 5px;
          line-height: 1.15;
          font-size: 2rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}
