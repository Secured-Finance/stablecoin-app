import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang='en'>
            <Head>
                <meta charSet='UTF-8' />
                <meta
                    name='description'
                    content='USDFC is a USD-pegged, fully Filecoin-backed decentralized stablecoin. Deposit FIL to mint, redeem anytime, earn yield, and bridge liquidity across DeFi.'
                />

                <script
                    type='application/ld+json'
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'WebApplication',
                            name: 'USDFC',
                            applicationCategory: 'FinanceApplication',
                            operatingSystem: 'iOS, Android, Web',
                            url: 'https://app.usdfc.net/',
                        }),
                    }}
                />

                <link rel='shortcut icon' href='/favicon.ico' />
                <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
                <link
                    rel='icon'
                    type='image/png'
                    sizes='32x32'
                    href='/favicon-32x32.png'
                />
                <link
                    rel='icon'
                    type='image/png'
                    sizes='16x16'
                    href='/favicon-16x16.png'
                />
                <link
                    rel='icon'
                    type='image/png'
                    sizes='192x192'
                    href='/android-chrome-192x192.png'
                />
                <link
                    rel='icon'
                    type='image/png'
                    sizes='512x512'
                    href='/android-chrome-512x512.png'
                />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
