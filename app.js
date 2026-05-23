const express = require("express");
const app = express();
const port = 5775;
const cors = require("cors");
const db = require('./db.js');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/status", (req, res) => {
    res.send(
        '{"kode":"01", "status":"API Berbasis ExpressJS OK"}'
    );
});

// BACKUP DATA
app.post("/backup", async (req, res) => {

    let pesan, kodex;

    let nama = req.body.nama_backup;
    let dtX = atob(req.body.dtx);

    let id = Date.now();
    let arr_data = dtX.split("#");

    let proses = await db.tambahBackup(id, nama, "nodejs");

    if (proses == "1") {

        let berhasil = 0;
        let gagal = 0;

        for (k of arr_data) {

            let arr_data2 = k.split("|");

            let idx = arr_data2[0];
            let deskripsix = arr_data2[1];
            let waktux = arr_data2[2];
            let nominalx = arr_data2[3];
            let jenisx = arr_data2[4];

            let proses2 = await db.tambahTransaksi(
                `${id}-${idx}`,
                id,
                waktux,
                nominalx,
                jenisx,
                deskripsix
            );

            proses2 == "1" ? berhasil++ : gagal++;
        }

        pesan = {
            kode: "01",
            status: "Proses Backup Berhasil dengan Rincian ",
            berhasil: berhasil,
            gagal: gagal
        };

        kodex = 200;

    } else {

        pesan = {
            kode: "00",
            status: "Proses Backup Gagal, Periksa Kembali Data Anda"
        };

        kodex = 500;
    }

    return res.status(kodex).json(pesan);

});

app.listen(port, () => {
    console.log(`API Berjalan di Port: ${port}`);
});

// revisi terbaru