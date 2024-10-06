'use strict';

module.exports.getLogs = async (event) => {
try {
    const recentLogs = logs
        .sort((a, b) => new Date(b.DateTime) - new Date(a.DateTime))
        .slice(0, 100);

    return {
        statusCode: 200,
        body: JSON.stringify(recentLogs)
    };
} catch (error) {
    return {
        statusCode: 500,
        body: JSON.stringify({ error: 'An error occurred: ' + error.message })
    };
}
};