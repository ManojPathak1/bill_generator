import React, { useEffect, useState } from "react";
import Link from "next/link";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getFirestoreDB } from "../../utils/firestore";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { formatDate, getAmountFromReadings } from "../../utils";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

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

const Bills = () => {
    const [bills, setBills] = useState([]);
    const [billDate, setBillDate] = useState("");
    const [amount, setAmount] = useState("");
    const classes = useStyles();
    const fetchData = () => {
        const db = getFirestoreDB();
        db.collection("paid_bills")
            .orderBy("date", "desc")
            .limit(12)
            .get()
            .then(function (prevSnapshot) {
                const data = [];
                prevSnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    console.log(doc.id, " => ", doc.data());
                    data.push({
                        id: doc.id,
                        amount: doc.data().amount,
                        date: formatDate(new Date(doc.data().date)),
                    });
                });
                setBills(data);
            });
    };
    useEffect(() => {
        fetchData();
    }, []);

    const onAddBill = () => {
        const db = getFirestoreDB();
        db.collection("paid_bills")
            .add({
                date: billDate,
                amount: Number(amount),
            })
            .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
                fetchData();
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
    };

    const onClickDelete = (id) => {
      if (confirm("Do you want to delete it?")) {
        const db = getFirestoreDB();
        db.collection("paid_bills")
            .doc(id)
            .delete()
            .then(() => {
                fetchData();
            })
            .catch((error) => {
                console.error("Error removing document: ", error);
            });
      }
    };

    const getAverage = () => {
        const totalAmount = bills.reduce((acc, curr) => {
            acc += curr.amount;
            return acc;
        }, 0);
        console.log(totalAmount);
        const totalBills = bills.length;
        const average = totalAmount / totalBills;
        return average.toFixed();
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            {bills.length > 0 && (<Card className={classes.root}>
            <CardContent>
              <Typography className={classes.pos} color="textSecondary">
                Average Amount
              </Typography>
              <Typography variant="h6" component="h4">
                &#8377; {getAverage()}
                </Typography>
            </CardContent>
          </Card>)}
            <Link href="/">Go to Home</Link>
            {bills.length === 0 && <CircularProgress />}
            {bills.length > 0 && (
                <TableContainer component={Paper} className={classes.margin}>
                    <Table
                        className={classes.table}
                        aria-label="customized table"
                    >
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>
                                    Bill Payment Date
                                </StyledTableCell>
                                <StyledTableCell>Amount</StyledTableCell>
                                <StyledTableCell>Action</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {bills.map((row) => (
                                <StyledTableRow key={row.afterDays}>
                                    <StyledTableCell component="th" scope="row">
                                        {row.date}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        {row.amount}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            color="secondary"
                                            className={classes.margin}
                                            onClick={() =>
                                                onClickDelete(row.id)
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            <div style={{ display: "flex", flexDirection: "column" }}>
                <h3>Add Bill</h3>
                <TextField
                    id="datetime-local"
                    label="Previous Reading Date"
                    type="datetime-local"
                    className={classes.margin}
                    variant="outlined"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={billDate}
                    onChange={(event) => setBillDate(event.target.value)}
                />
                <TextField
                    id="outlined-number"
                    label="Current Reading"
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    variant="outlined"
                    className={classes.margin}
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                />
                <Button
                    variant="contained"
                    size="large"
                    color="primary"
                    className={classes.margin}
                    onClick={onAddBill}
                >
                    Add Bill
                </Button>
            </div>
        </div>
    );
};

export default Bills;
