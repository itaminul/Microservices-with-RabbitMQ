export class responseHelper {
    sendResponse = (res, statusCode, status, message, data = null) => {
        const response = {
            status,
            code: statusCode,
            message
        };
        if (data !== null) {
            response.data = data;
        }
        return res.status(statusCode).json(response);
    };

    sendSuccess = (res, statusCode, message, data = null) => {
        return this.sendResponse(res, statusCode, true, message, data);
    };

    sendError = (res, statusCode, message, data = null) => {
        return this.sendResponse(res, statusCode, false, message, data);
    };
}
