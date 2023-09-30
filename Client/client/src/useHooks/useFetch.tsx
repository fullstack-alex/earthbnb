import useSession from "./useSession";

function useFetch(){
    const url = 'https://localhost:7263';
    const session = useSession();

    const post = async (endpoint:string, data:any, doJson:boolean = true) => {
        let headers:HeadersInit|undefined
        let contentType:HeadersInit|undefined = {"":""};
        if(doJson) {
            data=JSON.stringify(data);
            headers = { 
                "Authorization": "Bearer " + session.getToken(),
                "Content-Type":"application/json"
            }
        }
        else
        {
            headers = { 
                "Authorization": "Bearer " + session.getToken()
            }
        }
        
        const response = await fetch(url + endpoint, {
            method: "POST",
            mode: "cors",
            credentials: 'include',
            headers,
            body: data
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