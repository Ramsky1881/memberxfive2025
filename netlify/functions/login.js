exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const data = JSON.parse(event.body);
        const { username, password } = data;

        const adminUser = process.env.ADMIN_USERNAME;
        const adminPass = process.env.ADMIN_PASSWORD;

        if (!adminUser || !adminPass) {
            console.error("Server credentials not set.");
            return { statusCode: 500, body: "Server Error" };
        }

        if (username === adminUser && password === adminPass) {
            // Generate a simple session signature
            // In a real app, use JWT. Here, a simple hash/string is enough for the scope.
            // We'll just return a base64 of the credentials or a static token if env matches.
            // To make it slightly more secure, let's just use a secret string that the save function also knows.
            // Or simpler: The frontend sends this token back. The save function checks it against a hash of the env vars.

            const sessionToken = Buffer.from(`${adminUser}:${adminPass}`).toString('base64');

            return {
                statusCode: 200,
                body: JSON.stringify({ token: sessionToken })
            };
        } else {
            return { statusCode: 401, body: "Unauthorized" };
        }

    } catch (e) {
        return { statusCode: 400, body: "Bad Request" };
    }
};
