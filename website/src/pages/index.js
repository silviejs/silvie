import React from 'react';
import Layout from '@theme/Layout';
import Logo from '../components/logo';
import styles from './styles.module.scss';

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

                    <h1>Silvie JS</h1>
                    <p>A <span className={styles.ts}>Typescript</span> Based <span className={styles.njs}>NodeJS</span> Framework</p>

                    <div className={styles.scroll}>
                        <span>SCROLL</span>
                    </div>
                </section>
            </Layout>
        </div>
    );
}

export default Home;
