import React from 'react';
import Layout from '@theme/Layout';
import Logo from '../components/logo';
import styles from './styles.module.scss';
import {Link} from 'react-router-dom';

function Home() {
    return (
        <div className={styles.homePage}>
            <Layout title={'Home Page'} description="Silvie Typescript Node.JS Framework">
                <section className={styles.firstSection}>
                    <div className={styles.bubbles}>
                        <Logo className={styles.ts}/>
                        <Logo className={styles.njs}/>
                        <Logo className={styles.gql}/>
                    </div>

                    <div className={styles.content}>
                        <h1>Silvie JS</h1>
                        <p>
                            <span className={styles.part}>A <span className={styles.ts}>Typescript</span> Based</span>
                            <span className={styles.part}> <span className={styles.njs}>NodeJS</span> Framework</span>
                        </p>
                        <Link to={'/docs'}>Explore the Docs
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512">
                                <path fill="currentColor"
                                      d="M17.525 36.465l-7.071 7.07c-4.686 4.686-4.686 12.284 0 16.971L205.947 256 10.454 451.494c-4.686 4.686-4.686 12.284 0 16.971l7.071 7.07c4.686 4.686 12.284 4.686 16.97 0l211.051-211.05c4.686-4.686 4.686-12.284 0-16.971L34.495 36.465c-4.686-4.687-12.284-4.687-16.97 0z"
                                />
                            </svg>
                        </Link>
                    </div>

                    <div className={styles.scroll}>
                        <span>SCROLL</span>
                    </div>
                </section>

                <section className={styles.featuresSection}>
                    <h2>More About Silvie</h2>

                    <section className={styles.features}>
                        <div className={`${styles.tsready} ${styles.feature}`}>
                            <img className={styles.illustration} src="/static/img/server-status.svg"
                                 alt="Server Status"/>

                            <div className={styles.info}>
                                <h3>Typescript Ready</h3>
                                <p>Javascript is awesome, but it lacks some object oriented concepts. That's where
                                    Typescript comes to serve your needs.</p>
                            </div>
                        </div>
                        <div className={`${styles.graphql} ${styles.feature}`}>
                            <img className={styles.illustration} src="/static/img/artificial-intelligence.svg"
                                 alt="Artificial Intelligence"/>

                            <div className={styles.info}>
                                <h3>GraphQL Integration</h3>
                                <p>GraphQL came to improve what RESTful APIs were offering. I love it and I wanted
                                    Silvie
                                    developers to simply use it without configuring anything.</p>
                            </div>
                        </div>
                        <div className={`${styles.mvc} ${styles.feature}`}>
                            <img className={styles.illustration} src="/static/img/folder-searching.svg"
                                 alt="Folder Structure"/>

                            <div className={styles.info}>
                                <h3>Well-Structured</h3>
                                <p>Project structure of a Silvie application is based on MVC and keeps your code base
                                    organized all the time to reduce confusions.</p>
                            </div>
                        </div>
                        <div className={`${styles.fastdev} ${styles.feature}`}>
                            <img className={styles.illustration} src="/static/img/moving-forward.svg"
                                 alt="Moving Forward"/>

                            <div className={styles.info}>
                                <h3>Fast Development</h3>
                                <p>Silvie comes with some built-in features to make it easier for you to concentrate on
                                    your
                                    main application development.</p>
                            </div>
                        </div>
                    </section>
                </section>
            </Layout>
        </div>
    );
}

export default Home;
