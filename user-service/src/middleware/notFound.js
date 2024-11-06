const notFound = (req, res, next) => {
    const message = `The requested URL ${req.originalUrl} was not found on this server.`;
    return res.status(404).json({
        status: false,
        code: 404,
        message: message,
        url: req.originalUrl
    });
};

export default notFound;
