const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 6000;
app.use(express.json());

const CONTAINER_2_URL = 'http://container-2-service:6001/calculate';

app.post('/calculate', async (req, res) => {
    const data = req.body;

    if (!data || !data.file) {
        return res.status(400).json({"file": null, "error": "Invalid JSON input."});
    }

    const fileName = data.file;
    const product = data.product;

    if (!fileName) {
        return res.status(400).json({"file": null, "error": "Invalid JSON input."});
    }

    if (!fs.existsSync(path.join('/data', fileName))) {
        return res.status(404).json({"file": fileName, "error": "File not found."});
    }

    try {
        const response = await axios.post(CONTAINER_2_URL, data);
        res.json(response.data);
    } catch (error) {
        if (error.response && error.response.data) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({"error": "Internal Server Error"});
        }
    }
});

app.post('/store-file', (req, res) => {
    const { file, data } = req.body;
    if (!file || !data) {
        return res.status(400).json({ "file": null, "error": "Invalid JSON input." });
    }
    const filePath = path.join('/data', file);
    fs.writeFile(filePath, data, (err) => {
        if (err) {
            return res.status(500).json({ "file": file, "error": "Error while storing the file to the storage." });
        }
        res.json({ "file": file, "message": "Success." });
    });
});


app.listen(port, () => {
    console.log(`Container 1 listening on port: ${port}`);
});


