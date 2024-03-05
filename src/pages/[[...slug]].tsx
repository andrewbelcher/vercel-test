
import {
    GetStaticPathsResult,
    GetStaticProps,
    GetStaticPropsResult,
} from 'next'


import {PropsWithChildren, useEffect} from "react";
import Link from "next/link";

interface PageProps extends PropsWithChildren {
    slug: string
    time: string
}

export default function Page({ slug, time }: PageProps) {
    const now = (new Date()).getTime() / 1000
    const generated = (new Date(time)).getTime() / 1000

    const age = Math.round(now - generated)
    const expected = Math.round(generated + 120 - now)

    return (
        <main className="flex h-screen">
            <div className="m-auto">
                <p className="text-2xl">Slug: {slug}</p>
                <p className="text-xl">Built at: {time}</p>
                <p className="text-l" suppressHydrationWarning>Age at hydration: {age} seconds</p>
                <p className="text-l" suppressHydrationWarning>Next expected hydration: {expected} seconds</p>
                <ul className="flex flex-row gap-x-4 py-4">
                    <li><Link href="/" className="text-sky-400 underline">Front</Link></li>
                    <li><Link href="/test-1" className="text-sky-400 underline">Test 1</Link></li>
                    <li><Link href="/test-2" className="text-sky-400 underline">Test 2</Link></li>
                    <li><Link href="/test-3" className="text-sky-400 underline">Test 3</Link></li>
                </ul>
            </div>
        </main>
    )
}

export async function getStaticPaths(context): Promise<GetStaticPathsResult> {
    return {
        paths: [''],
        fallback: 'blocking',
    }
}

export const getStaticProps: GetStaticProps = async (
    context,
): Promise<GetStaticPropsResult<PageProps>> => {

    const slug = Array.isArray(context.params?.slug)
        ? context.params.slug.map((s) => encodeURIComponent(s)).join("/")
        : context.params?.slug ?? '<front>'

    await fetch('https://ifconfig.me')
    // await fetch('https://devcms.themacallan.com/en/jsonapi/node/page/3f94dfa9-87cb-4ee9-8a30-1f0729e42c2c?resourceVersion=rel%3Alatest-version')

    return {
        props: {
            slug: slug,
            time: (new Date()).toISOString(),
        },
        revalidate: 120
    }
}
