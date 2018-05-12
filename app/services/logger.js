const { app, remote } = require('electron');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, prettyPrint } = format;
const path = require('path');

export const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        prettyPrint()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ 
            filename: path.join((app || remote.app).getPath('userData'), '/error.log'),
            level: 'info'
        })
    ]
});