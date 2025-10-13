import HomePage from './index';
import * as fs from 'fs';
import path from 'path';

export async function getStaticPaths() {
    const pagesDir = path.join(process.cwd(), `./public/api/list-pages`);
    const ids = fs.readdirSync(pagesDir);
    const paths = ids.map(page => {
        const slug = page.slice(0, page.lastIndexOf('.'));
        return { params: { page: slug } };
    }).filter(page => page.params.page !== 'index');
    return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { page: string } }) {
    const pageName = params.page;
    const filePath = path.join(process.cwd(), `./public/api/list-pages/${pageName}.json`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const pages = JSON.parse(fileContents);
    return { props: { pages } };
}

export default HomePage;