import { useRouter } from "next/router"
import styles from '../../styles/Home.module.css'
import Head from 'next/head'
import Link from 'next/link'
import gql from 'graphql-tag'
import useQGLQuery  from '../../utils/useGQLQuery';
import { dehydrate, QueryClient, useQuery } from "react-query"
import { useEffect } from "react"

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

export async function getStaticPaths() {
    return {
      paths: [],
      fallback: true,
    }
}


function fetchCountry(code: any) {
    const data =  useQGLQuery('country', GET_COUNTRY, {code:code})
    return data.data;
}


export async function getStaticProps(context: { params: { code: any } }) {
    const queryClient = new QueryClient();
    await queryClient?.prefetchQuery('country', fetchCountry(context?.params?.code));
    return {
        props: {
            dehydratedState:dehydrate(queryClient)
        }
    }
}

export default function Country () {
    const router = useRouter()
    const { code } = router.query
    const {data}:any = useQuery('country', fetchCountry(code));
    return (
        <>
        <Head>
            <title>{data?.country?.name}</title>
        </Head>
        <div className={styles.container}>
            <h1>Country details</h1>
            <p>Country Name: {data?.country?.name}</p>
            <p>Country Native: {data?.country?.native}</p>
            <p>Country Phone: +{data?.country?.phone}</p>
            <p>Country Capital: {data?.country?.capital}</p>
            <p>Country Currency: {data?.country?.currency}</p>
            <p>Country Emoji: {data?.country?.emoji}</p>
            <Link href='/'>
                <button>Go back</button>
            </Link>
        </div>
        </>
    );
}