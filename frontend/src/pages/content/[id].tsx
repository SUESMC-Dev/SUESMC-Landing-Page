import { useContext, useEffect, useState } from "react";
import { Layout, Button, Space, Typography, FloatButton, Result, Grid } from "antd";
import Head from "next/head";
import Link from "next/link";
import { ArrowLeftOutlined, MoonOutlined, SunOutlined, ArrowUpOutlined, LoadingOutlined, ShareAltOutlined, CalendarOutlined } from "@ant-design/icons";
import { MessageContext } from '@/contexts/message';
import ThemeContext from '@/contexts/theme';
import { Page } from "@/models/page";
import MarkdownRenderer from "@/components/markdown-renderer";
import { EyeOutlined } from "@ant-design/icons";
import { ISOtoDate } from '@/utils/datetime'; 
import { shareContent } from "@/utils/share";

const { Header, Footer, Content } = Layout;
const { Title } = Typography;

interface DetailPageProps {
    pageContent: Page;
}

const DetailPage = ({ pageContent }: DetailPageProps) => {
    const themeCtx = useContext(ThemeContext);
    const screens = Grid.useBreakpoint();
    const [showTitleInHeader, setShowTitleInHeader] = useState(false);

    useEffect(() => {
        if (pageContent && pageContent.type === 'link') {
            window.location.href = pageContent.content;
        }
    }, [pageContent]);  

    useEffect(() => {
        const handleScroll = () => {
        const titleElement = document.querySelector('.home-title');
        if (!titleElement) return;
        const titleRect = titleElement.getBoundingClientRect();
            setShowTitleInHeader(titleRect.top <= 48);
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (pageContent && pageContent.type === 'link')
        return (
            <>
                <Result icon={<LoadingOutlined />} title="正在跳转..."/>
            </>
        )

    return (
        <>
            <Head>
                <title>{`${pageContent ? pageContent.title : '加载中'} - SUESMC`}</title>
                <meta name="description" content={pageContent ? (pageContent.subtitle || pageContent.content.substring(0, 150) + '...') : 'SUESMC 内容页面'} />
                <meta name="keywords" content={pageContent ? `SUESMC, 程园我的世界社, ${pageContent.title}, 上海工程技术大学, Minecraft` : 'SUESMC, 程园我的世界社, 上海工程技术大学, Minecraft'} />
                <meta property="og:title" content={pageContent ? `${pageContent.title} - SUESMC` : 'SUESMC'} />
                <meta property="og:description" content={pageContent ? (pageContent.subtitle || pageContent.content.substring(0, 150) + '...') : 'SUESMC 内容页面'} />
                <meta property="og:image" content="/assets/suesmc.png" />
                <meta property="og:url" content={pageContent ? `https://suesmc.ltd/content/${pageContent.id}` : 'https://suesmc.ltd'} />
            </Head>
            <Layout className="main-layout">
                <Header className="layout-header">
                    <Space className="navbar">
                        <Link href="/">
                            <Button type="text" icon={<ArrowLeftOutlined />}/>
                        </Link>
                        <div className={`header-title ${showTitleInHeader ? 'visible' : ''}`}>
                            {showTitleInHeader && pageContent?.title}
                        </div>
                    </Space>
                </Header>
                <Content className="layout-content">
                    {pageContent && pageContent.type==='article' &&
                    <Space className="page-content" direction="vertical" style={{width: '100%'}}>
                        <Title className="home-title" level={screens.lg ? 2:3}>{pageContent.title}</Title>
                        <MarkdownRenderer content={pageContent.content}/>
                            <Space direction="horizontal" style={{ color: "#a9a9a9", marginTop: '64px' }} size="large">
                                <Space direction="horizontal">
                                    <EyeOutlined />{pageContent.views_count}次阅读
                                </Space>
                                <Space direction="horizontal">
                                    <CalendarOutlined />
                                    {pageContent.created_at === pageContent.updated_at ? '创建于' : '更新于'}
                                    {ISOtoDate(pageContent.updated_at)}
                                </Space>
                        </Space>
                    </Space>
                    }
                </Content>
                <Footer className="layout-footer">
                    <div>SUESMC ｜ <a href="https://beian.miit.gov.cn/" target="_blank">沪ICP备2023020312号-1</a></div>
                    <div>改编自 <a href="https://mc.sjtu.cn/welcome/">SJMC-Landing-Page</a></div>
                </Footer>
            </Layout>
            <FloatButton.Group 
                shape="square"
                style={screens.lg ? { bottom: 60, right: 30 } : { bottom: 48, right: 20 }}
            >
                <FloatButton 
                    icon={<ArrowUpOutlined />}
                    onClick={()=>{window.scrollTo({ top: 0, behavior: 'smooth' });}}
                />
                <FloatButton
                    onClick={() => {themeCtx.changeTheme(themeCtx.userTheme === 'light' ? 'dark' : 'light')}}
                    icon = {themeCtx.userTheme === 'light' ? <MoonOutlined /> : <SunOutlined />}
                />
                 <FloatButton
                    icon={<ShareAltOutlined />}
                    onClick={() => {
                        shareContent(pageContent?.title,
                            `分享页面 ${pageContent?.title} #${pageContent?.id}`,
                            window.location.href)
                    }}
                />
            </FloatButton.Group>
        </>
    )
}

export default DetailPage;

import * as fs from 'fs';
import path from 'path';

export async function getStaticPaths() {
    const pagesDir = path.join(process.cwd(), './api/pages');
    const ids = fs.readdirSync(pagesDir).filter(dir => fs.statSync(path.join(pagesDir, dir)).isDirectory());
    const paths = ids.map(id => ({ params: { id } }));
    return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
    const filePath = path.join(process.cwd(), `./api/pages/${params.id}/index.json`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    data.id = parseInt(params.id);
    return { props: { pageContent: data } };
}
