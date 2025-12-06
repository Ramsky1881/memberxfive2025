const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const body = JSON.parse(event.body);
        const { content, token: sessionToken } = body;

        if (!content || !sessionToken) {
            return { statusCode: 400, body: "Missing content or token" };
        }

        // Validate Session Token
        const adminUser = process.env.ADMIN_USERNAME;
        const adminPass = process.env.ADMIN_PASSWORD;
        const expectedToken = Buffer.from(`${adminUser}:${adminPass}`).toString('base64');

        if (sessionToken !== expectedToken) {
            return { statusCode: 401, body: "Unauthorized" };
        }

        const githubToken = process.env.GITHUB_TOKEN;
        if (!githubToken) {
            return { statusCode: 500, body: "Server configuration error: GitHub Token missing" };
        }

        // GitHub Config
        const owner = "Ramsky1881";
        const repo = "memberxfive2025";
        const path = "js/members.js";
        const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

        // 1. Get current SHA
        const getRes = await fetch(url, {
            headers: {
                "Authorization": `token ${githubToken}`,
                "Accept": "application/vnd.github.v3+json"
            }
        });

        if (!getRes.ok) {
            const errText = await getRes.text();
            console.error("GitHub Get Error:", errText);
            return { statusCode: 502, body: "Failed to fetch file info from GitHub" };
        }

        const getData = await getRes.json();
        const sha = getData.sha;

        // 2. Encode content
        // Content must be base64 encoded. The frontend sends the raw JS string.
        // We need to ensure it's utf-8 -> base64
        const contentEncoded = Buffer.from(content, 'utf8').toString('base64');

        // 3. PUT update
        const putRes = await fetch(url, {
            method: "PUT",
            headers: {
                "Authorization": `token ${githubToken}`,
                "Accept": "application/vnd.github.v3+json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: "Update members via Admin Dashboard (Secure)",
                content: contentEncoded,
                sha: sha
            })
        });

        if (!putRes.ok) {
            const errText = await putRes.text();
            console.error("GitHub Put Error:", errText);
            return { statusCode: 502, body: "Failed to update file on GitHub" };
        }

        return { statusCode: 200, body: JSON.stringify({ message: "Success" }) };

    } catch (e) {
        console.error("Handler Error:", e);
        return { statusCode: 500, body: "Internal Server Error" };
    }
};
