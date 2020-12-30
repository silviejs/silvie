import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.scss';

const links = {
    docs: {
        'Introduction': '/docs/',
        'Getting Started': '/docs/installation',
        'Core Concepts': '/docs/http',
        'HTTP': '/docs/controllers',
        'GraphQL': '/docs/graphql',
        'Database': '/docs/migrations',
    },
    contribute: {
        'Contribution Guide': '/docs/contribution',
        'Code of Conduct': 'https://github.com/silviejs/silvie/blob/main/CODE_OF_CONDUCT.md',
    },
    source: {
        'GitHub': 'https://github.com/silviejs/silvie',
        'NPM': 'https://www.npmjs.com/package/silvie',
    }
};

export default () => {
    return (
        <footer className={styles.footer}>
            <nav>
                {Object.keys(links).map((groupKey) => {
                    const group = links[groupKey];

                    return (
                        <section key={groupKey}>
                            <h4>{groupKey}</h4>
                            <ul>
                                {Object.keys(group).map((linkKey) => {
                                    const link = group[linkKey];
                                    return (
                                        <li key={linkKey}>
                                            {link.startsWith('http') ? (
                                                <a href={link}>{linkKey}</a>
                                            ) : (
                                                <Link to={link}>{linkKey}</Link>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </section>
                    )
                })}
            </nav>

            <small>
                Copyright &copy; 2020
                <a target='_blank' rel='noopener' href="https://hmak.me">Hossein Maktoobian</a>
            </small>
        </footer>
    );
};
