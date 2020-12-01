import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

const links = {
    docs: {
        'Introduction': '/docs/',
        'Getting Started': '/docs/installation',
        'Core Concepts': '/docs/http',
        'HTTP': '/docs/controllers',
        'GraphQL': '/docs/graphql',
        'Database': '/docs/migrations',
        'Validation': '/docs/validator',
        'Security': '/docs/authentication',
        'Testing': '/docs/unit-tests',
    }
};

export default () => {
    return (
        <footer>
            <small>Copyright &copy; <a href="https://github.com/hmak-me">hmak-me</a></small>

            <section className="links">
                {Object.keys(links).map((groupKey) => (
                    <div className="group" key={groupKey}>
                        <h3>{groupKey}</h3>
                        <ul>
                            {Object.keys(links[groupKey]).map((linkKey) => (
                                <li key={linkKey}>
                                    <a href={useBaseUrl(links[groupKey][linkKey])}>{linkKey}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </section>
        </footer>
    );
};
