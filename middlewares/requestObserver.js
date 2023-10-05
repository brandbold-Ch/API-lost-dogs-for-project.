const ddosBlock = async (req, res, next) => {
    let requests = 0;
    let ip = req.ip;
    console.log(req.headers.log);

    if (requests >= 200) {
        res.status(403).json({'message': `Blocked: Request from IP ${req.ip}`})
    }
}