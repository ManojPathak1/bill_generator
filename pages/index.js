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
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import useLocalStorage from "../hooks/useLocalStorage";
import { getAmountFromReadings, formatDate } from "../utils";
import { afterDays } from "../config";

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
  const [readings, setReadings] = useLocalStorage(
    "readings",
    null
  );
  const classes = useStyles();

  const calculateBill = () => {
    const readings = currentReading - previousReading;
    const amt = getAmountFromReadings(readings);
    setAmount(amt);
    setAverageReading((readings / getHours(new Date())) * 24);
    getEstimatedAmount(readings);
    setReadings(currentReading - previousReading);
  };

  const resetValue = () => {
    setPreviousReading(0);
    setCurrentReading(0);
    setReadingDate("");
    setAmount(null);
    setAverageReading(null);
    setEstimatedData(null);
  };

  const getHours = (date) => {
    let diff = (date.getTime() - new Date(readingDate).getTime()) / 1000;
    diff /= 60 * 60;
    return Math.abs(Math.round(diff));
  };

  const getEstimatedAmount = (readings) => {
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
        amount: getAmountFromReadings(totalReadings),
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
          onChange={(event) => setReadingDate(event.target.value)}
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
        <Button
          variant="outlined"
          color="secondary"
          className={classes.margin}
          onClick={resetValue}
        >
          Reset
        </Button>
        {amount && averageReading && readings && (
          <Card className={classes.root}>
            <CardContent>
              <Typography className={classes.pos} color="textSecondary">
                Amount
              </Typography>
              <Typography variant="h6" component="h4">
                &#8377; {amount.toFixed(2)}
              </Typography>
              <Typography className={classes.pos} color="textSecondary">
                Total Reading
              </Typography>
              <Typography variant="h6" component="h4">
                {readings}
              </Typography>
              <Typography className={classes.pos} color="textSecondary">
                Average Reading
              </Typography>
              <Typography variant="h6" component="h4">
                {averageReading.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        )}
        {estimatedData && (
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
                {estimatedData.map((row) => (
                  <StyledTableRow key={row.afterDays}>
                    <StyledTableCell component="th" scope="row">
                      {row.afterDays}
                    </StyledTableCell>
                    <StyledTableCell>{row.estimatedDate}</StyledTableCell>
                    <StyledTableCell align="right">
                      {row.amount.toFixed(2)}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
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
