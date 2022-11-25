import axios from 'axios';

const BASE_API_URL: string = process.env.WORLD_CUP_API || 'localhost:8000';

export class WorldCupAPIervice {
    teamTagsDict: Record<string, any>;

    constructor() {
        this.teamTagsDict = {
            ARG: 'ARG',
            AUS: 'AUS',
            BEL: 'BEL',
            BRA: 'BRA',
            CAN: 'CAN',
            CMR: 'CAM',
            CRC: 'CRC',
            CRO: 'CRO',
            DEN: 'DIN',
            ECU: 'EQU',
            ENG: 'ING',
            ESP: 'ESP',
            FRA: 'FRA',
            GER: 'ALE',
            GHA: 'GAN',
            IRN: 'IRA',
            JPN: 'JAP',
            KOR: 'COR',
            KSA: 'ARS',
            MAR: 'MAR',
            MEX: 'MEX',
            NED: 'HOL',
            POL: 'POL',
            POR: 'POR',
            QAT: 'CAT',
            SEN: 'SEN',
            SRB: 'SER',
            SUI: 'SUI',
            TUN: 'TUN',
            URU: 'URU',
            USA: 'EUA',
            WAL: 'GAL',
        };
    }

    matchesToday = async (options: Record<string, any>) => {
        const { data } = await axios.get<Array<any>>(BASE_API_URL);

        if (options.completed)
            return data.filter((item: any) => item.status === 'completed');

        return data;
    }
}

export const wolrdCupAPIService = new WorldCupAPIervice();
