import axios, {AxiosError} from "axios";

export function handleError(error: any) {
    console.error("Error occurred:", error);
    // You can add more error handling logic here
    if (axios.isAxiosError(error) && error.response ) {
        const status = error.response.status;
        if (error.response) {
        // Backend provided message
        const msg =
            (error.response.data as any)?.message ||
            (error.response.data as any)?.error ||
            "An error occurred";

        switch (status) {
            case 400:
                return msg || "Invalid request.";
            case 401:
                return "Unauthorized. Please log in again.";
            case 403:
                return "You are not allowed to perform this action.";
            case 404:
                return "Resource not found.";
            case 409:
                return msg || "Conflict detected.";
            case 500:
                return "Something went wrong on the server.";
            default:
                return msg || `Unexpected error (status: ${status})`;
        }
    }

    if (error.request) {
        return "Cannot reach server. Please check your connection.";
    }
    return error.message || "Unexpected Axios error";
}

return error.message || "Unexpected Axios error";

}