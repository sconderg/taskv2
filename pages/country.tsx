import { useRouter } from "next/router"
import styles from '../styles/Home.module.css'
import Head from 'next/head'
import Link from 'next/link'
import gql from 'graphql-tag'
import useQGLQuery  from '../utils/useGQLQuery';
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

export default function Country () {
    const { query } = useRouter();
    const data = useQGLQuery('country', GET_COUNTRY, {code:query.code});
    if(data.isLoading) return 'loading countries...';
    if(data.error) return 'something went wrong...';

    return (
        <>
        <Head>
            <title>{data.data.country.name}</title>
        </Head>
        <div className={styles.container}>
            <h1>Country details</h1>
            <p>Country Name: {data.data.country.name}</p>
            <p>Country Native: +{data.data.country.native}</p>
            <p>Country Phone: {data.data.country.phone}</p>
            <p>Country Capital: {data.data.country.capital}</p>
            <p>Country Currency: {data.data.country.currency}</p>
            <p>Country Emoji: {data.data.country.emoji}</p>
            <Link href='/'>
                <button>Go back</button>
            </Link>
        </div>
        </>
    );
}