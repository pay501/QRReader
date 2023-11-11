const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const app = express();
const moment = require('moment');
app.use(express.json());
app.use(cors());

const connect = async () => {
    const db = await mysql.createConnection({
        user: "admin",
        password: "427517527safepassage",
        host: "safepassage.cexnx7vcyjx4.ap-southeast-2.rds.amazonaws.com",
        database: "Villa"
    });
    return db;
};

const updateEntryTime = async (db, table, password) => {
    try {
        await db.query(`
            UPDATE ${table} SET ExitTime = '${moment().format('YYYY-MM-DD HH:mm:ss')}'
            WHERE Password = '${password}'
        `);
        return true;
    } catch (error) {
        console.error(`Error updating EntryTime for ${table}: ${error.message}`);
        return false;
    }
};

app.post('/reader', async (req, res) => {
    try {
        const { password } = req.body;
        const db = await connect();

        const [isVisitor] = await db.query(`SELECT * FROM Visitor WHERE Password = ?`, [password]);
        const [isGrabDeliver] = await db.query(`SELECT * FROM GrabDeliver WHERE Password = ?`, [password]);
        const [isHouseOwner] = await db.query(`SELECT * FROM HouseOwnerTime WHERE Password = ?`, [password]);

        // Validate 
        if (isVisitor.length > 0) {
            const [data] = await db.query(`SELECT Password FROM QrCode WHERE Password = ?`, [password]);
            const result = data[0];
            if (password === result.Password && await updateEntryTime(db, 'Visitor', password)) {
                return res.json({ message: "Validation successfully" });
            }
        } else if (isGrabDeliver.length > 0) {
            const [data] = await db.query(`SELECT Password FROM QrCode WHERE Password = ?`, [password]);
            const result = data[0];
            if (password === result.Password && await updateEntryTime(db, 'GrabDeliver', password)) {
                return res.json({ message: "Validation successfully" });
            }
        } else if (isHouseOwner.length > 0) {
            const [data] = await db.query(`SELECT * FROM QrCode WHERE Password = ?`, [password]);
            const result = data[0];
            if (password === result.Password && await updateEntryTime(db, 'HouseOwnerTime', password)) {
                return res.json({ message: "Validation successfully" });
            }
        } else {
            return res.json({ message: "Validation failed" });
        }
    } catch (err) {
        console.log(err);
        return res.json({ message: "An error occurred" });
    }
});

app.listen(8889, () => {
    console.log('Server is running');
});
