import { useRouter } from "next/router"
import styles from '../../styles/Home.module.css'
import Head from 'next/head'
import {request} from 'graphql-request'
import Link from 'next/link'
import gql from 'graphql-tag'
import { dehydrate, QueryClient, useQuery } from "react-query"

const GET_COUNTRY = gql`
  query($code:ID!) {
    country(code: $code) {
        name
        native
        phone
        capital
        currency
        emoji
    }
  }
`;


function fetchCountry(code:any) {
    const endpoint = 'https://countries.trevorblades.com/';
    const fetchData = async () => await request(endpoint, GET_COUNTRY, {code:code});
    return fetchData;
}

export async function getStaticProps(context: { params: { code: any } }) {
    const queryClient = new QueryClient();
    await queryClient?.prefetchQuery('country', fetchCountry(context.params.code));
    return {
        props: {
            dehydratedState:dehydrate(queryClient)
        }
    }
}

export async function getStaticPaths() {
    return {
      paths: [],
      fallback: true,
    }
}


export default function Country () {
    const route = useRouter();
    const {code} = route.query;
    const data = useQuery('country', fetchCountry(code))
    return (
        <>
        <Head>
            <title>{data?.data?.country.name}</title>
        </Head>
        <div className={styles.container}>
            <h1>Country details</h1>
            <p>Country Name: {data?.data?.country.name}</p>
            <p>Country Native: {data?.data?.country.native}</p>
            <p>Country Phone: +{data?.data?.country.phone}</p>
            <p>Country Capital: {data?.data?.country.capital}</p>
            <p>Country Currency: {data?.data?.country.currency}</p>
            <p>Country Emoji: {data?.data?.country.emoji}</p>
            <Link href='/'>
                <button>Go back</button>
            </Link>
        </div>
        </>
    );
}