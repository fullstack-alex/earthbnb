import useSession from "./useSession";

function useFetch(){
    const url = 'https://localhost:7263';
    const session = useSession();

    const post = async (endpoint:string, data:any) => {
        const response = await fetch(url + endpoint, {
            method: "POST",
            mode: "cors",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + session.getToken()
            },
            body: JSON.stringify(data)
        });

        return response;
    }
    const get = async (endpoint:string) => {
        const response = await fetch(url + endpoint, {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + session.getToken()
            }
        });

        return response;
    }

    return{
        post,
        get
    }
}

export default useFetch;