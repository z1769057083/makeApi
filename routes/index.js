const router = require('koa-router')()
const api = require("../db/api");

router.post("/add/api", async(ctx, next) => {
    console.log('apiiiii', api)
    const data = ctx.request.body;
    await api.insert(data);
    ctx.body = {
        success: true
    }
})


module.exports = router