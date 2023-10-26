const srcDir = require('app-root-path');
const express = require('express');
const router = express.Router();
const redis    = require(`${srcDir}/modules/redis`);

router.post('/auth', async (req, res) => {
    const { PHPSESSID } = req.body;

    await redis.set("PHPSESSID", PHPSESSID);

    res.send({
      status: true,
    });
});

module.exports = router;
