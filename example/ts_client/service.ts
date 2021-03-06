
import {createTwirpRequest, throwTwirpError, Fetch} from './twirp';


export interface Hat {
    size: number;
    color: string;
    name: string;
    createdOn: Date;
    
}

interface HatJSON {
    size: number;
    color: string;
    name: string;
    created_on: string;
    
}


const JSONToHat = (m: HatJSON): Hat => {
	if(!m) {
		return <Hat>{};
	}

    return {
        size: m.size,
        color: m.color,
        name: m.name,
        createdOn: new Date(m.created_on),
        
    };
};

export interface Size {
    inches: number;
    
}

interface SizeJSON {
    inches: number;
    
}


const SizeToJSON = (m: Size): SizeJSON => {
    return {
        inches: m.inches,
        
    };
};



export interface Haberdasher {
    makeHat: (size: Size) => Promise<Hat>;
    
}

export class DefaultHaberdasher implements Haberdasher {
    private hostname: string;
    private fetch: Fetch;
    private pathPrefix = "/twirp/twitch.twirp.example.Haberdasher/";

    constructor(hostname: string, fetch: Fetch) {
        this.hostname = hostname;
        this.fetch = fetch;
    }
    makeHat(size: Size): Promise<Hat> {
        const url = this.hostname + this.pathPrefix + "MakeHat";
        return this.fetch(createTwirpRequest(url, SizeToJSON(size))).then((resp) => {
            if (!resp.ok) {
                return throwTwirpError(resp);
            }

            return resp.json().then(JSONToHat);
        });
    }
    
}

