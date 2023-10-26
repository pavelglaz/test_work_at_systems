const srcDir = require('app-root-path');
const express = require('express');
const router = express.Router();
const response = require(`${srcDir}/modules/response`);
const redis = require(`${srcDir}/modules/redis`);
const trending_api = require(`${srcDir}/modules/services/trending_api`);

router.get('/balance', async (req, res) => {
  const session_id = await redis.get("PHPSESSID");
  
  if (!session_id) {
    res.status(response.CODE_FB).send({
      status: false,
      message: `Not autorization`,
    })
  }

  const api_res = await trending_api.get_profile(
    {}, 
    {
      headers: {
        'Cookie': `PHPSESSID=${session_id}`
      }
    }
  );

  if(api_res.code !== 200) {
    res
      .status(response.CODE_SE)
      .send({
        status: false,
        message: "Not allowed trending_api."
      });
  }

  const { balance } = api_res.data;

  res.send({
    status: true,
    balance,
  });
});

module.exports = router;
