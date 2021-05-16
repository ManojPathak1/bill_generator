import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import { getFirestoreDB } from "../../utils/firestore";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { formatDate } from "../../utils";

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
}));

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
      const db = getFirestoreDB();
      db.collection("paid_bills").doc(id).delete().then(() => {
        fetchData();
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
    }

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
        <div>
          <span>{getAverage()}</span>
            <ul>
                {bills.map((bill) => {
                    return <div>{bill.date} - {bill.amount} <button onClick={() => onClickDelete(bill.id)}>Delete</button></div>;
                })}
            </ul>
            <div>
                <h3>Add Bill</h3>
                <TextField
                    id="datetime-local"
                    label="Previous Reading Date"
                    type="datetime-local"
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
                    Calculate Bill
                </Button>
            </div>
        </div>
    );
};

export default Bills;
