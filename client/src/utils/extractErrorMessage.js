export const extractErrorMessage = (error) => {
    const htmlString = error.response.data;
    if (!htmlString) return "An unknown error occurred.";

    try {
        // Parse the HTML string into a DOM object
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "text/html");

        // Extract <pre> content and format it properly
        const preElement = doc.querySelector("pre");
        if (!preElement) return "Error message not found in response.";

        const preContent = preElement.innerHTML.replace(/<br\s*\/?>/gi, "\n");

        // Return only the first line (error message)
        return preContent.split("\n")[0];
    } catch (error) {
        return "Failed to extract error message.";
    }
};
