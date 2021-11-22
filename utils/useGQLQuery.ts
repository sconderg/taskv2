import {useQuery} from 'react-query'
import {request} from 'graphql-request'
import { RequestDocument } from 'graphql-request/dist/types'

export default function useQGLQuery(key:string, query:RequestDocument, variables?:any, config?:any) {
    const endpoint = 'https://countries.trevorblades.com/';
    const fetchData = async () => await request(endpoint, query, variables);
    return useQuery(key, fetchData, config)
}