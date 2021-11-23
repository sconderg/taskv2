import { useRouter } from "next/router"
import styles from '../../styles/Home.module.css'
import Head from 'next/head'
import Link from 'next/link'
import gql from 'graphql-tag'
import useQGLQuery  from '../../utils/useGQLQuery';
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


const fetchCountry = () => {
    const query = useRouter().query;
    const data =  useQGLQuery('country', GET_COUNTRY, {code:query.code})
    return data.data;
}

export async function getStaticProps() {
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery('country', fetchCountry);
    return {
        props: {
            dehydratedState:dehydrate(queryClient)
        }
    }
}



export default function Country () {
    const {data} = useQuery('country', fetchCountry);
    return (
        <>
        <Head>
            <title>{data.country.name}</title>
        </Head>
        <div className={styles.container}>
            <h1>Country details</h1>
            <p>Country Name: {data.country.name}</p>
            <p>Country Native: {data.country.native}</p>
            <p>Country Phone: +{data.country.phone}</p>
            <p>Country Capital: {data.country.capital}</p>
            <p>Country Currency: {data.country.currency}</p>
            <p>Country Emoji: {data.country.emoji}</p>
            <Link href='/'>
                <button>Go back</button>
            </Link>
        </div>
        </>
    );
}