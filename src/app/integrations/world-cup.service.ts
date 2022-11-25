import axios from 'axios';

const BASE_API_URL: string = process.env.WORLD_CUP_API || 'localhost:8000';

export class WorldCupAPIervice {

    constructor() {
    }

    matchesToday = async (options: Record<string, any>) => {
        const { data } = await axios.get<Array<any>>(BASE_API_URL);

        if (options.completed)
            return data.filter((item: any) => item.status === 'completed');

        return data;
    }
}

export const wolrdCupAPIService = new WorldCupAPIervice();
