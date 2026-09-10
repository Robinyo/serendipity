import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
    title: string;
    description: ReactNode;
};

const FeatureList: FeatureItem[] = [
    {
        title: 'Open Source',
        description: (
            <>
                Serendipity is freely available under the GNU AGPL v3.0 license.
                Fork it, extend it, and adapt it to your organisation&apos;s needs.
            </>
        ),
    },
    {
        title: 'Customer Engagement Platform',
        description: (
            <>
                Connect your customers, products, people and operations with a unified
                platform built on Angular and Spring Boot.
            </>
        ),
    },
    {
        title: 'Secure by Design',
        description: (
            <>
                OpenID Connect for authentication, OAuth 2.0 for authorisation, TLS for
                data in transit, and AES for data at rest.
            </>
        ),
    },
];

function Feature({title, description}: FeatureItem) {
    return (
        <div className={clsx('col col--4')}>
            <div className="text--center">
                <Heading as="h3">{title}</Heading>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default function HomepageFeatures(): ReactNode {
    return (
        <section className={styles.features}>
            <div className="container">
                <div className="row">
                    {FeatureList.map((props, idx) => (
                        <Feature key={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    );
}
