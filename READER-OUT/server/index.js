const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const app = express();

app.use(express.json());
app.use(cors());

const connect = async () => {
    const db = await mysql.createConnection({
        user: "admin",
        password: "427517527safepassage",
        host: "safepassage.cexnx7vcyjx4.ap-southeast-2.rds.amazonaws.com",
        database: "Villa"
    })
    return db
};
app.post('/reader', async (req, res) => {
    try {
        let currentMinute = (new Date(Date.now()).getMinutes()<10)?"0"+new Date(Date.now()).getMinutes() : new Date(Date.now()).getMinutes()
        let currentHour = ()=>{
            if((new Date(Date.now()).getHours())<1){
                return "00"
            }else if ((new Date(Date.now()).getHours())>=1 && (new Date(Date.now()).getHours())<10){
                return "0"+(new Date(Date.now()).getHours());
            }else{
                return (new Date(Date.now()).getHours());
            }
        }
        let currentMonth = ((new Date(Date.now()).getMonth()+1)<10)? "0"+(new Date(Date.now()).getMonth()+1).toString(): (new Date(Date.now()).getMonth()+1)
        const currentTime = currentMonth +''+ (new Date(Date.now()).getDate() + new Date(Date.now()).getFullYear()) +''+ currentHour()+''+ currentMinute ;
        const moCurrentTime = currentTime.toString();
        const { password } = req.body;
        const db = await connect();
        const [isVisitor] = await db.query(`select * from Visitor where Password =?`,password)
        const [isGrabDeliver] = await db.query(`select * from GrabDeliver where Password = ?`,password)
        const [isHouseOwner] = await db.query(`select * from HouseOwnerTime where Password =?`,password)
        if(isVisitor.length>0){
            const [data] =  await db.query(`select Password from QrCode where Password = ?`,password)
            const result = data[0]
            if(password===result.Password){
                await db.query(`
                    update Visitor set ExitTime = ${moCurrentTime} where Password = '${password}'
                `)
                return res.json({
                    message: "Validation successfully"
                });
            }
        }if (isGrabDeliver.length>0){
            const [data] =  await db.query(`select Password from QrCode where Password = ?`,password)
            const result = data[0]
            if(password===result.Password){
                await db.query(`
                    update GrabDeliver set ExitTime = ${moCurrentTime} where Password = '${password}'
                `)
                return res.json({
                    message: "Validation successfully"
                });
            }
        }if(isHouseOwner.length>0){
            const [data] =  await db.query(`select * from QrCode where Password = ?`,password)
            const result = data[0]
            if(password===result.Password){
                await db.query(`
                    update HouseOwnerTime set ExitTime = ${moCurrentTime} where Password = '${password}'
                `)
                return res.json({
                    message: "Validation successfully"
                });
            }
        }else{
            return res.json({ message: "Validation failed" })
        }
    } catch (err) {
        console.log(err)
    }
});
app.listen(8889, () => {
    console.log('Server is running')
})