import Head from "next/head";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import useLocalStorage from "../hooks/useLocalStorage";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

export default function Home() {
  const [previousReading, setPreviousReading] = useLocalStorage(
    "previousReading",
    0
  );
  const [currentReading, setCurrentReading] = useLocalStorage(
    "currentReading",
    0
  );
  const [readingDate, setReadingDate] = useLocalStorage("readingDate", "");
  const [amount, setAmount] = useLocalStorage("amount", null);
  const [averageReading, setAverageReading] = useLocalStorage(
    "averageReading",
    null
  );
  const [estimatedData, setEstimatedData] = useLocalStorage(
    "estimatedData",
    null
  );
  const classes = useStyles();
  const calculateBill = () => {
    const readings = currentReading - previousReading;
    let amt = getAmount(readings);
    setAmount(amt);
    setAverageReading((readings / getHours(new Date())) * 24);
    getEstimatedAmount(readings);
    console.log(getHours(new Date()));
  };
  const resetValue = () => {
    setPreviousReading(0);
    setCurrentReading(0);
    setDays(0);
  };

  const formatDate = (date) => {
    var monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + " " + monthNames[monthIndex] + " " + year;
  };

  const getAmount = (readings) => {
    let amt = 0;
    if (readings > 0 && readings <= 150) amt = readings * 5.5;
    else if (readings > 150 && readings <= 300)
      amt = 150 * 5.5 + (readings - 150) * 6;
    else if (readings > 300 && readings <= 500)
      amt = 150 * 5.5 + 150 * 6 + (readings - 300) * 6.5;
    else if (readings > 500)
      amt = 150 * 5.5 + 150 * 6 + 200 * 6.5 + (readings - 500) * 7;
    amt += 655;
    return amt;
  };

  const getHours = (date) => {
    let diff = (date.getTime() - new Date(readingDate).getTime()) / 1000;
    diff /= 60 * 60;
    return Math.abs(Math.round(diff));
  };

  const getEstimatedAmount = (readings) => {
    const afterDays = [28, 29, 30, 31, 32, 33];
    const averageReading = readings / getHours(new Date());
    const result = afterDays.map((days) => {
      const readingDateObj = new Date(readingDate);
      const estimatedDate = new Date(
        readingDateObj.setDate(readingDateObj.getDate() + days)
      );
      const totalReadings = averageReading * getHours(estimatedDate);
      return {
        afterDays: days,
        estimatedDate: formatDate(estimatedDate),
        amount: getAmount(totalReadings),
      };
    });
    setEstimatedData(result);
  };
  return (
    <div className="container">
      <Head>
        <title>Electricity Bill Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h3 className="title">Electricity Bill Generator</h3>
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
          onChange={(event) => setCurrentReading(event.target.value)}
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
          onChange={(event) => setPreviousReading(event.target.value)}
        />
        <TextField
          id="datetime-local"
          label="Previous Reading Date"
          type="datetime-local"
          defaultValue={readingDate}
          className={classes.margin}
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(event) => {
            setReadingDate(event.target.value);
            console.log(Date(event.target.value));
          }}
        />
        <Button
          variant="contained"
          size="large"
          color="primary"
          className={classes.margin}
          onClick={calculateBill}
        >
          Calculate Bill
        </Button>
        <Button size="large" className={classes.margin} onClick={resetValue}>
          Reset
        </Button>
        <Card className={classes.root}>
          <CardContent>
            {amount && <><Typography className={classes.pos} color="textSecondary">
              Amount
            </Typography>
            <Typography variant="h6" component="h4">
            &#8377; {amount.toFixed(2)}
            </Typography></>}
            <Typography className={classes.pos} color="textSecondary">
              Total Reading
            </Typography>
            <Typography variant="h6" component="h4">
              {currentReading - previousReading}
            </Typography>
            {averageReading && <><Typography className={classes.pos} color="textSecondary">
              Average Reading
            </Typography>
            <Typography variant="h6" component="h4">
              {averageReading.toFixed(2)}
            </Typography></>}
          </CardContent>
        </Card>
        <TableContainer component={Paper} className={classes.margin}>
          <Table className={classes.table} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Days after previous bill</StyledTableCell>
                <StyledTableCell>Bill Date</StyledTableCell>
                <StyledTableCell>Estimated Amount (&#8377;)</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {estimatedData &&
                estimatedData.map((row) => (
                  <StyledTableRow key={row.daysAfter}>
                    <StyledTableCell component="th" scope="row">
                      {row.afterDays}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {String(row.estimatedDate)}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.amount.toFixed(2)}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
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
          padding: 1rem 0;
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
  );
}
